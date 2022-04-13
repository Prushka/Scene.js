/*
 * Copyright 2022 Dan Lyu.
 */

import {Scene} from "../index";

export default class Context {

    protected readonly scene
    protected readonly themeCtx
    protected readonly config

    public constructor(scene: Scene) {
        this.scene = scene
        this.themeCtx = scene.themeCtx
        this.config = scene.config
    }
}