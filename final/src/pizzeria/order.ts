// =====================================================================
// certiPizza - the order
//
// The state: the order being built, and the orders already placed. The
// only file here that holds values which change.
// =====================================================================

import type { NewOrder, Order, ToppingFlags } from './types'

// One object, edited in place. Every click in the browser changes a
// field here, and the compiler has already decided what fits: a missing
// field, a misspelt size, and this line refuses to compile.

export const order: NewOrder = {
  size: 'medium',
  toppings: ['mozzarella'],
  takeaway: true,
}

// Orders already placed are full Order objects: number and time granted.
export const placed: Order[] = []

let counter = 0

// The crossing from one type to the other: add the two missing fields.
// A spread copies one level deep, so the ticket shares the toppings
// array with the order being built. Safe: that array is readonly, the
// next click replaces it instead of changing it. No copy to write.
export function place(newOrder: NewOrder): Order {
  counter += 1

  return {
    ...newOrder,
    number: `P-${String(counter).padStart(3, '0')}`,
    placedAt: new Date(),
  }
}

// --- 14. Mapped types, in use --------------------------------------------
// The keys come from ToppingFlags: the editor proposes them, a typo is
// refused, and a topping added to the menu makes its key compulsory here.

export function flags(order: NewOrder): ToppingFlags {
  return {
    withMozzarella: order.toppings.includes('mozzarella'),
    withMushrooms: order.toppings.includes('mushrooms'),
    withOlives: order.toppings.includes('olives'),
    withChorizo: order.toppings.includes('chorizo'),
    withRocket: order.toppings.includes('rocket'),
  }
}
