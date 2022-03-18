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
            "--theme-dark-white": "#F5F5F5",
            "--theme-dark-gray": "#1c1c1c",
            "--theme-gray": "#696969",
            "--theme-purple": "#8688BC",
            "--theme-dark-purple": "#6565a1",
            "--theme-pink": "#EB7777",
            "--theme-dark-pink": "#d96262",
            "--theme-trans-white": "rgba(255, 255, 255, 0.95)",
            "--theme-base": "white",
            "--theme-base-inv": "black",
        },
        icon: 'bi bi-brightness-high'
    },
    'dark': {
        isLight: false,
        colors: {
            "--theme-dark-white": "#363636",
            "--theme-dark-gray": "#dcdcdc",
            "--theme-gray": "#b0b0b0",
            "--theme-purple": "#caccf5",
            "--theme-dark-purple": "#e1e1f3",
            "--theme-pink": "#f6a2a2",
            "--theme-dark-pink": "#f8cfcf",
            "--theme-trans-white": "rgba(45,45,45,0.95)",
            "--theme-base": "black",
            "--theme-base-inv": "white",
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