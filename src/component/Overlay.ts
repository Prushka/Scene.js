/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State from "../state/State";

export class Overlay extends SceneComponent {

    subscribe() {
        return [this.getRootId('overlay')]
    }

    listen(): State<any>[] {
        return [this.ctx.overlayOpenState, this.ctx.overlayHTMLState]
    }

    afterRender() {
        const overlay = document.getElementById(this.ctx.getIdType("overlay"))
        if(overlay){
            overlay.onclick = () => {
                this.ctx.overlayOpenState.set(false)
            }
        }
    }

    render(): string | string[] {
        return this.ctx.overlayOpenState.get() && `<div class='overlay' id="${this.ctx.getIdType("overlay")}">
        ${this.ctx.overlayHTMLState.get()}
        </div>`
    }
}