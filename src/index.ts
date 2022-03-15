/*
 * Copyright 2022 Dan Lyu.
 */

import Position from "./props/Position";
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
    createElement,
    createSVGIcon,
    generateDarkColor,
    getLineGroup,
    randInclusive
} from "./utils/Utils";
import {PropList} from "./component/PropList";
import {PropDialog} from "./component/PropDialog";
import {Footer} from "./component/Footer";
import {View} from "./component/View";
import {Config, DefaultConfig} from "./config/Config";
import {Snackbar} from "./component/Snackbar";
import {CustomComponent} from "./component/Component";

export * as position from './props/Position'

export interface SceneContextConfig {
    totalFrames?: number
}

export class TimeContext {
    protected _config: SceneContextConfig
    private _currentFrame: State<number> = createState(1)

    public constructor(config?: SceneContextConfig) {
        config = config || {}
        config.totalFrames = config.totalFrames || 5
        this._config = config
    }

    public get isStatic() {
        return this._config.totalFrames == 0
    }

    public get totalFrames() {
        return this._config.totalFrames
    }

    public set totalFrames(f: number) {
        this._config.totalFrames = f
    }

    public get currentFrame() {
        return this._currentFrame.get()
    }

    public set currentFrame(f: number) {
        this._currentFrame.set(f)
    }

    public get currentFrameState() {
        return this._currentFrame
    }

    public nextFrame(): number {
        const previousFrame = this.currentFrame
        if (this.currentFrame < this.totalFrames) {
            this.currentFrame++
        } else if (this.currentFrame === this.totalFrames) {
            this.currentFrame = 1
        }
        return previousFrame
    }
}

export class ViewPort {
    _offset: State<PositionConfig> = createState({
        x: 0, y: 0
    })
    _scale: State<number> = createState(0.75)

    public get offset() {
        return this._offset.get()
    }

    public set offset(offset) {
        this._offset.set(offset)
    }

    public get scale() {
        return this._scale.get()
    }

    public set scale(scale) {
        this._scale.set(scale)
    }
}

export class Context {
    private static contextIds = 0
    private readonly contextId
    protected ids: number = 0
    ctx: TimeContext
    private _selected: State<PropConfig> = createState()
    props: State<PropConfig[]> = createState([])
    viewports: State<ViewPort[]> = createState([])
    public readonly config: Config
    private _snackbarMSG: State<string> = createState('')
    public readonly propTypeIconPool: { [key in PropType]: PropTypeIcon }

    public get snackbarState(): State<string> {
        return this._snackbarMSG
    }

    public get snackbar() {
        return this._snackbarMSG.get()
    }

    public set snackbar(message: string) {
        this._snackbarMSG.set(message, true)
    }

    public constructor(config?: Config, context?: TimeContext) {
        this.contextId = Context.contextIds
        Context.contextIds += 1
        this.ctx = context ? context : new TimeContext()
        this.config = config ? {...DefaultConfig, ...config} : {...DefaultConfig}
        this.config.lines.forEach((l) => {
            l[2] = {...DefaultLine, ...l[2]}
        })
        console.log(this.config)
        this.propTypeIconPool = {...PropTypeIcons, ...config.propTypes}

    }

