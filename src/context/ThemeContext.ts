/*
 * Copyright 2022 Dan Lyu.
 */

import State, {createState} from "../state/State";

type Colors = { [key: string]: string }
type Theme = { colors: Colors, icon: string }

const ThemeConstants: { [key: string]: Theme } = {
    'light': {
        colors: {
            '--theme-dark-pink': '#000000'
        },
        icon: ''
    }
}

export function useTheme() {
    return new ThemeContext()
}

export default class ThemeContext {
    private _current: State<number> = createState(0)
    private readonly _themes: string[]

    public constructor() {
        this._themes = [...Object.keys(ThemeConstants)]
    }

    public next() {
        this._current.set(this._current.get() + 1)
        if (this._current.get() >= this._themes.length) {
            this._current.set(0)
        }
        const currentTheme = this._themes[this._current.get()]
        const colors = ThemeConstants[currentTheme].colors
        for (let key in colors) {
            document.documentElement.style.setProperty(key, colors[key]);
        }
    }

}