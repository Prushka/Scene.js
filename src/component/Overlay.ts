/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State from "../state/State";

export class Overlay extends SceneComponent {

    renderInIds() {
        return [this.ids.ROOT_OVERLAY]
    }

    listen(): State<any>[] {
        return [this.overlayCtx.overlayOpenState, this.overlayCtx.overlayHTMLState]
    }

    afterRender() {
        const overlay = document.getElementById(this.ids.OVERLAY)
        if (overlay) {
            overlay.onclick = (e) => {
                if(e.target === overlay){
                    this.overlayCtx.close()
                }else if(e.target['classList'] && e.target['classList'].contains('modal__header__close')){
                    this.overlayCtx.close()
                }
            }
            this.overlayCtx.overlayAfterRender()
        }
    }

    render(): string | string[] {
        return this.overlayCtx.overlayOpen ? `<div class='overlay' id="${this.ids.OVERLAY}">
        ${this.overlayCtx.overlayHTML}
        </div>` : ''
    }
}