export interface Config {
    theme?: "dark" | "light",
    dialog?: "popup" | "embedded",
    viewOffset?: number,
    playTransition?:string
}

export const DefaultConfig: Config = {
    theme: "light",
    dialog: "embedded",
    viewOffset: 0.2,
    playTransition: "linear"
}