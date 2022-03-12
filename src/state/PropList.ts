/*
 * Copyright 2022 Dan Lyu.
 */


import Action from "./Action";
import {PropConfig} from "../props/Props";
import {StateReducer} from "./State";

export enum PropListAction {
    ADD_PROP
}

export function addProp(prop: PropConfig) {
    return {
        type: PropListAction.ADD_PROP,
        payload: prop
    }
}

export const PropListReducer: StateReducer<PropConfig[]> = (state?, action?: Action) => {
    switch (action.type) {
        case PropListAction.ADD_PROP:
            return [
                ...state,
                action.payload
            ];
        default:
            return []
    }
}