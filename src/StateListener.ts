/*
 * Copyright 2022 Dan Lyu.
 */

export interface StateHTMLUpdater {
    listeningSelectors: string[],
    // events: string[],
    populateWith: () => string
}

export default class StateListener<T> {
    private _state: T
    private _f: Array<StateHTMLUpdater> = []

    public constructor(defaultValue?: T) {
        this._state = defaultValue
    }

    public get(): T {
        console.log(this._f[0][1]())
        return this._state
    }

    public update(){
        this.withSelectorPopulate((selector, populate) => {
            $(selector).html(populate())
        })
    }

    public set(value: T) {
        if (value !== this._state) {
            this._state = value
            this.update()
        }
    }

    private withSelectorPopulate(f: (selector: string, populate: () => string) => void) {
        this._f.forEach(updater => {
            updater.listeningSelectors.forEach(selector => {
                f(selector, updater.populateWith)
            })
        })
    }

    public populateSelectorWith(...f: StateHTMLUpdater[]) {
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