/// <reference types="vite/client" />

// =====================================================================
// The display. Provided with the exercise: you never edit this file.
//
// It reads the files you write in pizzeria/. Until a file exists, or
// until it exports a name, the lines below that ask for it cannot find
// it and TypeScript says so. The error list is your to-do list, and it
// empties itself as you go.
//
// The page never breaks while you work: a piece that is not written yet
// leaves a gap that says what it is waiting for, and in which file, and
// fills in the moment that file exports it.
// =====================================================================

// The types of each file. A file still empty is the first error on the
// list: "is not a module", one line per file.
import type { Size, Topping } from './pizzeria/types' // step 1
import type * as OrderFile from './pizzeria/order' // steps 1 and 6
import type * as MenuFile from './pizzeria/menu' // step 2
import type * as PricesFile from './pizzeria/prices' // steps 3, 4, 5

// The values, at runtime. Vite gathers every file of the folder, and
// reloads the moment one of them changes. An empty file exports
// nothing: no crash, just a gap on the page where its names would go.
const files = import.meta.glob<Record<string, unknown>>('./pizzeria/*.ts', {
  eager: true,
})

// The glob only knows it found some module. The type imports above say
// which one: that is what the three assertions state, and nothing more.
// A file not written yet becomes an empty object, so its names are
// undefined, and every box below checks for that before drawing.
const orderFile = (files['./pizzeria/order.ts'] ?? {}) as typeof OrderFile
const menuFile = (files['./pizzeria/menu.ts'] ?? {}) as typeof MenuFile
const pricesFile = (files['./pizzeria/prices.ts'] ?? {}) as typeof PricesFile

// Each line lights up at the step that writes it.
const { order } = orderFile // step 1
const { SIZES, TOPPINGS } = menuFile // step 2
const { basePrice } = pricesFile // step 3
const { toppingPrice } = pricesFile // step 4
const { total } = pricesFile // step 5
const { placed, place } = orderFile // step 6

// Where each name is written, for the notes left in the empty boxes.
const home: Record<string, string> = {
  order: 'order.ts',
  SIZES: 'menu.ts',
  TOPPINGS: 'menu.ts',
  basePrice: 'prices.ts',
  toppingPrice: 'prices.ts',
  total: 'prices.ts',
  placed: 'order.ts',
  place: 'order.ts',
  applyPromo: 'promo.ts',
  flags: 'order.ts',
}

// Steps 9 and 10 are reached by name, as unknown values, so a room that
// stops early still ends on zero errors. A type predicate makes them
// callable, returning unknown: no cast, and no any from the call.
function isCallable(value: unknown): value is (...args: unknown[]) => unknown { return typeof value === 'function' }
function late(file: string, name: string): ((...args: unknown[]) => unknown) | undefined {
  const value: unknown = files[`./pizzeria/${file}.ts`]?.[name]
  return isCallable(value) ? value : undefined
}

// getElementById returns HTMLElement | null. Refuse the null once, here,
// rather than dragging it through every function below.
function byId(id: string): HTMLElement {
  const element = document.getElementById(id)

  if (element === null) {
    throw new Error(`No element with id: ${id}`)
  }

  return element
}

const sizeBox = byId('sizes')
const toppingBox = byId('toppings')
const extraBox = byId('extra')
const serviceBox = byId('service')
const pizzaBox = byId('pizza')
const priceBox = byId('price')
const codeBox = byId('code')
const errorBox = byId('error')
const orderBox = byId('orders')
const placeButton = byId('place-order')
const promoBox = byId('promo')
const promoNote = byId('promo-note')

function euros(amount: number): string {
  return typeof amount === 'number' ? `€${amount.toFixed(2)}` : '€?'
}

// Before an export exists, its name is undefined at runtime. Say so in
// the box that needs it, name the file to open, and skip the drawing.
function ready(box: HTMLElement, needs: Record<string, unknown>): boolean {
  const missing = Object.keys(needs).filter((name) => needs[name] === undefined)

  if (missing.length === 0) {
    return true
  }

  const note = document.createElement('p')
  note.className = 'waiting'
  note.textContent = `waiting for ${missing
    .map((name) => `${name} in ${home[name]}`)
    .join(', ')}`
  box.replaceChildren(note)
  return false
}

function chip(
  label: string,
  price: string | undefined,
  selected: boolean,
  onClick: () => void,
): HTMLButtonElement {
  const element = document.createElement('button')
  element.type = 'button'
  element.className = selected ? 'option selected' : 'option'
  element.textContent = label
  element.setAttribute('aria-pressed', String(selected))
  element.addEventListener('click', onClick)

  if (price !== undefined) {
    const tag = document.createElement('span')
    tag.className = 'price'
    tag.textContent = price
    element.append(tag)
  }

  return element
}

