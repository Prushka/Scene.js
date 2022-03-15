/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State, {createState, StateAction} from "../state/State";
import ClickEvent = JQuery.ClickEvent;
import {setClassList} from "../utils/Utils";

export class Snackbar extends SceneComponent {

    actions(): StateAction<any>[] {
        return [[this.context.snackbarState, ((_, message) => {

        })]]
    }

    subscribe() {
        return [".snackbar-container"]
    }

    afterRender() {

    }

    render(): string | string[] {
        return `<div class='snackbar'><span>test message</span></div>`
    }
}