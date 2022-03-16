/*
 * Copyright 2022 Dan Lyu.
 */

import State, {createState} from "../state/State";
import {PositionConfig} from "../props/Props";

export default class ViewPort {
    private offsetState: State<PositionConfig> = createState({
        x: 0, y: 0
    })
    private scaleState: State<number> = createState(0.75)

    public get offset() {
        return this.offsetState.get()
    }

    public set offset(offset) {
        this.offsetState.set(offset)
    }

    public get scale() {
        return this.scaleState.get()
    }

    public set scale(scale) {
        this.scaleState.set(scale)
    }
}