// The price on a topping chip, once step 4 has written toppingPrice.
function toppingTag(topping: Topping): string | undefined {
  return toppingPrice === undefined
    ? undefined
    : `+${priced(() => toppingPrice(topping))}`
}

// The chips are built from the typed arrays, so the captured value is
// already a Size or a Topping. No cast, no conversion, nothing to check.
//
// Each callback names its parameter's type from the array it reads,
// (typeof SIZES)[number], instead of letting it be inferred. Same type,
// once the file exports it. Before, it is any on purpose: an empty file
// stays one error, "is not a module", not a cascade of them.
function renderOptions(): void {
  if (ready(sizeBox, { order, SIZES })) {
    sizeBox.replaceChildren(
      ...SIZES.map((size: (typeof SIZES)[number]) =>
        chip(
          size,
          // The price on a size chip, once step 3 has written basePrice.
          basePrice === undefined ? undefined : priced(() => basePrice(size)),
          order.size === size,
          () => {
            order.size = size
            render()
          },
        ),
      ),
    )
  }

  if (ready(toppingBox, { order, TOPPINGS })) {
    toppingBox.replaceChildren(
      ...TOPPINGS.map((topping: (typeof TOPPINGS)[number]) =>
        chip(
          topping,
          toppingTag(topping),
          order.toppings.includes(topping),
          () => {
            // toppings is a readonly array: never pushed to or spliced,
            // the order gets a new one.
            const on = order.toppings.includes(topping)

            order.toppings = on
              ? order.toppings.filter((other: Topping) => other !== topping)
              : [...order.toppings, topping]

            render()
          },
        ),
      ),
    )
  }

  if (ready(extraBox, { order, TOPPINGS })) {
    extraBox.replaceChildren(
      ...TOPPINGS.map((topping: (typeof TOPPINGS)[number]) =>
        chip(topping, toppingTag(topping), order.extra === topping, () => {
          order.extra = order.extra === topping ? undefined : topping
          render()
        }),
      ),
    )
  }

  if (ready(serviceBox, { order })) {
    serviceBox.replaceChildren(
      chip(
        order.takeaway ? 'takeaway' : 'eat in',
        undefined,
        !order.takeaway,
        () => {
          order.takeaway = !order.takeaway
          render()
        },
      ),
    )
  }
}

// One diameter per size. Add 'giant' to Size and this table turns red
// too, in a file you never opened. Two places to fix, nothing forgotten.
const DIAMETERS: Record<Size, number> = { small: 62, medium: 78, large: 94 }

function renderPizza(): void {
  if (order === undefined) {
    priceBox.textContent = '—'
    pizzaBox.replaceChildren()
    return
  }

  const size: Size = order.size

  pizzaBox.style.width = `${DIAMETERS[size]}%`

  const onTop: Topping[] = [...order.toppings]

  if (order.extra !== undefined) {
    onTop.push(order.extra)
  }

  const pieces: HTMLElement[] = []

  // Eight pieces per topping, laid out on a sunflower spiral so they
  // never line up and never sit on top of each other.
  onTop.forEach((topping, layer) => {
    for (let index = 0; index < 8; index += 1) {
      const angle = (index * 137.5 + layer * 51) * (Math.PI / 180)
      const radius = Math.sqrt((index + 0.7) / 8) * 34
      const piece = document.createElement('span')
      piece.className = `topping ${topping}`
      piece.style.left = `${50 + Math.cos(angle) * radius}%`
      piece.style.top = `${50 + Math.sin(angle) * radius}%`
      pieces.push(piece)
    }
  })

  pizzaBox.replaceChildren(...pieces)
  priceBox.textContent = total === undefined ? '—' : euros(total(order))
}

// The object the room is building, written out as you click.
function renderCode(): void {
  if (order === undefined) {
    codeBox.innerHTML =
      '<span class="comment">// waiting for order in order.ts</span>'
    return
  }

  const lines = [
    'const order: NewOrder = {',
    `  size: '${order.size}',`,
    `  toppings: [${order.toppings.map((t: Topping) => `'${t}'`).join(', ')}],`,
  ]

  if (order.extra !== undefined) {
    lines.push(`  extra: '${order.extra}',`)
  }

  lines.push(`  takeaway: ${String(order.takeaway)},`)

  // The promo field arrives at step 9: `in` narrows without a cast.
  if ('promo' in order && typeof order.promo === 'string') {
    lines.push(`  promo: '${order.promo}',`)
  }

  lines.push('}')

  // Step 10: the flags the compiler named, filled in by flags().
  const flags = late('order', 'flags')

  if (flags !== undefined) {
    const result: unknown = flags(order)

    if (typeof result === 'object' && result !== null) {
      lines.push('', 'const flags: ToppingFlags = {')
      for (const [key, value] of Object.entries(result)) {
        lines.push(`  ${key}: ${String(value)},`)
      }
      lines.push('}')
    }
  }

  // The content comes from our own types, never from user input.
  codeBox.innerHTML = lines
    .join('\n')
    .replace(/'[^']*'/g, '<span class="string">$&</span>')
    .replace(/\b(const|true|false)\b/g, '<span class="keyword">$1</span>')
    .replace(/\b(NewOrder|ToppingFlags)\b/g, '<span class="typename">$1</span>')
}

