/*
 * Copyright 2022 Dan Lyu.
 */

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

export interface HasId {
    id?: number,
}

export type FrameAnimationConfig = { [key: number]: AnimationConfig }

export interface PropConfig extends HasId {
    name?: string,
    iconColor?: string,
    iconStyle?: string,
    type?: PropType,
    enabled?: boolean,
    staticPosition?: AnimationConfig,
    frameAnimationConfig?: FrameAnimationConfig
}

export enum PropType {
    TABLE = "TABLE",
    LIGHT = "LIGHT",
    // CHARACTER = "CHARACTER",
    // CAMERA = "CAMERA",
    // SCRIPT = "SCRIPT",
    // STORYBOARD = "STORYBOARD"
}

export interface PropTypeStyleIcon {
    enabled: string,
    disabled: string,
}

export type PropTypeIcon = { [key: string]: PropTypeStyleIcon }

export const PropTypeIcons: { [key in PropType]: PropTypeIcon } = {
    TABLE: {
        default: {
            enabled: "bi-triangle",
            disabled: "bi-exclamation-triangle-fill",
        }
    },
    LIGHT: {
        default: {
            enabled: "bi-lightbulb",
            disabled: "bi-lightbulb-off",
        }
    }
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