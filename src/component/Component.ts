/*
 * Copyright 2022 Dan Lyu.
 */

import State from "../state/State";
import {Context} from "../index";

export abstract class CustomComponent {

    abstract render(): string | string[]

    abstract afterRender(): void

    abstract subscribe(): string[]

    mount(ss: State<any>[]) {
        ss.forEach(s=>{
            s.subscribe(this)
        })
    }

    abstract listen(): State<any>[]

    renderComponent() {
        const html = this.render()
        this.subscribe().forEach(selector => {
            $(selector).html(Array.isArray(html) ? html.join('') : html)
        })
        this.afterRender()
    }
}

export abstract class SceneComponent extends CustomComponent {
    protected context: Context

    constructor(context: Context) {
        super();
        this.context = context
        this.mount(this.listen())
    }
}