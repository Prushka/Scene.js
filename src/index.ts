/*
 * Copyright 2022 Dan Lyu.
 */

import {
    AnimationConfig, DefaultAnimationConfig, DefaultLine, DefaultPropConfig,
    FrameAnimationConfig, ImageConfig,
    PropConfig,
    PropType, PropTypeIcon,
    PropTypeIcons
} from "./props/Props";
import State, {createState} from "./state/State";
import {
    convertTypeToReadable,
    createSpan,
    createSVGIcon,
    generateDarkColor, generateLightColor, getPathGroupByHTML, getRandomFromList, randBoolean,
    randInclusive
} from "./utils/Utils";
import {PropDialog} from "./component/PropDialog";
import {Footer} from "./component/Footer";
import {ViewSVG} from "./component/ViewSVG";
import {Config, DefaultConfig} from "./config/Config";
import {Snackbar} from "./component/Snackbar";
import {CustomComponent} from "./component/Component";
import {Overlay} from "./component/Overlay";
import FrameContext, {useFrames} from "./context/FrameContext";
import ViewPortContext from "./context/ViewPortContext";
import {useSnackbar} from "./context/SnackbarContext";
import {useOverlay} from "./context/OverlayContext";
import {ViewCanvas} from "./component/ViewCanvas";
import View from "./component/View";
import {useId} from "./context/IdContext";
import {PropList} from "./component/PropList";
import {ThemeConstants, useTheme} from "./context/ThemeContext";

export class Context {
    protected propIds: number = 0
    private _selected: State<PropConfig> = createState()
    public propsState: State<PropConfig[]> = createState([])
    public viewportsState: State<ViewPortContext[]> = createState([])
    public readonly config: Config
    public readonly propTypeIconPool: { [key in PropType]: PropTypeIcon }
    public readonly rootContainerId: string
    public readonly rootContainerIdSymbol: string

    public readonly frameContext = useFrames()
    public readonly snackbarCtx = useSnackbar()
    public readonly overlayCtx = useOverlay()
    public readonly themeCtx
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
        this.propTypeIconPool = {...PropTypeIcons, ...config.propTypes}

        this.themeCtx = useTheme(this, {...ThemeConstants, ...this.config.customThemes}, this.config.defaultTheme)

