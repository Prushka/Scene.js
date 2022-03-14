/*
 * Copyright 2022 Dan Lyu.
 */

import {CustomComponent} from "../component/Component";

export type Action<T> = (oldValue:T, newValue:T) => void
export type StateAction<T> = [State<T>, Action<T>?]
export type ComponentAction<T> = [CustomComponent, Action<T>?]

export default class State<T> {
    private _state: T
    private static globalStates: State<any>[] = []
    private _components: CustomComponent[] = []
    private _componentsActions: ComponentAction<any>[] = []

    public static renderAll() {
        State.globalStates.forEach(s => {
            s.render()
        })
    }

    public constructor(defaultValue?: T) {
        this._state = defaultValue
        State.globalStates.push(this)
    }

    public get(): T {
        return this._state
    }

    private render() {
        this._components.forEach(component => {
            component.renderComponent()
        })
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
            this._componentsActions.forEach(([, action]) => {
                action(this.get(), value)
            })
            this._state = value
            this.render()
        }
    }

    public subscribe(component: CustomComponent) {
        this._components.push(component)
    }

    public subscribeActions(component: CustomComponent, func: () => void) {
        this._componentsActions.push([component, func])
    }
}

export function createState<T>(defaultValue?: T): State<T> {
    return new State(defaultValue)
}