// =====================================================================
// certiPizza - the promo codes
//
// What a customer types is only ever a string. The type PromoCode lists
// the valid codes; this file is where a string earns that type.
// =====================================================================

import type { NewOrder, PromoCode } from './types'
import { PERCENTS, TOPPINGS } from './menu'

// --- 13. Type predicates -----------------------------------------------
// `value is PromoCode` is a promise made to the compiler: when this
// returns true, value is a PromoCode. TypeScript takes our word for it,
// so the test has to be right: it rebuilds every code from the same two
// lists the type is built from.

export function isPromoCode(value: string): value is PromoCode {
  return TOPPINGS.some((topping) =>
    PERCENTS.some((percent) => value === `${topping.toUpperCase()}${percent}`),
  )
}

// A string from the customer, kept only if it is a real code. After the
// test, value is a PromoCode: no cast, the predicate did the narrowing.
export function applyPromo(order: NewOrder, value: string): boolean {
  if (!isPromoCode(value)) {
    return false
  }

  order.promo = value
  return true
}

// The percentage the code takes off, once the pizza has its topping:
// OLIVES10 needs olives.
export function promoPercent(order: NewOrder): number {
  const code = order.promo

  if (code === undefined) {
    return 0
  }

  const topping = TOPPINGS.find((name) => code.startsWith(name.toUpperCase()))

  if (topping === undefined || !order.toppings.includes(topping)) {
    return 0
  }

  return Number(code.slice(topping.length))
}
