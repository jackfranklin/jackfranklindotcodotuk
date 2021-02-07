function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function prevent_default(fn) {
    return function (event) {
        event.preventDefault();
        // @ts-ignore
        return fn.call(this, event);
    };
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

/* src/site/_includes/js/SideBySide.svelte generated by Svelte v3.32.1 */

function add_css() {
	var style = element("style");
	style.id = "svelte-6wlymn-style";
	style.textContent = ".wrapper.svelte-6wlymn.svelte-6wlymn{width:90vw;max-width:1000px}.header.svelte-6wlymn.svelte-6wlymn{display:flex;align-items:center;width:100%}.header.svelte-6wlymn ul.svelte-6wlymn{display:flex;list-style:none;margin:0;padding:0}.header.svelte-6wlymn ul a.svelte-6wlymn{display:block;padding:var(--space-s) var(--space-m);border-bottom:4px solid transparent}.header.svelte-6wlymn ul a.is-active.svelte-6wlymn{border-bottom:4px solid var(--green)}.header.svelte-6wlymn button.svelte-6wlymn:first-of-type{margin-left:auto}.code-block.svelte-6wlymn.svelte-6wlymn:not(.is-active){display:none}";
	append(document.head, style);
}

function create_fragment(ctx) {
	let div4;
	let div1;
	let div0;
	let ul;
	let li0;
	let a0;
	let t0_value = /*firstBlock*/ ctx[0].title + "";
	let t0;
	let t1;
	let li1;
	let a1;
	let t2_value = /*secondBlock*/ ctx[1].title + "";
	let t2;
	let t3;
	let button0;
	let t4;
	let button0_disabled_value;
	let t5;
	let button1;
	let t6;
	let button1_disabled_value;
	let t7;
	let div2;
	let t8;
	let div3;
	let mounted;
	let dispose;

	return {
		c() {
			div4 = element("div");
			div1 = element("div");
			div0 = element("div");
			ul = element("ul");
			li0 = element("li");
			a0 = element("a");
			t0 = text(t0_value);
			t1 = space();
			li1 = element("li");
			a1 = element("a");
			t2 = text(t2_value);
			t3 = space();
			button0 = element("button");
			t4 = text("Side by side");
			t5 = space();
			button1 = element("button");
			t6 = text("Tabs");
			t7 = space();
			div2 = element("div");
			t8 = space();
			div3 = element("div");
			attr(a0, "href", "/");
			attr(a0, "class", "svelte-6wlymn");
			toggle_class(a0, "is-active", /*activeTab*/ ctx[5] === 0);
			attr(a1, "href", "/");
			attr(a1, "class", "svelte-6wlymn");
			toggle_class(a1, "is-active", /*activeTab*/ ctx[5] === 1);
			attr(ul, "class", "svelte-6wlymn");
			button0.disabled = button0_disabled_value = /*mode*/ ctx[4] === "side-by-side";
			attr(button0, "class", "svelte-6wlymn");
			button1.disabled = button1_disabled_value = /*mode*/ ctx[4] === "tabs";
			attr(button1, "class", "svelte-6wlymn");
			attr(div0, "class", "header svelte-6wlymn");
			attr(div2, "class", "code-block svelte-6wlymn");

			toggle_class(div2, "is-active", /*mode*/ ctx[4] === "tabs"
			? /*activeTab*/ ctx[5] === 0
			: true);

			attr(div3, "class", "code-block svelte-6wlymn");

			toggle_class(div3, "is-active", /*mode*/ ctx[4] === "tabs"
			? /*activeTab*/ ctx[5] === 1
			: true);

			attr(div4, "class", "wrapper svelte-6wlymn");
			toggle_class(div4, "tabs", /*mode*/ ctx[4] === "tabs");
			toggle_class(div4, "side-by-side", /*mode*/ ctx[4] === "side-by-side");
		},
		m(target, anchor) {
			insert(target, div4, anchor);
			append(div4, div1);
			append(div1, div0);
			append(div0, ul);
			append(ul, li0);
			append(li0, a0);
			append(a0, t0);
			append(ul, t1);
			append(ul, li1);
			append(li1, a1);
			append(a1, t2);
			append(div0, t3);
			append(div0, button0);
			append(button0, t4);
			append(div0, t5);
			append(div0, button1);
			append(button1, t6);
			append(div4, t7);
			append(div4, div2);
			/*div2_binding*/ ctx[10](div2);
			append(div4, t8);
			append(div4, div3);
			/*div3_binding*/ ctx[11](div3);

			if (!mounted) {
				dispose = [
					listen(a0, "click", prevent_default(/*click_handler*/ ctx[6])),
					listen(a1, "click", prevent_default(/*click_handler_1*/ ctx[7])),
					listen(button0, "click", prevent_default(/*click_handler_2*/ ctx[8])),
					listen(button1, "click", prevent_default(/*click_handler_3*/ ctx[9]))
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*firstBlock*/ 1 && t0_value !== (t0_value = /*firstBlock*/ ctx[0].title + "")) set_data(t0, t0_value);

			if (dirty & /*activeTab*/ 32) {
				toggle_class(a0, "is-active", /*activeTab*/ ctx[5] === 0);
			}

			if (dirty & /*secondBlock*/ 2 && t2_value !== (t2_value = /*secondBlock*/ ctx[1].title + "")) set_data(t2, t2_value);

			if (dirty & /*activeTab*/ 32) {
				toggle_class(a1, "is-active", /*activeTab*/ ctx[5] === 1);
			}

			if (dirty & /*mode*/ 16 && button0_disabled_value !== (button0_disabled_value = /*mode*/ ctx[4] === "side-by-side")) {
				button0.disabled = button0_disabled_value;
			}

			if (dirty & /*mode*/ 16 && button1_disabled_value !== (button1_disabled_value = /*mode*/ ctx[4] === "tabs")) {
				button1.disabled = button1_disabled_value;
			}

			if (dirty & /*mode, activeTab*/ 48) {
				toggle_class(div2, "is-active", /*mode*/ ctx[4] === "tabs"
				? /*activeTab*/ ctx[5] === 0
				: true);
			}

			if (dirty & /*mode, activeTab*/ 48) {
				toggle_class(div3, "is-active", /*mode*/ ctx[4] === "tabs"
				? /*activeTab*/ ctx[5] === 1
				: true);
			}

			if (dirty & /*mode*/ 16) {
				toggle_class(div4, "tabs", /*mode*/ ctx[4] === "tabs");
			}

			if (dirty & /*mode*/ 16) {
				toggle_class(div4, "side-by-side", /*mode*/ ctx[4] === "side-by-side");
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(div4);
			/*div2_binding*/ ctx[10](null);
			/*div3_binding*/ ctx[11](null);
			mounted = false;
			run_all(dispose);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { firstBlock } = $$props;
	let { secondBlock } = $$props;
	console.log(firstBlock, secondBlock);
	let svelteFirstBlock;
	let svelteSecondBlock;

	onMount(() => {
		svelteFirstBlock.appendChild(firstBlock.code);
		svelteSecondBlock.appendChild(secondBlock.code);
	});

	let mode = "tabs";
	let activeTab = 0;
	const click_handler = () => $$invalidate(5, activeTab = 0);
	const click_handler_1 = () => $$invalidate(5, activeTab = 1);

	const click_handler_2 = () => {
		console.log("here");
		$$invalidate(4, mode = "side-by-side");
	};

	const click_handler_3 = () => $$invalidate(4, mode = "tabs");

	function div2_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			svelteFirstBlock = $$value;
			$$invalidate(2, svelteFirstBlock);
		});
	}

	function div3_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			svelteSecondBlock = $$value;
			$$invalidate(3, svelteSecondBlock);
		});
	}

	$$self.$$set = $$props => {
		if ("firstBlock" in $$props) $$invalidate(0, firstBlock = $$props.firstBlock);
		if ("secondBlock" in $$props) $$invalidate(1, secondBlock = $$props.secondBlock);
	};

	return [
		firstBlock,
		secondBlock,
		svelteFirstBlock,
		svelteSecondBlock,
		mode,
		activeTab,
		click_handler,
		click_handler_1,
		click_handler_2,
		click_handler_3,
		div2_binding,
		div3_binding
	];
}

class SideBySide extends SvelteComponent {
	constructor(options) {
		super();
		if (!document.getElementById("svelte-6wlymn-style")) add_css();
		init(this, options, instance, create_fragment, safe_not_equal, { firstBlock: 0, secondBlock: 1 });
	}
}

class SideBySide$1 extends HTMLElement {
  connectedCallback() {
    const [firstCodeBlock, secondCodeBlock] = this.querySelectorAll('pre');

    const titles = [this.getAttribute('first'), this.getAttribute('second')];

    this.innerHTML = '';
    const props = {
      firstBlock: {
        title: titles[0],
        code: firstCodeBlock,
      },
      secondBlock: {
        title: titles[1],
        code: secondCodeBlock,
      },
    };
    new SideBySide({
      target: this,
      props,
    });
  }
}
customElements.define('side-by-side', SideBySide$1);
//# sourceMappingURL=app.js.map
