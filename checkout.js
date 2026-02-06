import { createOrder } from './data/orders.js'
import { getCart, getCartTotal, clearCart } from './data/cart.js'
import { getProducts } from './data/products.js'

const form = document.getElementById('checkout-form')

function showError(input, show) {
    if (show) {
        input.classList.add('error')
    } else {
        input.classList.remove('error')
    }
}

function validateField(input) {
    if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        showError(input, !emailRegex.test(input.value.trim()))
        return emailRegex.test(input.value.trim())
    }
    
    showError(input, !input.value.trim())
    return !!input.value.trim()
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    
    // Validate all required fields
    const requiredFields = form.querySelectorAll('input[required], textarea[required]')
    let isValid = true
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false
        }
    })
    
    if (!isValid) {
        // Focus first invalid field
        const firstError = form.querySelector('.error')
        if (firstError) {
            firstError.focus()
        }
        return
    }
    
    // Check if cart is empty
    const cart = getCart()
    if (cart.length === 0) {
        alert('Ваша корзина пуста. Добавьте товары перед оформлением заказа.')
        return
    }
    
    // Get form data
    const formData = new FormData(form)
    
    // Get cart items with full product details
    const products = getProducts()
    const orderItems = cart.map(cartItem => {
        const product = products.find(p => p.id === cartItem.productId)
        return {
            id: cartItem.productId,
            name: product?.name || 'Unknown Product',
            price: product?.price || 0,
            quantity: cartItem.quantity
        }
    })
    
    // Create order
    const order = createOrder({
        fullName: formData.get('fullName'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address'),
        paymentMethod: formData.get('paymentMethod'),
        comment: formData.get('comment') || '',
        items: orderItems,
        totalPrice: getCartTotal(products)
    })
    
    // Clear cart
    clearCart()
    
    // Redirect to confirmation page
    window.location.href = `order-confirmation.html?orderId=${order.id}`
})

// Real-time validation
form.querySelectorAll('input[required], textarea[required]').forEach(input => {
    input.addEventListener('blur', () => validateField(input))
    input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
            validateField(input)
        }
    })
})
