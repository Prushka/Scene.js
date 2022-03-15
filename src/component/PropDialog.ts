/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State from "../state/State";
import {ExcludeKeys} from "../props/Props";

export class PropDialog extends SceneComponent {

    // prop is not a property, it's the prop used in a scene

    subscribe() {
        return [".prop__property-container"]
    }

    afterRender() {
        const toggle = (e) => {
            const [id] = this.context.extractIdType(e.target.id)
            this.context.toggleSelected(id)
        }
        $('.prop__dialog__close').on("click", (e) => {
            toggle(e)
        })
        $('.prop__dialog').on("click", (e) => {
            this.context.selected = null
        })
        $('.prop__dialog--popup').on("click", (e) => {
            e.stopPropagation()
        })
    }

    render(): string | string[] {
        const selectedProp = this.context.selected
        if (selectedProp) {
            const isPopup = this.context.config.dialog === 'popup'
            const parentContainer = document.createElement('div')
            if(isPopup){
                parentContainer.classList.add("prop__dialog")
            }
            const container = document.createElement('div')
            container.classList.add(`prop__dialog--${isPopup ? 'popup' : 'embedded'}`)
            parentContainer.appendChild(container)
            const header = document.createElement('div')
            header.classList.add('header')

            const titleSpan = document.createElement('span')
            const position = this.context.getPropPositionByCurrentFrame(selectedProp)
            titleSpan.innerText = `Position: ${position.x}, ${position.y}, ${position.degree}° | Scale: ${position.scaleX}, ${position.scaleY}`
            header.append(titleSpan)

            const content = document.createElement('div')
            content.classList.add("content")
            for(let key in selectedProp){
                if(!ExcludeKeys.includes(key)){
                    const span = document.createElement('span')
                    span.innerHTML = `${key}: ${selectedProp[key]}`
                    content.append(span)
                }
            }
            if(selectedProp.note){
                const span = document.createElement('span')
                span.innerText = selectedProp.note
                content.append(span)
            }

            const footer = document.createElement('div')
            footer.classList.add('footer')
            const headerCloseIcon = document.createElement('i')
            headerCloseIcon.id = this.context.getId(selectedProp, 'prop', 'dialog', 'property')
            headerCloseIcon.classList.add("bi", "bi-x", "pointer", "prop__dialog__close")
            header.appendChild(headerCloseIcon)

            const propIcon = this.context.getPropSVG(selectedProp)
            propIcon.id = this.context.getId(selectedProp, 'prop', 'dialog', 'property', 'icon')
            const propText = document.createElement("span")
            propText.innerText = selectedProp.name
            propText.style.color = selectedProp.color

            footer.append(propIcon, propText)
            container.append(header, content, footer)
            return parentContainer.outerHTML
        }
        return ""
    }

    listen(): State<any>[] {
        return [this.context.selectedState, this.context.props];
    }
}