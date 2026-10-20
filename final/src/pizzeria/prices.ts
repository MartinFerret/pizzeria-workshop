// =====================================================================
// certiPizza - the prices
//
// Pure functions: a size, a topping or an order in, a price out. They
// read the types and touch nothing else.
// =====================================================================

import type { NewOrder, Size, Topping } from './types'
import { promoPercent } from './promo'

// --- 6. Narrowing with switch -----------------------------------------
// --- 7. Exhaustiveness with never -------------------------------------
// In the default branch, size is never: all three cases are handled, so
// nothing is left. Add 'giant' to Size and this line turns red.

export function basePrice(size: Size): number {
  switch (size) {
    case 'small':
      return 8
    case 'medium':
      return 10
    case 'large':
      return 12.5
    default: {
      const exhaustive: never = size
      throw new Error(`Unknown size: ${String(exhaustive)}`)
    }
  }
}

// --- 11. satisfies and Record ----------------------------------------
// The toppings take a table instead of a switch. Record<Topping, number>
// demands one price per topping: forget one and this refuses to compile,
// the same guarantee as the never block above, reached another way.
//
// satisfies checks the table against Record without becoming it. The
// constant keeps its own, more precise type: with as const, read-only
// keys holding the exact prices. An annotation (: Record<...>) would
// check just as well, but widen every value to number and leave the
// table open to a stray TOPPING_PRICES.olives = 0.

const TOPPING_PRICES = {
  olives: 0.5,
  mozzarella: 1,
  mushrooms: 1,
  rocket: 1.5,
  chorizo: 2,
} as const satisfies Record<Topping, number>

export function toppingPrice(topping: Topping): number {
  return TOPPING_PRICES[topping]
}

// --- 5. Inference -----------------------------------------------------
// No annotation on SERVICE_CHARGE, none on price. TypeScript reads the
// values and works the types out on its own. Hover them: SERVICE_CHARGE
// is the literal 2, since a const never changes; price is number, since
// a let can take another value. That difference is called widening.

const SERVICE_CHARGE = 2

export function total(order: NewOrder): number {
  let price = basePrice(order.size)

  for (const topping of order.toppings) {
    price += toppingPrice(topping)
  }

  // extra is Topping | undefined. After this test, it is Topping.
  // Prefer !== undefined over a truthiness test, which would also throw
  // away '' and 0 if they ever became valid values.
  if (order.extra !== undefined) {
    price += toppingPrice(order.extra)
  }

  if (!order.takeaway) {
    price += SERVICE_CHARGE
  }

  // A promo code takes its percentage off the whole order.
  price -= (price * promoPercent(order)) / 100

  return price
}
