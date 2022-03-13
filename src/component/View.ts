/*
 * Copyright 2022 Dan Lyu.
 */

import {CustomComponent} from "./Component";
import {AnimationConfig, PropConfig, PropTypeIcons} from "../props/Props";
import State from "../state/State";
import {extractIdType} from "../utils/Utils";

export class View extends CustomComponent {

    private props: State<PropConfig[]>;
    private readonly getPropPosition;
    private readonly isPropEnabled;
    private readonly toggleSelected;

    public constructor(props, getPropPosition, toggleSelected, isPropEnabled) {
        super()
        this.props = props
        this.getPropPosition = getPropPosition
        this.isPropEnabled = isPropEnabled
        this.toggleSelected = toggleSelected
        this.mount()
    }

    subscribe() {
        return [".view-container"]
    }

    afterRender() {
        let mouseX, mouseY
        let dragging: boolean = false
        $('.view__prop').on("dragstart", (e) => {
            console.log(e)
        })
        $('.view-container').on("mousedown", (e) => {
            e.preventDefault()
            mouseX = e.clientX
            mouseY = e.clientY
            dragging = true
        }).on("mousemove", (e) => {
            e.preventDefault()
            if (dragging) {

            }
        }).on("mouseup", (e) => {
            e.preventDefault()
            dragging = false
        })
    }

    render(): string | string[] {
        const props = this.props.get()
        return props.map(prop => {
            const position: AnimationConfig = this.getPropPosition(prop)
            return `<div class="view__prop" style="left:${position.x}px;bottom: ${position.y}px">
                    <i id='prop-icon-${prop.propId}' class="${PropTypeIcons[prop.type][prop.iconStyle][this.isPropEnabled(prop) ? 'enabled' : 'disabled']}"></i>
                    </div>`
        })
    }
}