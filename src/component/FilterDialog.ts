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
        }, (previousValue, value) => {
            this.renderFilteredProps()
            if (previousValue !== value) {
                const input = document.getElementById(this.ids.PROP_SEARCH_INPUT)
                if (input) {
                    input['value'] = value
                }
            }
        }]]
    }

    renderInIds() {
        return [this.ids.OVERLAY]
    }

    afterRender() {
        this.renderFilteredProps()
        const propCtx = this.propCtx
        this.scene.$$('.list__items__item').forEach(el => el.addEventListener('click', (e) => {
            const [_, types] = this.idCtx.extractIdType((e.currentTarget as HTMLElement).id, ...IdTypes.PROP_TYPE_TOGGLE)
            if (types && types.length > 0) {
                this.propCtx.toggleSelectedPropType(types[0])
            }
        }))
        this.scene.idOn(this.ids.PROP_SEARCH_INPUT, 'input', (e) => {
            propCtx.searchValue = (e.target as HTMLInputElement).value
        })
        this.scene.idOn(this.ids.PROP_FILTER_DIALOG_SELECT_ALL, 'click', () => {
            propCtx.selectAllPropTypes()
        })
        this.scene.idOn(this.ids.PROP_FILTER_DIALOG_DESELECT_ALL, 'click', () => {
            propCtx.deselectAllPropTypes()
        })
        this.scene.idOn(this.ids.PROP_FILTER_DIALOG_CLEAR_TEXTFIELD, 'click', () => {
            propCtx.searchValue = ''
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
        if (propListContainer) {
            propListContainer.innerHTML = temp.innerHTML
        }
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

        const createButton = (text: string, id: string) => {
            const button = document.createElement('div')
            button.classList.add('search__container__button')
            button.innerText = text
            button.id = id
            return button
        }

        const searchContainer = document.createElement('div')
        searchContainer.classList.add('search__container')
        const searchTextField = document.createElement('div')
        searchTextField.classList.add('textfield')

        const searchTextFieldHeader = document.createElement('div')
        searchTextFieldHeader.classList.add('textfield__header')

        const label = FilterDialog.createTitle('Search Prop Name')

        const clearTextField = FilterDialog.createTitle('Clear')
        clearTextField.classList.add('textfield__action')
        clearTextField.id = this.ids.PROP_FILTER_DIALOG_CLEAR_TEXTFIELD

        searchTextFieldHeader.append(label, clearTextField)

        const input = document.createElement('input')
        input.classList.add('input__box', 'textfield__input')
        input.setAttribute('value', this.propCtx.searchValue)
        input.id = this.ids.PROP_SEARCH_INPUT
        searchTextField.append(searchTextFieldHeader, input)

        const selectAllPropTypesButton = createButton('Select All Props', this.ids.PROP_FILTER_DIALOG_SELECT_ALL)
        const deselectAllPropTypesButton = createButton('Deselect All Props', this.ids.PROP_FILTER_DIALOG_DESELECT_ALL)

        searchContainer.append(searchTextField, selectAllPropTypesButton, deselectAllPropTypesButton)

        filterPropsByTypeContainer.append(FilterDialog.createTitle('Select Prop Types'), typeListContainer)


        const filteredPropsContainer = document.createElement('div')
        filteredPropsContainer.classList.add('input__box')
        const propListContainer = FilterDialog.createListContainer()
        propListContainer.id = this.ids.PROP_FILTERED_LIST
        filteredPropsContainer.append(FilterDialog.createTitle('Filtered Props'), propListContainer)

        content.append(searchContainer, filterPropsByTypeContainer, filteredPropsContainer)
        return createDialog('Filter Props', content)
    }
}