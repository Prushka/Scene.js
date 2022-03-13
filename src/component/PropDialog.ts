/*
 * Copyright 2022 Dan Lyu.
 */

import {CustomComponent} from "./Component";
import {PropConfig, PropTypeIcons} from "../props/Props";
import State from "../state/State";
import {extractIdType} from "../utils/Utils";

export class PropDialog extends CustomComponent {

    // prop is not a property, it's the prop used in a scene
    private props: State<PropConfig[]>;
    private selected: State<PropConfig>;
    private readonly toggleSelected;
    private readonly isPropEnabled;

    public constructor(selected, toggleSelected, isPropEnabled) {
        super()
        this.selected = selected
        this.toggleSelected = toggleSelected
        this.isPropEnabled = isPropEnabled
        this.mount()
    }

    subscribe() {
        return [".prop__property-container"]
    }

    afterRender() {
        $('.prop__property-dialog__close').on("click", (e) => {
            const [id] = extractIdType(e.target.id)
            console.log(e.target.id)
            this.toggleSelected(id)
        })
    }

    render(): string | string[] {
        const selected = this.selected.get()
        if (selected) {
            return `<div class="prop__property-dialog">
                            <div class="prop__property-dialog__header"><i id="prop-property-dialog-${selected.propId}" class="bi bi-x pointer prop__property-dialog__close"></i></div>
                            <div class="prop__property-dialog__footer"><i id='prop-property-dialog-icon-${selected.propId}' class="${PropTypeIcons[selected.type][selected.iconStyle][this.isPropEnabled(selected) ? 'enabled' : 'disabled']}"></i> <span>${selected.name}</span></div>
                            </div>`
        }
        return ""
    }
}