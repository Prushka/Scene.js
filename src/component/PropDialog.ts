/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State, {createState, StateAction} from "../state/State";
import {ExcludeKeys, ImageConfig} from "../props/Props";
import {camelToDisplay, createSpan, positionToDisplay} from "../utils/Utils";

enum Tab {
    IMAGES = "IMAGES",
    GENERAL = "GENERAL",
    STEPS = "STEPS",
    SCRIPTS = "SCRIPTS"
}

export class PropDialog extends SceneComponent {

    // prop is not a property, it's the prop used in a scene

    selectedTabState: State<Tab>

    afterConstructor() {
        this.selectedTabState = createState(Tab.GENERAL)
    }

    listen(): State<any>[] {
        return [this.context.selectedState, this.context.props, this.context.ctx.currentFrameState,
            this.selectedTabState];
    }

    subscribe() {
        return [".prop__property-container"]
    }

    actions(): StateAction<any>[] {
        return [[this.context.selectedState, () => {
            this.selectedTabState.set(Tab.GENERAL)
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
            this.selectedTabState.set(Tab[this.context.extractIdType(e.target.id)[1][1] as keyof typeof Tab])
        })
        $('.content .image__container img').on("click", (e)=>{
            this.context.overlayOpenState.set(true)
            this.context.overlayHTMLState.set(`<img src='${e.target.getAttribute('src')}' alt=""/>`)
        })
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
                button.classList.add(this.selectedTabState.get() === id ? "header__button--selected" : "header__button--not-selected")
                return button
            }

            const position = this.context.getPropPositionByCurrentFrame(selectedProp)
            const positionDisplay = positionToDisplay(position)
            header.append(createTitleButton(Tab.GENERAL, "General Info", "bi", "bi-boxes"),
                createTitleButton(Tab.SCRIPTS, "Scripts", "bi", "bi-journal-bookmark-fill"),
                createTitleButton(Tab.IMAGES, "Images", "bi", "bi-image-fill"),
                createTitleButton(Tab.STEPS, "Steps", "bi", "bi-123"))

            const contentElement = document.createElement('div')
            contentElement.classList.add("content")

            const createKeyValueContent = (key, value) => {
                const parentElement = document.createElement('span')
                const keyElement = document.createElement('span')
                const valueElement = document.createElement('span')

                keyElement.innerHTML = `【${camelToDisplay(key)}】 `
                keyElement.classList.add("content__key")
                valueElement.innerHTML = value
                valueElement.classList.add("content__value")

                parentElement.append(keyElement, valueElement)
                return parentElement
            }

            const createImage = (imageConfig: ImageConfig) => {
                const containerElement = document.createElement('div')
                containerElement.classList.add('image__container')
                const imageElement = document.createElement('img')
                if (imageConfig.title) {
                    const titleElement = document.createElement('span')
                    titleElement.innerText = imageConfig.title
                    titleElement.classList.add("image__container__title")
                    containerElement.append(titleElement)
                }
                imageElement.src = imageConfig.imageURL

                containerElement.append(imageElement)
                return containerElement
            }

            switch (this.selectedTabState.get()) {
                case Tab.GENERAL:
                    for (let key in selectedProp) {
                        if (!ExcludeKeys.includes(key)) {
                            contentElement.append(createKeyValueContent(key, selectedProp[key]))
                        }
                    }
                    if (selectedProp.note) {
                        contentElement.append(createKeyValueContent("Note", selectedProp.note))
                    }
                    break
                case Tab.SCRIPTS:

                    break
                case Tab.IMAGES:
                    if (selectedProp.images) {
                        selectedProp.images.forEach(imageConfig => {
                            contentElement.append(createImage(imageConfig))
                        })
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
            container.append(header, contentElement, footer)
            return parentContainer.outerHTML
        }
        return ""
    }
}