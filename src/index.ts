/*
 * Copyright 2022 Dan Lyu.
 */

import {DefaultLine, ImageConfig, PropType, PropTypeIcons} from "./props/Props";
import State, {createState} from "./state/State";
import {getRandomFromList, randBoolean, randInclusive} from "./utils/Utils";
import {PropDialog} from "./component/PropDialog";
import {Footer} from "./component/Footer";
import {ViewSVG} from "./component/ViewSVG";
import {Config, DefaultConfig} from "./config/Config";
import {Snackbar} from "./component/Snackbar";
import {CustomComponent} from "./component/Component";
import {Overlay} from "./component/Overlay";
import PropContext from "./context/PropContext";
import ViewPortContext from "./context/ViewPortContext";
import {useSnackbar} from "./context/SnackbarContext";
import {useOverlay} from "./context/OverlayContext";
import {ViewCanvas} from "./component/ViewCanvas";
import View from "./component/View";
import {useId} from "./context/IdContext";
import {PropList} from "./component/PropList";
import {ThemeConstants, useTheme} from "./context/ThemeContext";

import './index.css'

export * from './utils/Utils'
export * from './props/Props'
export * from './context/SnackbarContext'

let globalSceneIds = 0

const globalScenes: { [key: number]: Scene } = {}

export class Scene {
    public viewportsState: State<ViewPortContext[]> = createState([])
    public readonly config: Config
    public readonly rootContainerId: string
    public readonly rootContainerIdSymbol: string

    public readonly snackbarCtx = useSnackbar()
    public readonly overlayCtx = useOverlay()
    public readonly themeCtx
    public readonly propCtx
    public readonly ids
    public readonly idContext

    public viewComponent: View

    public constructor(rootContainerId: string, config?: Config) {
        [this.ids, this.idContext] = useId()
        this.rootContainerId = rootContainerId
        this.rootContainerIdSymbol = '#' + this.rootContainerId
        this.config = config ? {...DefaultConfig, ...config} : {...DefaultConfig}
        this.config.lines.forEach((l) => {
            l[2] = {...DefaultLine, ...l[2]}
        })
        console.log(this.config)
        this.themeCtx = useTheme(this, {...ThemeConstants, ...this.config.customThemes}, this.config.defaultTheme)
        this.propCtx = new PropContext(this)
        this.propCtx.addPropType(config.propTypes)

        this.config.props.forEach(propConfig => {
            this.propCtx.addProp(propConfig)
        })
    }

    public getRootDocument() {
        return document.getElementById(this.rootContainerId)
    }

    public getRootWidth() {
        return this.getRootDocument().getBoundingClientRect().width
    }

    public getRootHeight() {
        return this.getRootDocument().getBoundingClientRect().height
    }

    public isRootMobile() {
        return this.getRootWidth() < 500
    }

    public getFrameSeconds(frame: number): number {
        return frame in this.config.frameSpeed ? this.config.frameSpeed[frame] : this.config.defaultFrameSpeed
    }

    public getViewportGetter(): () => ViewPortContext {
        return () => {
            return this.viewportsState.get()[0]
        }
    }

    private beforeDisplay() {
        this.propCtx.totalFrames = this.propCtx.findMaxFrames()
        const viewports = []
        for (let i = 0; i <= this.propCtx.totalFrames; i++) {
            // populate one more frame since 0's used for static/animation
            const viewport = new ViewPortContext(this)
            viewports.push(viewport)
        }
        this.viewportsState.set(viewports)
        this.propCtx.sortPropsByRenderOrder()
        this.propCtx.resetFilter()

        this.themeCtx.renderTheme()
    }

    private register(...c: Array<new(T) => CustomComponent>): CustomComponent[] {
        const components: CustomComponent[] = []
        c.forEach(cl => {
            const component = new cl(this)
            component.renderComponent()
            components.push(component)
        })
        return components
    }

    public $(selector) {
        return document.querySelector(`${this.rootContainerIdSymbol} ${selector}`)
    }

    public $$(selector) {
        return document.querySelectorAll(`${this.rootContainerIdSymbol} ${selector}`)
    }

    public idOn(id: string, event: string, f: (e: any) => void) {
        const el = document.getElementById(id)
        if (el) {
            el.addEventListener(event, f)
        }
    }

