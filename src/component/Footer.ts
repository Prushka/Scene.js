/*
 * Copyright 2022 Dan Lyu.
 */

import {CustomComponent} from "./Component";
import State from "../state/State";
import {extractIdType} from "../utils/Utils";

export class Footer extends CustomComponent {

    // prop is not a property, it's the prop used in a scene
    private totalFrames: number;
    private currentFrame: State<number>;

    public constructor(totalFrames, currentFrame) {
        super()
        this.totalFrames = totalFrames
        this.currentFrame = currentFrame
        this.mount()
    }

    subscribe() {
        return [".footer-container"]
    }

    afterRender() {
        $('.timeline__frame').on("click", (e) => {
            const [frame] = extractIdType(e.target.id)
            this.currentFrame.set(frame)
        })
    }

    render(): string | string[] {
        const currentFrame = this.currentFrame.get()
        let elements = ""
        const buttons = [`<div class="button button--purple pointer"><span>Export</span></div>`]
        if (this.totalFrames !== 0) {
            let frames = ""
            for (let f = 0; f < this.totalFrames; f++) {
                frames += `<div id="timeline-frame-${f + 1}" class="timeline__frame ${currentFrame === f + 1 ? 'timeline__frame--selected' : 'timeline__frame--not-selected'} pointer">${f + 1}</div>`
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