/*
 * Copyright 2022 Dan Lyu.
 */

import Position from "./props/Position";
import {AnimationConfig, PositionConfig, PropConfig, PropType} from "./props/Props";
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
    public currentFrame: State<number> = createState(1)

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

}

export class Context {
    protected ids: number = 0
    public ctx: SceneContext
    public selected: State<PropConfig> = createState()
    public props: State<PropConfig[]> = createState([])
    viewPortOffset:State<PositionConfig> = createState({
        x:0, y:0
    })

    public constructor(context: SceneContext) {
        this.ctx = context
    }

    public addProp<T extends PropConfig>(...propConfigs: T[]): Context {
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
        if (this.ctx.isStatic) {
            return prop.staticPosition
        } else {
            return prop.frameAnimationConfig[this.ctx.currentFrame.get()]
        }
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

    private offset: Coordinates

    private register<T>(...c: Array<new(T) => T>) {
        c.forEach(cl => {
            new cl(this)
        })
    }

    public displayRoot(selector: string) {
        $(() => {
            $(selector).addClass("root-container")
                .html(`<div class='prop__list-container'></div>
                                    <div class='prop__property-container'></div>
                                    <div class='view-container'></div>
                                    <div class="footer-container"></div>`)

            // this._selected.set(this.props[0])
            this.register(PropList, PropDialog, Footer, View)
            State.renderAll()
            this.offset = $(selector).offset()
            console.log(`offset: left ${this.offset.left}, top ${this.offset.top}`)
        })
    }
}

export function demo() {
    const getDemoLight = () => {
        return {
            type: PropType.LIGHT,
            colorTemperature: 5000,
            enabled: false,
            staticPosition: {
                x: 180, y: 100, degree: 30
            },
            frameAnimationConfig: {
                1: {x: 200, y: 200, degree: 30},
                2: {x: 20, y: 20, degree: 30, isOffset: false}
            }
        }
    }

    const getDemoTable = () => {
        return {
            type: PropType.TABLE,
            enabled: true,
            staticPosition: {
                x: 280, y: 200, degree: 30
            },
            frameAnimationConfig: {
                1: {x: 280, y: 200, degree: 30},
                2: {x: 20, y: 20, degree: 30, isOffset: false}
            }
        }
    }
    const context: SceneContext = new SceneContext()
    const config: Context = new Context(context)
    config.addProp(getDemoLight(), getDemoLight(), getDemoTable(), getDemoLight(), getDemoTable()).displayRoot("#scene")
    console.log(config.props.get())

    return new Position(1, 1)
}

