// @ts-ignore
import sheet from './style.css' with { type: 'css' }

const templatePromise = fetch(new URL('./template.html', import.meta.url)).then(r => r.text())

export class OptekaHeader extends HTMLElement {
    constructor() {
        super()
    }

    async connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' })

        shadow.innerHTML = await templatePromise

        shadow.adoptedStyleSheets = [sheet]
    }
}

customElements.define('opteka-header', OptekaHeader)
