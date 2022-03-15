export interface Config {
    theme?: "dark" | "light",
    dialog?: "popup" | "embedded",

}

export const DefaultConfig: Config = {
    theme: "light",
    dialog: "embedded",
}