/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State, {createState, StateAction} from "../state/State";
import ClickEvent = JQuery.ClickEvent;
import {setClassList} from "../utils/Utils";

export class Overlay extends SceneComponent {

    subscribe() {
        return [".overlay-container"]
    }

    listen(): State<any>[] {
        return [this.context.overlayOpenState, this.context.overlayHTMLState]
    }

    afterRender() {
        const overlay = document.getElementById(this.context.getIdType("overlay"))
        if(overlay){
            overlay.onclick = (e) => {
                this.context.overlayOpenState.set(false)
            }
        }

    }

    render(): string | string[] {
        return this.context.overlayOpenState.get() && `<div class='overlay' id="${this.context.getIdType("overlay")}">
        ${this.context.overlayHTMLState.get()}
        </div>`
    }
}