/*
 * Copyright 2022 Dan Lyu.
 */

export interface PositionConfig {
    x?: number,
    y?: number
}

export interface OrientationConfig {
    /**
     * @default 0
     */
    degree?: number
}

export interface ScaleConfig {
    /**
     * @default 1
     */
    scaleX?: number,
    /**
     * @default 1
     */
    scaleY?: number
}

export interface ImageConfig {
    title?: string,
    imageURL: string,
    width?: number,
    height?: number
}

export interface AnimationConfig extends OrientationConfig, PositionConfig, ScaleConfig {
    /** True renders the enabled path, False renders the disabled one.
     *
     * @default true
     */
    enabled?: boolean,
    /** If the prop should be hidden.
     *
     * @default false
     */
    hide?: boolean,
    /** The transition timing function of the prop group (at this frame).
     *
     * @see Config
     * @default uses the default transitionTimingFunction defined in the config.
     */
    transitionTimingFunction?: string,
    /** The thumbnail used at this frame, if provided, an <image> will be rendered
     * in the prop group instead of its path.
     *
     * @default null
     */
    thumbnail?: ImageConfig,
}

export const DefaultAnimationConfig: AnimationConfig = {
    degree: 0,
    scaleX: 1,
    scaleY: 1,
    hide: false,
    enabled: true
}

export interface LineConfig {
    color?: string,
    width?: number
}

export const DefaultLine: LineConfig = {
    color: "var(--scene-base-inv-s2)",
    width: 1
}

export interface HasId {
    id?: number,
}

export type FrameAnimationConfig = { [key: number]: AnimationConfig }


export interface StepConfig {
    title?: string,
    content?: string
}

export type StepsConfig = { [key: number]: StepConfig }

export type PropNamePosition = 'center' | 'top' | 'right' | 'left' | 'bottom'

export interface PropConfig extends HasId {
    /** The name of the prop.
     *
     * @see type
     * @default if a name is not provided,
     * a name with an index and type will be generated
     * @example Table 1
     */
    name?: string,

    /** The color of the prop icon
     *
     * @see Config.defaultTheme
     * @default if a color is not provided,
     * a random color will be generated based on the default theme
     */
    color?: string,

    /** The icon style of this prop */
    style?: string,

    /** The prop type.
     *
     * Affects the icon being rendered in the prop group
     * */
    type?: PropType | string,

    /** The specific frame animation
     * (i.e., position, orientation, frame speed, enabled/hide etc.)
     *
     * @see FrameAnimationConfig */
    frameAnimationConfig?: FrameAnimationConfig,

    /** A script
     *
     * Affects the prop dialog's script tab and its content
     */
    scripts?: string,

    /** A list of objects
     *
     * Affects the prop dialog's step tab and its content,
     * will be ordered before render
     */
    steps?: StepsConfig,

    /** A note
     *
     * Affects the prop dialog's general information tab and its content
     */
    note?: string,

    /** A list of images with titles
     *
     * Affects the prop dialog's images tab and its content
     * and the image overlay on click
     */
    images?: ImageConfig[],

    /** The order index of this prop.
     * A larger order index renders this prop on top of other props
     * with smaller indices.
     *
     * Affects the prop's group's order inside the svg viewport's props group
     */
    orderIndex?: number,

    /** True displays the prop's name inside the viewport
     *
     * False hides its name
     */
    shouldDisplayName?: boolean,

    /** When name is displayed, the position of this prop's name
     *  relative to its main content (i.e., image OR icon OR script)
     *
     * Affects the position of the text element inside the grouped <g> prop in the svg viewport
     *
     * @default 'top'
     */
    namePosition?: string | PropNamePosition,

    /** An extra scale parameter of the name inside the viewport
     *
     * @default 1
     */
    nameScale?: number,

    /** When set, the name will use this color in the
     * viewport, prop list and prop dialog (i.e., everywhere the name is colored)
     */
    nameColor?: string,

    /** The x offset of the name text element inside the grouped prop
     *
     * @default 0
     */
    nameXOffset?: number,

