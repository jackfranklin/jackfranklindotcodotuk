---
permalink: blog/typescript-enums-0-values/index.html
title: 'TypeScript enums and falsy values'
date: 2024-11-17
---

I recently lost an evening to debugging a subtle issue which highlights a
potential pitfall in the interaction between TypeScript enums and "falsy" values
in JavaScript. Let’s look at a scenario that illustrates this problem:

## Spot the Bug

Consider the following code where a function returns either an enum value or
`null` depending on whether a user is logged in:

```typescript
const enum Status {
  Inactive,
  Active,
  Pending,
}

function getUserStatus(user?: User): Status | null {
  if (!user) {
    // No user is logged in.
    return null
  }
  return user.status()
}

function checkUserStatus(user?: User): void {
  const status = getUserStatus(userId)

  if (status) {
    console.log('User has a valid status:', status)
  } else {
    console.log('The user is not logged in.')
  }
}
```

## What's the Issue?

JavaScript has a concept of truthy and falsy values. In conditional statements,
values that are considered falsy are treated as false. The list of falsy values
in JavaScript include:

- `false`
- `0`
- `""` (empty string)
- `null`
- `undefined`
- `NaN`

This means that `if(0) {}` is always **false** in JavaScript.

Now we can look at the default values assigned to enum members in TypeScript. As
the
[TypeScript documentation](https://www.typescriptlang.org/docs/handbook/enums.html#enum-members)
states, when initializing enum values, the default values are numeric and
**start from 0**. These two enums are equivalent:

```typescript
const enum Status {
  Inactive = 0,
  Active = 1,
  Pending = 2,
}

const enum Status {
  Inactive,
  Active,
  Pending,
}
```

This means that if an enum member is assigned the value 0, it will behave like
false in any condition where truthiness is evaluated rather than explicitly
checking for the `null` value.

## Solving with explicit checks

To avoid this bug, explicitly check for null instead of relying on truthy
checks:

```typescript
function checkUserStatus(user?: User): void {
  const status = getUserStatus(user)

  if (status !== null) {
    console.log('User has a valid status:', status)
  } else {
    console.log('The user is not logged in.')
  }
}
```

## Solving with explicit enum values

Alternatively, because each number in JavaScript that is not `0` is considered
truthy, we can update our TypeScript enum to explicitly assign the values `1`,
`2`, and `3` to the members `Inactive`, `Active`, and `Pending` respectively:

```typescript
const enum Status {
  Inactive = 1,
  Active = 2,
  Pending = 3,
}
```

Now code that checks `if(status)` when status is `Status|null` will work as
intended as we avoid inadvertently treating an enum value as falsy.

If you prefer to be more explicit with your enum values, you can also use string
values. As long as you avoid the empty string (which is also considered "falsy"
in JavaScript), you will also avoid the bug:

```typescript
const enum Status {
  Inactive = 'inactive',
  Active = 'active',
  Pending = 'pending',
}
```

## Conclusion

TypeScript enums are still a powerful tool for representing various states,
despite the
[well documented concerns](https://rahuulmiishra.medium.com/the-pitfalls-of-using-enums-in-typescript-4a52f00979a8#).
This bug is particularly challenging to fix given that is avoids any TypeScript
compilation errors, so you have to be careful when using enum values, or the
existence of them, in your conditionals.

You might also like to check the
[`strict-boolean-expressions`](https://typescript-eslint.io/rules/strict-boolean-expressions/)
rule in the TypeScript ESLint package, which can aid in catching problems like
this.
