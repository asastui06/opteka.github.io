
/**
 * @param {number} price
 */
export default function formatPrice(price) {
    return price
        .toLocaleString('ru-RU', {
            style: 'currency',
            currency: 'RUB',
        })
}
