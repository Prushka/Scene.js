/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State, {createState, StateAction} from "../state/State";
import {createDialog, createIconFontElement} from "../utils/Utils";
import {IdTypes} from "../context/IdContext";

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

    private openFilterDialog() {
        const createTitle = (text: string) => {
            const title = document.createElement('div')
            title.innerText = text
            title.classList.add('filter__modal__title')
            return title
        }

        const createListContainer = () => {
            const filteredProps = document.createElement('div')
            filteredProps.classList.add('list__items')
            return filteredProps
        }

        const content = document.createElement('div')
        content.classList.add('filter__modal__container')
        const filteredPropsContainer = document.createElement('div')
        filteredPropsContainer.classList.add('input__box')

        const propListContainer = createListContainer()
        this.propCtx.filteredProps.forEach(prop => {
            const propElement = document.createElement('div')
            propElement.classList.add('list__items__item')
            const span = this.propCtx.getPropSpanText(prop)
            const svg = this.propCtx.getPropSVG(prop, null, 1)
            propElement.append(span, svg)
            propListContainer.append(propElement)
        })

        const filterPropsByTypeContainer = document.createElement('div')
        filterPropsByTypeContainer.classList.add('input__box')
        const typeListContainer = createListContainer()
        this.propCtx.allPropTypes.forEach(type => {
            const propElement = document.createElement('div')
            propElement.classList.add('list__items__item')
            if (this.propCtx.isPropTypeSelected(type)) {
                propElement.classList.add('list__items__item--selected')
            } else {
                propElement.classList.add('list__items__item--not-selected')
            }
            const span = document.createElement('span')
            span.innerText = type
            const svg = this.propCtx.getPropSVG(type, 'white', 1)
            propElement.append(span, svg)
            propElement.id = this.idCtx.PROP_TYPE_TOGGLE(null, type)
            typeListContainer.append(propElement)
        })

        const searchTextField = document.createElement('div')
        searchTextField.classList.add('textfield')
        const label = createTitle('Search Prop Name')
        label.classList.add('textfield__label')
        const input = document.createElement('input')
        input.classList.add('input__box', 'textfield__input')
        input.setAttribute('value', this.propCtx.searchValue)
        console.log(this.propCtx.searchValue)
        input.id = this.ids.PROP_SEARCH_INPUT
        searchTextField.append(label, input)


        filterPropsByTypeContainer.append(createTitle('Select Prop Types'), typeListContainer)
        filteredPropsContainer.append(createTitle('Filtered Props'), propListContainer)

        content.append(searchTextField, filterPropsByTypeContainer, filteredPropsContainer)
        this.overlayCtx.openWith(createDialog('Filter Props', content), () => {
            const propCtx = this.propCtx
            this.scene.$(`#${this.ids.PROP_SEARCH_INPUT}`).focus()
            this.scene.$('.list__items__item').on('click', (e) => {
                const [_, type] = this.idCtx.extractIdType(e.currentTarget.id, ...IdTypes.PROP_TYPE_TOGGLE)
                if (type && type.length > 0) {
                    this.propCtx.toggleSelectedPropType(type[0])
                }
            })
            this.scene.$(`#${this.ids.PROP_SEARCH_INPUT}`).on('input', function (e) {
                propCtx.searchValue = $(this).val().toString()
            })
        })
    }

    afterRender() {
        this.open.set(this.scene.config.defaultOpenPropList)
        this.scene.$('.prop__list__item').on("click", (e) => {
            const [id] = this.idCtx.extractIdType(e.currentTarget.id)
            this.propCtx.toggleSelected(id)
        })
        this.scene.$('#' + this.ids.PROP_LIST_HIDE).on("click", () => {
            this.open.set(!this.open.get())
        })
        this.scene.$('#' + this.ids.PROP_LIST_DIALOG_BUTTON).on("click", () => {
            this.openFilterDialog()
        })
        this.openFilterDialog()
    }

    render(): string | string[] {
        const propColumnContainer = document.createElement('div')
        propColumnContainer.classList.add('prop__column')
        const parentContainer = document.createElement('div')
        parentContainer.classList.add('prop__list')


        const createButton = (text, id) => {
            const button = document.createElement('div')
            button.classList.add('prop__list__bottom__button')
            button.id = id
            const buttonText = document.createElement('span')
            buttonText.innerText = text
            button.append(buttonText)
            return button
        }
        const dialogButton = createButton('Filter', this.ids.PROP_LIST_DIALOG_BUTTON)
        const resetButton = createButton('Reset', this.ids.PROP_LIST_RESET_BUTTON)

        const buttonGroup = document.createElement('div')
        buttonGroup.classList.add('prop__list__bottom__container')

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