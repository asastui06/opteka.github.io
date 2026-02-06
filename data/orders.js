/**
 * @typedef OrderItem
 * @property id {number}
 * @property name {string}
 * @property price {number}
 * @property quantity {number}
 */

/**
 * @typedef Order
 * @property id {string}
 * @property fullName {string}
 * @property phone {string}
 * @property email {string}
 * @property address {string}
 * @property paymentMethod {'online' | 'cash'}
 * @property comment {string}
 * @property items {OrderItem[]}
 * @property totalPrice {number}
 * @property createdAt {string}
 */

const KEY = 'orders'

/**
 * @param {any} obj
 * @returns {boolean}
 */
const validateOrder = obj =>
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.fullName === 'string' &&
    typeof obj.phone === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.address === 'string' &&
    (obj.paymentMethod === 'online' || obj.paymentMethod === 'cash') &&
    Array.isArray(obj.items) &&
    typeof obj.totalPrice === 'number' &&
    typeof obj.createdAt === 'string'

/**
 * @returns {Order[]}
 */
export function getOrders() {
    /** @type Order[] */
    let orders

    try {
        orders = JSON.parse(localStorage.getItem(KEY))
    } catch (err) {
        console.warn(err, 'while retrieving orders from localStorage. returning an empty array')
    }

    if (!orders) return []

    return orders.filter(validateOrder)
}

/**
 * @param {string} id
 * @returns {Order | undefined}
 */
export function getOrderById(id) {
    return getOrders().find(order => order.id === id)
}

/**
 * @param {object} orderData
 * @param {string} orderData.fullName
 * @param {string} orderData.phone
 * @param {string} orderData.email
 * @param {string} orderData.address
 * @param {'online' | 'cash'} orderData.paymentMethod
 * @param {string} orderData.comment
 * @param {OrderItem[]} orderData.items
 * @param {number} orderData.totalPrice
 * @returns {Order}
 */
export function createOrder(orderData) {
    const orders = getOrders()
    
    const newOrder = {
        id: Date.now().toString(),
        ...orderData,
        createdAt: new Date().toISOString()
    }

    orders.push(newOrder)
    localStorage.setItem(KEY, JSON.stringify(orders))
    
    return newOrder
}

/**
 * @param {string} id
 */
export function deleteOrder(id) {
    const orders = getOrders().filter(order => order.id !== id)
    localStorage.setItem(KEY, JSON.stringify(orders))
}

/**
 * Clear all orders (use with caution)
 */
export function clearOrders() {
    localStorage.removeItem(KEY)
}
