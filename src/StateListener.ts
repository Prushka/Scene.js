/*
 * Copyright 2022 Dan Lyu.
 */

export interface StateHTMLUpdater<T> {
    listeningSelectors: string[],
    // events: string[],
    renderWith: (value: T) => string | string[]
    afterRender: () => void
}

export default class StateListener<T> {
    private _state: T
    private _f: Array<StateHTMLUpdater<T>> = []

    public constructor(defaultValue?: T) {
        this._state = defaultValue
    }

    public get(): T {
        return this._state
    }

    public render() {
        this.withSelectorPopulate((selector, populate, afterRender) => {
            const html: string | string[] = populate(this.get())
            $(selector).html(Array.isArray(html) ? html.join('') : html)
            afterRender()
        })

    }

    public set(value: T) {
        if (value !== this._state) {
            this._state = value
            this.render()
        }
    }

    private withSelectorPopulate(f: (selector: string, populate: (v: T) => string | string[], afterRender: () => void) => void) {
        this._f.forEach(updater => {
            updater.listeningSelectors.forEach(selector => {
                f(selector, updater.renderWith, updater.afterRender)
            })
        })
    }

    public populateSelectorWith(...f: StateHTMLUpdater<T>[]) {
        this._f = this._f.concat(f)
        // // remove previous listeners
        // this.withUpdaterSelectorEvent((updater, selector, event) => {
        //     $(selector).off(event)
        // })
        // this.withUpdaterSelectorEvent((updater, selector, event) => {
        //     $(selector).off(event)
        // })
        return this
    }
}

export function createState<T>(defaultValue?: T) {
    return new StateListener(defaultValue)
}