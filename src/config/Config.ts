export interface Config {
    theme?: "dark" | "light",
    dialog?: "popup" | "embedded",
    viewOffset?: number,
    playTransition?: string,
    defaultOpenPropList?: boolean,
    defaultOpenToolbar?: boolean,
    frameSpeed?: { [key: number]: number },
    defaultFrameSpeed?: number,
    frameSelectionSpeed?: number, // set to 0 to disable animation while selecting
    attachment?: { [key: string]: string[] }
}

export const DefaultConfig: Config = {
    theme: "light",
    dialog: "embedded",
    viewOffset: 0.2,
    playTransition: "linear",
    frameSpeed: {},
    attachment: {},
    defaultFrameSpeed: 1,
    frameSelectionSpeed: 1,
    defaultOpenPropList: false,
    defaultOpenToolbar: false
}