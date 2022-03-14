/*
 * Copyright 2022 Dan Lyu.
 */

import State, {StateAction} from "../state/State";
import {Context} from "../index";

export interface HasStateAction {
    actions?(): StateAction

    subscribe(): string[]
}

export abstract class CustomComponent implements HasStateAction {

    abstract render(): string | string[]

    abstract afterRender(): void

    mount() {
        // listen will trigger render on every state update
        this.listen().forEach(s => {
            s.subscribe(this)
        })
        // action will trigger the action function on the specified state update
        this.actions().forEach(([state, func]) => {
            if (func) {
                state.subscribeActions(this, func)
            }
        })
    }

    listen(): State<any>[] {
        return []
    }

    renderComponent() {
        const html = this.render()
        this.subscribe().forEach(selector => {
            $(selector).html(Array.isArray(html) ? html.join('') : html)
        })
        this.afterRender()
    }

    actions(): StateAction {
        return []
    }

    subscribe(): string[] {
        return [];
    }
}

export abstract class SceneComponent extends CustomComponent {
    protected context: Context

    constructor(context: Context) {
        super();
        this.context = context
        this.mount()
    }
}