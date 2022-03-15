/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import {PropTypeIcons} from "../props/Props";
import {createSVGIcon} from "../utils/Utils";

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
            const container = document.createElement('div')
            container.id = this.context.getId(prop, 'prop', 'list')
            container.classList.add("pointer", "prop__list__item",  this.context.propSelected(prop) ? "prop__list__item--selected" : "prop__list__item--not-selected")
            const propIcon = this.context.getPropSVG(prop, 1.3)
            propIcon.id = this.context.getId(prop, 'prop', 'list', 'icon')
            const propText = this.context.getPropSpanText(prop)
            propText.id = this.context.getId(prop, 'prop', 'list', 'title')
            container.append(propIcon)
            container.append(propText)
            return container.outerHTML
        })
    }
}