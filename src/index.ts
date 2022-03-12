/*
 * Copyright 2022 Dan Lyu.
 */

import Position from "./props/Position";
import {AnimationConfig, FrameAnimationConfig, PropConfig, PropType, PropTypeIcons} from "./props/Props";
import StateListener, {createState} from "./StateListener";

export * as position from './props/Position'

function convertTypeToReadable(type: PropType): string {
    return `${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()}`
}

function extractIdType(htmlID: string): [number, string] {
    const id: number = parseInt(htmlID.match(/\d+/)[0])
    const type: string = htmlID.replace(/-\d+/, '')
    return [id, type]
}

export interface SceneContextConfig {
    totalFrames?: number
}

export class SceneContext {
    protected _config: SceneContextConfig
    public currentFrame: number = 0

    public constructor(config?: SceneContextConfig) {
        config = config || {}
        config.totalFrames = config.totalFrames || 0
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
    protected _props: Array<PropConfig> = []
    protected _ctx: SceneContext
    protected _selected?: StateListener<PropConfig> = createState()

    public constructor(context: SceneContext) {
        this.ctx = context
    }

    public set ctx(context: SceneContext) {
        this._ctx = context
    }

    public get props() {
        return this._props
    }

    public addProp<T extends PropConfig>(...propConfigs: T[]): ConfigConstructor {
        propConfigs.forEach(propConfig => {
            propConfig.iconStyle = propConfig.iconStyle || "default"
            propConfig.propId = propConfig.propId || this.ids
            propConfig.enabled = propConfig.enabled === undefined ? true : propConfig.enabled
            propConfig.name = propConfig.name || `${convertTypeToReadable(propConfig.type)} ${propConfig.propId}`
            this.ids += 1
            this._props.push(propConfig)
        })
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
        for (const prop of this._props) {
            if (prop.propId === id) {
                return prop
            }
        }
        return null
    }

    private getPropListHtml() {
        const lst: Array<string> = this.props.map(prop => {
            return `<div id='prop-list-${prop.propId}' class='prop__list__item'>
                    <i id='prop-list-icon-${prop.propId}' class="${PropTypeIcons[prop.type][prop.iconStyle][this.isPropEnabled(prop) ? 'enabled' : 'disabled']} prop__list__item__icon"></i>
                    <p id='prop-list-text-${prop.propId}'>${prop.name}</p>
                    </div>`
        })
        return lst.join('')
    }

    private set selected(prop:PropConfig | number){
        if(typeof prop == "number"){
            this._selected = this.getPropById(prop)
        }else{
            this._selected = prop
        }
    }

    public displayRoot(selector: string) {

        $(() => {
            $(selector).addClass("root-container")
                .html(`<div class='prop__list'>${this.getPropListHtml()}</div>`)

            $('.prop__list__item').on("click", (e) => {
                const [id] = extractIdType(e.target.id)
                this.selected = id
            })
        })
    }
}

export function demo() {
    const getDemoLight = () => {
        return {
            type: PropType.LIGHT,
            colorTemperature: 5000,
            enabled: false,
            frameAnimationConfig: {
                1: {x: 200, y: 200, degree: 30},
                2: {x: 20, y: 20, degree: 30, isOffset: false}
            }
        }
    }
    const context: SceneContext = new SceneContext()
    const config: ConfigConstructor = new ConfigConstructor(context)
    config.addProp(getDemoLight(), getDemoLight(), getDemoLight(),
        getDemoLight(), getDemoLight()).displayRoot("#scene")
    console.log(config.props)

    return new Position(1, 1)
}

