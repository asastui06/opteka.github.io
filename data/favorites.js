const KEY = 'favorites'

/**
    * @returns {number[]}
    */
export function getFavorites() {
    let favorites
    try {
        favorites = JSON.parse(localStorage.getItem(KEY))
    } catch (err) {
        console.warn(err, 'while retrieving favorites from localStorage. returning an empty array')
    }
    if (!favorites) favorites = []
    return favorites
}

/**
 * @param {number} id
 */
export function addFavorite(id) {
    localStorage.setItem(KEY, JSON.stringify(getFavorites().concat(id)))
}

/**
 * @param {number} id
 */
export function removeFavorite(id) {
    localStorage.setItem(KEY, JSON.stringify(getFavorites().filter(f => f !== id)))
}
