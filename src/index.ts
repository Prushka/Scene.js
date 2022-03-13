/*
 * Copyright 2022 Dan Lyu.
 */

import Position from "./props/Position";
import {AnimationConfig, PropConfig, PropType} from "./props/Props";
import Coordinates = JQuery.Coordinates;
import State, {createState} from "./state/State";
import {convertTypeToReadable} from "./utils/Utils";
import {PropList} from "./component/PropList";
import {PropDialog} from "./component/PropDialog";
import {Footer} from "./component/Footer";

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

export class ConfigConstructor {
    protected ids: number = 0
    protected _ctx: SceneContext
    protected _selected: State<PropConfig> = createState()
    protected _props: State<PropConfig[]> = createState([])

//     protected _props: StateListener<PropConfig[]> = createStateContext([]).populateSelectorWith(
//         {
//             listeningSelectors: [".view-container"], renderWith: (v: PropConfig[]) =>
//                 v.map(prop => {
//                     const position: AnimationConfig = this.getPropPosition(prop)
//                     return `<div class="view__prop" style="left:${position.x}px;bottom: ${position.y}px">
// <i id='prop-icon-${prop.propId}' class="${PropTypeIcons[prop.type][prop.iconStyle][this.isPropEnabled(prop) ? 'enabled' : 'disabled']}"></i>
// </div>`
//                 }),
//             afterRender: () => {
//                 let mouseX, mouseY
//                 let dragging: boolean = false
//                 $('.view__prop').on("dragstart", (e) => {
//                     console.log(e)
//                 })
//                 $('.view-container').on("mousedown", (e) => {
//                     e.preventDefault()
//                     mouseX = e.clientX
//                     mouseY = e.clientY
//                     dragging = true
//                 }).on("mousemove", (e) => {
//                     e.preventDefault()
//                     if (dragging) {
//
//                     }
//                 }).on("mouseup", (e) => {
//                     e.preventDefault()
//                     dragging = false
//                 })
//             }
//         }
//     )

    public constructor(context: SceneContext) {
        this._ctx = context
    }

    public get props() {
        return this._props.get()
    }

    public addProp<T extends PropConfig>(...propConfigs: T[]): ConfigConstructor {
        const _props = [...this.props]
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
        this._props.set(_props)
        return this
    }

    private isPropEnabled(prop: PropConfig): boolean {
        if (this._ctx.isStatic) {
            return prop.enabled
        } else {
            return false
        }
    }

    private getPropById(id: number): PropConfig | null {
        for (const prop of this.props) {
            if (prop.propId === id) {
                return prop
            }
        }
        return null
    }

    private getPropPosition(prop: PropConfig): AnimationConfig | null {
        if (this._ctx.isStatic) {
            return prop.staticPosition
        } else {
            return prop.frameAnimationConfig[this._ctx.currentFrame.get()]
        }
    }

    private toggleSelected(prop: PropConfig | number) {
        let _prop: PropConfig
        if (typeof prop == "number") {
            _prop = this.getPropById(prop)
        } else {
            _prop = prop
        }
        if (_prop === this._selected.get()) {
            this._selected.set(null)
        } else {
            this._selected.set(_prop)
        }
    }

    private offset: Coordinates

    public displayRoot(selector: string) {
        $(() => {

            $(selector).addClass("root-container")
                .html(`<div class='prop__list-container'></div>
                                    <div class='prop__property-container'></div>
                                    <div class='view-container'></div>
                                    <div class="footer-container"></div>`)

            // this._selected.set(this.props[0])
            new PropList(this._props, this._selected, (prop) => this.toggleSelected(prop), (prop) => this.isPropEnabled(prop))
            new PropDialog(this._selected, (prop) => this.toggleSelected(prop), (prop) => this.isPropEnabled(prop))
            new Footer(this._ctx.totalFrames, this._ctx.currentFrame)
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
    const config: ConfigConstructor = new ConfigConstructor(context)
    config.addProp(getDemoLight(), getDemoLight(), getDemoTable(), getDemoLight(), getDemoTable()).displayRoot("#scene")
    console.log(config.props)

    return new Position(1, 1)
}