    /** The y offset of the name text element inside the grouped prop
     *
     * @default 0
     */
    nameYOffset?: number,

    /** By default, the general information tab renders
     *  all key value pairs provided by the user.
     *
     *  Any key listed in this list will be excluded from
     *  the content element in the prop dialog
     *
     * @default []
     */
    excludeKeys?: string[]
}

export const DefaultPropConfig: PropConfig = {
    style: "default",
    shouldDisplayName: true,
    orderIndex: 0,
    namePosition: 'top',
    nameScale: 1,
    nameXOffset: 0,
    nameYOffset: 0,
    excludeKeys: []
}

export const ExcludeKeys = ["name", "color", "type", "frameAnimationConfig",
    "steps", "note", "shouldDisplayName", "id", "images", "orderIndex",
    "namePosition", "nameScale", "nameXOffset", "nameYOffset", "excludeKeys",
    "nameColor", "scripts"]

/** The default PropTypes */
export enum PropType {
    TABLE = "TABLE",
    LIGHT = "LIGHT",
    CHARACTER = "CHARACTER",
    CAMERA = "CAMERA",
    DISPLAY = "DISPLAY",
    // CHAIR = "CHAIR",
    SHELF = "SHELF",
    MAP = "MAP",
    SCRIPT = "SCRIPT",
    STORYBOARD = "STORYBOARD"
}

export interface PropTypeStyleIcon {
    /** A string of a list of paths, can repeat in the following format:
     * 1. <path .*? />
     * 2. <path .*?><path/>
     */
    enabledPaths: string,
    disabledPaths: string
}

export type PropTypeIcon = { [key: string]: PropTypeStyleIcon }

