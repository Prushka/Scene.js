/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State, {createState, StateAction} from "../state/State";
import ClickEvent = JQuery.ClickEvent;
import {setClassList} from "../utils/Utils";


export class ProgressBarTupleElements {
    private readonly progressFinished: HTMLElement
    private readonly progressUnfinished: HTMLElement

    public constructor(progressFinished: HTMLElement, progressUnfinished: HTMLElement) {
        this.progressFinished = progressFinished
        this.progressUnfinished = progressUnfinished
    }

    private static setStyles(element: HTMLElement, width: string, transitionDuration: string, transitionFunction?: string) {
        element.style.width = width
        element.style.transitionDuration = transitionDuration
        if (transitionFunction) {
            element.style.transitionTimingFunction = transitionFunction
        }
    }

    public reset() {
        ProgressBarTupleElements.setStyles(this.progressFinished, '0%', '0s')
        ProgressBarTupleElements.setStyles(this.progressUnfinished, '100%', '0s')
    }

    public setTransition(duration, transitionFunction, finished: boolean) {
        ProgressBarTupleElements.setStyles(this.progressFinished, finished ? "100%" : "0%", duration, transitionFunction)
        ProgressBarTupleElements.setStyles(this.progressUnfinished, finished ? "0%" : "100%", duration, transitionFunction)
    }
}

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

    private getProgressBars(frame) {
        const progressFinished = document.getElementById(this.ctx.getId(frame, 'frame', 'progress', 'finished'))
        const progressUnfinished = document.getElementById(this.ctx.getId(frame, 'frame', 'progress', 'unfinished'))
        if (progressUnfinished && progressFinished) {
            return new ProgressBarTupleElements(progressFinished, progressUnfinished)
        }
        return null
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
            [this.ctx.timeCtx.currentFrameState, (oldFrame, newFrame) => {
                if (oldFrame == null) {
                    return
                }
                const frameSeconds = this.ctx.getFrameSeconds(oldFrame)
                if (this.getTimeCtx().ifJumpOneLiterally(oldFrame, newFrame)) {
                    setTimeout(()=>{
                        const frameElement = document.getElementById(this.ctx.getId(newFrame, 'timeline', 'frame'))
                        frameElement.classList.remove("timeline__frame--not-selected")
                        frameElement.classList.add("timeline__frame--selected")
                    }, frameSeconds*1000)
                    const progressBars = this.getProgressBars(oldFrame)
                    if (progressBars) {
                        progressBars.setTransition(frameSeconds + 's', this.ctx.config.transitionTimingFunction, true)
                    }
                } else {
                    for (let frame = 1; frame <= this.getTimeCtx().totalFrames; frame++) {
                        const fElement = document.getElementById(this.ctx.getId(frame, 'timeline', 'frame'))
                        fElement.classList.remove("timeline__frame--selected")
                        fElement.classList.add("timeline__frame--not-selected")
                        const progressBars = this.getProgressBars(frame)
                        if (progressBars) {
                            progressBars.reset()
                        }
                    }
                    const frameElement = document.getElementById(this.ctx.getId(newFrame, 'timeline', 'frame'))
                    frameElement.classList.remove("timeline__frame--not-selected")
                    frameElement.classList.add("timeline__frame--selected")
                }
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
            this.ctx.timeCtx.currentFrame = frame
        })
        hookButton(() => {
            this.open.set(!this.open.get())
        }, "toolbar", "collapse")
        hookButton(() => {
            this.ctx.viewComponent.resetViewport()
            this.snackbarCtx.snackbar = "Reset Viewport - Frames Based"
        }, "toolbar", "reset", "frames")

        hookButton(() => {
            this.ctx.viewComponent.resetViewport(this.ctx.timeCtx.currentFrame)
            this.snackbarCtx.snackbar = "Reset Current Viewport"
        }, "toolbar", "reset", "current")

        const nextFrame = () => {
            if (this.playing.get()) {
                const previousFrame = this.ctx.timeCtx.nextFrame()
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
            navigator.clipboard.writeText(JSON.stringify(this.ctx.config, null, 2)).then(() => this.snackbarCtx.snackbar = "Copied to clipboard")
        }, "toolbar", "export")
    }

    render(): string | string[] {
        const footerContainer = document.createElement('div')
        const toolbarContainer = document.createElement('div')
        toolbarContainer.id = this.ctx.getIdType("toolbar")
        toolbarContainer.classList.add('toolbar')
        const addButtonToToolbar = (title, iconClasses, ...types: string[]) => {
            const toolbarButton = document.createElement('div')
            toolbarButton.id = this.ctx.getIdType(...types)
            toolbarButton.title = title
            toolbarButton.classList.add('button', 'button--purple', 'pointer')
            const icon = document.createElement('i')
            icon.classList.add(...iconClasses.split(' '))
            icon.id = this.ctx.getIdType(...types, 'icon')
            toolbarButton.append(icon)
            toolbarContainer.append(toolbarButton)
        }
        const currentFrame = this.ctx.timeCtx.currentFrame
        let elements = ""
        addButtonToToolbar('Collapse/Expand', 'bi bi-arrows-collapse', "toolbar", "collapse")
        addButtonToToolbar('Reset viewport (based on current frame)', 'bi bi-arrows-move', "toolbar", "reset", "current")
        addButtonToToolbar("Reset viewport (based on all frames)", 'bi bi-bootstrap-reboot', "toolbar", "reset", "frames")
        addButtonToToolbar('Export', 'bi bi-box-arrow-up-right', "toolbar", "export")

        footerContainer.append(toolbarContainer)
        if (!this.ctx.timeCtx.isStatic) {
            // create a timeline since it's not static
            let frames = ""

            const timelineContainer = document.createElement('div')
            timelineContainer.classList.add('timeline-container')
            for (let f = 0; f < this.getTimeCtx().totalFrames; f++) {
                const frame = f + 1
                const frameContainer = document.createElement('div')
                frameContainer.classList.add('timeline__frame-container')
                if (frame != this.getTimeCtx().totalFrames) {
                    frameContainer.style.flexGrow = String(Math.floor(this.ctx.getFrameSeconds(frame) * 10))
                }
                // The styling (e.g., color etc.,) of a standard html <progress> tag cannot be standardized,
                // that's why a custom div was used
                const progress = document.createElement('div')
                progress.classList.add('progress-container')
                const progressFinished = document.createElement('div')
                const progressUnfinished = document.createElement('div')
                progressFinished.classList.add('progress', 'progress-finished')
                progressUnfinished.classList.add('progress', 'progress-not')
                progressFinished.setAttribute('max', '100')
                progressFinished.id = this.ctx.getId(frame, 'frame', 'progress', 'finished')
                progressUnfinished.id = this.ctx.getId(frame, 'frame', 'progress', 'unfinished')
                progress.append(progressFinished, progressUnfinished)
                frameContainer.append(progress)
                const frameButton = document.createElement('div')
                frameButton.id = this.ctx.getId(frame, 'timeline', 'frame')
                frameButton.classList.add(`timeline__frame`, currentFrame === frame ? 'timeline__frame--selected' : 'timeline__frame--not-selected', `pointer`)
                frameButton.innerText = String(frame)
                frameContainer.append(frameButton)
                timelineContainer.append(frameContainer)
            }
            addButtonToToolbar('Play', this.playing.get() ? 'bi bi-pause-fill' : 'bi bi-play-fill', "toolbar", "play")
            footerContainer.append(timelineContainer)
        }
        return footerContainer.outerHTML
    }
}