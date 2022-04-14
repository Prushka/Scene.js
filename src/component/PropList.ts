/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State, {createState, StateAction} from "../state/State";
import {createDialog, createIconFontElement} from "../utils/Utils";
import {IdTypes} from "../context/IdContext";
import {FilterDialog} from "./FilterDialog";

export class PropList extends SceneComponent {

    // prop is not a property, it's the prop used in a scene
    open: State<boolean>

    afterConstructor() {
        this.open = createState(true)
    }

    listen() {
        return [this.propCtx.propsState, this.propCtx.selectedPropTypesState,
            this.propCtx.searchPropValueState]
    }

    actions(): StateAction<any>[] {
        return [[this.open, (_, open) => {
            const container = this.scene.getRootDocument().querySelector('.prop__list-container')
            const icon = this.scene.getRootDocument().querySelector('.hide__icon-rotate-container')
            if (open) {
                container.classList.remove("prop__list-container--closed")
                icon.classList.remove("icon-animated-right")
                icon.classList.add("icon-animated-left")
            } else {
                container.classList.add("prop__list-container--closed")
                icon.classList.remove("icon-animated-left")
                icon.classList.add("icon-animated-right")
            }
        }], [this.propCtx.selectedPropState, (_, selected) => {
            const listItemContainer = document.getElementById(this.idCtx.PROP_LIST(selected))
            this.propCtx.props.forEach(prop => {
                const listItemContainer = document.getElementById(this.idCtx.PROP_LIST(prop))
                if (listItemContainer) {
                    listItemContainer.classList.add("prop__list__item--not-selected")
                    listItemContainer.classList.remove("prop__list__item--selected")
                    listItemContainer.querySelector("span").style.color = prop.color
                    listItemContainer.querySelectorAll("path").forEach(c => {
                        c.style.fill = prop.color
                    })
                }
            })
            if (listItemContainer) {
                listItemContainer.classList.remove("prop__list__item--not-selected")
                listItemContainer.classList.add("prop__list__item--selected")
                listItemContainer.querySelector("span").style.color = "var(--scene-base)"
                listItemContainer.querySelectorAll("path").forEach(c => {
                    c.style.fill = "var(--scene-base)"
                })
            }
        }]]
    }

    renderInIds() {
        return [this.ids.ROOT_PROP_LIST]
    }

    afterRender() {
        let filterDialog
        this.open.set(this.scene.config.defaultOpenPropList)

        const openFilterDialog = () => {
            this.overlayCtx.openWith(``)
            filterDialog = new FilterDialog(this.scene)
            filterDialog.renderComponent()
        }
        this.scene.$$('.prop__list__item').forEach(el => el.addEventListener("click", (e) => {
            const [id] = this.idCtx.extractIdType((e.currentTarget as HTMLElement).id)
            this.propCtx.toggleSelected(id)
        }))
        this.scene.idOn(this.ids.PROP_LIST_HIDE, "click", () => {
            this.open.set(!this.open.get())
        })
        this.scene.idOn(this.ids.PROP_LIST_DIALOG_BUTTON, "click", () => {
            openFilterDialog()
        })
        this.scene.idOn(this.ids.PROP_LIST_RESET_BUTTON, "click", () => {
            if (filterDialog) {
                filterDialog.unmount()
            }
            this.propCtx.resetFilter()
        })
    }

    render(): string | string[] {
        const propColumnContainer = document.createElement('div')
        propColumnContainer.classList.add('prop__column')
        const parentContainer = document.createElement('div')
        parentContainer.classList.add('prop__list')


        const createButton = (text, id, ...iconClasses: string[]) => {
            const button = document.createElement('div')
            button.classList.add('prop__list__action__button')
            button.id = id
            const buttonText = document.createElement('span')
            buttonText.innerText = text

            const icon = document.createElement('span')
            icon.classList.add(...iconClasses, 'prop__list__action__button__icon')

            button.append(buttonText, icon)
            return button
        }
        const dialogButton = createButton('Filter', this.ids.PROP_LIST_DIALOG_BUTTON, 'bi', 'bi-search')
        const resetButton = createButton('Reset', this.ids.PROP_LIST_RESET_BUTTON, 'bi', 'bi-arrow-clockwise')

        const buttonGroup = document.createElement('div')
        buttonGroup.classList.add('prop__list__action__container')

        buttonGroup.append(dialogButton, resetButton)
        propColumnContainer.append(buttonGroup)

        propColumnContainer.append(parentContainer)

        const hideIconContainer = document.createElement('div')
        hideIconContainer.id = this.ids.PROP_LIST_HIDE
        const hideIconRotateContainer = document.createElement('div')
        hideIconRotateContainer.classList.add("icon-animated-left", "hide__icon-rotate-container")
        const hideIcon = createIconFontElement(this.ids.PROP_LIST_HIDE_ICON,
            "bi", "bi-arrow-bar-left")

        hideIconRotateContainer.append(hideIcon)
        hideIconContainer.append(hideIconRotateContainer)
        hideIconContainer.classList.add('hide__icon-container', 'pointer')
        this.propCtx.filteredProps.forEach(prop => {
            const isSelected = this.propCtx.isPropSelected(prop)
            const color = isSelected ? "var(--scene-base)" : prop.color
            const listItemContainer = document.createElement('div')
            listItemContainer.id = this.idCtx.PROP_LIST(prop)
            listItemContainer.classList.add("pointer", "prop__list__item", this.propCtx.isPropSelected(prop) ? "prop__list__item--selected" : "prop__list__item--not-selected")
            const propIcon = this.propCtx.getPropSVG(prop, color, 1.3)
            const propText = this.propCtx.getPropSpanText(prop, color)
            listItemContainer.append(propIcon, propText)
            parentContainer.append(listItemContainer)
        })

        return propColumnContainer.outerHTML + hideIconContainer.outerHTML
    }
}