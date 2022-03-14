/*
 * Copyright 2022 Dan Lyu.
 */

import Position from "./props/Position";
import {AnimationConfig, FrameAnimationConfig, PositionConfig, PropConfig, PropType} from "./props/Props";
import Coordinates = JQuery.Coordinates;
import State, {createState} from "./state/State";
import {convertTypeToReadable} from "./utils/Utils";
import {PropList} from "./component/PropList";
import {PropDialog} from "./component/PropDialog";
import {Footer} from "./component/Footer";
import {View} from "./component/View";

export * as position from './props/Position'

export interface SceneContextConfig {
    totalFrames?: number
}

export class SceneContext {
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

}

export class ViewPort {
    _offset: State<PositionConfig> = createState({
        x: 0, y: 0
    })
    _scale: State<number> = createState(1)

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
    private contextId = 0
    protected ids: number = 0
    ctx: SceneContext
    selected: State<PropConfig> = createState()
    props: State<PropConfig[]> = createState([])
    viewports: State<ViewPort[]> = createState([])

    public constructor(context: SceneContext) {
        this.contextId = Context.contextIds
        Context.contextIds += 1
        this.ctx = context
    }

    public addProp(...propConfigs: PropConfig[]): Context {
        const _props = [...this.props.get()]
        propConfigs.forEach(propConfig => {
            propConfig.iconStyle = propConfig.iconStyle || "default"
            propConfig.propId = propConfig.propId || this.ids
            propConfig.enabled = propConfig.enabled === undefined ? true : propConfig.enabled
            propConfig.name = propConfig.name || `${convertTypeToReadable(propConfig.type)} ${propConfig.propId}`
            if (propConfig.frameAnimationConfig) {
                for (let key in propConfig.frameAnimationConfig) {
                    propConfig.frameAnimationConfig[key].enabled = propConfig.frameAnimationConfig[key].enabled === undefined ? true : propConfig.frameAnimationConfig[key].enabled
                }
            }
            this.ids += 1
            _props.push(propConfig)
        })
        this.props.set(_props)
        return this
    }

    public extractIdType(htmlID: string): [number, string[]] {
        const id: number = parseInt(htmlID.match(/-\d+/)[0].replace('-',''))
        const type: string = htmlID.replace(/-\d+/, '').replace(/\d+-/, '')
        return [id, type.split('-')]
    }

    public getId(prop: PropConfig | number, ...type: string[]) {
        const id = typeof prop === 'number' ? prop : prop.propId
        return `${this.contextId}-${type.join('-')}-${id}`
    }

    public isPropEnabled(prop: PropConfig): boolean {
        if (this.ctx.isStatic) {
            return prop.enabled
        } else {
            return false
        }
    }

    public getPropById(id: number): PropConfig | null {
        for (const prop of this.props.get()) {
            if (prop.propId === id) {
                return prop
            }
        }
        return null
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

    public toggleSelected(prop: PropConfig | number) {
        let _prop: PropConfig
        if (typeof prop == "number") {
            _prop = this.getPropById(prop)
        } else {
            _prop = prop
        }
        if (_prop === this.selected.get()) {
            this.selected.set(null)
        } else {
            this.selected.set(_prop)
        }
    }

    private register<T>(...c: Array<new(T) => T>) {
        c.forEach(cl => {
            new cl(this)
        })
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

        console.log(this.viewports.get()[this.ctx.currentFrame].offset)
        return this.viewports.get()[this.ctx.currentFrame].offset
    }

    public set viewportOffset(offset: PositionConfig) {
        const _viewports = [...this.viewports.get()]
        _viewports[this.ctx.currentFrame].offset = offset
        this.viewports.set(_viewports)
    }

    public get viewportScale() {
        return this.viewports.get()[this.ctx.currentFrame].scale
    }

    public set viewportScale(scale: number) {
        const _viewports = [...this.viewports.get()]
        _viewports[this.ctx.currentFrame].scale = scale
        this.viewports.set(_viewports)
    }

    private beforeDisplay() {
        this.ctx.totalFrames = this.findMaxFrames()
        const viewports = []
        for (let i = 0; i <= this.ctx.totalFrames; i++) {
            // populate one more frame since 0's used for static
            viewports.push(new ViewPort())
        }
        this.viewports.set(viewports)
    }

    public displayRoot(selector: string) {
        this.beforeDisplay()
        $(() => {

            $(selector).addClass("root-container")
                .html(`<div class='prop__list-container'></div>
                                    <div class='prop__property-container'></div>
                                    <div class='view-container'></div>
                                    <div class="footer-container"></div>`)

            // this._selected.set(this.props[0])
            //
            this.register(View, PropList, PropDialog, Footer,)
            State.renderAll()

            // console.log(`offset: left ${this.offset.left}, top ${this.offset.top}`)
        })
    }
}

export function demo() {
    const getRandomPosition = () => {
        return {x: Math.random() * 600, y: Math.random() * 600, degree: Math.random() * 360}
    }
    const getDemoLight = () => {
        return {
            type: PropType.LIGHT,
            colorTemperature: 5000,
            enabled: false,
            staticPosition: {
                x: 500, y: 500, degree: 30
            },
            frameAnimationConfig: {
                1: getRandomPosition(),
                2: getRandomPosition(),
                3: getRandomPosition(),
            }
        }
    }

    const getDemoTable = () => {
        return {
            type: PropType.TABLE,
            enabled: true,
            staticPosition: {
                x: Math.random() * 600, y: Math.random() * 600, degree: 30
            },
            frameAnimationConfig: {
                1: getRandomPosition(),
                2: getRandomPosition(),
                3: getRandomPosition(),
                4: getRandomPosition(),
            }
        }
    }
    const context: SceneContext = new SceneContext()
    const config: Context = new Context(context)
    config.addProp(getDemoLight(), getDemoLight()).displayRoot("#scene")
    console.log(config.props.get())

    return new Position(1, 1)
}

