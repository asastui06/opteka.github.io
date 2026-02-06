import { getOrderById } from './data/orders.js'

const urlParams = new URLSearchParams(window.location.search)
const orderId = urlParams.get('orderId')

const orderIdElement = document.getElementById('order-id')

if (orderId) {
    const order = getOrderById(orderId)
    if (order) {
        orderIdElement.textContent = orderId
    } else {
        orderIdElement.textContent = 'Не найден'
    }
} else {
    orderIdElement.textContent = 'Неизвестен'
}
