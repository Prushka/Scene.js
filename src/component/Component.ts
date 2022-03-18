/*
 * Copyright 2022 Dan Lyu.
 */

import State, {StateAction} from "../state/State";
import {Context} from "../index";
import SnackbarContext from "../context/SnackbarContext";
import OverlayContext from "../context/OverlayContext";
import ViewPortContext from "../context/ViewPortContext";
import TimeContext from "../context/TimeContext";
import {IdContext, useId} from "../context/IdContext";


export abstract class CustomComponent {

    protected hookedComponents: { [key: string]: CustomComponent }

    abstract render(): string | string[] | Node

    abstract afterRender(): void

    mount() {
        // listen will trigger render on every state update
        this.listen().forEach(s => {
            s.subscribe(this)
        })
        // action will trigger the action function on the specified state update
        this.actions().forEach(([state, func]) => {
            if (func) {
                state.subscribeActions(this, func)
            }
        })
    }

    listen(): State<any>[] {
        return []
    }

    renderComponent() {

        this.renderInIds().forEach(elementId => {
            const el: string | string[] | Node = this.render()
            const parent = document.getElementById(elementId)
            if (Array.isArray(el)) {
                parent.innerHTML = el.join('')
            } else if (typeof el === 'string') {
                parent.innerHTML = el
            } else {
                parent.append(el)
            }

        })
        this.afterRender()
    }

    actions(): StateAction<any>[] {
        return []
    }

    renderInIds(): string[] {
        return [];
    }

    afterConstructor() {
    }

    hook(key: string, c: CustomComponent) {
        this.hookedComponents[key] = c
    }
}

export abstract class SceneComponent extends CustomComponent {
    protected ctx: Context
    protected snackbarCtx: SnackbarContext
    protected overlayCtx: OverlayContext
    protected getViewportCtx: () => ViewPortContext
    protected getTimeCtx: () => TimeContext
    protected readonly ids
    protected readonly idCtx

    public constructor(context: Context) {
        super();
        this.ctx = context;
        [this.ids, this.idCtx] = [this.ctx.ids, this.ctx.idContext]
        this.snackbarCtx = this.ctx.snackbarCtx
        this.overlayCtx = this.ctx.overlayCtx
        this.getViewportCtx = this.ctx.getViewportGetter()
        this.getTimeCtx = this.ctx.getTimeContextGetter()

        this.afterConstructor()
        this.mount()
    }
}