/*
 * Copyright 2022 Dan Lyu.
 */

import State from "../state/State";

export abstract class CustomComponent {
    abstract render(): string | string[]

    abstract afterRender(): void

    abstract subscribe(): string[]

    mount() {
        for(let key in this){
            let v = this[key]
            if(v instanceof State){
                v.subscribe(this)
            }
        }
    }

    renderComponent() {
        const html = this.render()
        this.subscribe().forEach(selector => {
            $(selector).html(Array.isArray(html) ? html.join('') : html)
        })
        this.afterRender()
    }
}