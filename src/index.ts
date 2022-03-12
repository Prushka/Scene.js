import Position from "./props/Position";
import {PropConfig, PropType} from "./props/Props";

export * as position from './props/Position'

export class ConfigConstructor {
    protected ids: number = 0
    protected _props: Array<PropConfig> = []

    public constructor() {
    }

    public get props() {
        return this._props
    }

    public addProp<T extends PropConfig>(propType: PropType, propConfig: T) {
        propConfig.propId = propConfig.propId || this.ids
        this.ids += 1
        this._props.push(propConfig)
        return this
    }

}

export function demo() {
    const config: ConfigConstructor = new ConfigConstructor()
    config.addProp(PropType.LIGHT, {
        name: "Light", iconColor: "#000000", colorTemperature: 5000
    }).addProp(PropType.LIGHT, {
        name: "Light", iconColor: "#000000", colorTemperature: 5000
    })
    console.log(config.props)
    $(() => {
        $("#scene").addClass("root-container")
            .html("<p class='test'>tewst12</p>")
    })
    return new Position(1, 1)
}

