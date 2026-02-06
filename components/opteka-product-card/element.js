import { addToCart, getCart } from "../../data/cart.js"
import { addFavorite, getFavorites, removeFavorite } from "../../data/favorites.js"
import formatPrice from "../../util/formatPrice.js"

// @ts-ignore
import sheet from './style.css' with { type: 'css' }

const templatePromise = fetch(new URL('./template.html', import.meta.url)).then(r => r.text())
const REMOVE_FAVORITE_TEXT = 'Удалить из избранного.'
const ADD_FAVORITE_TEXT = 'Добавить в избранное.'

const ADD_TO_CART_TEXT = 'Купить.'
const IN_CART_TEXT = 'Уже в корзине.'

/**
 * @param {string} template
 * @param {DOMStringMap} data
 */
function render(template, data) {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? `{{${key}}}`)
}

export class OptekaProductCard extends HTMLElement {
    constructor() {
        super()
    }

    get isFavorite() {
        return getFavorites().includes(Number(this.dataset.id))
    }

    get isInCart() {
        return getCart().findIndex(cr => cr.productId === Number(this.dataset.id)) != -1
    }

    /** @type {HTMLAnchorElement} */
    favoriteLink
    /** @type {HTMLAnchorElement} */
    cartLink

    static observedAttributes = [
        'data-favorite-text',
        'data-cart-text',
    ]

    /**
     * @param {string} name
     * @param {string} _
     * @param {string} newValue
     */
    async attributeChangedCallback(name, _, newValue) {
        if (!this.shadowRoot) return null

        switch (name) {
            case 'data-favorite-text':
                this.favoriteLink.innerText = newValue
                break;
            case 'data-cart-text':
                this.cartLink.innerText = newValue
        }
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' })

        this.dataset.price = formatPrice(Number(this.dataset.price))

        this.shadowRoot.innerHTML = render(await templatePromise, this.dataset)

        this.favoriteLink = this.shadowRoot.querySelector('a#favorite')
        this.cartLink = this.shadowRoot.querySelector('a#cart')

        if (this.isFavorite) {
            this.dataset.favoriteText = REMOVE_FAVORITE_TEXT
        } else {
            this.dataset.favoriteText = ADD_FAVORITE_TEXT
        }

        if (this.isInCart) {
            this.dataset.cartText = IN_CART_TEXT
        } else {
            this.dataset.cartText = ADD_TO_CART_TEXT
        }

        this.favoriteLink.addEventListener('click', e => {
            e.preventDefault()
            if (this.isFavorite) {
                removeFavorite(Number(this.dataset.id))
                this.dataset.favoriteText = ADD_FAVORITE_TEXT
            } else {
                addFavorite(Number(this.dataset.id))
                this.dataset.favoriteText = REMOVE_FAVORITE_TEXT
            }
        })

        this.cartLink.addEventListener('click', e => {
            e.preventDefault()
            if (this.isInCart) {
                location.href = 'cart.html'
            } else {
                addToCart(Number(this.dataset.id))
                this.dataset.cartText = IN_CART_TEXT
            }
        })

        shadow.adoptedStyleSheets = [sheet]
    }
}

customElements.define('opteka-product-card', OptekaProductCard)
