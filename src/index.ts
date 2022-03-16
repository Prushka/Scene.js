/*
 * Copyright 2022 Dan Lyu.
 */

import {
    AnimationConfig, DefaultLine,
    FrameAnimationConfig,
    HasId,
    PositionConfig,
    PropConfig,
    PropType, PropTypeIcon,
    PropTypeIcons
} from "./props/Props";
import State, {createState} from "./state/State";
import {
    convertTypeToReadable,
    createElement, createSpan,
    createSVGIcon,
    generateDarkColor,
    randInclusive
} from "./utils/Utils";
import {PropList} from "./component/PropList";
import {PropDialog} from "./component/PropDialog";
import {Footer} from "./component/Footer";
import {View} from "./component/View";
import {Config, DefaultConfig} from "./config/Config";
import {Snackbar} from "./component/Snackbar";
import {CustomComponent} from "./component/Component";
import {Overlay} from "./component/Overlay";
import TimeContext from "./context/TimeContext";
import ViewPort from "./context/Viewport";
import SnackbarContext from "./context/SnackbarContext";
import OverlayContext from "./context/OverlayContext";

export class Context {
    private static contextIds = 0
    private readonly contextId
    protected ids: number = 0
    timeCtx: TimeContext
    private _selected: State<PropConfig> = createState()
    propsState: State<PropConfig[]> = createState([])
    viewportsState: State<ViewPort[]> = createState([])
    public readonly config: Config
    public readonly propTypeIconPool: { [key in PropType]: PropTypeIcon }
    public readonly rootContainerId: string
    public readonly rootContainerIdSymbol: string
    public readonly snackbarCtx = new SnackbarContext()
    public readonly overlayCtx = new OverlayContext()

    public constructor(rootContainerId: string, config?: Config, context?: TimeContext) {
        this.rootContainerId = rootContainerId
        this.rootContainerIdSymbol = '#' + this.rootContainerId
        this.contextId = Context.contextIds
        Context.contextIds += 1
        this.timeCtx = context ? context : new TimeContext()
        this.config = config ? {...DefaultConfig, ...config} : {...DefaultConfig}
        this.config.lines.forEach((l) => {
            l[2] = {...DefaultLine, ...l[2]}
        })
        console.log(this.config)
        this.propTypeIconPool = {...PropTypeIcons, ...config.propTypes}
        this.config.props.forEach(propConfig => {
            this.addProp(propConfig)
        })
    }

