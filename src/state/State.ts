/*
 * Copyright 2022 Dan Lyu.
 */

export default class State<T> {
    private _state: T
    private static globalStates: State<any>[] = []

    public static renderAll() {
        State.globalStates.forEach(s => s.render())
    }

    public constructor(defaultValue?: T) {
        this._state = defaultValue
        State.globalStates.push(this)
    }

    public get(): T {
        return this._state
    }

    public render() {
        // this.withSelectorPopulate((selector, populate, afterRender) => {
        //     const html: string | string[] = populate(this.get())
        //     $(selector).html(Array.isArray(html) ? html.join('') : html)
        //     if (afterRender) {
        //         afterRender()
        //     }
        // })

    }

    public set(value: T) {
        if (value !== this._state) {
            this._state = value
            this.render()
        }
    }
}

export function createState<T>(defaultValue?:T):State<T>{
    return new State(defaultValue)
}