/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import {PropTypeIcons} from "../props/Props";

export class PropList extends SceneComponent {

    // prop is not a property, it's the prop used in a scene

    listen() {
        return [this.context.selectedState, this.context.props]
    }

    subscribe() {
        return [".prop__list-container"]
    }

    afterRender() {
        $('.prop__list__item').on("click", (e) => {
            console.log(this.context.extractIdType(e.target.id))
            const [id] = this.context.extractIdType(e.target.id)
            this.context.toggleSelected(id)
        })
    }

    render(): string | string[] {
        return this.context.props.get().map(prop => {
            return `<div id="${this.context.getId(prop, 'prop', 'list')}" class='pointer prop__list__item  ${this.context.propSelected(prop) ? "prop__list__item--selected" : "prop__list__item--not-selected"}'>
                    <i id="${this.context.getId(prop, 'prop', 'list', 'icon')}" class="${PropTypeIcons[prop.type][prop.iconStyle][this.context.isPropEnabled(prop) ? 'enabled' : 'disabled']}"></i>
                    <span id="${this.context.getId(prop, 'prop', 'list', 'title')}">${prop.name}</span>
                    </div>`
        })
    }
}