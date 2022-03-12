
/*
 * Copyright 2022 Dan Lyu.
 */

export abstract class CustomComponent {
    abstract render(): string | string[]
    abstract afterRender()
}