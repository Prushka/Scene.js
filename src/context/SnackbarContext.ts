/*
 * Copyright 2022 Dan Lyu.
 */

import State, {createState} from "../state/State";

export function useSnackbar(){
    return new SnackbarContext()
}

export default class SnackbarContext {
    private snackbarMessageState: State<string> = createState('')
    private error: boolean = false

    public get isError(){
        return this.error
    }

    public get snackbarState(): State<string> {
        return this.snackbarMessageState
    }

    public snackbar(message: string, isError: boolean = false) {
        this.error = isError
        this.snackbarMessageState.set(message, true)
    }
}