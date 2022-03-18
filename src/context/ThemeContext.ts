/*
 * Copyright 2022 Dan Lyu.
 */

import State from "../state/State";

enum Theme {
    light = 'light',
    dark = 'dark'
}

export function useTheme() {
    return new ThemeContext()
}

export default class ThemeContext {
    private _theme: State<Theme>

    public set theme(theme) {
        this._theme.set(theme)
    }

    public get theme() {
        return this._theme.get()
    }

    public get themeState() {
        return this._theme
    }
}