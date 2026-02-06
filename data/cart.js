/**
    * @typedef CartRecord
    * @property productId {number}
    * @property quantity {number}
*/

/** 
    * @param {CartRecord} obj 
    */
const validateCartRecord = obj =>
    typeof obj === 'object' &&
    typeof obj.productId === 'number' &&
    typeof obj.quantity === 'number' &&
    obj.quantity > 0

const KEY = 'cart'

/**
    * @returns {CartRecord[]}
*/
export function getCart() {
    /** @type CartRecord[] */
    let cart

    try {
        cart = JSON.parse(localStorage.getItem(KEY))
    } catch (err) {
        console.warn(err, 'while retrieving cart from localStorage. returning an empty array')
    }

    if (!cart) return []

    return cart.filter(validateCartRecord)
}

/**
 * @param {number} id
 */
export function addToCart(id) {
    const cart = getCart()

    const i = cart.findIndex(cr => cr.productId === id)
    if (i == -1) { // not present in array
        cart.push({
            productId: id,
            quantity: 1,
        })
    } else { // present in array
        cart[i].quantity++
    }

    localStorage.setItem(KEY, JSON.stringify(cart))
}

/**
 * @param {number} id
 */
export function removeOneFromCart(id) {
    const cart = getCart()

    const i = cart.findIndex(cr => cr.productId === id)
    if (i == -1) {
        throw new Error(`no product with id ${id} in cart`)
    } else {
        cart[i].quantity--;
    }

    if (cart[i].quantity < 1) cart.splice(i, 1)

    localStorage.setItem(KEY, JSON.stringify(cart))
}

/**
 * @param {number} id
 */
export function removeAllFromCart(id) {
    const cart = getCart()

    const i = cart.findIndex(cr => cr.productId === id)
    if (i == -1) {
        throw new Error(`no product with id ${id} in cart`)
    } else {
        cart.splice(i, 1)
    }

    localStorage.setItem(KEY, JSON.stringify(cart))
}

/**
 * Clear the entire cart
 */
export function clearCart() {
    localStorage.removeItem(KEY)
}

/**
 * Calculate total price of all items in cart
 * @param {import('./products.js').Product[]} products
 * @returns {number}
 */
export function getCartTotal(products) {
    const cart = getCart()
    return cart.reduce((total, cartItem) => {
        const product = products.find(p => p.id === cartItem.productId)
        if (product) {
            return total + (product.price * cartItem.quantity)
        }
        return total
    }, 0)
}