        this.config.props.forEach(propConfig => {
            this.addProp(propConfig)
        })
    }

    private addProp(...propConfigs: PropConfig[]): Context {
        const _props = [...this.propsState.get()]
        propConfigs.forEach(propConfig => {
            propConfig = {...DefaultPropConfig, ...propConfig}
            propConfig.color = propConfig.color ?? this.themeCtx.currentTheme.isLight ? generateDarkColor() : generateLightColor()
            propConfig.id = propConfig.id ?? this.propIds
            propConfig.name = propConfig.name ?? `${convertTypeToReadable(propConfig.type)} ${propConfig.id}`
            if (propConfig.frameAnimationConfig) {
                propConfig.frameAnimationConfig
                for (let key in propConfig.frameAnimationConfig) {
                    const a = {...DefaultAnimationConfig, ...propConfig.frameAnimationConfig[key]}
                    a.transitionTimingFunction = a.transitionTimingFunction || this.config.transitionTimingFunction
                    propConfig.frameAnimationConfig[key] = a
                }
            }
            this.propIds += 1
            _props.push(propConfig)
        })
        this.propsState.set(_props)
        return this
    }

    public get selected() {
        return this._selected.get()
    }

    public set selected(selected: PropConfig) {
        this._selected.set(selected)
    }

    public get selectedState() {
        return this._selected
    }

    public propSelected(prop: PropConfig | number): boolean {
        const selectedProp: PropConfig = this.selected
        const propId: number = typeof prop === 'number' ? prop : prop.id
        return selectedProp && selectedProp.id === propId;
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

    public isPropEnabled(prop: PropConfig): boolean {
        return this.getPropPositionByCurrentFrame(prop).enabled
    }

    public getPropById(id: number): PropConfig | null {
        for (const prop of this.propsState.get()) {
            if (prop.id === id) {
                return prop
            }
        }
        return null
    }

    public getPropsByName(name: string) {
        const props = []
        for (const prop of this.propsState.get()) {
            if (prop.name.toLowerCase() === name.toLowerCase()) {
                props.push(prop)
            }
        }
        return props
    }

    public getFrameSeconds(frame: number): number {
        return frame in this.config.frameSpeed ? this.config.frameSpeed[frame] : this.config.defaultFrameSpeed
    }

    public getPropPositionByCurrentFrame(prop: PropConfig): AnimationConfig | null {
        return this.getPropPositionByFrame(prop, this.frameContext.currentFrame, false)
    }

    public getPropPositionByFrame(prop: PropConfig, frame: number, lookForward: boolean): AnimationConfig | null {
        const _get = (_lookForward: boolean) => {
            let position: AnimationConfig
            const frameConfig = prop.frameAnimationConfig
            if (frameConfig) {
                if (frameConfig[frame]) {
                    position = frameConfig[frame]
                } else {
                    let closest = -1
                    for (let key in frameConfig) {
                        const _key = Number(key)
                        if (_lookForward) {
                            if (_key > frame && (closest === -1 || Math.abs(_key - frame) < closest)) {
                                closest = _key
                            }
                        } else {
                            if (_key < frame && (closest === -1 || Math.abs(_key - frame) < closest)) {
                                closest = _key
                            }
                        }
                    }
                    position = frameConfig[closest]
                }
            }
            return position
        }
        const position = _get(lookForward) ?? _get(!lookForward)
        if (position) {
            return {...position}
        }
        return null
    }

    public toggleSelected(prop: PropConfig | number) {
        let _prop: PropConfig
        if (typeof prop == "number") {
            _prop = this.getPropById(prop)
        } else {
            _prop = prop
        }
        if (_prop === this.selected) {
            this.selected = null
        } else {
            this.selected = _prop
        }
    }

    public findMaxFrames(): number {
        let max = 0
        this.propsState.get().forEach(prop => {
            const frameConfig: FrameAnimationConfig = prop.frameAnimationConfig
            const _max: number = Number(Object.keys(frameConfig).reduce((a, b) => frameConfig[a] > frameConfig[b] ? a : b))
            if (_max > max) {
                max = _max
            }
        })
        return max
    }

    public getViewportGetter(): () => ViewPortContext {
        return () => {
            return this.viewportsState.get()[0]
        }
    }

    public getTimeContextGetter(): () => FrameContext {
        return () => {
            return this.frameContext
        }
    }

    private beforeDisplay() {
        this.frameContext.totalFrames = this.findMaxFrames()
        const viewports = []
        for (let i = 0; i <= this.frameContext.totalFrames; i++) {
            // populate one more frame since 0's used for static/animation
            const viewport = new ViewPortContext(this)
            viewports.push(viewport)
        }
        this.viewportsState.set(viewports)
        this.propsState.set(this.propsState.get().sort((a, b) => {
            if (a.orderIndex < b.orderIndex) {
                return -1
            }
            if (a.orderIndex > b.orderIndex) {
                return 1
            }
            return 0
        }));
    }

    public getPropSpanText(prop: PropConfig, color ?: string) {
        return createSpan(prop.name, color ? color : prop.color)
    }

    public getPropSVG(prop: PropConfig, color ?: string, scale ?: number) {
        scale = scale ? scale : 1.4
        const propIcon = this.getPathGroup(prop, color)
        const svg = createSVGIcon(scale)
        svg.append(propIcon)
        return svg
    }

    public getPathGroup(prop: PropConfig, color ?: string) {
        return getPathGroupByHTML(this.propTypeIconPool[prop.type][prop.style][this.isPropEnabled(prop) ? 'enabledPaths' : 'disabledPaths'], prop, color)
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
        return $(`${this.rootContainerIdSymbol} ${selector}`)
    }

    public display() {
        this.beforeDisplay()
        $(() => {
            $(`${this.rootContainerIdSymbol}`).addClass("root-container")
                .html(`<div id="${this.ids.ROOT_SNACKBAR}" class='snackbar-container'></div>
                                     <div id="${this.ids.ROOT_PROP_LIST}" class='prop__list-container'></div>
                                    <div id="${this.ids.ROOT_PROP_DIALOG}" class='prop__property-container'></div>
                                    <div id="${this.ids.ROOT_VIEW}" class='view-container'></div>
                                    <div id="${this.ids.ROOT_FOOTER}" class="footer-container"></div>
                                    <div id="${this.ids.ROOT_OVERLAY}" class="overlay-container"></div>`)
            const v = this.config.renderMethod === 'canvas' ? ViewCanvas : ViewSVG
            const [view] = this.register(v, PropDialog, Footer, Snackbar, Overlay)
            if (this.config.displayPropList) {
                this.register(PropList)
            }
            this.viewComponent = view as View
        })
    }
}

