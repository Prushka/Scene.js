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
            const toolbarElement = document.getElementById(this.context.getIdType("toolbar"))
            const bottom = open ? 0 : -(toolbarElement.getBoundingClientRect().height - 45)
            toolbarElement.style.bottom = `${bottom}px`
        })], [this.playing, ((_, playing) => {
            const icon = document.getElementById(this.context.getIdType("toolbar", "play", "icon"))
            if (playing) {
                setClassList(icon, "bi", "bi-pause-fill")
            } else {
                setClassList(icon, "bi", "bi-play-fill")
            }
        })],
        [this.context.ctx.currentFrameState, (_, currentFrame)=>{
            for (let f = 0; f < this.context.ctx.totalFrames; f++) {
                const fElement = document.getElementById(this.context.getId(f + 1, 'timeline', 'frame'))
                fElement.classList.remove("timeline__frame--selected")
                fElement.classList.add("timeline__frame--not-selected")
            }
            const frameElement = document.getElementById(this.context.getId(currentFrame, 'timeline', 'frame'))
            frameElement.classList.remove("timeline__frame--not-selected")
            frameElement.classList.add("timeline__frame--selected")
            console.log(frameElement.id)

        }]]
    }

    subscribe() {
        return [".footer-container"]
    }

    afterRender() {
        this.open.set(this.context.config.defaultOpenToolbar)
        const hookButton = (action: (e: ClickEvent) => void, ...types: string[]) => {
            $("#" + this.context.getIdType(...types)).on("click", (e) => {
                action(e)
            })
        }
        $('.timeline__frame').on("click", (e) => {
            const [frame] = this.context.extractIdType(e.target.id)
            this.context.ctx.currentFrame = frame
        })
        hookButton(() => {
            this.open.set(!this.open.get())
        }, "toolbar", "collapse")
        hookButton(() => {
            this.context.viewComponent.resetViewport()
            this.context.snackbar = "Reset Viewport - Frames Based"
        }, "toolbar", "reset", "frames")

        hookButton(() => {
            this.context.viewComponent.resetViewport(this.context.ctx.currentFrame)
            this.context.snackbar = "Reset Current Viewport"
        }, "toolbar", "reset", "current")

        const nextFrame = () => {
            if (this.playing.get()) {
                const previousFrame = this.context.ctx.nextFrame()
                setTimeout(() => {
                    nextFrame()
                }, this.context.getFrameSeconds(previousFrame) * 1000)
            }
        }
        hookButton(() => {
            this.playing.set(!this.playing.get())
            if (this.playing.get()) {
                nextFrame()
            }
        }, "toolbar", "play")
        hookButton(() => {
            navigator.clipboard.writeText(JSON.stringify(this.context.props.get())).then(() => this.context.snackbar = "Copied to clipboard")
        }, "toolbar", "export")
    }

    render(): string | string[] {
        const createButtonDiv = (title, iconClasses, ...types: string[]) => {
            return `<div id="${this.context.getIdType(...types)}" title="${title}" class="button button--purple pointer"><i class='${iconClasses}' id="${this.context.getIdType(...types, 'icon')}"></i></div>`
        }
        const currentFrame = this.context.ctx.currentFrame
        let elements = ""
        const buttons = [createButtonDiv('Collapse/Expand', 'bi bi-arrows-collapse', "toolbar", "collapse")]

        buttons.push(createButtonDiv('Reset viewport (based on current frame)', 'bi bi-arrows-move', "toolbar", "reset", "current"))
        buttons.push(createButtonDiv("Reset viewport (based on all frames)", 'bi bi-bootstrap-reboot', "toolbar", "reset", "frames"))
        buttons.push(createButtonDiv('Export', 'bi bi-box-arrow-up-right', "toolbar", "export"))
        if (this.context.ctx.totalFrames !== 0) {
            let frames = ""
            for (let f = 0; f < this.context.ctx.totalFrames; f++) {
                frames += `<div id="${this.context.getId(f + 1, 'timeline', 'frame')}" class="timeline__frame ${currentFrame === f + 1 ? 'timeline__frame--selected' : 'timeline__frame--not-selected'} pointer">${f + 1}</div>`
            }
            elements = `<div class="timeline-container"><div class="timeline__frame-container">${frames}</div><div class="timeline"></div></div>`
            buttons.push(createButtonDiv('Play', this.playing.get() ? 'bi bi-pause-fill' : 'bi bi-play-fill', "toolbar", "play"))
        }
        return `
                     <div id="${this.context.getIdType("toolbar")}" class="toolbar">${buttons.join('')}</div>
                     ${elements}
                     `
    }
}