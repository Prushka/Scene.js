/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State from "../state/State";

export class Overlay extends SceneComponent {

    renderIn() {
        return [this.getRootId('overlay')]
    }

    listen(): State<any>[] {
        return [this.overlayCtx.overlayOpenState, this.overlayCtx.overlayHTMLState]
    }

    afterRender() {
        const overlay = document.getElementById(this.ctx.getIdType("overlay"))
        if (overlay) {
            overlay.onclick = () => {
                this.overlayCtx.overlayOpenState.set(false)
            }
        }
    }

    render(): string | string[] {
        return this.overlayCtx.overlayOpenState.get() ? `<div class='overlay' id="${this.ctx.getIdType("overlay")}">
        ${this.overlayCtx.overlayHTMLState.get()}
        </div>` : ''
    }
}