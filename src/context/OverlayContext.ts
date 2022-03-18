/*
 * Copyright 2022 Dan Lyu.
 */

import State, {createState} from "../state/State";

export function useOverlay(){
    return new OverlayContext()
}

export default class OverlayContext {
    public overlayOpenState: State<boolean> = createState(false)
    public overlayHTMLState: State<string> = createState('')

}