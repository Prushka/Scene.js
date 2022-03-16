/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import {StateAction} from "../state/State";

export class Snackbar extends SceneComponent {

    timeouts = []

    actions(): StateAction<any>[] {
        return [[this.ctx.snackbarState, ((_, message) => {
            const snackbar = document.getElementById(this.ctx.getIdType("snackbar"))
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

    subscribe() {
        return [this.getRootId("snackbar")]
    }

    afterRender() {

    }

    render(): string | string[] {
        return `<div class='snackbar snackbar--closed' id="${this.ctx.getIdType("snackbar")}"><span></span></div>`
    }
}