import {LineConfig, PositionConfig, PropConfig, PropTypeIcon} from "../props/Props";
import {Theme} from "../context/ThemeContext";


export type FrameSpeeds = { [key: number]: number }

export interface Config {
    /** The default theme used
     *
     * Affects all interface
     * colors and prop icon/text colors.
     *
     * When a light theme is used and there exists props
     * with no specified colors, a random dark color will be generated.
     * (This applies to dark themes as well (which generates light colors)).
     *
     * @default light
     */
    defaultTheme?: string,

    /** The default theme scope
     *
     * Root sets all instances of this library to the certain theme
     * on theme switch.
     *
     * Container restricts the scope to the current selected theme.
     *
     * @default 'container
     */
    themeScope?: 'root' | 'container',

    /** [TODO: Popup hasn't been fully implemented]
     *
     * Affects the basic container style of the prop property dialog
     *
     * Embedded displays the dialog inside the root container.
     * Popup displays the dialog as a popup window.
     *
     * @default embedded
     */
    dialog?: "popup" | "embedded",

    /** The offset of view's viewbox position.
     *
     * Affects the viewbox of the svg element after resetting the viewport.
     * A value greater than 0 will give extra space to fit all props inside the viewport.
     *
     * @default 0.2
     */
    viewOffset?: number,

    /** Default transition timing function of prop and timeline frame progress bar
     *
     * Affects all viewport elements' transition-timing-function property.
     *
     * @default linear
     */
    transitionTimingFunction?: string,

    /** Affects the default style of the prop list. false hides the prop list.
     *
     * @default true
     */
    defaultOpenPropList?: boolean,

    /** Affects the default style of the toolbar. false hides the toolbar.
     *
     * @default true
     */
    defaultOpenToolbar?: boolean,

    /** A list of pairs of frame speeds
     * {1: 1, 2: 2} allocates 1 second for frame 1->2 transition
     * and 2 seconds for frame 2->1 transition.
     *
     * Affects the length (i.e., flex-grow property) of timeline frame progress bar
     * (between each pair of frames), all props' and
     * timeline frame progress bar's transition-duration.
     *
     * @default {}
     */
    frameSpeed?: FrameSpeeds,

    /** The default frame speed used when a frame speed property is missing.
     *
     * @see frameSpeed
     * @default 1
     */
    defaultFrameSpeed?: number,

    /** Affects all view elements' animation speed when the user skips one frame
     * (i.e., jump more than 1 frame).
     *
     * 0 disables the animation.
     *
     * @default 1
     */
    frameSelectionSpeed?: number,

    /** [TODO: Drawing connections hasn't been implemented]
     * Describes the connection relationship between props.
     *
     * {'table 1': ['table 2', 'table 3]} draws 2 arrows between
     * table 1, table 2 and table 1, table 3
     *
     * Affects the path element inside the connection group <g>
     *     in the svg view element.
     *
     * @default {}
     */
    attachment?: { [key: string]: string[] },

    /** Custom prop types with their svg paths.
     *
     * These paths will be used if a custom prop type is provided and used.
     *
     * @default {}
     * A js object that represents custom prop types icons
     *
     * @example
     * TABLE: {
     *     default: {
     *        enabledPaths: `<path.../>`,
     *        disabledPaths: `<path.../>`
     *         },
     *      triangle: {
     *        enabledPaths: `<path.../>`,
     *        disabledPaths: `<path.../>`
     *        }
     *     }
     */
    propTypes?: { [key: string]: PropTypeIcon },

    /** Defines a list of lines to be drawn in the viewport inside the lines group.
     *
     * Used to draw elements like room walls.
     *
     * @default []
     */
    lines?: [PositionConfig, PositionConfig, LineConfig?][],

    /** True shows all tab elements
     * (general information, scripts, steps, storyboard images, optional debug)
     *  in the dialog header.
     * False shows only the tab elements that contain data.
     *
     * @see dialog
     * @see dialogShowAllProperties
     * @default false
     */
    alwaysShowAllDialogTabs?: boolean,

    /** A list of all props.
     *
     * Affects the specific rendering method of all elements inside
     * the prop <g> in the svg view.
     *
     * @default []
     */
    props?: PropConfig[],

    /** [TODO: canvas hasn't been implemented, svg has been fully implemented]
     * The default render method of the main viewport.
     *
     * svg uses DOM manipulation and grouped elements.
     *
     * @default svg
     */
    renderMethod?: "canvas" | "svg",

    /** The max distance the user can zoom-out in the viewport.
     *
     * Affects the viewbox/scale attribute of the parent svg element.
     *
     * @default 0.15
     */
    zoomLowerBound?: number,

    /** The min distance the user can zoom-in in the viewport.
     *
     * Affects the viewbox/scale attribute of the parent svg element.
     *
     * @default 2
     */
    zoomUpperBound?: number,

    /** [TODO: mobile zoom using touch hasn't been implemented]
     *
     * The zoom distance of a single wheel trigger,
     * used to multiply the wheel data.
     *
     * Affects the viewbox/scale attribute of the parent svg element.
     *
     * @default 1.02
     */
    zoomFactor?: number,

    /** Affects the dialog element's header tab.
     *
     * True renders an additional debug tab that renders all properties of
     * the selected prop.
     *
     * @default: false
     */
    dialogShowAllProperties?: boolean,

    /** Affects the dialog element's debug tab's render format
     *  and all its text elements' colors.
     *
     * 'json' renders all data in a json format.
     *
     * 'flat' recursively iterates over the prop object and
     * renders its data in a list of [key1.key2...] value format.
     *
     *
     * @default: 'flat'
     */
    dialogAllPropertiesFormat?: 'json' | 'flat',

    /** Affects the toolbar theme selection button, its icon and all theme colors
     *
     * @default: {}
     */
    customThemes?: { [key: string]: Theme },

    /** Doesn't render the toolbar element and
     *  all its buttons/tooltip when set to false.
     *
     * Also affects the timeline length
     * (timeline takes full length if this is set to false)
     *
     * @default: true
     */
    displayToolbar?: boolean,

    /** Doesn't render the prop list element when set to false.
     *
     * @default: true
     */
    displayPropList?: boolean,

    /** Doesn't render the timeline element when set to false.
     *
     * @default true
     */
    displayTimeline?: boolean
}

export const DefaultConfig: Config = {
    defaultTheme: "light",
    themeScope: 'container',
    dialog: "embedded",
    viewOffset: 0.2,
    transitionTimingFunction: "linear",
    frameSpeed: {},
    attachment: {},
    defaultFrameSpeed: 1,
    frameSelectionSpeed: 1,
    defaultOpenPropList: true,
    defaultOpenToolbar: true,
    propTypes: {},
    lines: [],
    alwaysShowAllDialogTabs: false,
    props: [],
    renderMethod: "svg",
    zoomLowerBound: 0.15,
    zoomUpperBound: 2,
    zoomFactor: 1.02,
    dialogShowAllProperties: false,
    dialogAllPropertiesFormat: 'json',
    customThemes: {},
    displayToolbar: true,
    displayPropList: true,
    displayTimeline: true,
}