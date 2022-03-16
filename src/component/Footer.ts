/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State, {createState, StateAction} from "../state/State";
import ClickEvent = JQuery.ClickEvent;
import {setClassList} from "../utils/Utils";

export class Footer extends SceneComponent {

    open: State<boolean>
    playing: State<boolean>

    afterConstructor() {
        this.open = createState(true)
        this.playing = createState(false)
    }

    listen(): State<any>[] {
        return []
    }

    actions(): StateAction<any>[] {
        return [[this.open, ((_, open) => {
            const toolbarElement = document.getElementById(this.ctx.getIdType("toolbar"))
            const bottom = open ? 0 : -(toolbarElement.getBoundingClientRect().height - 45)
            toolbarElement.style.bottom = `${bottom}px`
        })], [this.playing, ((_, playing) => {
            const icon = document.getElementById(this.ctx.getIdType("toolbar", "play", "icon"))
            if (playing) {
                setClassList(icon, "bi", "bi-pause-fill")
            } else {
                setClassList(icon, "bi", "bi-play-fill")
            }
        })],
        [this.ctx.ctx.currentFrameState, (_, currentFrame)=>{
            for (let f = 0; f < this.ctx.ctx.totalFrames; f++) {
                const fElement = document.getElementById(this.ctx.getId(f + 1, 'timeline', 'frame'))
                fElement.classList.remove("timeline__frame--selected")
                fElement.classList.add("timeline__frame--not-selected")
            }
            const frameElement = document.getElementById(this.ctx.getId(currentFrame, 'timeline', 'frame'))
            frameElement.classList.remove("timeline__frame--not-selected")
            frameElement.classList.add("timeline__frame--selected")
        }]]
    }

    subscribe() {
        return [this.getRootId("footer")]
    }

    afterRender() {
        this.open.set(this.ctx.config.defaultOpenToolbar)
        const hookButton = (action: (e: ClickEvent) => void, ...types: string[]) => {
            this.ctx.$("#" + this.ctx.getIdType(...types)).on("click", (e) => {
                action(e)
            })
        }
        this.ctx.$('.timeline__frame').on("click", (e) => {
            const [frame] = this.ctx.extractIdType(e.target.id)
            this.ctx.ctx.currentFrame = frame
        })
        hookButton(() => {
            this.open.set(!this.open.get())
        }, "toolbar", "collapse")
        hookButton(() => {
            this.ctx.viewComponent.resetViewport()
            this.ctx.snackbar = "Reset Viewport - Frames Based"
        }, "toolbar", "reset", "frames")

        hookButton(() => {
            this.ctx.viewComponent.resetViewport(this.ctx.ctx.currentFrame)
            this.ctx.snackbar = "Reset Current Viewport"
        }, "toolbar", "reset", "current")

        const nextFrame = () => {
            if (this.playing.get()) {
                const previousFrame = this.ctx.ctx.nextFrame()
                setTimeout(() => {
                    nextFrame()
                }, this.ctx.getFrameSeconds(previousFrame) * 1000)
            }
        }
        hookButton(() => {
            this.playing.set(!this.playing.get())
            if (this.playing.get()) {
                nextFrame()
            }
        }, "toolbar", "play")
        hookButton(() => {
            navigator.clipboard.writeText(JSON.stringify(this.ctx.props.get())).then(() => this.ctx.snackbar = "Copied to clipboard")
        }, "toolbar", "export")
    }

    render(): string | string[] {
        const createButtonDiv = (title, iconClasses, ...types: string[]) => {
            return `<div id="${this.ctx.getIdType(...types)}" title="${title}" class="button button--purple pointer"><i class='${iconClasses}' id="${this.ctx.getIdType(...types, 'icon')}"></i></div>`
        }
        const currentFrame = this.ctx.ctx.currentFrame
        let elements = ""
        const buttons = [createButtonDiv('Collapse/Expand', 'bi bi-arrows-collapse', "toolbar", "collapse")]

        buttons.push(createButtonDiv('Reset viewport (based on current frame)', 'bi bi-arrows-move', "toolbar", "reset", "current"))
        buttons.push(createButtonDiv("Reset viewport (based on all frames)", 'bi bi-bootstrap-reboot', "toolbar", "reset", "frames"))
        buttons.push(createButtonDiv('Export', 'bi bi-box-arrow-up-right', "toolbar", "export"))
        if (this.ctx.ctx.totalFrames > 1) {
            let frames = ""
            for (let f = 0; f < this.ctx.ctx.totalFrames; f++) {
                frames += `<div id="${this.ctx.getId(f + 1, 'timeline', 'frame')}" class="timeline__frame ${currentFrame === f + 1 ? 'timeline__frame--selected' : 'timeline__frame--not-selected'} pointer">${f + 1}</div>`
            }
            elements = `<div class="timeline-container"><div class="timeline__frame-container">${frames}</div><div class="timeline"></div></div>`
            buttons.push(createButtonDiv('Play', this.playing.get() ? 'bi bi-pause-fill' : 'bi bi-play-fill', "toolbar", "play"))
        }
        return `
                     <div id="${this.ctx.getIdType("toolbar")}" class="toolbar">${buttons.join('')}</div>
                     ${elements}
                     `
    }
}