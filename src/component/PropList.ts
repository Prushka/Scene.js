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
            const [id] = this.context.extractIdType(e.target.id)
            this.context.toggleSelected(id)
        })
    }

    render(): string | string[] {
        const parentContainer = document.createElement('div')
        parentContainer.classList.add('prop__list')

        const hideIconContainer = document.createElement('div')
        const hideIcon = document.createElement('i')
        hideIcon.id = "prop__list__hide"
        hideIcon.classList.add("bi", "bi-arrow-bar-left")
        hideIconContainer.append(hideIcon)
        hideIconContainer.classList.add('hide__icon-container')
        this.context.props.get().forEach(prop => {
            const isSelected = this.context.propSelected(prop)
            const color = isSelected ? "white" : prop.color
            const listItemContainer = document.createElement('div')
            listItemContainer.id = this.context.getId(prop, 'prop', 'list')
            listItemContainer.classList.add("pointer", "prop__list__item", this.context.propSelected(prop) ? "prop__list__item--selected" : "prop__list__item--not-selected")
            const propIcon = this.context.getPropSVG(prop, color, 1.3)
            propIcon.id = this.context.getId(prop, 'prop', 'list', 'icon')
            const propText = this.context.getPropSpanText(prop, color)
            propText.id = this.context.getId(prop, 'prop', 'list', 'title')
            listItemContainer.append(propIcon, propText)
            parentContainer.append(listItemContainer)
        })

        return parentContainer.outerHTML + hideIconContainer.outerHTML
    }
}