/*
 * Copyright 2022 Dan Lyu.
 */

import Action from "./Action";

interface GlobalState {

}

export type StateReducer<T> = (state:T, action: Action) => T

export function createState() {

}