// Here we handle full Order objects: number and time are guaranteed.
// Until step 6 gives Order those two fields, the two lines that read
// them are the errors that say so.
function renderOrders(): void {
  const open =
    order !== undefined && placed !== undefined && place !== undefined
  placeButton.toggleAttribute('disabled', !open)

  if (placed === undefined) {
    orderBox.replaceChildren()
    return
  }

  const receipts = placed.map((placedOrder: (typeof placed)[number]) => {
    const receipt = document.createElement('li')
    const left = document.createElement('span')
    const right = document.createElement('span')

    const time = placedOrder.placedAt.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    })

    left.textContent = `${placedOrder.number} · ${placedOrder.size} · ${time}`
    right.textContent = total === undefined ? '' : euros(total(placedOrder))
    receipt.append(left, right)
    return receipt
  })

  orderBox.replaceChildren(...receipts.reverse())
}

// Step 9: a promo code, typed by the customer, checked by applyPromo().
let refused: string | undefined

function renderPromo(): void {
  const applyPromo = late('promo', 'applyPromo')

  // Step 9 is not on the to-do list: until promo.ts exists, the whole
  // field stays out of sight rather than naming a file nobody has met.
  promoBox.closest('.field')?.toggleAttribute('hidden', applyPromo === undefined)

  if (!ready(promoBox, { order, applyPromo })) {
    promoNote.textContent = ''
    return
  }

  if (promoBox.querySelector('form') === null) {
    const form = document.createElement('form')
    const input = document.createElement('input')
    const button = document.createElement('button')
    form.className = 'promo-form'
    input.name = 'promo'
    input.autocomplete = 'off'
    input.spellcheck = false
    input.placeholder = 'OLIVES10'
    input.setAttribute('aria-label', 'Promo code')
    input.setAttribute('aria-describedby', 'promo-note')
    button.type = 'submit'
    button.className = 'option'
    button.textContent = 'Apply'
    form.append(input, button)
    form.addEventListener('submit', (event) => {
      event.preventDefault()
      const value = input.value.trim().toUpperCase()
      const apply = late('promo', 'applyPromo')
      refused = apply !== undefined && apply(order, value) === true ? undefined : value
      render()
    })
    promoBox.replaceChildren(form)
  }

  const code = 'promo' in order && typeof order.promo === 'string' ? order.promo : undefined
  const percent: unknown = late('promo', 'promoPercent')?.(order)
  promoNote.classList.toggle('applied', typeof percent === 'number' && percent > 0)

  if (refused !== undefined) {
    promoNote.textContent = refused === '' ? 'Type a code first.' : `${refused} is not a code.`
  } else if (code === undefined) {
    promoNote.textContent = ''
  } else if (typeof percent === 'number' && percent > 0) {
    promoNote.textContent = `${code}: ${percent}% off the order.`
  } else {
    const topping = code.replace(/\d+$/, '').toLowerCase()
    promoNote.textContent = `${code} is saved. It applies once the pizza has ${topping}.`
  }
}

// A scene that throws at runtime (a never block reached, a price that is
// not there yet) must not blank the page: each part draws on its own, and
// the message lands in the error box, next to the one the compiler gives.
function report(error: unknown): void {
  errorBox.textContent = `runtime: ${error instanceof Error ? error.message : String(error)}`
  errorBox.classList.add('visible')
}

function attempt(draw: () => void): void {
  try {
    draw()
  } catch (error) {
    report(error)
  }
}

// A price on a chip. If the function throws (a never block reached), the
// chip says so with '€?' and the message goes to the error box.
function priced(compute: () => number): string {
  try {
    return euros(compute())
  } catch (error) {
    report(error)
    return '€?'
  }
}

function render(): void {
  attempt(renderOptions)
  attempt(renderPizza)
  attempt(renderCode)
  attempt(renderOrders)
  attempt(renderPromo)
}

placeButton.addEventListener('click', () => {
  placed.push(place(order))
  render()
})

// The moment worth waiting for: what the compiler refuses to write.
byId('pineapple').addEventListener('click', () => {
  errorBox.textContent =
    'error TS2322: Type \'"pineapple"\' is not assignable to type \'Topping\'.'
  errorBox.classList.add('visible')
  window.setTimeout(() => errorBox.classList.remove('visible'), 4000)
})

render()
