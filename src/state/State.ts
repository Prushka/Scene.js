/*
 * Copyright 2022 Dan Lyu.
 */

import Action from "./Action";
import {CustomComponent} from "../component/Component";


export type StateReducer<T> = (state?: T, action?: Action) => T

interface StateStore<T> {
    key: string,
    reducer: StateReducer<T>,
    state: T,
    subscribers: Set<CustomComponent>
}

class StateContext {
    _store: { [key: string]: StateStore<any> }
    _reducers: { [key: string]: StateReducer<any> }

    constructor(reducers: { [key: string]: StateReducer<any> }) {
        this._store = {}
        this._reducers = reducers
        for (let k in reducers) {
            this.addReducer(k, reducers[k])
        }
    }

    public dispatch<T>(f:(T)=>Action){
        return f
    }

    private addReducer(key, reducer) {
        this._store[key] = {
            key: key,
            reducer: reducer,
            state: reducer(),
            subscribers: new Set<CustomComponent>()
        }
    }

    public bindState(component: CustomComponent, key:string) {
        this._store[key].subscribers.add(component)
        return this._store[key].state
    }
}

export function createStateContext(reducers: { [key: string]: StateReducer<any> }): StateContext {
    return new StateContext(reducers)
}