import { OptekaProductCard } from "./components/opteka-product-card/element.js"
import { getProducts } from "./data/products.js"
import { getFavorites } from "./data/favorites.js"

const products = getProducts()
const favorites = getFavorites()

const productsContainer = document.querySelector('.products-container')

const favoriteProducts = products.filter(product => favorites.includes(product.id))

if (favoriteProducts.length === 0) {
    productsContainer.innerHTML = '<div class="empty-message">У вас пока нет избранных товаров</div>'
} else {
    favoriteProducts.forEach(product => {
        const card = new OptekaProductCard()

        Object.keys(product).forEach(key => {
            card.dataset[key] = product[key]
        })

        productsContainer.appendChild(card)
    })
}
