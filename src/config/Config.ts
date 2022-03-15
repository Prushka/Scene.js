export interface Config {
    theme?: "dark" | "light",
    dialog?: "popup" | "embed",

}

export const DefaultConfig: Config = {
    theme: "light",
    dialog: "embed",
}