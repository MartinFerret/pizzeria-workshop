# certiPizza

The order page of a pizzeria, written in TypeScript from the first line:
strict mode on, no `any`, no casts. This is the project from the
"TypeScript, live" workshop by certificates.dev.

## What's inside

- `start/` is where the workshop begins. The site is there, and the four
  files of `src/pizzeria/` are empty.
- `final/` is the finished version, with comments that explain each
  concept where it's used.

Both are the same Vite project. The only folder that differs is
`src/pizzeria/`.

## Run it

You need Node.js 18 or later.

```sh
cd final
npm install
npm run dev
```

Then open http://localhost:5173/order.html.

To see the type errors as you go, run the compiler in a second terminal:

```sh
npx tsc --noEmit --watch
```

The page also shows them: a small badge in the bottom-left corner counts
the errors, and a click opens the details.

## The folder you write

```
src/pizzeria/
  types.ts    the vocabulary: Size, Topping, Order, NewOrder
  menu.ts     the lists: SIZES, TOPPINGS
  prices.ts   the maths: basePrice, toppingPrice, total
  order.ts    the state: the order being built, the tickets placed
  promo.ts    promo codes (final/ only)
```

`src/ui.ts` draws the page. It imports your types and never defines its
own, so every time a file in `src/pizzeria/` changes, the page follows.

## Try to break it

In `final/`, add `'giant'` to `SIZES` in `menu.ts`, or `'ham'` to
`TOPPINGS`, and watch which files the compiler sends you to.

## Go further

The TypeScript certification, Junior, Mid and Senior, is on
[certificates.dev](https://certificates.dev).
