/*
 * Copyright 2022 Dan Lyu.
 */

import State, {createState} from "../state/State";

export function useSnackbar() {
    return new SnackbarContext()
}

export default class SnackbarContext {
    private snackbarMessageState: State<string> = createState('')
    private _error: boolean = false

    public get isError() {
        return this._error
    }

    public get snackbarState(): State<string> {
        return this.snackbarMessageState
    }

    public error(message: string) {
        this.snackbar(message, true)
    }

    public success(message: string) {
        this.snackbar(message)
    }

    private snackbar(message: string, isError: boolean = false) {
        this._error = isError
        this.snackbarMessageState.set(message, true)
    }
}