    private addProp(...propConfigs: PropConfig[]): Context {
        const _props = [...this.propsState.get()]
        propConfigs.forEach(propConfig => {
            propConfig.color = propConfig.color || generateDarkColor()
            propConfig.style = propConfig.style || "default"
            propConfig.id = propConfig.id || this.ids
            propConfig.shouldDisplayName = propConfig.shouldDisplayName ?? true
            propConfig.name = propConfig.name || `${convertTypeToReadable(propConfig.type)} ${propConfig.id}`
            if (propConfig.frameAnimationConfig) {
                for (let key in propConfig.frameAnimationConfig) {
                    const a = propConfig.frameAnimationConfig[key]
                    a.scaleX = a.scaleX || 1
                    a.scaleY = a.scaleY || 1
                    a.hide = a.hide ?? false
                    a.enabled = a.enabled ?? true
                }
            }
            this.ids += 1
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

    public extractIdType(htmlID: string): [number, string[]] {
        const elementId = htmlID.match(/-\d+/)
        const contextId = htmlID.match(/\d+-/)
        if (!contextId) {
            return [-1, []]
        }
        let id = -1
        if (elementId) {
            id = parseInt(elementId[0].replace('-', ''))
        }
        const type: string = htmlID.replace(/-\d+/, '').replace(/\d+-/, '')
        return [id, type.split('-')]
    }

    public getIdType(...type: string[]) {
        return this.getId(null, ...type)
    }

    public getId(id: HasId | number | null, ...type: string[]) {
        type.sort((a, b) => a.localeCompare(b))
        const _id = id === null || undefined ? "" : (typeof id === 'number' ? "-" + id : (id.id === null || undefined) ? "" : "-" + id.id)
        return `${this.contextId}-${type.join('-')}${_id}`
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

    public getPropPosition(prop: PropConfig): AnimationConfig | null {
        let position: AnimationConfig = prop.frameAnimationConfig[this.timeCtx.currentFrame]
        position = {...position}
        return position
    }

    public getPropPositionByCurrentFrame(prop: PropConfig): AnimationConfig | null {
        return this.getPropPositionByFrame(prop, this.timeCtx.currentFrame, false)
    }

    public getPropPositionByFrame(prop: PropConfig, frame: number, lookForward: boolean): AnimationConfig | null {
        let position: AnimationConfig
        const frameConfig = prop.frameAnimationConfig
        if (frameConfig) {
            if (frameConfig[frame]) {
                position = frameConfig[frame]
            } else {
                let closest = -1
                for (let key in frameConfig) {
                    const _key = Number(key)
                    if (lookForward) {
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

    public get viewportOffset() {
        return this.viewportsState.get()[0].offset
    }

    public set viewportOffset(offset: PositionConfig) {
        const _viewports = [...this.viewportsState.get()]
        _viewports[0].offset = offset
        this.viewportsState.set(_viewports)
    }

    public get viewportScale() {
        return this.viewportsState.get()[0].scale
    }

    public set viewportScale(scale: number) {
        const _viewports = [...this.viewportsState.get()]
        _viewports[0].scale = scale
        this.viewportsState.set(_viewports)
    }

    public findMinMaxPosition(currentFrame?: number): [number, number, number, number] {
        let [minX, minY, maxX, maxY] = [null, null, null, null]
        const updateMinMax = (position) => {
            if (position.x > maxX || maxX == null) {
                maxX = position.x
            }
            if (position.y > maxY || maxY == null) {
                maxY = position.y
            }
            if (position.x < minX || minX == null) {
                minX = position.x
            }
            if (position.y < minY || minY == null) {
                minY = position.y
            }
        }
        this.propsState.get().forEach(prop => {
            if (currentFrame) {
                updateMinMax(this.getPropPositionByCurrentFrame(prop))
            } else {
                for (let key in prop.frameAnimationConfig) {
                    const position = prop.frameAnimationConfig[key]
                    if (position) {
                        updateMinMax(position)
                    }
                }
            }

        })
        return [minX, minY, maxX, maxY]
    }

    public calcViewBox([minX, minY, maxX, maxY]) {
        const svgE = $(`${this.rootContainerIdSymbol}`)
        const viewWidthRatio = (maxX - minX) / svgE.width()
        const viewHeightRatio = (maxY - minY) / svgE.height()
        let viewRatio = viewWidthRatio > viewHeightRatio ? viewWidthRatio : viewHeightRatio
        viewRatio += this.config.viewOffset
        const viewX = minX - (this.config.viewOffset / 2) * svgE.width()
        const viewY = minY - (this.config.viewOffset / 2) * svgE.height()
        return [viewRatio, viewX, viewY]
    }

    private beforeDisplay() {
        this.timeCtx.totalFrames = this.findMaxFrames()
        const viewports = []
        for (let i = 0; i <= this.timeCtx.totalFrames; i++) {
            // populate one more frame since 0's used for static/animation
            const viewport = new ViewPort()
            viewports.push(viewport)
        }
        this.viewportsState.set(viewports)
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
        return this.getPathGroupByHTML(this.propTypeIconPool[prop.type][prop.style][this.isPropEnabled(prop) ? 'enabledPaths' : 'disabledPaths'], prop, color)
    }

    public getPathGroupByHTML(pathsHTML: string, prop: PropConfig, color ?: string) {
        let pathId = 0
        const pathGroup = document.createElement("g")
        pathsHTML.match(/<path.*?\/>|<path.*?><\/path>/g).forEach(pathHTML => {
            const path = createElement(pathHTML)
            path.id = this.getId(prop, 'view', 'prop', 'icon', `[${pathId}]`)
            path.style.fill = color ? color : prop.color
            pathGroup.appendChild(path)
            pathId++
        })
        return pathGroup
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

    viewComponent: View

    public $(selector) {
        return $(`${this.rootContainerIdSymbol} ${selector}`)
    }

    public display() {
        this.beforeDisplay()
        $(() => {
            $(`${this.rootContainerIdSymbol}`).addClass("root-container")
                .html(`<div id="${this.getIdType('snackbar', 'root__container')}" class='snackbar-container'></div>
                                     <div id="${this.getIdType('prop__list', 'root__container')}" class='prop__list-container'></div>
                                    <div id="${this.getIdType('prop__property', 'root__container')}" class='prop__property-container'></div>
                                    <div id="${this.getIdType('view', 'root__container')}" class='view-container'></div>
                                    <div id="${this.getIdType('footer', 'root__container')}" class="footer-container"></div>
                                    <div id="${this.getIdType('overlay', 'root__container')}" class="overlay-container"></div>`)

            const [view] = this.register(View, PropList, PropDialog, Footer, Snackbar, Overlay)
            this.viewComponent = view as View
        })
    }
}

export function demo(rootId: string) {
    const getRandomPosition = () => {
        const scale = randInclusive(5, 30) / 10
        return {
            enabled: !!randInclusive(0, 1),
            x: Math.random() * 500,
            y: Math.random() * 500,
            degree: Math.random() * 360,
            scaleX: scale,
            scaleY: scale,
        }
    }
    const getDemoLight = () => {
        return {
            type: PropType.LIGHT,
            colorTemperature: 5000,
            lightType: "hard",
            frameAnimationConfig: {
                1: {
                    x: 0, y: 0, degree: 30, enabled: false
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

    const getDemoTable = () => {
        return {
            type: "MAP",
            brand: "Random",
            note: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            frameAnimationConfig: {
                1: getRandomPosition(),
                2: getRandomPosition(),
                3: getRandomPosition(),
                4: getRandomPosition(),
            },
            script: "Lorem ipsum dolor sit amet, consectetur adipiscing elit,\n123\n\na: c",
            images: [
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
            ],
            shouldDisplayName: false,
            steps: {
                11: {
                    title: "Here's step 1",
                    content: "Here's some content"
                },
                2: {
                    title: "Here's step 2",
                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris"
                },
                22: {
                    content: "aha"
                },
                21: {},
                1: {}
            }
        }
    }
    const ctx: Context = new Context(rootId, {
        frameSpeed: {
            1: 3,
            2: 2,
            4: 0.2
        },
        attachment: {
            "table 1": ["table 2"],
            "table 2": ["table 1", "table 2"],
        },
        propTypes: {
            "HOUSE": {
                default: {
                    enabledPaths: `<path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09zM4.157 8.5H7a.5.5 0 0 1 .478.647L6.11 13.59l5.732-6.09H9a.5.5 0 0 1-.478-.647L9.89 2.41 4.157 8.5z"/>`,
                    disabledPaths: `<path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>`
                }
            }
        },
        lines: [
            [{x: 40, y: 40}, {x: 80, y: 80}]
        ],
        props: [getDemoTable(), getDemoLight()]
    })
    // svg order is determined by declaration order
    ctx.display()
    console.log(ctx.propsState.get())
}

