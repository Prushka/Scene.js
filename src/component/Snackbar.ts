/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import {StateAction} from "../state/State";

export class Snackbar extends SceneComponent {

    timeouts = []

    actions(): StateAction<any>[] {
        return [[this.snackbarCtx.snackbarState, ((_, message) => {
            const snackbar = document.getElementById(this.ids.SNACKBAR)
            const span = snackbar.querySelector("span")
            snackbar.classList.remove("snackbar--closed")
            span.innerText = message
            this.timeouts.forEach(t => {
                clearTimeout(t)
            })
            this.timeouts.push(setTimeout(() => {
                snackbar.classList.add("snackbar--closed")
            }, 4000))
        })]]
    }

    renderInIds() {
        return [this.ids.ROOT_SNACKBAR]
    }

    afterRender() {

    }

    render(): string | string[] {
        return `<div class='snackbar snackbar--closed ${this.ctx.isRootMobile()?'snackbar--mobile':'snackbar--normal'}' id="${this.ids.SNACKBAR}"><span></span></div>`
    }
}