/*
 * Copyright 2022 Dan Lyu.
 */

import State, {createState} from "../state/State";

export function useSnackbar(){
    return new SnackbarContext()
}

export default class SnackbarContext {
    private snackbarMessageState: State<string> = createState('')

    public get snackbarState(): State<string> {
        return this.snackbarMessageState
    }

    public get snackbar() {
        return this.snackbarMessageState.get()
    }

    public set snackbar(message: string) {
        this.snackbarMessageState.set(message, true)
    }
}