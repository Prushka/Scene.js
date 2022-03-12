export interface PositionConfig {
    x: number,
    y: number
}

export interface OrientationConfig {
    degree?: number
}

export interface AnimationConfig extends OrientationConfig, PositionConfig {
    enabled?: boolean,
    isOffset?: boolean
}

export type FrameAnimationConfig = { [key: number]: AnimationConfig }

export interface PropConfig {
    name: string,
    iconColor: string,
    propId?: number,
    type?: PropType,
    frameAnimationConfig?: FrameAnimationConfig
}

export enum PropType {
    TABLE,
    LIGHT,
    CHARACTER,
    CAMERA,
    SCRIPT,
    STORYBOARD
}

export interface FurnitureConfig extends PropConfig {
    brand?: string
}

export interface CharacterConfig extends PropConfig {
    gender?: string
}

export interface LightConfig extends PropConfig {
    colorTemperature: number
}