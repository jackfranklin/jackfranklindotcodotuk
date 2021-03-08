---
permalink: /blog/comparing-svelte-and-react-javascript/index.html
title: 'Comparing Svelte and React'
intro:
  "Today I'm comparing the same app built once in React, and once in Svelte, to
  look at the pros and cons of each library and how I think about them."
date: 2021-03-09
---

<side-by-side first="Svelte" second="React">

```js
onMount(() => {
  console.log('Foo')
})
```

```js
useEffect(() => {
  console.log('Foo')
}, [])
```

</side-by-side>
