/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import State, {createState, StateAction} from "../state/State";
import {ExcludeKeys, ImageConfig, StepConfig} from "../props/Props";
import {camelToDisplay, flatObject, positionToDisplay} from "../utils/Utils";

enum Tab {
    IMAGES,
    GENERAL,
    STEPS,
    SCRIPTS,
    DEBUG
}

export class PropDialog extends SceneComponent {

    // prop is not a property, it's the prop used in a scene

    selectedTabState: State<Tab>

    afterConstructor() {
        this.selectedTabState = createState(Tab.GENERAL)
    }

    listen(): State<any>[] {
        return [this.propCtx.selectedPropState, this.propCtx.propsState, this.selectedTabState];
    }

    renderInIds() {
        return [this.ids.ROOT_PROP_DIALOG]
    }

    actions(): StateAction<any>[] {
        return [[this.propCtx.selectedPropState, () => {
            this.selectedTabState.set(Tab.GENERAL)
        }], [this.scene.propCtx.currentFrameState, (oldFrame, newFrame) => {
            const selectedProp = this.propCtx.selectedProp
            if (selectedProp) {
                const positionElement = document.getElementById(this.idCtx.PROP_DIALOG_FOOTER_POSITION(selectedProp))
                const scaleElement = document.getElementById(this.idCtx.PROP_DIALOG_FOOTER_SCALE(selectedProp))
                this.updatePositionScaleElements(positionElement, scaleElement, selectedProp, newFrame, newFrame < oldFrame)
            }
        }]]
    }

    private updatePositionScaleElements(positionElement, scaleElement, prop, frame?: number, lookForward?: boolean) {
        const position = frame == null ? this.propCtx.getPropPositionByCurrentFrame(prop) : this.propCtx.getPropPositionByFrame(prop, frame, lookForward)
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
            const [id] = this.idCtx.extractIdType(e.target.id)
            this.propCtx.toggleSelected(id)
        }
        console.log('render')
        const closeButton = document.getElementById(this.ids.PROP_DIALOG_CLOSE_ICON)
        closeButton && closeButton.addEventListener("click", (e) => {
            this.propCtx.clearSelectedProp()
        })
        const headerTabs = this.scene.$$('.header__tab')
        headerTabs.forEach(e => {
            e.addEventListener("click", (e) => {
                this.selectedTabState.set(this.idCtx.extractIdType((e.target as HTMLElement).id)[0])
            })
        })
        const image = this.scene.$('.content .image__container img')
        image && image.addEventListener('click', (e) => {
            this.overlayCtx.openWith(`<img src='${(e.target as HTMLElement).getAttribute('src')}' alt=""/>`)
        })

    }

    render() {
        const selectedProp = this.propCtx.selectedProp
        if (selectedProp) {
            const parentContainer = document.createElement('div')
            const dialogContainerElement = document.createElement('div')
            dialogContainerElement.classList.add(`prop__dialog--embedded`,
                this.scene.isRootMobile() ? 'prop__dialog--embedded--mobile' : 'prop__dialog--embedded--normal')
            parentContainer.appendChild(dialogContainerElement)
            const header = document.createElement('div')
            header.classList.add('header')

            const addTitleTab = (id, title, enableTab, ...classNames) => {
                if (this.scene.config.alwaysShowAllDialogTabs || enableTab) {
                    const button = document.createElement('span')
                    const tooltip = document.createElement('span')
                    tooltip.innerText = title
                    button.append(tooltip)
                    button.classList.add(...classNames, 'tooltip', 'header__tab')
                    button.id = this.idCtx.PROP_DIALOG_HEADER_TAB(id)
                    button.classList.add(this.selectedTabState.get() === id ? "header__button--selected" : "header__button--not-selected")
                    header.append(button)
                }
            }


            addTitleTab(Tab.GENERAL, "General Information", true, "bi", "bi-boxes")
            addTitleTab(Tab.SCRIPTS, "Scripts", selectedProp.script, "bi", "bi-journal-bookmark-fill")
            addTitleTab(Tab.STEPS, "Steps", selectedProp.steps, "bi", "bi-123")
            addTitleTab(Tab.IMAGES, "Images", selectedProp.images, "bi", "bi-image-fill")
            addTitleTab(Tab.DEBUG, "Debug Information", this.scene.config.dialogShowAllProperties, "bi", "bi-bug")

            const contentElement = document.createElement('div')
            contentElement.classList.add("content")

            const createKeyValueContent = (key, value, displayFormat?: boolean) => {
                const parentElement = document.createElement('span')
                const keyElement = document.createElement('span')
                const valueElement = document.createElement('span')
                keyElement.innerHTML = displayFormat ? `【${camelToDisplay(String(key))}】 ` : `【${String(key)}】 `
                keyElement.classList.add("content__key")
                valueElement.innerHTML = String(value)
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
                titleElement.classList.add("content-text--normal")
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
                titleElement.classList.add('content-text--normal')
                headerElement.append(stepNumberElement, titleElement)

                const contentElement = document.createElement('span')
                contentElement.innerText = stepConfig.content ? stepConfig.content : ""
                contentElement.classList.add('content-text--normal')
                containerElement.append(headerElement, contentElement)
                return containerElement
            }
            switch (this.selectedTabState.get()) {
                case Tab.GENERAL:
                    for (let key in selectedProp) {
                        if (!ExcludeKeys.includes(key) && !selectedProp.excludeKeys.includes(key)) {
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
                        scriptElement.classList.add('content-text--normal')
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
                        Object.keys(selectedProp.steps).sort((a, b) => Number(a) - Number(b)).forEach(key => {
                            contentElement.append(createStepCard(Number(key), selectedProp.steps[key]))
                        })
                    }
                    break
                case Tab.DEBUG:
                    switch (this.scene.config.dialogAllPropertiesFormat) {
                        case "flat":
                            const flat = flatObject(selectedProp)
                            for (let key in flat) {
                                contentElement.append(createKeyValueContent(key, flat[key], false))
                            }
                            break
                        case "json":
                            const jsonElement = document.createElement('p')
                            jsonElement.innerText = JSON.stringify(selectedProp, null, 2)
                            jsonElement.classList.add('content-text--normal')
                            contentElement.append(jsonElement)
                            break
                    }

                    break
            }


            const footer = document.createElement('div')
            footer.classList.add('footer')
            const headerCloseIcon = document.createElement('i')
            headerCloseIcon.id = this.ids.PROP_DIALOG_CLOSE_ICON
            headerCloseIcon.classList.add("bi", "bi-x", "pointer", "prop__dialog__close")
            header.appendChild(headerCloseIcon)

            const propIcon = this.propCtx.getPropSVG(selectedProp)
            propIcon.id = this.idCtx.PROP_DIALOG_FOOTER_ICON(selectedProp)
            const propText = document.createElement("span")
            propText.innerText = selectedProp.name
            propText.style.color = selectedProp.color

            const positionText = document.createElement('span')
            const scaleText = document.createElement('span')
            this.updatePositionScaleElements(positionText, scaleText, selectedProp)
            positionText.id = this.idCtx.PROP_DIALOG_FOOTER_POSITION(selectedProp)
            scaleText.id = this.idCtx.PROP_DIALOG_FOOTER_SCALE(selectedProp)

            footer.append(propIcon, propText, positionText, scaleText)
            dialogContainerElement.append(header, contentElement, footer)

            return parentContainer.outerHTML
            // appending the element will set svg's Viewbox to viewbox
            // attributes are case-sensitive, that's why outerHTML's used
        }
        return ""
    }
}