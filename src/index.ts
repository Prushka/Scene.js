import Position from "./props/Position";
import {AnimationConfig, FrameAnimationConfig, PropConfig, PropType, PropTypeIcons} from "./props/Props";

export * as position from './props/Position'

function convertTypeToReadable(type: PropType): string {
    return `${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()}`
}

export interface SceneContextConfig {
    totalFrames?: number
}

export class SceneContext {
    protected _config: SceneContextConfig
    protected _currentFrame: number = 0

    public constructor(config?: SceneContextConfig) {
        config = config || {}
        config.totalFrames = config.totalFrames || 0
        this._config = config
    }

}

export class ConfigConstructor {
    protected ids: number = 0
    protected _props: Array<PropConfig> = []
    protected _sceneContext: SceneContext

    public constructor(context: SceneContext) {
        this._sceneContext = context
    }

    public set ctx(context: SceneContext) {
        this._sceneContext = context
    }

    public get props() {
        return this._props
    }

    public addProp<T extends PropConfig>(...propConfigs: T[]) {
        propConfigs.forEach(propConfig => {
            propConfig.propId = propConfig.propId || this.ids
            propConfig.name = propConfig.name || `${convertTypeToReadable(propConfig.type)} ${propConfig.propId}`
            this.ids += 1
            this._props.push(propConfig)
        })
        return this
    }

    private getPropListHtml() {
        const lst: Array<string> = this.props.map(prop => {
            return `<div id='prop-list-${prop.propId}' class='prop__list__item'>
                    <i class="${PropTypeIcons[prop.type].default.enabled} prop__list__item__icon"></i><p>${prop.name}</p>
                    </div>`
        })
        return lst.join('')
    }

    public displayRoot(selector: string) {
        $(() => {
            $(selector).addClass("root-container")
                .html(`<div class='prop__list'>${this.getPropListHtml()}</div>`)
        })
    }
}

export function demo() {
    const getDemoLight = () => {
        return {
            type: PropType.LIGHT,
            colorTemperature: 5000,
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