export const PropTypeIcons: { [key in PropType]: PropTypeIcon } = {
    TABLE: {
        default: {
            enabledPaths: `<path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>`,
            disabledPaths: `<path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
  <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>`
        },
        triangle: {
            enabledPaths: `<path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>`,
            disabledPaths: `<path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z"/>
  <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z"/>`
        },
        fillTriangle: {
            enabledPaths: `<path fill-rule="evenodd" d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767L7.022 1.566z"/>`,
            disabledPaths: `<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>`
        },
        square: {
            enabledPaths: `<path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>`,
            disabledPaths: `<path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
  <path d="M11.354 4.646a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708l6-6a.5.5 0 0 1 .708 0z"/>`
        },
        fillSquare: {
            enabledPaths: `<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2z"/>`,
            disabledPaths: `<path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm9.354 5.354-6 6a.5.5 0 0 1-.708-.708l6-6a.5.5 0 0 1 .708.708z"/>`
        }
    },
    LIGHT: {
        default: {
            enabledPaths: `<path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a1.964 1.964 0 0 0-.453-.618A5.984 5.984 0 0 1 2 6zm6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1z"/>`,
            disabledPaths: `<path fill-rule="evenodd" d="M2.23 4.35A6.004 6.004 0 0 0 2 6c0 1.691.7 3.22 1.826 4.31.203.196.359.4.453.619l.762 1.769A.5.5 0 0 0 5.5 13a.5.5 0 0 0 0 1 .5.5 0 0 0 0 1l.224.447a1 1 0 0 0 .894.553h2.764a1 1 0 0 0 .894-.553L10.5 15a.5.5 0 0 0 0-1 .5.5 0 0 0 0-1 .5.5 0 0 0 .288-.091L9.878 12H5.83l-.632-1.467a2.954 2.954 0 0 0-.676-.941 4.984 4.984 0 0 1-1.455-4.405l-.837-.836zm1.588-2.653.708.707a5 5 0 0 1 7.07 7.07l.707.707a6 6 0 0 0-8.484-8.484zm-2.172-.051a.5.5 0 0 1 .708 0l12 12a.5.5 0 0 1-.708.708l-12-12a.5.5 0 0 1 0-.708z"/>`
        },
        lightning: {
            enabledPaths: `<path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09zM4.157 8.5H7a.5.5 0 0 1 .478.647L6.11 13.59l5.732-6.09H9a.5.5 0 0 1-.478-.647L9.89 2.41 4.157 8.5z"/>`,
            disabledPaths: `<path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>`
        }
    },
    CHARACTER: {
        default: {
            enabledPaths: `<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>`,
            disabledPaths: `<path fill-rule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6.146-2.854a.5.5 0 0 1 .708 0L14 6.293l1.146-1.147a.5.5 0 0 1 .708.708L14.707 7l1.147 1.146a.5.5 0 0 1-.708.708L14 7.707l-1.146 1.147a.5.5 0 0 1-.708-.708L13.293 7l-1.147-1.146a.5.5 0 0 1 0-.708z"/>`
        }
    },
    CAMERA: {
        default: {
            enabledPaths: `<path fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z"/>`,
            disabledPaths: `<path fill-rule="evenodd" d="M10.961 12.365a1.99 1.99 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272l.714 1H9.5a1 1 0 0 1 1 1v6a1 1 0 0 1-.144.518l.605.847zM1.428 4.18A.999.999 0 0 0 1 5v6a1 1 0 0 0 1 1h5.014l.714 1H2a2 2 0 0 1-2-2V5c0-.675.334-1.272.847-1.634l.58.814zM15 11.73l-3.5-1.555v-4.35L15 4.269v7.462zm-4.407 3.56-10-14 .814-.58 10 14-.814.58z"/>`
        }
    },
    DISPLAY: {
        default: {
            enabledPaths: `<path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4c0 .667.083 1.167.25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75c.167-.333.25-.833.25-1.5H2s-2 0-2-2V4zm1.398-.855a.758.758 0 0 0-.254.302A1.46 1.46 0 0 0 1 4.01V10c0 .325.078.502.145.602.07.105.17.188.302.254a1.464 1.464 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.758.758 0 0 0 .254-.302 1.464 1.464 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.757.757 0 0 0-.302-.254A1.46 1.46 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145z"/>`,
            disabledPaths: `<path d="M6 12c0 .667-.083 1.167-.25 1.5H5a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-.75c-.167-.333-.25-.833-.25-1.5h4c2 0 2-2 2-2V4c0-2-2-2-2-2H2C0 2 0 4 0 4v6c0 2 2 2 2 2h4z"/>`
        }
    },
    // CHAIR: {
    //     default: {
    //         enabledPaths: `<path d="M445.1 338.6l-14.77-32C425.1 295.3 413.7 288 401.2 288H46.76C34.28 288 22.94 295.3 17.7 306.6l-14.77 32c-4.563 9.906-3.766 21.47 2.109 30.66S21.09 384 31.1 384l.001 112c0 8.836 7.164 16 16 16h32c8.838 0 16-7.164 16-16V384h256v112c0 8.836 7.164 16 16 16h31.1c8.838 0 16-7.164 16-16L416 384c10.91 0 21.08-5.562 26.95-14.75S449.6 348.5 445.1 338.6zM111.1 128c0-29.48 16.2-54.1 40-68.87L151.1 256h48l.0092-208h48L247.1 256h48l.0093-196.9C319.8 73 335.1 98.52 335.1 128l-.0094 128h48.03l-.0123-128c0-70.69-57.31-128-128-128H191.1C121.3 0 63.98 57.31 63.98 128l.0158 128h47.97L111.1 128z"/>`,
    //         disabledPaths: `<path d="M445.1 338.6l-14.77-32C425.1 295.3 413.7 288 401.2 288H46.76C34.28 288 22.94 295.3 17.7 306.6l-14.77 32c-4.563 9.906-3.766 21.47 2.109 30.66S21.09 384 31.1 384l.001 112c0 8.836 7.164 16 16 16h32c8.838 0 16-7.164 16-16V384h256v112c0 8.836 7.164 16 16 16h31.1c8.838 0 16-7.164 16-16L416 384c10.91 0 21.08-5.562 26.95-14.75S449.6 348.5 445.1 338.6zM111.1 128c0-29.48 16.2-54.1 40-68.87L151.1 256h48l.0092-208h48L247.1 256h48l.0093-196.9C319.8 73 335.1 98.52 335.1 128l-.0094 128h48.03l-.0123-128c0-70.69-57.31-128-128-128H191.1C121.3 0 63.98 57.31 63.98 128l.0158 128h47.97L111.1 128z"/>`
    //     }
    // },
    SHELF: {
        default: {
            enabledPaths: `<path d="M2.5 0a.5.5 0 0 1 .5.5V2h10V.5a.5.5 0 0 1 1 0v15a.5.5 0 0 1-1 0V15H3v.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5zM3 14h10v-3H3v3zm0-4h10V7H3v3zm0-4h10V3H3v3z"></path>`,
            disabledPaths: `<path d="M2.5 0a.5.5 0 0 1 .5.5V2h10V.5a.5.5 0 0 1 1 0v15a.5.5 0 0 1-1 0V15H3v.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 .5-.5zM3 14h10v-3H3v3zm0-4h10V7H3v3zm0-4h10V3H3v3z"></path>`
        }
    },
    MAP: {
        default: {
            enabledPaths: `<path fill-rule="evenodd" d="M3.1 11.2a.5.5 0 0 1 .4-.2H6a.5.5 0 0 1 0 1H3.75L1.5 15h13l-2.25-3H10a.5.5 0 0 1 0-1h2.5a.5.5 0 0 1 .4.2l3 4a.5.5 0 0 1-.4.8H.5a.5.5 0 0 1-.4-.8l3-4z"></path><path fill-rule="evenodd" d="M4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999z"></path>`,
            disabledPaths: `<path fill-rule="evenodd" d="M3.1 11.2a.5.5 0 0 1 .4-.2H6a.5.5 0 0 1 0 1H3.75L1.5 15h13l-2.25-3H10a.5.5 0 0 1 0-1h2.5a.5.5 0 0 1 .4.2l3 4a.5.5 0 0 1-.4.8H.5a.5.5 0 0 1-.4-.8l3-4z"></path><path fill-rule="evenodd" d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999z"></path>`
        }
    },
    STORYBOARD: {
        default: {
            enabledPaths: `<path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h11A1.5 1.5 0 0 1 14 2.5v10.528c0 .3-.05.654-.238.972h.738a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 1 1 0v9a1.5 1.5 0 0 1-1.5 1.5H1.497A1.497 1.497 0 0 1 0 13.5v-11zM12 14c.37 0 .654-.211.853-.441.092-.106.147-.279.147-.531V2.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v11c0 .278.223.5.497.5H12z"/>
  <path d="M2 3h10v2H2V3zm0 3h4v3H2V6zm0 4h4v1H2v-1zm0 2h4v1H2v-1zm5-6h2v1H7V6zm3 0h2v1h-2V6zM7 8h2v1H7V8zm3 0h2v1h-2V8zm-3 2h2v1H7v-1zm3 0h2v1h-2v-1zm-3 2h2v1H7v-1zm3 0h2v1h-2v-1z"/>`,
            disabledPaths: `<path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h11A1.5 1.5 0 0 1 14 2.5v10.528c0 .3-.05.654-.238.972h.738a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 1 1 0v9a1.5 1.5 0 0 1-1.5 1.5H1.497A1.497 1.497 0 0 1 0 13.5v-11zM12 14c.37 0 .654-.211.853-.441.092-.106.147-.279.147-.531V2.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v11c0 .278.223.5.497.5H12z"/>
  <path d="M2 3h10v2H2V3zm0 3h4v3H2V6zm0 4h4v1H2v-1zm0 2h4v1H2v-1zm5-6h2v1H7V6zm3 0h2v1h-2V6zM7 8h2v1H7V8zm3 0h2v1h-2V8zm-3 2h2v1H7v-1zm3 0h2v1h-2v-1zm-3 2h2v1H7v-1zm3 0h2v1h-2v-1z"/>`
        }
    },
    SCRIPT: {
        default: {
            enabledPaths: ``,
            disabledPaths: ``
        }
    },
}