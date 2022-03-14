/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import {AnimationConfig, PropTypeIcons} from "../props/Props";
import State, {createState} from "../state/State";

export class View extends SceneComponent {

    mouseX: number
    mouseY: number
    dragging: boolean

    listen(): State<any>[] {
        return [this.context.props, this.context.ctx.currentFrameState]
    }

    subscribe() {
        return [".view-container"]
    }

    afterRender() {
        console.log("Reset")
        this.mouseX = this.mouseY = 0
        this.dragging = false

        const stopDragging = (e) => {
            if (this.dragging) {
                e.preventDefault()
                this.dragging = false
                const previous = this.context.viewportOffset
                this.context.viewportOffset = {
                    x: e.clientX - this.mouseX + previous.x,
                    y: this.mouseY - e.clientY + previous.y
                }
                $('.view-container').css('cursor', 'unset')
            }
        }
        $('.view__prop').on("dragstart", (e) => {
            console.log(e)
        })
        $('.view-container').on("mousedown", (e) => {
            e.preventDefault()
            this.mouseX = e.clientX
            this.mouseY = e.clientY
            this.dragging = true
            $('.view-container').css('cursor', 'grabbing')
        }).on("mousemove", (e) => {
            e.preventDefault()
            if (this.dragging) {
                this.context.props.get().forEach(prop => {
                    const position: AnimationConfig = this.context.getPropPosition(prop)
                    if (position) {
                        $(`#view-prop-${prop.propId}`).css("left", position.x + e.clientX - this.mouseX)
                            .css("bottom", position.y + this.mouseY - e.clientY)
                    }
                })
            }
        }).on("mouseup mouseleave", (e) => {
            stopDragging(e)
        }).on('wheel', (e) => {
            const deltaY = (<WheelEvent>e.originalEvent).deltaY
            if (deltaY < 0) { // zoom in

            } else { // zoom out

            }
        })
    }

    render(): string | string[] {
        const props = this.context.props.get()
        return props.map(prop => {
            const position: AnimationConfig = this.context.getPropPosition(prop)
            return position && `<div class="view__prop" id="view-prop-${prop.propId}" style="left:${position.x}px;bottom: ${position.y}px;transform: rotate(${position.degree}deg);">
                    <i id='prop-icon-${prop.propId}' class="${PropTypeIcons[prop.type][prop.iconStyle][this.context.isPropEnabled(prop) ? 'enabled' : 'disabled']}"></i>
                    </div>`
        }).join('')
    }
}