    public display() {
        console.log(`Going to render scene: ${this.rootContainerId}`)
        this.beforeDisplay()

        const render = () => {
            const container = document.getElementById(this.rootContainerId)
            container.classList.add('root-container')
            container.innerHTML = `<div id="${this.ids.ROOT_SNACKBAR}" class='snackbar-container'></div>
                                     <div id="${this.ids.ROOT_PROP_LIST}" class='prop__list-container'></div>
                                    <div id="${this.ids.ROOT_PROP_DIALOG}" class='prop__property-container'></div>
                                    <div id="${this.ids.ROOT_VIEW}" class='view-container'></div>
                                    <div id="${this.ids.ROOT_FOOTER}" class="footer-container"></div>
                                    <div id="${this.ids.ROOT_OVERLAY}" class="overlay-container"></div>`
            const v = this.config.renderMethod === 'canvas' ? ViewCanvas : ViewSVG
            const [view] = this.register(v, PropDialog, Footer, Snackbar, Overlay)
            if (this.config.displayPropList) {
                this.register(PropList)
            }
            this.viewComponent = view as View
        }
        render()
        document.addEventListener("DOMContentLoaded", (e) => {

        })
    }

}

export function demo(rootRootId): Scene {
    console.log(`Render scene in: ${rootRootId}`)
    const rootContainer = document.getElementById(rootRootId)

    let randomNamePosition: boolean = false
    let randomNameScale: boolean = false
    const sImages = [
        {
            title: "test",
            imageURL: "https://s2.loli.net/2022/02/10/grldkO4LeDjxmY8.png"
        },
        {
            imageURL: "https://s2.loli.net/2022/03/16/KZw7yAWXudMGL21.png"
        },
        {
            title: "A long picture",
            imageURL: "https://s2.loli.net/2022/03/16/tukpnVKZaUC7GIF.png"
        }
    ]

    const getSharedProp = () => {
        const s = {}
        if (randBoolean()) {
            s['note'] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }
        if (randBoolean()) {
            s['scripts'] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit,\n123\n\na: c"
        }
        if (randBoolean()) {
            s['images'] = sImages
        }
        if (randBoolean()) {
            s['steps'] =
                {
                    3: {
                        title: "Here's step 1",
                        content: "Here's some content"
                    },
                    2: {
                        title: "Here's step 2",
                        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris"
                    },
                    4: {
                        content: "aha"
                    },
                    5: {title: "A title"},
                    1: {},
                    6: {},
                    7: {}
                }
        }
        return s
    }
    const sharedConfig: Config = {
        defaultTheme: 'light',
        customThemes: {
            "light-custom": {
                icon: "bi bi-arrow-through-heart-fill",
                isLight: true,
                colors: {
                    "--scene-base": "#ffffff",
                    "--scene-base-s1": "#F5F5F5",
                    "--scene-base-inv": "#000000",
                    "--scene-base-inv-s1": "#1c1c1c",
                    "--scene-base-inv-s2": "#696969",
                    "--scene-dialog-header-button-not-selected-hover": "#355070",
                    "--scene-dialog-header-button-not-selected-text-hover": "#355070",
                    "--scene-snackbar": "#F765A3",
                    "--scene-timeline-button-selected": "#6d597a",
                    "--scene-timeline-button-selected-hover": "#6d597a",
                    "--scene-timeline-button-not-selected": "#F765A3",
                    "--scene-timeline-button-not-selected-hover": "#ea5490",
                    "--scene-timeline-button-text": "#ffffff",
                    "--scene-snackbar-text": "#ffffff",
                    "--scene-dialog-key": "#6d597a",
                    "--scene-dialog-value": "#A155B9",
                    "--scene-dialog-content": "#000000",
                    "--scene-button-text": "#ffffff",
                    "--scene-button-color": "#7ec4ef",
                    "--scene-button-hover": "#9cabde",
                    "--scene-trans-base": "rgba(255, 255, 255, 0.95)",
                },
            }
        },
        propTypes: {
            "HOUSE": {
                default: {
                    enabledPaths: `<path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09zM4.157 8.5H7a.5.5 0 0 1 .478.647L6.11 13.59l5.732-6.09H9a.5.5 0 0 1-.478-.647L9.89 2.41 4.157 8.5z"/>`,
                    disabledPaths: `<path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>`
                }
            }
        },
        renderMethod: 'svg',
    }

    const getDemoLight = () => {
        return {
            type: PropType.LIGHT,
            colorTemperature: 5000,
            lightType: "hard",
            frameAnimationConfig: {
                1: {
                    x: 140, y: 140, degree: 30, enabled: false
                },
                2: {
                    x: 100, y: 100, degree: 60
                },
                3: {
                    x: 190, y: 150, degree: 90
                },
            }
        }
    }

    const generateTable = (order, position) => {
        return {
            type: "TABLE",
            brand: "Random",
            style: "fillSquare",
            frameAnimationConfig: {
                1: position,
            },
            orderIndex: order,
            shouldDisplayName: true,
            nameScale: 0.8,
        }
    }

    const getRandomPosition = () => {
        const scale = randInclusive(8, 46) / 10
        return {
            enabled: randBoolean(),
            x: Math.random() * 750,
            y: Math.random() * 750,
            degree: Math.random() * 360,
            scaleX: scale,
            scaleY: scale,
        }
    }

    const sImage1 = {
        title: "something",
        imageURL: "https://s2.loli.net/2022/03/19/kfoHSKL792r4cvD.jpg",
        width: 400
    }
    const sImage2 = {
        title: "something",
        imageURL: "https://s2.loli.net/2022/03/19/iN9yLYWoE28z5MI.jpg",
        width: 300
    }

    const getStoryBoard = (image: ImageConfig) => {
        return {
            type: "STORYBOARD",
            script: "Some storyboard script",
            orderIndex: 20,
            namePosition: 'bottom',
            shouldDisplayName: false,
            frameAnimationConfig: {
                1: {
                    x: 100, y: 100, thumbnail: image,
                    degree: 0
                },
                2: {
                    x: 60, y: 60, thumbnail: image,
                    degree: 40
                }
            },
            images: sImages
        }
    }
    const allPropTypes = Object.values(PropType)
    let allIconPropTypes = [...allPropTypes]
    const allPositions = ['top', 'bottom', 'right', 'left']
    allIconPropTypes = allIconPropTypes.filter(i => {
        return i != PropType.STORYBOARD && i != PropType.SCRIPT
    })
    const getRandom = (frames) => {
        const type = getRandomFromList(allIconPropTypes)
        const s = {}
        for (let i = 0; i < frames; i++) {
            s[i + 1] = getRandomPosition()
        }
        return {
            ...getSharedProp(),
            nameScale: randomNameScale ? randInclusive(2, 20) / 10 : 1,
            type: type,
            brand: "Random",
            style: getRandomFromList(Object.keys(PropTypeIcons[type])),
            someValue: 5000,
            frameAnimationConfig: s,
            shouldDisplayName: !!randInclusive(0, 1),
            namePosition: randomNamePosition ? getRandomFromList(allPositions) : 'top',
        }
    }

    const getRandoms = (howMany, frames) => {
        const s = []
        for (let i = 0; i < howMany; i++) {
            s.push(getRandom(frames))
        }
        return s
    }

    const getRandomFrameSpeed = (frames) => {
        const s = {}
        for (let i = 0; i < frames; i++) {
            s[i + 1] = randInclusive(3, 30) / 10
        }
        return s
    }
    let ids = 0
    const display = (config) => {
        // const root = document.createElement('div')
        // root.id = `scene-${ids}`
        // ids += 1
        // rootContainer.append(root)

        return new Scene(rootRootId, {
            ...sharedConfig,
            ...config
        })
    }
    let frames = 6
    const s = display({
        frameSpeed: getRandomFrameSpeed(frames),
        defaultOpenPropList: true,
        frameSelectionSpeed: 5,
        lines: [
            [{x: 300, y: -2}, {x: 300, y: 100}, {color: 'var(--scene-base-inv-s2)', width: 3}],
            [{x: 300, y: 98}, {x: 600, y: 98}, {color: 'var(--scene-base-inv-s2)', width: 3}],
            [{x: 0, y: 0}, {x: 300, y: 0}, {color: 'var(--scene-base-inv-s2)', width: 3}]],
        props: [...getRandoms(25, frames), getStoryBoard(sImage2)]
    })
    console.log(s)
    return s
}

console.log('Scene.js loaded')