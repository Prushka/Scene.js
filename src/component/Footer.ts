/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State, {createState, StateAction} from "../state/State";
import ClickEvent = JQuery.ClickEvent;

export class Footer extends SceneComponent {

    open: State<boolean>

    afterConstructor() {
        this.open = createState(true)
    }

    listen(): State<any>[] {
        return [this.context.ctx.currentFrameState]
    }

    actions(): StateAction<any>[] {
        return [[this.open, ((_, open) => {
            const toolbarElement = document.getElementById(this.context.getIdType("toolbar"))
            let bottom
            if (open) {
                bottom = 0
            } else {
                bottom = -(toolbarElement.getBoundingClientRect().height - 45)
            }
            toolbarElement.style.bottom = `${bottom}px`
        })]]
    }

    subscribe() {
        return [".footer-container"]
    }

    afterRender() {
        const hookButton = (action: (e: ClickEvent) => void, ...types: string[]) => {
            $("#" + this.context.getIdType(...types)).on("click", (e) => {
                action(e)
            })
        }
        $('.timeline__frame').on("click", (e) => {
            const [frame] = this.context.extractIdType(e.target.id)
            this.context.ctx.currentFrame = frame
        })
        hookButton((e) => {
            this.open.set(!this.open.get())
        }, "toolbar", "collapse")
        hookButton((e) => {
            this.hookedComponents.view.resetViewport()
        }, "toolbar", "reset")
    }

    render(): string | string[] {
        const createButtonDiv = (title, iconClasses, ...types: string[]) => {
            return `<div id="${this.context.getIdType(...types)}" title=${title} class="button button--purple pointer"><i class='${iconClasses}'></i></div>`
        }
        const currentFrame = this.context.ctx.currentFrame
        let elements = ""
        const buttons = [createButtonDiv('Collapse/Expand', 'bi bi-arrows-collapse', "toolbar", "collapse")]
        if (this.open.get()) {
            buttons.push(createButtonDiv('Reset-Viewport', 'bi bi-bootstrap-reboot', "toolbar", "reset"))
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
                     <div id="${this.context.getIdType("toolbar")}" class="footer__toolbar">${buttons.join('')}</div>
                     ${elements}
                     </div>`
    }
}