    public addProp(...propConfigs: PropConfig[]): Context {
        const _props = [...this.props.get()]
        propConfigs.forEach(propConfig => {
            propConfig.color = propConfig.color || generateDarkColor()
            propConfig.style = propConfig.style || "default"
            propConfig.id = propConfig.id || this.ids
            propConfig.displayName = propConfig.displayName === undefined ? true : propConfig.displayName
            propConfig.name = propConfig.name || `${convertTypeToReadable(propConfig.type)} ${propConfig.id}`
            if (propConfig.frameAnimationConfig) {
                for (let key in propConfig.frameAnimationConfig) {
                    const a = propConfig.frameAnimationConfig[key]
                    a.scaleX = a.scaleX || 1
                    a.scaleY = a.scaleY || 1
                    a.hide = a.hide === undefined ? false : a.hide
                    a.enabled = a.enabled === undefined ? true : a.enabled
                }
            }
            this.ids += 1
            _props.push(propConfig)
        })
        this.props.set(_props)
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

    public extractIdType(htmlID: string): [number, string[]] {
        const id: number = parseInt(htmlID.match(/-\d+/)[0].replace('-', ''))
        const type: string = htmlID.replace(/-\d+/, '').replace(/\d+-/, '')
        return [id, type.split('-')]
    }

    public getIdType(...type: string[]) {
        return this.getId(null, ...type)
    }

    public getId(id: HasId | number | null, ...type: string[]) {
        type.sort((a, b) => a.localeCompare(b))
        const _id = id === null ? "" : (typeof id === 'number' ? "-" + id : "-" + id.id)
        return `${this.contextId}-${type.join('-')}${_id}`
    }

    public isPropEnabled(prop: PropConfig): boolean {
        return this.getPropPositionByFrame(prop, this.ctx.currentFrame, false).enabled
    }

    public getPropById(id: number): PropConfig | null {
        for (const prop of this.props.get()) {
            if (prop.id === id) {
                return prop
            }
        }
        return null
    }

    public getPropsByName(name: string) {
        const props = []
        for (const prop of this.props.get()) {
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
        let position: AnimationConfig
        if (this.ctx.isStatic) {
            position = prop.staticPosition
        } else {
            position = prop.frameAnimationConfig[this.ctx.currentFrame]
        }
        position = {...position}
        console.log(`${prop.name} (${position.x},${position.y})`)
        return position
    }

    public getPropPositionByCurrentFrame(prop: PropConfig): AnimationConfig | null {
        return this.getPropPositionByFrame(prop, this.ctx.currentFrame, false)
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
        this.props.get().forEach(prop => {
            const frameConfig: FrameAnimationConfig = prop.frameAnimationConfig
            const _max: number = Number(Object.keys(frameConfig).reduce((a, b) => frameConfig[a] > frameConfig[b] ? a : b))
            if (_max > max) {
                max = _max
            }
        })
        return max
    }

    public get viewportOffset() {
        return this.viewports.get()[0].offset
    }

    public set viewportOffset(offset: PositionConfig) {
        const _viewports = [...this.viewports.get()]
        _viewports[0].offset = offset
        this.viewports.set(_viewports)
    }

    public get viewportScale() {
        return this.viewports.get()[0].scale
    }

    public set viewportScale(scale: number) {
        const _viewports = [...this.viewports.get()]
        _viewports[0].scale = scale
        this.viewports.set(_viewports)
    }

    public findMinMaxPosition(currentFrame?: number): [number, number, number, number] {
        let [minX, minY, maxX, maxY] = [null, null, null, null]
        const updateMinMax = (position) => {
            if (position.x > maxX || maxX === null) {
                maxX = position.x
            }
            if (position.y > maxY || maxY === null) {
                maxY = position.y
            }
            if (position.x < minX || minX === null) {
                minX = position.x
            }
            if (position.y < minY || minY === null) {
                minY = position.y
            }
        }
        this.props.get().forEach(prop => {
            if (currentFrame) {
                updateMinMax(this.getPropPositionByFrame(prop, currentFrame, false))
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
        console.log(minX, minY, maxX, maxY)
        const svgE = $(`.root-container`)
        const viewWidthRatio = (maxX - minX) / svgE.width()
        const viewHeightRatio = (maxY - minY) / svgE.height()
        let viewRatio = viewWidthRatio > viewHeightRatio ? viewWidthRatio : viewHeightRatio
        viewRatio += this.config.viewOffset
        const viewX = minX - (this.config.viewOffset / 2) * svgE.width()
        const viewY = minY - (this.config.viewOffset / 2) * svgE.height()
        return [viewRatio, viewX, viewY]
    }

    private beforeDisplay() {
        this.ctx.totalFrames = this.findMaxFrames()
        const viewports = []
        for (let i = 0; i <= this.ctx.totalFrames; i++) {
            // populate one more frame since 0's used for static/animation
            const viewport = new ViewPort()
            viewports.push(viewport)
        }
        this.viewports.set(viewports)
    }

    public getPropSpanText(prop: PropConfig, color ?: string) {
        const propText = document.createElement("span")
        propText.innerText = prop.name
        propText.style.color = color ? color : prop.color
        return propText
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

    private register<T extends CustomComponent>(...c: Array<new(T) => T>): T[] {
        const components: T[] = []
        c.forEach(cl => {
            const component = new cl(this)
            component.renderComponent()
            components.push(component)
        })
        return components
    }

    viewComponent: View

    public displayRoot(selector: string) {
        this.beforeDisplay()
        $(() => {

            $(selector).addClass("root-container")
                .html(`<div class='snackbar-container'></div>
                                     <div class='prop__list-container'></div>
                                    <div class='prop__property-container'></div>
                                    <div class='view-container'></div>
                                    <div class="footer-container"></div>`)

            // this._selected.set(this.props[0])
            //
            const [view] = this.register(View, PropList, PropDialog, Footer, Snackbar)
            this.viewComponent = view as View

            // console.log(`offset: left ${this.offset.left}, top ${this.offset.top}`)
        })
    }
}

export function demo() {
    const getRandomPosition = () => {
        return {
            enabled: !!randInclusive(0, 1),
            x: Math.random() * 500,
            y: Math.random() * 500,
            degree: Math.random() * 360,
        }
    }
    const getDemoLight = () => {
        return {
            type: PropType.LIGHT,
            colorTemperature: 5000,
            frameAnimationConfig: {
                1: {
                    x: 0, y: 0, degree: 30, enabled: false
                },
                2: {
                    x: 100, y: 100, degree: 60, hide: true
                },
                3: {
                    x: 190, y: 150, degree: 90
                },
            }
        }
    }

    const getDemoTable = () => {
        return {
            type: "HOUSE",
            frameAnimationConfig: {
                1: getRandomPosition(),
                2: getRandomPosition(),
                3: getRandomPosition(),
                4: getRandomPosition(),
            },
            displayName: false
        }
    }
    const ctx: Context = new Context({
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
        ]
    })
    ctx.addProp(getDemoLight(), getDemoTable(), getDemoTable(), getDemoTable(), getDemoTable(), getDemoTable(), getDemoTable()).displayRoot("#scene")
    console.log(ctx.props.get())

    return new Position(1, 1)
}

