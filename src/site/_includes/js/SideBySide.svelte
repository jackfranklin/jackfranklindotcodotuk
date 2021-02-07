<script>
  import { onMount } from 'svelte'
  export let firstBlock
  export let secondBlock
  console.log(firstBlock, secondBlock)

  let svelteFirstBlock
  let svelteSecondBlock

  onMount(() => {
    svelteFirstBlock.appendChild(firstBlock.code)
    svelteSecondBlock.appendChild(secondBlock.code)
  })

  let mode = 'tabs'
  let activeTab = 0
</script>

<div
  class="wrapper"
  class:tabs={mode === 'tabs'}
  class:side-by-side={mode === 'side-by-side'}
>
  <div>
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
        disabled={mode === 'side-by-side'}
        on:click|preventDefault={() => {
          console.log('here')
          mode = 'side-by-side'
        }}>Side by side</button
      >
      <button
        disabled={mode === 'tabs'}
        on:click|preventDefault={() => (mode = 'tabs')}>Tabs</button
      >
    </div>
  </div>

  <div
    bind:this={svelteFirstBlock}
    class="code-block"
    class:is-active={mode === 'tabs' ? activeTab === 0 : true}
  />
  <div
    bind:this={svelteSecondBlock}
    class="code-block"
    class:is-active={mode === 'tabs' ? activeTab === 1 : true}
  />
</div>

<style>
  .wrapper {
    width: 90vw;
    max-width: 1000px;
  }
  .header {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .header ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
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
</style>
