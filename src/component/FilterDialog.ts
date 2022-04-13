/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State, {createState, StateAction} from "../state/State";
import {createDialog, createIconFontElement} from "../utils/Utils";
import {IdTypes} from "../context/IdContext";

export class FilterDialog extends SceneComponent {

    listen() {
        return [this.propCtx.propsState, this.propCtx.selectedPropTypesState]
    }

    actions(): StateAction<any>[] {
        return [[this.propCtx.searchPropValueState, () => {
        }, () => {
            this.renderFilteredProps()
        }]]
    }

    renderInIds() {
        return [this.ids.OVERLAY]
    }

    afterRender() {
        this.renderFilteredProps()
        const propCtx = this.propCtx
        this.scene.$('.list__items__item').on('click', (e) => {
            const [_, type] = this.idCtx.extractIdType(e.currentTarget.id, ...IdTypes.PROP_TYPE_TOGGLE)
            if (type && type.length > 0) {
                this.propCtx.toggleSelectedPropType(type[0])
            }
        })
        this.scene.$(`#${this.ids.PROP_SEARCH_INPUT}`).on('input', function (e) {
            propCtx.searchValue = $(this).val().toString()
        })
    }

    private static createTitle(text: string) {
        const title = document.createElement('div')
        title.innerText = text
        title.classList.add('filter__modal__title')
        return title
    }

    private static createListContainer() {
        const filteredProps = document.createElement('div')
        filteredProps.classList.add('list__items')
        return filteredProps
    }

    private renderFilteredProps() {
        const propListContainer = document.getElementById(this.ids.PROP_FILTERED_LIST)
        const temp = document.createElement('div')
        this.propCtx.filteredProps.forEach(prop => {
            const propElement = document.createElement('div')
            propElement.classList.add('list__items__item')
            const span = this.propCtx.getPropSpanText(prop)
            const svg = this.propCtx.getPropSVG(prop, null, 1)
            propElement.append(span, svg)
            temp.append(propElement)
        })
        propListContainer.innerHTML = temp.innerHTML
    }

    render(): string | string[] {


        const content = document.createElement('div')
        content.classList.add('filter__modal__container')

        const filterPropsByTypeContainer = document.createElement('div')
        filterPropsByTypeContainer.classList.add('input__box')
        const typeListContainer = FilterDialog.createListContainer()
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
        const label = FilterDialog.createTitle('Search Prop Name')
        label.classList.add('textfield__label')
        const input = document.createElement('input')
        input.classList.add('input__box', 'textfield__input')
        input.setAttribute('value', this.propCtx.searchValue)
        input.id = this.ids.PROP_SEARCH_INPUT
        searchTextField.append(label, input)


        filterPropsByTypeContainer.append(FilterDialog.createTitle('Select Prop Types'), typeListContainer)


        const filteredPropsContainer = document.createElement('div')
        filteredPropsContainer.classList.add('input__box')
        const propListContainer = FilterDialog.createListContainer()
        propListContainer.id = this.ids.PROP_FILTERED_LIST
        filteredPropsContainer.append(FilterDialog.createTitle('Filtered Props'), propListContainer)

        content.append(searchTextField, filterPropsByTypeContainer, filteredPropsContainer)
        return createDialog('Filter Props', content)
    }
}