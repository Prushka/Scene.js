/*
 * Copyright 2022 Dan Lyu.
 */

import State, {createState} from "../state/State";

type Colors = { [key: string]: string }
type Theme = { isLight: boolean, colors: Colors, icon: string }

const ThemeConstants: { [key: string]: Theme } = {
    'light': {
        isLight: true,
        colors: {
            "--scene-base": "#ffffff",
            "--scene-base-s1": "#F5F5F5",
            "--scene-base-inv": "#000000",
            "--scene-base-inv-s1": "#1c1c1c",
            "--scene-base-inv-s2": "#696969",
            "--scene-dialog-header-button-not-selected-hover": "#6565a1",
            "--scene-dialog-header-button-not-selected-text-hover": "#6565a1",
            "--scene-snackbar": "#EB7777",
            "--scene-timeline-button-selected": "#8688BC",
            "--scene-timeline-button-selected-hover": "#6565a1",
            "--scene-timeline-button-not-selected": "#EB7777",
            "--scene-timeline-button-not-selected-hover": "#d96262",
            "--scene-timeline-button-text": "#ffffff",
            "--scene-snackbar-text": "#ffffff",
            "--scene-dialog-key": "#6565a1",
            "--scene-dialog-value": "#EB7777",
            "--scene-dialog-content": "#000000",
            "--scene-button-text": "#ffffff",
            "--scene-button-color": "#8688BC",
            "--scene-button-hover": "#6565a1",
            "--scene-trans-base": "rgba(255, 255, 255, 0.95)",
        },
        icon: 'bi bi-brightness-high'
    },
    'dark': {
        isLight: false,
        colors: {
            "--scene-base": "#000000",
            "--scene-base-s1": "#2c2c2c",
            "--scene-base-inv": "#ffffff",
            "--scene-base-inv-s1": "#efefef",
            "--scene-base-inv-s2": "#b4b4b4",
            "--scene-dialog-header-button-not-selected-hover": "#a3a3c7",
            "--scene-dialog-header-button-not-selected-text-hover": "#a3a3c7",
            "--scene-snackbar": "#EB7777",
            "--scene-timeline-button-selected": "#8688BC",
            "--scene-timeline-button-selected-hover": "#6565a1",
            "--scene-timeline-button-not-selected": "#EB7777",
            "--scene-timeline-button-not-selected-hover": "#d96262",
            "--scene-timeline-button-text": "#ffffff",
            "--scene-snackbar-text": "#ffffff",
            "--scene-dialog-key": "#a3a3c7",
            "--scene-dialog-value": "#ea9090",
            "--scene-dialog-content": "#ffffff",
            "--scene-button-text": "#ffffff",
            "--scene-button-color": "#8688BC",
            "--scene-button-hover": "#6565a1",
            "--scene-trans-base": "rgba(40,40,40,0.95)",
        },
        icon: 'bi bi-moon-stars-fill'
    }
}

export function useTheme(defaultTheme?: string) {
    return new ThemeContext(defaultTheme)
}

export default class ThemeContext {
    private readonly _current: State<number>
    private readonly _themes: string[]

    public get currentState() {
        return this._current
    }

    public constructor(defaultTheme?: string) {
        this._themes = [...Object.keys(ThemeConstants)]
        let defaultPos = 0
        if (defaultTheme) {
            defaultTheme = defaultTheme.toLowerCase()
            if (this._themes.includes(defaultTheme)) {
                defaultPos = this._themes.indexOf(defaultTheme)
            }
        }
        this._current = createState(defaultPos)
        this.renderTheme()
    }

    public get currentTheme(): Theme {
        return ThemeConstants[this._themes[this._current.get()]]
    }

    public get nextTheme(): Theme {
        return this.getThemeByIndex(this.nextThemeIndex)
    }

    public renderTheme() {
        const colors = this.currentTheme.colors
        for (let key in colors) {
            document.documentElement.style.setProperty(key, colors[key]);
        }
    }

    public getThemeByIndex(index: number) {
        return ThemeConstants[this._themes[index]]
    }

    public get nextThemeIndex() {
        let next = this._current.get() + 1
        if (next >= this._themes.length) {
            next = 0
        }
        return next
    }

    public next() {
        this._current.set(this.nextThemeIndex)
        this.renderTheme()
    }

}