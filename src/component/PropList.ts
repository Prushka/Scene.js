/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import {PropTypeIcons} from "../props/Props";
import {extractIdType} from "../utils/Utils";

export class PropList extends SceneComponent {

    // prop is not a property, it's the prop used in a scene

    listen() {
        return [this.context.selected, this.context.props]
    }

    subscribe() {
        return [".prop__list-container"]
    }

    afterRender() {
        $('.prop__list__item').on("click", (e) => {
            const [id] = extractIdType(e.target.id)
            this.context.toggleSelected(id)
        })
    }

    render(): string | string[] {
        const selected = this.context.selected.get()
        return this.context.props.get().map(prop => {
            return `<div id='prop-list-${prop.propId}' class='pointer prop__list__item  ${selected === prop ? "prop__list__item--selected" : "prop__list__item--not-selected"}'>
                    <i id='prop-list-icon-${prop.propId}' class="${PropTypeIcons[prop.type][prop.iconStyle][this.context.isPropEnabled(prop) ? 'enabled' : 'disabled']}"></i>
                    <span id='prop-list-text-${prop.propId}'>${prop.name}</span>
                    </div>`
        })
    }
}