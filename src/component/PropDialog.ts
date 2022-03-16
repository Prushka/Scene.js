/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State, {createState, StateAction} from "../state/State";
import {ExcludeKeys, ImageConfig, StepConfig} from "../props/Props";
import {camelToDisplay, positionToDisplay} from "../utils/Utils";

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
        return [this.context.selectedState, this.context.props, this.selectedTabState];
    }

    subscribe() {
        return [this.getRootId("prop__property")]
    }

    actions(): StateAction<any>[] {
        return [[this.context.selectedState, () => {
            this.selectedTabState.set(Tab.GENERAL)
        }], [this.context.ctx.currentFrameState, (oldFrame, newFrame) => {
            const selectedProp = this.context.selected
            if(selectedProp){
                const positionElement = document.getElementById(this.context.getId(selectedProp, "position", "dialog"))
                const scaleElement = document.getElementById(this.context.getId(selectedProp, "scale", "dialog"))
                this.updatePositionScaleElements(positionElement, scaleElement, selectedProp, newFrame, newFrame < oldFrame)
            }
        }]]
    }

    private updatePositionScaleElements(positionElement, scaleElement, prop, frame?: number, lookForward?: boolean) {
        const position = frame == null ? this.context.getPropPositionByCurrentFrame(prop) : this.context.getPropPositionByFrame(prop, frame, lookForward)
        const positionDisplay = positionToDisplay(position)
        if (positionElement) {
            positionElement.innerText = `(${positionDisplay.x}, ${positionDisplay.y}, ${positionDisplay.degree}°)`
            positionElement.style.color = prop.color
        }
        if (scaleElement) {
            scaleElement.innerText = `(${positionDisplay.scaleX}x, ${positionDisplay.scaleY}x)`
            scaleElement.style.color = prop.color
        }
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
        $('.content .image__container img').on("click", (e) => {
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

            const addTitleTab = (id, title, check, ...classNames) => {
                if (this.context.config.alwaysShowAllDialogTabs || check) {
                    const button = document.createElement('span')
                    button.title = title
                    button.classList.add(...classNames)
                    button.id = this.context.getIdType("dialog", id)
                    button.classList.add(this.selectedTabState.get() === id ? "header__button--selected" : "header__button--not-selected")
                    header.append(button)
                }
            }


            addTitleTab(Tab.GENERAL, "General Info", true, "bi", "bi-boxes")
            addTitleTab(Tab.SCRIPTS, "Scripts", selectedProp.script, "bi", "bi-journal-bookmark-fill")
            addTitleTab(Tab.STEPS, "Steps", selectedProp.steps, "bi", "bi-123")
            addTitleTab(Tab.IMAGES, "Images", selectedProp.images, "bi", "bi-image-fill")

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
                parentElement.classList.add('content__key-value')
                parentElement.append(keyElement, valueElement)
                return parentElement
            }

            const createImage = (imageConfig: ImageConfig) => {
                const containerElement = document.createElement('div')
                containerElement.classList.add('image__container', 'bottom-gray-border')
                const imageElement = document.createElement('img')
                const titleElement = document.createElement('span')
                titleElement.innerText = imageConfig.title ? imageConfig.title : ''
                titleElement.classList.add("image__container__title")
                containerElement.append(titleElement)
                imageElement.src = imageConfig.imageURL

                containerElement.append(imageElement)
                return containerElement
            }

            const createStepCard = (stepNumber: number, stepConfig: StepConfig): HTMLElement => {
                const containerElement = document.createElement('div')
                containerElement.classList.add('step-card', 'bottom-gray-border')
                const headerElement = document.createElement('div')

                const stepNumberElement = document.createElement('span')
                stepNumberElement.innerText = String(stepNumber)
                stepNumberElement.classList.add('step-card__step')

                const titleElement = document.createElement('span')
                titleElement.innerText = stepConfig.title ? stepConfig.title : ""
                headerElement.append(stepNumberElement, titleElement)

                const contentElement = document.createElement('span')
                contentElement.innerText = stepConfig.content ? stepConfig.content : ""
                containerElement.append(headerElement, contentElement)
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
                    if (selectedProp.script) {
                        const scriptElement = document.createElement('span')
                        scriptElement.innerText = selectedProp.script
                        contentElement.append(scriptElement)
                    }
                    break
                case Tab.IMAGES:
                    if (selectedProp.images) {
                        selectedProp.images.forEach(imageConfig => {
                            contentElement.append(createImage(imageConfig))
                        })
                    }
                    break
                case Tab.STEPS:
                    if (selectedProp.steps) {
                        console.log(Object.keys(selectedProp.steps))
                        Object.keys(selectedProp.steps).sort((a, b) => Number(a) - Number(b)).forEach(key => {
                            contentElement.append(createStepCard(Number(key), selectedProp.steps[key]))
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

            const positionText = document.createElement('span')
            const scaleText = document.createElement('span')
            this.updatePositionScaleElements(positionText, scaleText, selectedProp)
            positionText.id = this.context.getId(selectedProp, "position", "dialog")
            scaleText.id = this.context.getId(selectedProp, "scale", "dialog")

            footer.append(propIcon, propText, positionText, scaleText)
            container.append(header, contentElement, footer)
            return parentContainer.outerHTML
        }
        return ""
    }
}