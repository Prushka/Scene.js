/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State from "../state/State";

export class Footer extends SceneComponent {
    listen(): State<any>[] {
        return [this.context.ctx.currentFrameState]
    }

    // prop is not a property, it's the prop used in a scene

    subscribe() {
        return [".footer-container"]
    }

    afterRender() {
        $('.timeline__frame').on("click", (e) => {
            const [frame] = this.context.extractIdType(e.target.id)
            this.context.ctx.currentFrame = frame
        })
    }

    render(): string | string[] {
        const currentFrame = this.context.ctx.currentFrame
        let elements = ""
        const buttons = [`<div class="button button--purple pointer"><span>Export</span></div>`]
        if (this.context.ctx.totalFrames !== 0) {
            let frames = ""
            for (let f = 0; f < this.context.ctx.totalFrames; f++) {
                frames += `<div id="${this.context.getId(f + 1, 'timeline', 'frame')}" class="timeline__frame ${currentFrame === f + 1 ? 'timeline__frame--selected' : 'timeline__frame--not-selected'} pointer">${f + 1}</div>`
            }
            elements = `<div class="timeline-container"><div class="timeline__frame-container">${frames}</div><div class="timeline"></div></div>`
            buttons.push(`<div class="button button--purple pointer"><span>Play</span></div>`)
        }
        return `<div class='footer'>
                     <div class="footer__button-group">${buttons.join('')}</div>
                     ${elements}
                     </div>`
    }
}