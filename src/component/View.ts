/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import {AnimationConfig, PropTypeIcons} from "../props/Props";
import State, {createState} from "../state/State";

export class View extends SceneComponent {

    mouseX: number = 0
    mouseY: number = 0
    dragging: boolean = false
    stopDragging = (e) => {
        if(this.dragging) {
            e.preventDefault()
            this.dragging = false
            const previous = this.context.viewPortOffset.get()
            this.context.viewPortOffset.set({
                x: e.clientX - this.mouseX + previous.x,
                y: this.mouseY - e.clientY + previous.y
            })
            console.log(this.context.viewPortOffset.get())
        }
    }

    listen(): State<any>[] {
        return [this.context.props]
    }

    subscribe() {
        return [".view-container"]
    }

    afterRender() {
        $('.view__prop').on("dragstart", (e) => {
            console.log(e)
        })
        $('.view-container').on("mousedown", (e) => {
            e.preventDefault()
            this.mouseX = e.clientX
            this.mouseY = e.clientY
            this.dragging = true
        }).on("mousemove", (e) => {
            e.preventDefault()
            if (this.dragging) {
                this.context.props.get().forEach(prop => {
                    const position: AnimationConfig = this.context.getPropPosition(prop)
                    $(`#view-prop-${prop.propId}`).css("left", position.x + e.clientX - this.mouseX + this.context.viewPortOffset.get().x)
                        .css("bottom", position.y + this.context.viewPortOffset.get().y + this.mouseY - e.clientY)
                })
            }
        }).on("mouseup", (e) => {
            this.stopDragging(e)
        }).on("mouseleave", (e) => {
            this.stopDragging(e)
        })
    }

    render(): string | string[] {
        const props = this.context.props.get()
        return props.map(prop => {
            const position: AnimationConfig = this.context.getPropPosition(prop)
            return `<div class="view__prop" id="view-prop-${prop.propId}" style="left:${position.x}px;bottom: ${position.y}px">
                    <i id='prop-icon-${prop.propId}' class="${PropTypeIcons[prop.type][prop.iconStyle][this.context.isPropEnabled(prop) ? 'enabled' : 'disabled']}"></i>
                    </div>`
        })
    }
}