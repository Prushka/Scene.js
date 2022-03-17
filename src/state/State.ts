/*
 * Copyright 2022 Dan Lyu.
 */

import {CustomComponent} from "../component/Component";

export type Action<T> = (oldValue: T, newValue: T, previousValue: T) => void
export type StateAction<T> = [State<T>, Action<T>?]
export type ComponentAction<T> = [CustomComponent, Action<T>?]

export default class State<T> {
    private _state: T
    private _previous_state: T
    private _components: CustomComponent[] = []
    private _componentsActions: ComponentAction<any>[] = []

    public constructor(defaultValue?: T) {
        this._state = defaultValue
    }

    public get(): T {
        return this._state
    }

    public getPrevious(): T {
        return this._previous_state
    }

    private render() {
        this._components.forEach(component => {
            component.renderComponent()
        })
    }

    public set(value: T, forceUpdate?: boolean) {
        if (forceUpdate || value !== this._state) {
            this._componentsActions.forEach(([, action]) => {
                action(this.get(), value, this._previous_state)
            })
            this._previous_state = this._state
            this._state = value
            this.render()
        }
    }

    public subscribe(component: CustomComponent) {
        this._components.push(component)
    }

    public subscribeActions(component: CustomComponent, func: Action<T>) {
        this._componentsActions.push([component, func])
    }
}

export function createState<T>(defaultValue?: T): State<T> {
    return new State(defaultValue)
}