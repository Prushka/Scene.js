/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State, {createState} from "../state/State";

export class Footer extends SceneComponent {

    open: State<boolean>

    afterConstructor() {
        this.open = createState(true)
    }

    listen(): State<any>[] {
        return [this.context.ctx.currentFrameState]
    }

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
        const createButtonDiv = (title, iconClasses) => {
            return `<div title=${title} class="button button--purple pointer"><i class='${iconClasses}'></i></div>`
        }
        const currentFrame = this.context.ctx.currentFrame
        let elements = ""
        const buttons = [createButtonDiv('Collapse/Expand', 'bi bi-arrows-collapse')]
        if(this.open.get()){
            buttons.push(createButtonDiv('Export', 'bi bi-box-arrow-up-right'))
            if (this.context.ctx.totalFrames !== 0) {
                let frames = ""
                for (let f = 0; f < this.context.ctx.totalFrames; f++) {
                    frames += `<div id="${this.context.getId(f + 1, 'timeline', 'frame')}" class="timeline__frame ${currentFrame === f + 1 ? 'timeline__frame--selected' : 'timeline__frame--not-selected'} pointer">${f + 1}</div>`
                }
                elements = `<div class="timeline-container"><div class="timeline__frame-container">${frames}</div><div class="timeline"></div></div>`
                buttons.push(createButtonDiv('Play', 'bi bi-play-fill'))
            }
        }
        return `<div class='footer'>
                     <div class="footer__button-group">${buttons.join('')}</div>
                     ${elements}
                     </div>`
    }
}