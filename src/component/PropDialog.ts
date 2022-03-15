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
        const toggle = (e) => {
            const [id] = this.context.extractIdType(e.target.id)
            console.log(e.target.id)
            this.context.toggleSelected(id)
        }
        $('.prop__dialog__close').on("click", (e) => {
            toggle(e)
        })
        $('.prop__dialog').on("click", (e) => {
            this.context.selected = null
        })
        $('.prop__dialog--popup').on("click", (e)=>{
            e.stopPropagation()
        })
    }

    render(): string | string[] {
        const selectedProp = this.context.selected
        if (selectedProp) {
            const isPopup = this.context.config.dialog === 'popup'
            return `${isPopup && '<div class="prop__dialog">'}<div class="prop__dialog--${isPopup ? 'popup' : 'embedded'}">
                            <div class="header"><i id="${this.context.getId(selectedProp, 'prop', 'dialog', 'property')}" class="bi bi-x pointer prop__dialog__close"></i></div>
                            
                            <div class="content">
                            
                            </div>
                            <div class="footer"><i id="${this.context.getId(selectedProp, 'prop', 'dialog', 'property', 'icon')}" class="${PropTypeIcons[selectedProp.type][selectedProp.iconStyle][this.context.isPropEnabled(selectedProp) ? 'enabled' : 'disabled']}"></i> <span>${selectedProp.name}</span></div>
                            </div>${isPopup && '</div>'}`
        }
        return ""
    }

    listen(): State<any>[] {
        return [this.context.selectedState, this.context.props];
    }
}