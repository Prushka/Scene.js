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
        if (transitionDuration == '0s') {
            element.classList.add('no-transition')
        } else {
            element.classList.remove('no-transition')
        }
        if (transitionFunction) {
            element.style.transitionTimingFunction = transitionFunction
        }
    }

    public full() {
        ProgressBarTupleElements.setStyles(this.progressFinished, '100%', '0s')
        ProgressBarTupleElements.setStyles(this.progressUnfinished, '0%', '0s')
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
    timeouts = []

    afterConstructor() {
        this.open = createState(true)
        this.playing = createState(false)
    }

    listen(): State<any>[] {
        return []
    }

    private getProgressBars(frame) {
        const progressFinished = document.getElementById(this.idCtx.FRAME_PROGRESS_FINISHED(frame))
        const progressUnfinished = document.getElementById(this.idCtx.FRAME_PROGRESS_UNFINISHED(frame))
        if (progressUnfinished && progressFinished) {
            return new ProgressBarTupleElements(progressFinished, progressUnfinished)
        }
        return null
    }

    actions(): StateAction<any>[] {
        const setFrameButton = (frame: number, selected: boolean) => {
            const frameElement = document.getElementById(this.idCtx.TIMELINE_FRAME(frame))
            frameElement.classList.remove(!selected ? "timeline__frame--selected" : "timeline__frame--not-selected")
            frameElement.classList.add(selected ? "timeline__frame--selected" : "timeline__frame--not-selected")
        }
        return [[this.open, ((_, open) => {
            const toolbarElement = document.getElementById(this.ids.TOOLBAR)
            const bottom = open ? 0 : -(toolbarElement.getBoundingClientRect().height - 45)
            toolbarElement.style.bottom = `${bottom}px`
        })], [this.playing, ((_, playing) => {
            const icon = document.getElementById(this.ids.TOOLBAR_PLAY_ICON)
            if (playing) {
                setClassList(icon, "bi", "bi-pause-fill")
            } else {
                setClassList(icon, "bi", "bi-play-fill")
            }
        })],
            [this.ctx.timeCtx.currentFrameState, (oldFrame, newFrame, previousFrame) => {
                console.log(`Frame: ${previousFrame} | ${oldFrame} -> ${newFrame}`)
                if (oldFrame == null) {
                    return
                }
                const frameSeconds = this.ctx.getFrameSeconds(oldFrame)
                if (this.getTimeCtx().ifJumpOneLiterally(oldFrame, newFrame)) {
                    // normal flow, (start -> end, one frame jump) will trigger progress bar change and frame button timeout change
                    setFrameButton(oldFrame, true)
                    this.timeouts.push(setTimeout(() => {
                        setFrameButton(newFrame, true)
                    }, frameSeconds * 1000))
                    if(previousFrame==null || this.getTimeCtx().ifJumpOne(previousFrame, oldFrame)){
                        // force the previous progress bar to be full if the user jumps another frame ahead
                        const previousProgressBars = this.getProgressBars(oldFrame - 1)
                        if (previousProgressBars) {
                            previousProgressBars.full()
                        }
                    }
                    const progressBars = this.getProgressBars(oldFrame)
                    if (progressBars) {
                        progressBars.setTransition(frameSeconds + 's', this.ctx.config.transitionTimingFunction, true)
                    }
                } else {
                    // user skips frames, reset progress bar and frame button styles
                    this.timeouts.forEach(t => {
                        clearTimeout(t)
                    })
                    for (let frame = 1; frame <= this.getTimeCtx().totalFrames; frame++) {
                        setFrameButton(frame, false)
                        const progressBars = this.getProgressBars(frame)
                        if (progressBars) {
                            progressBars.reset()
                        }
                    }
                    setFrameButton(newFrame, true)
                }
            }]]
    }

    renderInIds() {
        return [this.ids.ROOT_FOOTER]
    }

    afterRender() {
        this.open.set(this.ctx.config.defaultOpenToolbar)
        const hookButton = (action: (e: ClickEvent) => void, ...types: string[]) => {
            this.ctx.$("#" + this.idCtx.getType(...types)).on("click", (e) => {
                action(e)
            })
        }
        this.ctx.$('.timeline__frame').on("click", (e) => {
            const [frame] = this.idCtx.extractIdType(e.target.id)
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

    render() {
        const footerContainer = document.createElement('div')
        const toolbarContainer = document.createElement('div')
        toolbarContainer.id = this.ids.TOOLBAR
        toolbarContainer.classList.add('toolbar')
        const addButtonToToolbar = (title, iconClasses, ...types: string[]) => {
            const toolbarButton = document.createElement('div')
            toolbarButton.id = this.idCtx.getType(...types)
            toolbarButton.title = title
            toolbarButton.classList.add('button', 'button--purple', 'pointer')
            const icon = document.createElement('i')
            icon.classList.add(...iconClasses.split(' '))
            icon.id = this.idCtx.getType(...types, 'icon')
            toolbarButton.append(icon)
            toolbarContainer.append(toolbarButton)
        }
        const currentFrame = this.ctx.timeCtx.currentFrame
        addButtonToToolbar('Collapse/Expand', 'bi bi-arrows-collapse', "toolbar", "collapse")
        addButtonToToolbar('Reset viewport (based on current frame)', 'bi bi-arrows-move', "toolbar", "reset", "current")
        addButtonToToolbar("Reset viewport (based on all frames)", 'bi bi-bootstrap-reboot', "toolbar", "reset", "frames")
        addButtonToToolbar('Export', 'bi bi-box-arrow-up-right', "toolbar", "export")

        footerContainer.append(toolbarContainer)
        if (!this.ctx.timeCtx.isStatic) {
            // create a timeline since it's not static
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
                progressFinished.id = this.idCtx.FRAME_PROGRESS_FINISHED(frame)
                progressUnfinished.id = this.idCtx.FRAME_PROGRESS_UNFINISHED(frame)
                progress.append(progressFinished, progressUnfinished)
                frameContainer.append(progress)
                const frameButton = document.createElement('div')
                frameButton.id = this.idCtx.TIMELINE_FRAME(frame)
                frameButton.classList.add(`timeline__frame`, currentFrame === frame ? 'timeline__frame--selected' : 'timeline__frame--not-selected', `pointer`)
                frameButton.innerText = String(frame)
                frameContainer.append(frameButton)
                timelineContainer.append(frameContainer)
            }
            addButtonToToolbar('Play', this.playing.get() ? 'bi bi-pause-fill' : 'bi bi-play-fill', "toolbar", "play")
            footerContainer.append(timelineContainer)
        }
        return footerContainer
    }
}