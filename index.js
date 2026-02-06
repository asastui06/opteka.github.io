import { OptekaProductCard } from "./components/opteka-product-card/element.js"
import { getProducts } from "./data/products.js"

const products = getProducts()

const productsContainer = document.querySelector('.products-container')

products.forEach(product => {
    const card = new OptekaProductCard()

    Object.keys(product).forEach(key => {
        card.dataset[key] = product[key]
    })

    productsContainer.appendChild(card)
})
