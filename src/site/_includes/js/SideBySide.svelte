<script>
  import { onMount } from 'svelte'
  export let firstBlock
  export let secondBlock
  export let isWideExample

  let svelteFirstBlock
  let svelteSecondBlock

  onMount(() => {
    svelteFirstBlock.appendChild(firstBlock.code)
    svelteSecondBlock.appendChild(secondBlock.code)
    calculateMode()
  })

  let windowIsTooSmallForSideBySide
  let mode

  function calculateMode() {
    windowIsTooSmallForSideBySide = window.innerWidth < 750
    mode =
      windowIsTooSmallForSideBySide || isWideExample ? 'tabs' : 'side-by-side'
  }

  let activeTab = 0

  function handleWindowResize() {
    calculateMode()
  }
</script>

<svelte:window on:resize={handleWindowResize} />
<div
  class="wrapper"
  class:tabs={mode === 'tabs'}
  class:side-by-side={mode === 'side-by-side'}
>
  <div class="header">
    <ul>
      <li>
        <a
          href="/"
          on:click|preventDefault={() => (activeTab = 0)}
          class:is-active={activeTab === 0}>{firstBlock.title}</a
        >
      </li>
      <li>
        <a
          href="/"
          on:click|preventDefault={() => (activeTab = 1)}
          class:is-active={activeTab === 1}>{secondBlock.title}</a
        >
      </li>
    </ul>

    <button
      class="toggle-btn"
      class:hidden={windowIsTooSmallForSideBySide}
      disabled={mode === 'side-by-side'}
      on:click|preventDefault={() => (mode = 'side-by-side')}>Side</button
    >
    <button
      class="toggle-btn"
      class:hidden={windowIsTooSmallForSideBySide}
      disabled={mode === 'tabs'}
      on:click|preventDefault={() => (mode = 'tabs')}>Tabs</button
    >
  </div>

  <div class="code-wrapper">
    <div
      bind:this={svelteFirstBlock}
      class="code-block"
      class:is-active={mode === 'tabs' ? activeTab === 0 : true}
    >
      <span class="inline-code-title">{firstBlock.title}</span>
    </div>

    <div
      bind:this={svelteSecondBlock}
      class="code-block"
      class:is-active={mode === 'tabs' ? activeTab === 1 : true}
    >
      <span class="inline-code-title">{secondBlock.title}</span>
    </div>
  </div>
</div>

<style>
  .wrapper {
    width: 90vw;
    max-width: 1000px;
    margin-top: var(--space-m);
    margin-bottom: var(--space-m);
  }
  .header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 40px;
  }

  .header ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    max-width: auto;
  }

  .header ul li {
    margin-top: initial;
  }

  .toggle-btn {
    background: var(--grey);
    color: var(--dark);
    border: none;
    padding: var(--space-s);
    border: 1px solid var(--blue);
    opacity: 1;
  }

  .toggle-btn.hidden {
    display: none;
  }

  .toggle-btn[disabled] {
    opacity: 0.5;
  }

  .toggle-btn:first-of-type {
    border-right: 1px solid var(--blue);
  }
  .toggle-btn:last-of-type {
    border-left: 1px solid var(--blue);
  }

  .header ul li:not(:last-child) {
    margin-right: var(--space-l);
  }

  .side-by-side .header ul {
    display: none;
  }

  .header ul a {
    display: block;
    padding: var(--space-s) var(--space-m);
    border-bottom: 4px solid transparent;
  }

  .header ul a.is-active {
    border-bottom: 4px solid var(--green);
  }

  .header button:first-of-type {
    margin-left: auto;
  }

  .code-block:not(.is-active) {
    display: none;
  }

  .side-by-side .code-wrapper {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 1fr;
    column-gap: 10px;
    align-items: start;
    align-content: start;
  }

  .tabs .inline-code-title {
    display: none;
  }

  .side-by-side .code-block {
    position: relative;
    min-width: 0;
  }
  .side-by-side .inline-code-title {
    user-select: none;
    display: block;
    z-index: 3;
    background: #fff;
    position: absolute;
    top: -15px;
    padding: var(--space-m) var(--space-l);
    font-size: var(--font-m);
    left: 0;
  }

  @media (min-width: 45em) {
    .side-by-side .inline-code-title {
      font-size: var(--size-500);
      top: -40px;
    }
  }
</style>
