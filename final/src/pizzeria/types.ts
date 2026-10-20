// =====================================================================
// certiPizza - the types
//
// The vocabulary of the pizzeria. Nothing here runs: every line is
// erased at build time. The other files import these names with
// `import type`, so no module ever depends on this one at runtime.
// =====================================================================

import type { PERCENTS, SIZES, TOPPINGS } from './menu'

// --- 1. Literal unions -----------------------------------------------
// A value locked onto a fixed set. Not a string that happens to look
// right: a closed list, and the compiler holds you to it.
//
// --- 10. Types derived from values ------------------------------------
// The lists already live in menu.ts. Rather than write them twice, read
// the type off the value: typeof SIZES is the array's type, and [number]
// is the type of any one of its elements. Thanks to as const, that is
// 'small' | 'medium' | 'large', not string. One list to maintain: add
// 'giant' to SIZES and Size follows.
//
// `import type` is enough for typeof: the value is read by the compiler,
// never loaded at runtime.

export type Size = (typeof SIZES)[number]

export type Topping = (typeof TOPPINGS)[number]

// --- 12. Template literal types ----------------------------------------
// Every promo code, spelt out by the compiler: a topping in capitals,
// then a percentage. Ten codes, from MOZZARELLA10 to ROCKET20, and not
// one written by hand. Uppercase is built into TypeScript.

export type PromoCode = `${Uppercase<Topping>}${(typeof PERCENTS)[number]}`

// --- 2. Object types --------------------------------------------------
// --- 3. Optional properties -------------------------------------------
// The shape of one order. The ? on extra adds undefined to its type,
// which is why total() in prices.ts needs a guard before using it.
// A type alias, like every other name in this file: one keyword to
// learn. An interface would do the same job here.
// readonly where a value must not change: a ticket keeps its number and
// its time, and the toppings array is replaced, never pushed to.

export type Order = {
  readonly number: string
  readonly placedAt: Date
  size: Size
  toppings: readonly Topping[]
  extra?: Topping
  takeaway: boolean
  promo?: PromoCode
}

// --- 9. Omit ----------------------------------------------------------
// What the customer fills in. The number and the time are handed out at
// the counter, not typed by the customer. One type to maintain: add a
// field to Order and NewOrder picks it up on its own.

export type NewOrder = Omit<Order, 'number' | 'placedAt'>

// --- 14. Mapped types, with key remapping ------------------------------
// One boolean per topping, named by the compiler: for each T in Topping,
// the key becomes `with` and T with a capital. Add a topping to the menu
// and a key appears here, then goes missing wherever it is not filled.

export type ToppingFlags = {
  [T in Topping as `with${Capitalize<T>}`]: boolean
}
