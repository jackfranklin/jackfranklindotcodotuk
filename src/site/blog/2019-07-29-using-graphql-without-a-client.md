---

title: "Getting started with GraphQL: what client to use?"
intro: "Today we're looking into working with a GraphQL API and discussing if you need to reach for a 3rd party library or not."
date: 2019-07-29
---

When I first started working with GraphQL APIs my first challenge was to decide
what GraphQL frontend library I wanted to use. I can remember spending all
morning exploring all sorts of options, from small libraries like
[graphql-request](https:www.npmjs.com/package/graphql-request) to slightly
larger ones like [urql](https:github.com/FormidableLabs/urql) and finally the
most well known like [Apollo](https:www.apollographql.com/). These are all great
libraries - in fact we use urql at work - but at this point in time I was
working with a tiny GraphQL library that I'd built for a side project and I
really didn't need any complexity. I think I lost a good couple of hours trying
to decide before thinking: what if I made my own?

> This post is not meant to criticise libraries: they provide a bunch of
> features that many applications will want and need, but if you're just getting
> started, they might be overkill for your needs.

## Do you need a library to use GraphQL?

I had in my head this mindset that making a request to a GraphQL API was
"special" and not something that I could do with the `fetch` API, for example.
I'm not really sure where this came from but I think I'd seen so many talks
about Apollo and various client libraries doing all sorts of smart things I'd
ended up assuming that I'd use one of those. But Apollo packs in a vast array of
features that I really didn't need on my side project. I wanted to make a
request and get the data. Concerns such as smart caching and cache invalidation
were not present for me.

When you're starting to learn something it can be tempting to reach for
libraries to fill in gaps in knowledge but I highly recommend trying to avoid
doing this when possible. I'm very happy that I made the decision to write my
own tiny client because it plugged gaps in my knowledge and de-mystified how a
GraphQL API works. In this post I'll talk through how to get started talking to
a GraphQL API just by using the `fetch` API and nothing more.

## A sample GraphQL API

We need a sample API for this and I've made one that lives on Heroku:
http:faker-graphql-api.herokuapp.com/graphql. This API returns some fake people
(all data is generated by [Faker.js](https:github.com/marak/Faker.js/)). It lets
us query for people and get their names:

```graphql
{
  people {
    name
  }
}
```

Returns an array of ten people and their names. This is the query we're going to
use as our example today.

> My dummy API is hosted on a free Heroku instance so please be patient if it
> takes some time to boot up when you request it.

## Making a request to a GraphQL API

It turns out there are some simple steps to follow to talk to a GraphQL
endpoint:

* All requests are `POST` requests
* You should pass the `Content-Type` header as `application/json`
* The body of the request should contain a string which is the GraphQL query

As long as we follow those rules we can easily use `fetch` to talk to the API.
Let's do it!

```js
const api = 'http:faker-graphql-api.herokuapp.com/graphql'

export const request = ({ query }) => {
  return fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
    }),
  })
    .then(response => response.json())
    .then(result => {
      console.log('got here!', result)
      return result
    })
}
```

The `request` function takes an object and expects the `query` key to contain
the raw GraphQL query. The `fetch` API takes the URL and an object of options,
which are used to configure the request: we set `method: 'POST'` and the
`Content-Type` header as discussed and then use `JSON.stringify({ query })` to
generate the body for the request, passing in the `query` that was passed in to
our `request` function. Finally, the GraphQL API will return JSON so we parse
the response before returning it (I've logged it just to aid debugging but feel
free to skip that!).

With that we can make our request:

```js
request({
  query: `{ people { name } }`,
})
```

And you should get some people back! 🎉.

If you only need to make basic requests in your app you could stop here and be
done. We've saved having to install, learn and ship in our bundle any additional
libraries. Of course this comes with less functionality - but for some projects
that might be just fine.

> If you do need caching and more advanced features I'd highly recommend a well
> tested, established library rather than rolling your own!

## Supporting variables

Another feature of GraphQL is that queries can take variables. For example, the
fake API lets us find a single person by their ID:

```graphql
query fetchPerson($id: Int!) {
  person(id: $id) {
    name
  }
}
```

To support this our API needs to pass variables through as well that it includes
in the request:

```js
export const request = ({ variables, query }) => {
  return fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
    .then(response => response.json())
    .then(result => {
      console.log('got here!', result)
      return result
    })
}
```

And now our client supports variables:

```js
request({
  query: `query fetchPerson($id: Int!) {
    person(id: $id) {
      name,
    }
  }`,
  variables: {
    id: 1,
  },
})
```

If this is all you need, or you're not using React for your frontend, you can
stop here. This client will be plenty good enough to keep you going as you work
with and get more familiar with GraphQL. By working with your own
implementations first you'll find you have a greater fundamental understanding
when swapping to a library, and you'll understand the features the library
provides better.

## A React hook!

Finally let's see how easy it would be to wrap this up in a React hook for those
of you working with React.

> If you're not familiar with hooks, I wrote
> [an introduction to them](/refactoring-to-react-hooks/) which will help get
> you up to speed.

Creating the hook is a case of wrapping our `request` function in a
`React.useEffect` hook and storing the response via `React.useState`:

```js
export const useGraphQL = ({ variables, query }) => {
  const [data, setData] = React.useState(null)

  React.useEffect(
    () => {
      request({ variables, query }).then(setData)
    },
    [variables, query]
  )

  return [data]
}
```

> This hook is missing some useful features like tracking if we're loading or
> not, but I'll leave that as an exercise to the reader 😃

We can use this hook within a component like so:

```js
const [data] = useGraphQL({
  query: `{ people { name } }`,
})
```

And it works! There is one gotcha though that I want to highlight. If you do
this:

```js
const [data] = useGraphQL({
  variables: {},
  query: `{ people { name } }`,
})
```

You'll cause an infinite loop of requests, which isn't what we want! This is
because `React.useEffect` has `variables` as a dependency and every time it
changes it will cause the effect to re-run. Every re-render this code runs and
`variables: {}` creates a new object every time which means `React.useEffect`
will re-run.

We can fix this by remembering to wrap our `variables` in a `React.useMemo` hook
to ensure that we only recalculate the variables if we need to:

```js
const vars = React.useMemo(
  () => {
    return {
      id: props.id,
    }
  },
  [props.id]
)

const [data] = useGraphQL({
  variables: vars,
  query: `{ people { name } }`,
})
```

But this requires you to remember to do this every time. Instead what we can do
is convert the `variables` within our `useGraphQL` hook to a string, via
`JSON.stringify`, and use that as the dependency to `useEffect`:

```js
const stringifiedVars = JSON.stringify(variables)
React.useEffect(
  () => {
    request({ variables, query }).then(setData)
  },
  [stringifiedVars, query]
)
```

> ❗️This isn't the best solution but it is the easiest and will serve just fine
> for most projects. It's also similar to how the popular
> [urql works](https://github.com/FormidableLabs/urql/blob/master/src/utils/keyForQuery.ts)
> although that uses the
> [fast-json-stable-stringify](https://www.npmjs.com/package/fast-json-stable-stringify)
> to avoid some of the performance problems with `JSON.stringify`.

## Conclusion

Although this post has focused on GraphQL I hope that your main takeaway is to
resist diving straight for libraries. You can often get a long way with a few
lines of code you write yourself, _particularly when learning a new technology_.
This will help your understanding of the tech that you're learning but also your
understanding of libraries: if you've written a library yourself, however small
and straight forward, you're more likely to be able to follow how the more
complex libraries work.