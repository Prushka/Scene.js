/*
 * Copyright 2022 Dan Lyu.
 */

import State, {createState} from "../state/State";

export function useOverlay() {
    return new OverlayContext()
}

export default class OverlayContext {
    public overlayOpenState: State<boolean> = createState(false)
    public overlayHTMLState: State<string> = createState('')

    public get overlayHTML() {
        return this.overlayHTMLState.get()
    }

    public get overlayOpen() {
        return this.overlayOpenState.get()
    }

    public close() {
        this.overlayOpenState.set(false)
    }

    public openWith(content: string) {
        this.overlayOpenState.set(true)
        this.overlayHTMLState.set(content)
    }
}