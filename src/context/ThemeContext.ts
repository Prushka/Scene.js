/*
 * Copyright 2022 Dan Lyu.
 */

import State, {createState} from "../state/State";
import {Scene} from "../index";
import Context from "./Context";

export type Colors = { [key: string]: string }
export type Theme = { isLight: boolean, colors: Colors, icon: string }
export type Themes = { [key: string]: Theme }
export const ThemeConstants: Themes = {
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
            "--scene-snackbar-error": "#EB7777",
            "--scene-snackbar-success": "#49655E",
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
            "--scene-trans-base": "rgba(255, 255, 255, 0.92)",
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
            "--scene-snackbar-error": "#EB7777",
            "--scene-snackbar-success": "#49655E",
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
            "--scene-trans-base": "rgba(40,40,40,0.92)",
        },
        icon: 'bi bi-moon-stars-fill'
    },
    'dark-classic': {
        isLight: false,
        colors: {
            "--scene-base": "#000000",
            "--scene-base-s1": "#2c2c2c",
            "--scene-base-inv": "#ffffff",
            "--scene-base-inv-s1": "#efefef",
            "--scene-base-inv-s2": "#b4b4b4",
            "--scene-dialog-header-button-not-selected-hover": "#9ab999",
            "--scene-dialog-header-button-not-selected-text-hover": "#9ab999",
            "--scene-snackbar-error": "#EB7777",
            "--scene-snackbar-success": "#49655E",
            "--scene-timeline-button-selected": "#375d7e",
            "--scene-timeline-button-selected-hover": "#513c66",
            "--scene-timeline-button-not-selected": "#6d5c7c",
            "--scene-timeline-button-not-selected-hover": "#c06d85",
            "--scene-timeline-button-text": "#ffffff",
            "--scene-snackbar-text": "#ffffff",
            "--scene-dialog-key": "#4c87b5",
            "--scene-dialog-value": "#ff6a79",
            "--scene-dialog-content": "#ffffff",
            "--scene-button-text": "#ffffff",
            "--scene-button-color": "#46aea9",
            "--scene-button-hover": "#557a81",
            "--scene-trans-base": "rgba(40,40,40,0.92)",
        },
        icon: 'bi bi-balloon-heart-fill'
    }
}


export default class ThemeContext extends Context{
    private readonly _current: State<number>
    private readonly _themeKeys: string[]
    private readonly _themes: Themes

    public get currentState() {
        return this._current
    }

    public constructor(scene: Scene) {
        super(scene)
        this._themes = {...ThemeConstants, ...this.config.customThemes}
        this._themeKeys = [...Object.keys(this._themes)]
        let defaultPos = 0
        if (this.config.defaultTheme) {
            const defaultTheme = this.config.defaultTheme.toLowerCase()
            if (this._themeKeys.includes(defaultTheme)) {
                defaultPos = this._themeKeys.indexOf(defaultTheme)
            }
        }
        this._current = createState(defaultPos)
    }

    public get currentTheme(): Theme {
        return this._themes[this._themeKeys[this._current.get()]]
    }

    public get nextTheme(): Theme {
        return this.getThemeByIndex(this.nextThemeIndex)
    }

    public renderTheme() {
        const colors = this.currentTheme.colors
        const container = this.config.themeScope === 'root'
            ? document.documentElement : this.scene.getRootDocument()
        for (let key in colors) {
            container.style.setProperty(key, colors[key]);
        }
    }

    public getThemeByIndex(index: number) {
        return this._themes[this.getThemeName(index)]
    }

    public getThemeName(index: number) {
        return this._themeKeys[index]
    }

    public getCurrentThemeName() {
        return this.getThemeName(this._current.get())
    }

    public getNextThemeName() {
        return this.getThemeName(this.nextThemeIndex)
    }

    public changeThemeByThemeName(name: string) {
        for (let themeKey of this._themeKeys) {
            if(themeKey.toLowerCase() === name.toLowerCase()){
                this._current.set(this._themeKeys.indexOf(name))
                this.renderTheme()
            }
        }
    }

    public getNextThemeIndex(index: number) {
        let next = index + 1
        if (next >= this._themeKeys.length) {
            next = 0
        }
        return next
    }

    public get themeToDisplay() {
        return `${this.getCurrentThemeName()} -> ${this.getNextThemeName()}`
    }

    public get nextThemeIndex() {
        return this.getNextThemeIndex(this._current.get())
    }

    public next() {
        this._current.set(this.nextThemeIndex)
        this.renderTheme()
    }

}