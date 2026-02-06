import { getOrders } from './data/orders.js'
import formatPrice from './util/formatPrice.js'

const ordersContainer = document.getElementById('orders-container')

function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

function getPaymentMethodLabel(method) {
    return method === 'online' ? 'Онлайн оплата' : 'Наличными при получении'
}

function renderOrders() {
    const orders = getOrders()
    
    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-orders">
                <p>У вас пока нет заказов</p>
                <a href="index.html" class="btn">Перейти к покупкам</a>
            </div>
        `
        return
    }
    
    // Sort orders by date (newest first)
    const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    
    ordersContainer.innerHTML = sortedOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-id">Заказ №${order.id}</div>
                <div class="order-date">${formatDate(order.createdAt)}</div>
            </div>
            <div class="order-details">
                <div class="order-detail-row">
                    <span>Получатель:</span>
                    <span>${order.fullName}</span>
                </div>
                <div class="order-detail-row">
                    <span>Телефон:</span>
                    <span>${order.phone}</span>
                </div>
                <div class="order-detail-row">
                    <span>Адрес:</span>
                    <span>${order.address}</span>
                </div>
                <div class="order-detail-row">
                    <span>Способ оплаты:</span>
                    <span>${getPaymentMethodLabel(order.paymentMethod)}</span>
                </div>
                ${order.comment ? `
                <div class="order-detail-row">
                    <span>Комментарий:</span>
                    <span>${order.comment}</span>
                </div>
                ` : ''}
            </div>
            <div class="order-items">
                <h4>Товары (${order.items.length}):</h4>
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>${formatPrice(item.price * item.quantity)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <span class="order-total-label">Итого:</span>
                <span class="order-total-price">${formatPrice(order.totalPrice)}</span>
            </div>
        </div>
    `).join('')
}

renderOrders()