export function demo(rootRootId) {
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
                    1: {}
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
        console.log(Object.keys(PropTypeIcons[type]))
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

    const rootContainer = document.getElementById(rootRootId)
    let ids = 0
    const display = (content, config: Config, width?, height?) => {
        const rootRoot = document.createElement('div')
        rootRoot.id = `root-${ids}`
        const root = document.createElement('div')
        root.id = `scene-${ids}`
        ids += 1
        const contentEl = document.createElement('p')
        contentEl.innerText = content
        rootRoot.append(contentEl, root)
        rootContainer.append(rootRoot)
        if (width) {
            root.style.width = width
            root.style.height = height
        }

        const ctx: Context = new Context(root.id, {
            ...sharedConfig,
            ...config
        })
        ctx.display()
    }
    let frames = 5
    display(
        `A completely random scene to demonstrate basic functionalities\nshows all interface elements (and sets them to open)`,
        {
            frameSpeed: getRandomFrameSpeed(frames),
            props: [...getRandoms(11, frames)]
        }, '100vw', '600px')

    display('A random scene\nwith mobile style, hides all interface elements and another light theme', {
        frameSpeed: getRandomFrameSpeed(frames),
        defaultTheme: "light-custom",
        defaultOpenToolbar: false,
        defaultOpenPropList: false,
        props: [...getRandoms(8, frames)]
    }, '400px', '800px')
    frames = 4
    display('A random scene\nwith no toolbar or prop list, shows all debug details in prop dialog and 1 storyboard', {
        frameSpeed: getRandomFrameSpeed(frames),
        displayToolbar: false,
        displayPropList: false,
        dialogShowAllProperties: true,
        props: [...getRandoms(8, frames),
            getStoryBoard(sImage1)]
    }, '90vw', '800px')

    frames = 7
    display(`A random scene\n with walls, slower default frame speed, a dark theme and a director's viewfinder`, {
        frameSpeed: getRandomFrameSpeed(frames),
        defaultOpenPropList: false,
        defaultTheme: 'dark',
        frameSelectionSpeed: 5,
        lines: [
            [{x: 300, y: -2}, {x: 300, y: 100}, {color: 'var(--scene-base-inv-s2)', width: 3}],
            [{x: 300, y: 98}, {x: 600, y: 98}, {color: 'var(--scene-base-inv-s2)', width: 3}],
            [{x: 0, y: 0}, {x: 300, y: 0}, {color: 'var(--scene-base-inv-s2)', width: 3}]],
        props: [...getRandoms(8, frames), getStoryBoard(sImage2)]
    }, '90vw', '800px')

    frames = 1
    randomNamePosition = true
    randomNameScale = true
    display('A random static scene\n with larger zoom factors, always show all dialog tabs, another dark theme,\nrandom name position (top/bottom/right/center), random name scale and random name offsets', {
        frameSpeed: getRandomFrameSpeed(frames),
        zoomFactor: 1.2,
        defaultTheme: 'dark-classic',
        alwaysShowAllDialogTabs: true,
        props: [...getRandoms(16, frames)]
    }, '90vw', '800px')


}

