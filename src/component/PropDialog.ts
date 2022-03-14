/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import {PropTypeIcons} from "../props/Props";
import State from "../state/State";

export class PropDialog extends SceneComponent {

    // prop is not a property, it's the prop used in a scene

    subscribe() {
        return [".prop__property-container"]
    }

    afterRender() {
        $('.prop__property-dialog__close').on("click", (e) => {
            const [id] = this.context.extractIdType(e.target.id)
            console.log(e.target.id)
            this.context.toggleSelected(id)
        })
    }

    render(): string | string[] {
        const selectedProp = this.context.selected.get()
        if (selectedProp) {
            return `<div class="prop__property-dialog">
                            <div class="prop__property-dialog__header"><i id="${this.context.getId(selectedProp, 'prop', 'dialog', 'property')}" class="bi bi-x pointer prop__property-dialog__close"></i></div>
                            <div class="prop__property-dialog__footer"><i id="${this.context.getId(selectedProp, 'prop', 'dialog', 'property', 'icon')}" class="${PropTypeIcons[selectedProp.type][selectedProp.iconStyle][this.context.isPropEnabled(selectedProp) ? 'enabled' : 'disabled']}"></i> <span>${selectedProp.name}</span></div>
                            </div>`
        }
        return ""
    }

    listen(): State<any>[] {
        return [this.context.selected, this.context.props];
    }
}