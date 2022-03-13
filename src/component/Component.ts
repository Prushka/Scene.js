/*
 * Copyright 2022 Dan Lyu.
 */

export abstract class CustomComponent {
    abstract render(): string | string[]

    abstract afterRender(): void

    abstract subscribe(): string[]

    renderComponent() {
        const html = this.render()
        this.subscribe().forEach(selector => {
            $(selector).html(Array.isArray(html) ? html.join('') : html)
        })
        this.afterRender()
    }
}