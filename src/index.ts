import Position from "./props/Position";
import {AnimationConfig, FrameAnimationConfig, PropConfig, PropType} from "./props/Props";

export * as position from './props/Position'

export class ConfigConstructor {
    protected ids: number = 0
    protected _props: Array<PropConfig> = []

    public constructor() {
    }

    public get props() {
        return this._props
    }

    public addProp<T extends PropConfig>(propConfig: T,
                                         propAnimations?: FrameAnimationConfig) {
        propConfig.propId = propConfig.propId || this.ids
        propConfig.frameAnimationConfig = propConfig.frameAnimationConfig || propAnimations
        this.ids += 1
        this._props.push(propConfig)
        return this
    }

    private getPropListHtml() {
        const lst: Array<string> = this.props.map(prop => {
            return `<div class='prop__list__item'><i class="bi-alarm prop__list__item__icon"></i><p>${prop.name}</p></div>`
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
    const config: ConfigConstructor = new ConfigConstructor()
    config.addProp({
        name: "Light", iconColor: "#000000",
        type: PropType.LIGHT,
        colorTemperature: 5000,
        frameAnimationConfig: {
            1: {x: 200, y: 200, degree: 30},
            2: {x: 20, y: 20, degree: 30, isOffset: false}
        }
    }).displayRoot("#scene")
    console.log(config.props)

    return new Position(1, 1)
}

