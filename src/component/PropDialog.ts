/*
 * Copyright 2022 Dan Lyu.
 */

import {CustomComponent, SceneComponent} from "./Component";
import {PropConfig, PropTypeIcons} from "../props/Props";
import State from "../state/State";
import {extractIdType} from "../utils/Utils";

export class PropDialog extends SceneComponent {

    // prop is not a property, it's the prop used in a scene

    subscribe() {
        return [".prop__property-container"]
    }

    afterRender() {
        $('.prop__property-dialog__close').on("click", (e) => {
            const [id] = extractIdType(e.target.id)
            console.log(e.target.id)
            this.context.toggleSelected(id)
        })
    }

    render(): string | string[] {
        const selected = this.context.selected.get()
        if (selected) {
            return `<div class="prop__property-dialog">
                            <div class="prop__property-dialog__header"><i id="prop-property-dialog-${selected.propId}" class="bi bi-x pointer prop__property-dialog__close"></i></div>
                            <div class="prop__property-dialog__footer"><i id='prop-property-dialog-icon-${selected.propId}' class="${PropTypeIcons[selected.type][selected.iconStyle][this.context.isPropEnabled(selected) ? 'enabled' : 'disabled']}"></i> <span>${selected.name}</span></div>
                            </div>`
        }
        return ""
    }

    listen(): State<any>[] {
        return [this.context.selected, this.context.props];
    }
}