---
permalink: /blog/working-with-react-and-the-web-platform/index.html
title: "Why I don't miss React: a story about using the platform"
intro: "After working with React for over five years, I was nervous about moving on and not having its power and features available to me. It's ended up being a pleasant experience." 
date: 2022-05-03
---

Just over two years ago I left a role at a London based startup where I lead development of a large, React based e-commerce frontend to join Google to work on Chrome DevTools. My initial focus was to introduce Web Components as the new fundamental building block of all new DevTools features and UI. With the recently launched [Recorder](https://developer.chrome.com/docs/devtools/recorder/) panel along with others, there are now large parts of DevTools that are almost exclusively web components.

When I left my React focused role behind I expected to find the transition hard, and miss what React had to offer. I've ended up finding the transition easier than expected and have come to really relish working closer to the platform’s primitives and maintaining more control over the software I write and in this blog post I’d like to share why that is.

Firstly, because some people on the internet like to get angry over opinions that may not match their own, I want to make clear what this blog post is not:

* It is not a call for everyone to immediately drop React and move to web components.
* It is not a blog post declaring React “dead”, or the wrong choice for every project.
* It is not a blog post declaring web components the best solution to all projects.
* It is not a blog post declaring all web frameworks useless or a bad choice.
* It is not a blog post suggesting that, because this approach works for me and the team I’m on at Google, that it works for you. All projects are different, and Chrome DevTools almost certainly has a different set of requirements and constraints to your project. And that's fine :)

This blog post should be read as the musings of someone who went from working with React every day to not touching it, and the experiences of doing so. I am writing this post because I have been pleasantly surprised on how much I've enjoyed working more closely with the web platform.

> Whilst I will use “React” as my comparison, you could reasonably substitute it for any of the large modern frameworks.

## Using the platform

“Using the platform” has become a bit of an overused and abused phrase in recent years, but the core principle resonates with me: can we use the APIs built into the browser and JavaScript to build features for our users without paying the cost of third party dependencies?

> Note: the answer here is not always “yes”! There are still plenty of features I’d like to see built into browsers, but compared to ten years ago the landscape of native functionality has expanded massively.

One classic example here is building forms: this used to be a justifiable reason to reach for React because browsers offered us very little here beyond primitive functionality. Fast forward a few years and on a recent side project I was able to use 100% native functionality to build my form with a solid user experience:

* I used [HTML validation attributes](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#using_built-in_form_validation) to enforce required fields (and could have done more with pattern based validation)
* I used the [FormData API](https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects) to read values out of the form rather than track their values in state (which I didn’t need to, because the validation was done by the browser).
* If I wanted to, I could even customise the error messages using the [Constraint Validation API](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#validating_forms_using_javascript) - an API I didn't even know existed until a few days ago!

Was this slightly more work than using a library from npm that wraps this all up for me? Maybe! But I was able to achieve the same result, writing a few extra lines of code myself, but without weighing my application down with an extra dependency.

## Maintaining control

Adjusting to [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) was the main concern I had when moving on from React, but I've come to really enjoy working with them.

Custom Elements may lead to more code being written but with a little bit of work you can create something that will feel surprisingly familiar if you've worked with any of the popular component libraries, with one crucial difference: **you don’t give up control**.

React will not allow you to dictate how and when you render your component onto the page. You write code using its constructs and it determines when to render. 9 times out of 10 - even 99 out of 100 or more - this works exactly as you’d expect. But the web platform isn't perfect, and I suspect most React developers have come across a situation where you’d love to be able to just tweak how your component is being rendered.

Giving up control of your rendering process can lead to confusion, as per [this tweet from Gary Bernhardt](https://twitter.com/garybernhardt/status/1516099364611047436):

> Why does this code:
>
> <code>console.log(`mark ${Math.random()}`)</code>
>
> <code>alert(`mark ${Math.random()}`)</code>
>
> print one log but show two alerts? Because `React.StrictMode` hides one log to "help" me prepare for concurrent mode. React is great but concurrent mode feels like a mistake for 99.9% of apps.

This behaviour has now changed in React v18, but the fact that React had to work to suppress extra `console.log` calls that occur as a result of how it renders my application is surprising to me; it's this lack of control in my own application that has become something I'm wary of.

In software development this is known as [Inversion of Control](https://martinfowler.com/bliki/InversionOfControl.html). When you use a framework like React, your code is no longer in direct control of when components (or functions) are called. Your components don't directly tell React when to re-render them, but React decides. Your components have ceded control to React.

Our Custom Elements solution doesn't have this inversion of control; we control every render by explicitly calling a function (in the case of lit-html, it is a [tagged template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals?retiredLocale=nl) called [`html`](https://lit.dev/docs/v1/lit-html/introduction/#lit-html-templates)).

The downside of not picking a framework like React is that you have to consider recreating pieces that are otherwise built-in, such as a basic scheduler that ensures we batch renders or a library of test helpers to make testing these components easier. You have to carefully consider your options in situations like this: if we avoid React but end up re-implementing the majority of what it offers, we might have been better off using the framework. In our case, we still felt this decision was justified because we don't have to recreate a scheduler with all the complexity of React's; we can build a small, self-contained implementation that only implements what we need.

Having built our basic scheduler, we know exactly why and when every component renders, and on those times where we have to deviate from the standard path, we are able to. This feels very valuable: every software project I've ever worked on has had at least one component that needed to do something differently to solve a peculiar edge case.

## Pick dependencies that can be easily replaced.

One area where custom elements are lacking is some form of HTML templating solution that provides efficient re-rendering of HTML. I'd definitely recommend using a library for this, and we settled on [lit-html](https://lit.dev/docs/libraries/standalone-templates/). What appeals about lit-html is that it makes up just one small piece of our solution. We could have gone for Lit, a more fully featured components library formed around custom elements, but that would have led to us increasing our dependencies and forgoing some control (_to reiterate the points I made earlier in this blog post: this is not a criticism of Lit, and for many people Lit is the right choice!_).

Lit-html ensures that our HTML is rendered efficiently and comes with a nice set of directives that allow us to easily do common tasks like [conditionally applying classes](https://lit.dev/docs/templates/directives/#classmap). It’s not quite as seamless as JSX, but gets pretty close.

The best part? It’s a very small dependency ([3.3kB gzipped](https://bundlephobia.com/package/lit-html@2.2.2)) and even more crucially could easily be replaced if we needed to. It might sound negative or even pessimistic, but when we adopt a new dependency one of the main questions we ask is “what happens if this disappears”?

Let's say React disappears (this is not to say I think it will). What's the cost to us of dealing with that? We have a few options:

1. Maintain a fork of React at whichever version we are currently using.
1. Migrate all our components from React to something else.

Neither of those options appeal to me; maintaining a library means we either do nothing and miss out on improvements and/or security fixes, and migrating all our components would be a huge undertaking. I'm sure React forks would spring up should this event occur, but regardless it would involve a lot of churn and work to get things on a healthier footing. Migrating all of our components would be a costly exercise with little tangible benefit to end users - and therefore an incredibly hard sell to the business and leadership. We'd also have to learn a new framework (even if it was similar to React) and increase our expertise in that framework.

Contrast this with custom elements and lit-html. We can have a good level of confidence that custom elements won't suddenly disappear; it's baked into the browser and backwards compatibility is a core tenet of the web platform.

> If you're thinking about custom elements v0 being removed in favour of v1, remember that v0 was a Chrome specific experimental spec, whereas v1 is a cross-platform standardised specification. The purpose of v0 was to gather feedback from developers that could inform the future standardised specification.

And if lit-html were to vanish from the internet? We have the same two choices: maintain a fork, or replace it. Maintaining a fork wouldn't be ideal for the same reasons maintaining a React fork isn't ideal, with one slight difference: the scope of lit-html is much smaller, and it is a much smaller library generally. It would be less work to get our heads around and learn to a point where we could land fixes or improvements if we required.

Replacing lit-html would be an undertaking but much less so than replacing React: it’s used in our codebase purely for having our components (re)-render HTML. Replacing lit-html would still mean that we can keep our business logic, ultimately maintaining the value they provide to end-users. Lit-Html is one small Lego brick in our system, React (or Angular, or similar) is the entire box.

## The cost of third party dependencies

Third party dependencies, however big or small, have a set of costs that your users and/or developers will pay. Everyone's opinion on if that cost is worth it or not will differ, and it will depend on your application and tech stack, but when I think about adding new dependencies the following set of costs appear:

1. **Bundle size**: how much weight is this dependency adding to our final JavaScript that we have to deliver and execute in the browser? Is that bundle size appropriate and worth it for what this dependency provides?
1. **Breaking changes and upgrades**: what happens if the package has a big overhaul and needs work to upgrade to the latest version? Do we stay on the older version (not ideal if it's not getting updates or security fixes) or invest the work to upgrade? Can the work to upgrade be prioritised soon or is it the type of work that we might never get around to?
1. **Risk of unmaintained code or issues**: who is to say that a third party dependency might have a particular vulnerability or issue that might cause issues? (this is not a criticism of all those who work tirelessly to maintain open source software - but these things happen).

Jeremy Keith in [his recent post on trust](https://adactio.com/journal/19021) states:

> Every dependency you add to a project is one more potential single point of failure.

The same is true of your own code (swap "dependency" for "file"), but crucially you have full control, you presumably are more familiar with its workings as it was written in house, and you are not beholden to others to fix the issue upstream. This is not to say that you should recreate the world on every project; there will always be a fine balancing act of building it yourself versus adding a dependency, and there is no rule that will determine the right outcome every time.

## Conclusion

This post is not to say that you shouldn't reach for dependencies. In response to Jeremey Keith's post on trust and third party dependencies, [Charles Harries suggests that cross browser compatibility was historically the driver for dependencies](https://charlesharri.es/stream/libraries-over-browser-features):

> Browser compatibility is one of the underlying promises that libraries—especially the big ones that Jeremy references, like React and Bootstrap—make to developers.

> I'm on a budget and I can't spend my time reading through the caniuse.com page for Array.prototype.includes or MutationObserver. Lodash promises cross-platform compatibility right there at the bottom of its homepage.

I completely agree with Charles' opinion, and this is one area where working on the DevTools for one browser has an advantage because we know our audience's browser choice.

My hope is that with the baseline feature set supported by browsers now more uniform - especially with the death of Internet Explorer - that we as an industry can over time move to reaching for the extensive built-in functionality of browsers by default, polyfilling where absolutely necessary, and look beyond frameworks as a default starting point.
