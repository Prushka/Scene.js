/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State, {createState, StateAction} from "../state/State";
import ClickEvent = JQuery.ClickEvent;
import {setClassList} from "../utils/Utils";

export class Snackbar extends SceneComponent {

    timeouts = []

    actions(): StateAction<any>[] {
        return [[this.context.snackbarState, ((_, message) => {
            const snackbar = document.getElementById(this.context.getIdType("snackbar"))
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
        return `<div class='snackbar snackbar--closed' id="${this.context.getIdType("snackbar")}"><span></span></div>`
    }
}