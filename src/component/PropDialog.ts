/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State, {createState, StateAction} from "../state/State";
import {ExcludeKeys} from "../props/Props";
import {camelToDisplay, createSpan, positionToDisplay} from "../utils/Utils";

enum Tab {
    IMAGES = "IMAGES",
    GENERAL = "GENERAL",
    STEPS = "STEPS",
    SCRIPTS = "SCRIPTS"
}

export class PropDialog extends SceneComponent {

    // prop is not a property, it's the prop used in a scene

    selectedTab: State<Tab>

    afterConstructor() {
        this.selectedTab = createState(Tab.GENERAL)
    }

    listen(): State<any>[] {
        return [this.context.selectedState, this.context.props, this.context.ctx.currentFrameState,
        this.selectedTab];
    }

    subscribe() {
        return [".prop__property-container"]
    }

    actions(): StateAction<any>[] {
        return [[this.context.selectedState, ()=>{
            this.selectedTab.set(Tab.GENERAL)
        }]]
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
        $('.header span').on("click", (e) => {
            this.selectedTab.set(Tab[this.context.extractIdType(e.target.id)[1][1] as keyof typeof Tab])
        })
    }

    private createContent(title, contentHTML) {
        const titleElement = document.createElement("div")
        titleElement.classList.add("title")
        titleElement.innerText = title
        return titleElement.outerHTML + contentHTML
    }

    render(): string | string[] {
        const selectedProp = this.context.selected
        if (selectedProp) {
            const isPopup = this.context.config.dialog === 'popup'
            const parentContainer = document.createElement('div')
            if (isPopup) {
                parentContainer.classList.add("prop__dialog")
            }
            const container = document.createElement('div')
            container.classList.add(`prop__dialog--${isPopup ? 'popup' : 'embedded'}`)
            parentContainer.appendChild(container)
            const header = document.createElement('div')
            header.classList.add('header')

            const createTitleButton = (id, title, ...classNames) => {
                const button = document.createElement('span')
                button.title = title
                button.classList.add(...classNames)
                button.id = this.context.getIdType("dialog", id)
                button.classList.add(this.selectedTab.get() === id?"header__button--selected":"header__button--not-selected")
                return button
            }

            const position = this.context.getPropPositionByCurrentFrame(selectedProp)
            const positionDisplay = positionToDisplay(position)
            header.append(createTitleButton(Tab.GENERAL, "General Info", "bi", "bi-boxes"),
                createTitleButton(Tab.SCRIPTS, "Scripts", "bi", "bi-journal-bookmark-fill"),
                createTitleButton(Tab.IMAGES, "Images", "bi", "bi-image-fill"),
                createTitleButton(Tab.STEPS, "Steps", "bi", "bi-123"))

            const content = document.createElement('div')
            content.classList.add("content")

            switch (this.selectedTab.get()){
                case Tab.GENERAL:
                    for (let key in selectedProp) {
                        if (!ExcludeKeys.includes(key)) {
                            const span = document.createElement('span')
                            span.innerHTML = `${camelToDisplay(key)}: ${selectedProp[key]}`
                            content.append(span)
                        }
                    }
                    break
                case Tab.SCRIPTS:
                    if(selectedProp.note){
                        const span = document.createElement('span')
                        span.innerText = selectedProp.note
                        content.append(span)
                    }
                    break
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

            const positionText = createSpan(`(${positionDisplay.x}, ${positionDisplay.y}, ${positionDisplay.degree}°)`, selectedProp.color)
            const scaleText = createSpan(`(${positionDisplay.scaleX}x, ${positionDisplay.scaleY}x)`, selectedProp.color)
            footer.append(propIcon, propText, positionText, scaleText)
            container.append(header, content, footer)
            return parentContainer.outerHTML
        }
        return ""
    }
}