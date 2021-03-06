/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State, {createState, StateAction} from "../state/State";
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

    public isPlaying(){
        return this.playing && this.playing.get()
    }

    public play(v: boolean) {
        this.playing.set(v)
    }

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
        return [[this.themeCtx.currentState, null, () => {
            const theme = this.themeCtx.currentTheme
            const themeButton = document.getElementById(this.ids.TOOLBAR_THEME_BUTTON)
            const iconEl = themeButton.querySelector('i')
            const spanEl = themeButton.parentElement.querySelector('span')
            if (iconEl) {
                setClassList(iconEl, ...theme.icon.split(' '))
            }
            if (spanEl) {
                spanEl.innerText = `Theme (${this.themeCtx.themeToDisplay})`
            }
        }], [this.open, (_, open) => {
            const toolbarElement = document.getElementById(this.ids.TOOLBAR)
            // TODO: y does the bounding rect have a ~10px random offset?
            if (toolbarElement) {
                const bottom = open ? 0 : -(toolbarElement.getBoundingClientRect().height - 45)
                toolbarElement.style.bottom = `${bottom}px`
            }
        }], [this.playing, (_, playing) => {
            const playButton = document.getElementById(this.ids.TOOLBAR_PLAY_BUTTON)
            const iconEl = playButton.querySelector('i')
            const spanEl = playButton.parentElement.querySelector('span')
            if (playing) {
                setClassList(iconEl, "bi", "bi-pause-fill")
                spanEl.innerText = 'Pause'
            } else {
                setClassList(iconEl, "bi", "bi-play-fill")
                spanEl.innerText = 'Play'
            }
        }, () => {
            const nextFrame = () => {
                if (this.playing.get()) {
                    const previousFrame = this.scene.propCtx.nextFrame()
                    this.scene.registerTimeOut(() => {
                        nextFrame()
                    }, this.scene.getFrameSeconds(previousFrame) * 1000)
                }
            }
            nextFrame()
        }],
            [this.scene.propCtx.currentFrameState, (oldFrame, newFrame, previousFrame) => {
                console.log(`Frame: ${previousFrame} | ${oldFrame} -> ${newFrame}`)
                if (oldFrame == null) {
                    return
                }
                const frameSeconds = this.scene.getFrameSeconds(oldFrame)
                if (this.propCtx.ifJumpOneLiterally(oldFrame, newFrame)) {
                    // normal flow, (start -> end, one frame jump) will trigger progress bar change and frame button timeout change
                    setFrameButton(oldFrame, true)
                    this.timeouts.push(this.scene.registerTimeOut(() => {
                        setFrameButton(newFrame, true)
                    }, frameSeconds * 1000))
                    if (previousFrame == null || this.propCtx.ifJumpOne(previousFrame, oldFrame)) {
                        // force the previous progress bar to be full if the user jumps another frame ahead
                        const previousProgressBars = this.getProgressBars(oldFrame - 1)
                        if (previousProgressBars) {
                            previousProgressBars.full()
                        }
                    }
                    const progressBars = this.getProgressBars(oldFrame)
                    if (progressBars) {
                        progressBars.setTransition(frameSeconds + 's', this.scene.config.transitionTimingFunction, true)
                    }
                } else {
                    // user skips frames, reset progress bar and frame button styles
                    this.timeouts.forEach(t => {
                        clearTimeout(t)
                    })
                    for (let frame = 1; frame <= this.propCtx.totalFrames; frame++) {
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
        this.open.set(this.scene.config.defaultOpenToolbar)
        const hookButton = (action: (el: HTMLElement) => void, id: string) => {
            this.scene.idOn(id, "click", (e) => {
                action(document.getElementById(id))
            })
        }
        this.scene.$$('.timeline__frame').forEach(el => el.addEventListener("click", (e) => {
            const [frame] = this.idCtx.extractIdType((e.target as HTMLElement).id)
            this.scene.propCtx.currentFrame = frame
        }))
        hookButton(() => {
            this.open.set(!this.open.get())
        }, this.ids.TOOLBAR_COLLAPSE_BUTTON)
        hookButton(() => {
            this.scene.viewComponent.resetViewport()
            this.snackbarCtx.success("Reset Viewport - Frames Based")
        }, this.ids.TOOLBAR_RESET_FRAMES_BUTTON)

        hookButton(() => {
            this.scene.viewComponent.resetViewport(this.scene.propCtx.currentFrame)
            this.snackbarCtx.success("Reset Current Viewport")
        }, this.ids.TOOLBAR_RESET_CURRENT_BUTTON)


        hookButton(() => {
            this.playing.set(!this.playing.get())
        }, this.ids.TOOLBAR_PLAY_BUTTON)
        hookButton(() => {
            const data = !this.scene.config.exportPopulatedConfig ? JSON.stringify(this.scene.config, null, 2) : this.scene.originalConfig
            navigator.clipboard
                .writeText(data)
                .then(() => this.snackbarCtx.success("Copied to clipboard"))
        }, this.ids.TOOLBAR_EXPORT_BUTTON)

        hookButton(() => {
            this.themeCtx.next()
        }, this.ids.TOOLBAR_THEME_BUTTON)
        hookButton((e) => {
            // binding a fullscreenchange doesn't always work
            e.parentElement.querySelector('span').classList.remove('toolbar__tooltip--visible')
            if (document.fullscreenElement) {
                document.exitFullscreen().then()
            } else {
                const element = this.scene.getRootDocument();
                element.requestFullscreen().then()
            }
        }, this.ids.TOOLBAR_FULLSCREEN)
    }

    render() {
        const footerContainer = document.createElement('div')

        const toolbarContainer = document.createElement('div')
        toolbarContainer.id = this.ids.TOOLBAR
        toolbarContainer.classList.add('toolbar')
        const addButtonToToolbar = (title, iconClasses, id: string) => {
            const container = document.createElement('div')
            container.classList.add('tooltip', 'toolbar__button-container')

            const toolbarButton = document.createElement('div')
            toolbarButton.id = id
            // toolbarButton.title = title
            toolbarButton.classList.add('scene__button', 'toolbar__button', 'pointer')
            const icon = document.createElement('i')
            icon.classList.add(...iconClasses.split(' '))
            toolbarButton.append(icon)

            const tooltipText = document.createElement('span')
            tooltipText.innerText = title

            container.append(toolbarButton, tooltipText)
            toolbarContainer.append(container)
        }
        const currentFrame = this.scene.propCtx.currentFrame
        addButtonToToolbar('Collapse/Expand', 'bi bi-arrows-collapse', this.ids.TOOLBAR_COLLAPSE_BUTTON)
        addButtonToToolbar('Toggle fullscreen mode', 'bi bi-arrows-fullscreen', this.ids.TOOLBAR_FULLSCREEN)
        addButtonToToolbar('Reset viewport (based on current frame)', 'bi bi-arrows-move', this.ids.TOOLBAR_RESET_CURRENT_BUTTON)
        if (!this.propCtx.isStatic) {
            addButtonToToolbar("Reset viewport (based on all frames)", 'bi bi-bootstrap-reboot', this.ids.TOOLBAR_RESET_FRAMES_BUTTON)
        }
        addButtonToToolbar('Export', 'bi bi-box-arrow-up-right', this.ids.TOOLBAR_EXPORT_BUTTON)
        addButtonToToolbar(`Theme (${this.themeCtx.themeToDisplay})`, this.themeCtx.currentTheme.icon, this.ids.TOOLBAR_THEME_BUTTON)
        if (this.scene.config.displayToolbar) {
            footerContainer.append(toolbarContainer)
        }
        if (!this.scene.propCtx.isStatic) {
            // create a timeline since it's not static
            const timelineContainer = document.createElement('div')
            timelineContainer.classList.add('timeline-container')
            if (!this.scene.config.displayToolbar) {
                timelineContainer.classList.add('timeline-container-full-width')
            }
            for (let f = 0; f < this.propCtx.totalFrames; f++) {
                const frame = f + 1
                const frameContainer = document.createElement('div')
                frameContainer.classList.add('timeline__frame-container')
                if (frame != this.propCtx.totalFrames) {
                    frameContainer.style.flexGrow = String(Math.floor(this.scene.getFrameSeconds(frame) * 10))
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
            addButtonToToolbar('Play', this.playing.get() ? 'bi bi-pause-fill' : 'bi bi-play-fill', this.ids.TOOLBAR_PLAY_BUTTON)
            if (this.scene.config.displayTimeline) {
                footerContainer.append(timelineContainer)
            }
        }
        return footerContainer
    }
}