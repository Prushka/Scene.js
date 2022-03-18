/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State, {createState, StateAction} from "../state/State";
import {createIconFontElement} from "../utils/Utils";

export class PropList extends SceneComponent {

    // prop is not a property, it's the prop used in a scene
    open: State<boolean>

    afterConstructor() {
        this.open = createState(true)
    }

    listen() {
        return [this.ctx.propsState]
    }

    actions(): StateAction<any>[] {
        return [[this.open, (_, open) => {
            const container = this.ctx.getRootDocument().querySelector('.prop__list-container')
            const icon = this.ctx.getRootDocument().querySelector('.hide__icon-rotate-container')
            if (open) {
                container.classList.remove("prop__list-container--closed")
                icon.classList.remove("icon-animated-right")
                icon.classList.add("icon-animated-left")
            } else {
                container.classList.add("prop__list-container--closed")
                icon.classList.remove("icon-animated-left")
                icon.classList.add("icon-animated-right")
            }
        }], [this.ctx.selectedState, (_, selected) => {
            const listItemContainer = document.getElementById(this.ctx.getId(selected, 'prop', 'list'))
            this.ctx.propsState.get().forEach(prop => {
                const listItemContainer = document.getElementById(this.ctx.getId(prop, 'prop', 'list'))
                if(listItemContainer){
                    listItemContainer.classList.add("prop__list__item--not-selected")
                    listItemContainer.classList.remove("prop__list__item--selected")
                    listItemContainer.querySelector("span").style.color = prop.color
                    listItemContainer.querySelector("path").style.fill = prop.color
                }
            })
            if(listItemContainer){
                listItemContainer.classList.remove("prop__list__item--not-selected")
                listItemContainer.classList.add("prop__list__item--selected")
                listItemContainer.querySelector("span").style.color = "white"
                listItemContainer.querySelector("path").style.fill = "white"
            }
        }]]
    }

    renderIn() {
        return [this.getRootId("prop__list")]
    }

    afterRender() {
        this.open.set(this.ctx.config.defaultOpenPropList)
        this.ctx.$('.prop__list__item').on("click", (e) => {
            const [id] = this.ctx.extractIdType(e.target.id)
            this.ctx.toggleSelected(id)
        })
        this.ctx.$('#' + this.ctx.getIdType("prop", "list", "hide")).on("click", () => {
            this.open.set(!this.open.get())
        })
    }

    render(): string | string[] {
        const parentContainer = document.createElement('div')
        parentContainer.classList.add('prop__list')

        const hideIconContainer = document.createElement('div')
        hideIconContainer.id = this.ctx.getIdType("prop", "list", "hide")
        const hideIconRotateContainer = document.createElement('div')
        hideIconRotateContainer.classList.add("icon-animated-left", "hide__icon-rotate-container")
        const hideIcon = createIconFontElement(this.ctx.getIdType("prop", "list", "hide", "icon"),
            "bi", "bi-arrow-bar-left")

        hideIconRotateContainer.append(hideIcon)
        hideIconContainer.append(hideIconRotateContainer)
        hideIconContainer.classList.add('hide__icon-container', 'pointer')
        this.ctx.propsState.get().forEach(prop => {
            const isSelected = this.ctx.propSelected(prop)
            const color = isSelected ? "white" : prop.color
            const listItemContainer = document.createElement('div')
            listItemContainer.id = this.ctx.getId(prop, 'prop', 'list')
            listItemContainer.classList.add("pointer", "prop__list__item", this.ctx.propSelected(prop) ? "prop__list__item--selected" : "prop__list__item--not-selected")
            const propIcon = this.ctx.getPropSVG(prop, color, 1.3)
            propIcon.id = this.ctx.getId(prop, 'prop', 'list', 'icon')
            const propText = this.ctx.getPropSpanText(prop, color)
            propText.id = this.ctx.getId(prop, 'prop', 'list', 'title')
            listItemContainer.append(propIcon, propText)
            parentContainer.append(listItemContainer)
        })

        return parentContainer.outerHTML + hideIconContainer.outerHTML
    }
}