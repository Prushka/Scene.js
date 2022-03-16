/*
 * Copyright 2022 Dan Lyu.
 */

import {PropConfig} from "./Props";

export default class Prop {
    protected propConfig: PropConfig

    public constructor(propConfig: PropConfig) {
        this.propConfig = propConfig
    }
}