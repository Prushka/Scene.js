/*
 * Copyright 2022 Dan Lyu.
 */

import {CustomComponent} from "../component/Component";

export type ActionBefore<T> = (oldValue: T, newValue: T, previousValue: T) => void
export type ActionAfter<T> = (previousValue: T, currentValue: T) => void
export type StateAction<T> = [State<T>, ActionBefore<T>?, ActionAfter<T>?]
export type ComponentAction<T> = [CustomComponent, ActionBefore<T>?, ActionAfter<T>?]

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
            this._componentsActions.forEach(([, actionBefore,]) => {
                if (actionBefore) {
                    actionBefore(this.get(), value, this._previous_state)
                }
            })
            this._previous_state = this._state
            this._state = value
            this._componentsActions.forEach(([, , actionAfter]) => {
                if (actionAfter) {
                    actionAfter(this._previous_state, this.get())
                }
            })
            this.render()
        }
    }

    public unsubscribe(component: CustomComponent) {
        this._components = this._components.filter(c => c !== component)
        this._componentsActions = this._componentsActions.filter(c => c[0] !== component)
    }

    public subscribe(component: CustomComponent) {
        this._components.push(component)
    }

    public subscribeActions(component: CustomComponent, actionBefore: ActionBefore<T>, actionAfter: ActionAfter<T>) {
        this._componentsActions.push([component, actionBefore, actionAfter])
    }
}

export function createState<T>(defaultValue?: T): State<T> {
    return new State(defaultValue)
}