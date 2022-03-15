export interface Config {
    theme?: "dark" | "light",
    dialog?: "popup" | "embedded",
    viewOffset?: number,
    playTransition?: string,
    frameSpeed?: { [key: number]: number },
    defaultFrameSpeed?: number,
    frameSelectionSpeed?: number // set to 0 to disable animation while selecting
}

export const DefaultConfig: Config = {
    theme: "light",
    dialog: "embedded",
    viewOffset: 0.2,
    playTransition: "linear",
    frameSpeed: {},
    defaultFrameSpeed: 1,
    frameSelectionSpeed: 1
}