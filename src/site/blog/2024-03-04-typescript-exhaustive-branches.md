---
permalink: blog/typescript-exhaustive-branches/index.html
title: 'Exhaustive branch checks with TypeScript'
date: 2024-03-04
---

It's very common when working with TypeScript that you will have a type that
declares a list of values, such as an enum or union type:

```ts
enum SupportedColour1 {
  RED,
  YELLOW,
  BLUE,
}

type SupportedColour2 = 'RED' | 'YELLOW' | 'BLUE'
```

And then you will often have functions that need to run differently or return
different values based on what variant is passed in:

```ts
function codeForColour1(colour: SupportedColour1): string {
  switch (colour) {
    case SupportedColour1.BLUE:
      return '#0000ff'
    case SupportedColour1.RED:
      return '#ff0000'
    case SupportedColour1.YELLOW:
      return '#ffff00'
  }
}

function codeForColour2(colour: SupportedColour2): string {
  switch (colour) {
    case 'BLUE':
      return '#0000ff'
    case 'RED':
      return '#ff0000'
    case 'YELLOW':
      return '#ffff00'
  }
}
```

## Updating code when types change

One thing that can catch you out is if the list of valid values in the type
changes. Let's say we want to add `GREEN` as a value to our union type (I will
drop the `enum` example for brevity, but the functionality for the sake of this
post is equivalent):

```ts
type SupportedColour2 = 'RED' | 'YELLOW' | 'BLUE' | 'GREEN'
```

In this case we will now get an error in this function. TypeScript will realise
that the function does not return anything in the case that `GREEN` is passed
in, but the error is not very obvious:

```ts
function codeForColour2(colour: SupportedColour2): string {
  switch (colour) {
    case 'BLUE':
      return '#0000ff'
    case 'RED':
      return '#ff0000'
    case 'YELLOW':
      return '#ffff00'
  }
}
```

```txt
Function lacks ending return statement and return type does not include 'undefined'.
```

If the function did not return a value, **TypeScript will not error** and it
would be easy to miss that we now have a branch (for `GREEN`) that is not dealt
with:

```ts
// This will not error in TypeScript, even though we are not
// dealing with the GREEN case.
function logForColour(colour: SupportedColour2): void {
  switch (colour) {
    case 'BLUE':
      console.log('User picked blue')
    case 'RED':
      console.log('User picked red')
    case 'YELLOW':
      console.log('User picked yellow')
  }
}
```

## Meet `ensureExhaustive`

To help prevent these cases falling through the cracks, and to improve compiler
errors to point us to the problem, all of my TypeScript projects contain this
`ensureExhaustive` helper:

```ts
export function ensureExhaustive(_x: never): never {
  throw new Error('Reached a branch with non-exhaustive checks')
}
```

To use it, ensure that whenever you are branching based on values, you have a
default case that calls `ensureExhaustive`:

```ts
function logForColour(colour: SupportedColour2): void {
  switch (colour) {
    case 'BLUE':
      console.log('User picked blue')
      break
    case 'RED':
      console.log('User picked red')
      break
    case 'YELLOW':
      console.log('User picked yellow')
      break
    default:
      ensureExhaustive(colour)
  }
}
```

Because `ensureExhaustive` takes in an argument of type `never`, which
represents values that cannot be observed, this code will now cause a compiler
error:

```txt
Argument of type 'string' is not assignable to parameter of type 'never'.(2345)
(parameter) colour: "GREEN"
```

And TypeScript is able to tell us the exact value that we are missing from the
function.

This doesn't have to be used with `switch` statements either - it will work just
as well on large `if {} if else {}` branches too or in any other situation where
TypeScript is applying type narrowing as it reads through your code.

## Always ensure exhaustive checks

I can't overstate how helpful this technique has become in my TypeScript
codebases. By getting into the habit of using it every time I have code that
deals with branching over multiple values I am reminded to ensure I have dealt
with every value explicitly, and I get told which code to update should the set
of possible values change.
