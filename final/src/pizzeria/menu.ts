// =====================================================================
// certiPizza - the menu
//
// The lists the display turns into buttons. Plain values, no imports.
// =====================================================================

// --- 4. Typed arrays --------------------------------------------------
// --- 8. as const ------------------------------------------------------
// Without as const these are string[], and the display can no longer put
// a chip's value into order.size. With it, each value keeps its literal
// type.

export const SIZES = ['small', 'medium', 'large'] as const

export const TOPPINGS = [
  'mozzarella',
  'mushrooms',
  'olives',
  'chorizo',
  'rocket',
] as const

// --- 12. Template literal types (the values behind them) --------------
// The two percentages a promo code can take off. types.ts reads them to
// build the type of every code, promo.ts to check what a customer types.

export const PERCENTS = [10, 20] as const
