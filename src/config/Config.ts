import {LineConfig, PositionConfig, PropConfig, PropTypeIcon} from "../props/Props";
import {Theme} from "../context/ThemeContext";

export interface Config {
    defaultTheme?: string,
    dialog?: "popup" | "embedded",
    viewOffset?: number,
    transitionTimingFunction?: string,
    defaultOpenPropList?: boolean,
    defaultOpenToolbar?: boolean,
    frameSpeed?: { [key: number]: number },
    defaultFrameSpeed?: number,
    frameSelectionSpeed?: number, // set to 0 to disable animation while selecting
    attachment?: { [key: string]: string[] },
    propTypes?: { [key: string]: PropTypeIcon },
    lines?: [PositionConfig, PositionConfig, LineConfig?][],
    alwaysShowAllDialogTabs?: boolean,
    props?: PropConfig[],
    renderMethod?: "canvas" | "svg",
    zoomLowerBound?: number,
    zoomUpperBound?: number,
    zoomFactor?: number,
    dialogShowAllProperties?: boolean, // add an extra tab to dialog, which shows all properties of the selected prop
    dialogAllPropertiesFormat?: 'json' | 'flat',
    customThemes?: { [key: string]: Theme },
    displayToolbar?: boolean,
    displayPropList?: boolean,
    displayTimeline?: boolean
}

export const DefaultConfig: Config = {
    defaultTheme: "dark",
    dialog: "embedded",
    viewOffset: 0.2,
    transitionTimingFunction: "linear",
    frameSpeed: {},
    attachment: {},
    defaultFrameSpeed: 1,
    frameSelectionSpeed: 1,
    defaultOpenPropList: false,
    defaultOpenToolbar: false,
    propTypes: {},
    lines: [],
    alwaysShowAllDialogTabs: false,
    props: [],
    renderMethod: "canvas",
    zoomLowerBound: 0.15,
    zoomUpperBound: 2,
    zoomFactor: 1.02,
    dialogShowAllProperties: true,
    dialogAllPropertiesFormat: 'json',
    customThemes: {},
    displayToolbar: true,
    displayPropList: true,
    displayTimeline: true,
}