import { removeOneFromCart, addToCart, removeAllFromCart, getCart } from "../../data/cart.js"
import { getProducts } from "../../data/products.js"
import formatPrice from "../../util/formatPrice.js"

// @ts-ignore
import sheet from './style.css' with { type: 'css' }

const templatePromise = fetch(new URL('./template.html', import.meta.url)).then(r => r.text())

/**
 * @param {string} template
 * @param {DOMStringMap} data
 */
function render(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? `{{${key}}}`)
}

const cartChangeEvent = new CustomEvent('cartChange')

export class OptekaCartItem extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' })

        shadow.innerHTML = render(await templatePromise, this.dataset)

        this.updateDisplay()

        shadow.adoptedStyleSheets = [sheet]

        const decreaseBtn = shadow.querySelector('.decrease')
        const increaseBtn = shadow.querySelector('.increase')
        const deleteBtn = shadow.querySelector('.delete')

        decreaseBtn.addEventListener('click', () => {
            const productId = Number(this.dataset.id)
            removeOneFromCart(productId)
            this.parentElement.dispatchEvent(cartChangeEvent)
            this.updateDisplay()
        })

        increaseBtn.addEventListener('click', () => {
            const productId = Number(this.dataset.id)
            addToCart(productId)
            this.parentElement.dispatchEvent(cartChangeEvent)
            this.updateDisplay()
        })

        deleteBtn.addEventListener('click', () => {
            const productId = Number(this.dataset.id)
            removeAllFromCart(productId)
            this.parentElement.dispatchEvent(cartChangeEvent)
            this.remove()
        })
    }

    updateDisplay() {
        const cart = getCart()
        const product = getProducts().find(p => p.id === Number(this.dataset.id))
        const item = cart.find(cr => cr.productId === Number(this.dataset.id))

        if (item) {
            const quantitySpan = this.shadowRoot.querySelector('.quantity')

            /** @type HTMLDivElement */
            const priceDiv = this.shadowRoot.querySelector('.price')
            priceDiv.innerText = formatPrice(product.price)

            /** @type HTMLDivElement */
            const sumDiv = this.shadowRoot.querySelector('.sum')
            sumDiv.innerText = formatPrice(product.price * item.quantity)

            quantitySpan.textContent = item.quantity.toString() + ' шт.'
        } else {
            this.remove()
        }
    }
}

customElements.define('opteka-cart-item', OptekaCartItem)
