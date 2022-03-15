/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State, {createState, StateAction} from "../state/State";

export class PropList extends SceneComponent {

    // prop is not a property, it's the prop used in a scene
    open: State<boolean>

    afterConstructor() {
        this.open = createState(true)
    }

    listen() {
        return [this.context.selectedState, this.context.props]
    }

    actions(): StateAction<any>[] {
        return [[this.open, (oldValue, newValue) => {
            if (newValue) {
                $('.prop__list-container').removeClass("prop__list-container--closed")
            } else {
                $('.prop__list-container').addClass("prop__list-container--closed")
            }
        }]]
    }

    subscribe() {
        return [".prop__list-container"]
    }

    afterRender() {
        $('.prop__list__item').on("click", (e) => {
            const [id] = this.context.extractIdType(e.target.id)
            this.context.toggleSelected(id)
        })
        $("#" + this.context.getId(0, "prop", "list", "hide")).on("click", (e) => {
            console.log(e.target.id)
            this.open.set(!this.open.get())
        })
    }

    render(): string | string[] {
        const parentContainer = document.createElement('div')
        parentContainer.classList.add('prop__list')

        const hideIconContainer = document.createElement('div')
        hideIconContainer.id = this.context.getId(0, "prop", "list", "hide")
        const hideIcon = document.createElement('i')
        hideIcon.id = this.context.getId(0, "prop", "list", "hide", "icon")
        hideIcon.classList.add("bi", "bi-arrow-bar-left")
        hideIconContainer.append(hideIcon)
        hideIconContainer.classList.add('hide__icon-container', 'pointer')
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