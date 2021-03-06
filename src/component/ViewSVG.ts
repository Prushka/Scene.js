/*
 * Copyright 2022 Dan Lyu.
 */

import {PositionConfig, PropConfig, PropType} from "../props/Props";
import State, {createState, StateAction} from "../state/State";
import PropTupleSet from "../utils/PropTupleSet";
import {getLineGroup, getPathGroupByHTML, setStyles} from "../utils/Utils";
import View from "./View";

export class ViewSVG extends View {

    // I can't find a way to add animation while re-rendering the entire content
    // This means:
    // view will be updated only when props config changed
    // the rest of state changes will dispatch actions that modify the DOM

    mouse: PositionConfig
    dragging: boolean

    connections: State<PropTupleSet>

    afterConstructor() {
        this.connections = createState(new PropTupleSet())
    }

    listen(): State<any>[] {
        return [this.propCtx.propsState, this.propCtx.selectedPropTypesState,
            this.propCtx.searchPropValueState];
    }

    actions(): StateAction<any>[] {
        return [
            [this.propCtx.selectedPropState, (oldProp: PropConfig, newProp: PropConfig) => {
                if (oldProp) {
                    const propDOM = document.getElementById(this.idCtx.VIEW_PROP(oldProp))
                    if (propDOM) {
                        propDOM.classList.remove("view__prop--selected")
                    }
                }
                if (newProp) {
                    const propDOM = document.getElementById(this.idCtx.VIEW_PROP(newProp))
                    if (propDOM) {
                        propDOM.classList.remove("view__prop--not-selected")
                        propDOM.classList.add("view__prop--selected")
                    }
                }
            }],
            [this.propCtx.currentFrameState, (oldFrame: number, newFrame: number) => {
                this.propCtx.filteredProps.forEach(prop => {
                    let newPosition = prop.frameAnimationConfig[newFrame]
                    let show = newPosition && !newPosition.hide
                    newPosition = this.propCtx.getPropPositionByFrame(prop, newFrame, newFrame < oldFrame)
                    const groupElement = document.getElementById(this.idCtx.VIEW_PROP(prop))
                    groupElement.style.display = show ? "unset" : "none"
                    const enabledGroup = document.getElementById(this.idCtx.VIEW_ICON_PATH_GROUP_ENABLED(prop))
                    const disabledGroup = document.getElementById(this.idCtx.VIEW_ICON_PATH_GROUP_DISABLED(prop))
                    const storyboard = groupElement.querySelector('image')
                    if (enabledGroup) {
                        enabledGroup.style.opacity = !newPosition.enabled ? "0" : "1"
                    }
                    if (disabledGroup) {
                        disabledGroup.style.opacity = !newPosition.enabled ? "1" : "0"
                    }
                    if (storyboard) {
                        if (newPosition.thumbnail) {
                            if (newPosition.thumbnail.height) {
                                storyboard.setAttributeNS(null, 'height', String(newPosition.thumbnail.height))
                            }
                            if (newPosition.thumbnail.width) {
                                storyboard.setAttributeNS(null, 'width', String(newPosition.thumbnail.width))
                            }
                            if (newPosition.thumbnail.imageURL) {
                                storyboard.setAttributeNS('http://www.w3.org/1999/xlink', 'href', newPosition.thumbnail.imageURL)
                            }
                        }
                    }
                    groupElement.setAttribute("transform", `translate(${newPosition.x}, ${newPosition.y}) rotate(${newPosition.degree}) scale(${newPosition.scaleX} ${newPosition.scaleY})`)
                    let transitionDuration
                    if (this.propCtx.ifJumpOne(oldFrame, newFrame)) {
                        transitionDuration = this.scene.getFrameSeconds(oldFrame) + "s"
                    } else {
                        transitionDuration = this.scene.config.frameSelectionSpeed + "s"
                    }
                    setStyles('transitionDuration', transitionDuration, enabledGroup, disabledGroup, groupElement, storyboard)
                    const oldPosition = this.propCtx.getPropPositionByFrame(prop, oldFrame, false)
                    if (oldPosition) {
                        setStyles('transitionTimingFunction', oldPosition.transitionTimingFunction,
                            enabledGroup, disabledGroup, groupElement, storyboard)
                    }
                })

            }]]
    }

    renderInIds() {
        return [this.ids.ROOT_VIEW]
    }

    private applyViewportAttrs(viewBoxChange?: boolean) {
        const svgE = (document.getElementById(this.ids.VIEW_SVG) as HTMLElement)
        svgE.setAttribute("viewBox",
            `${-this.getViewportCtx().x} ${-this.getViewportCtx().y} ${svgE.clientWidth * this.getViewportCtx().scale} ${svgE.clientHeight * this.getViewportCtx().scale}`);
        if (!viewBoxChange) {
            this.scene.$$(`.view__prop`).forEach((element, index) => {
                const prop = this.propCtx.getPropById(this.idCtx.extractIdType(element.id)[0])
                if (prop.shouldDisplayName) {
                    const position = this.propCtx.getPropPositionByCurrentFrame(prop)
                    const textElement = element.querySelector('text')
                    const pathGroup = document.getElementById(this.idCtx.VIEW_ICON_PATH_GROUP(prop, position.enabled ? 'enabled' : 'disabled')) as any
                    const storyboard = element.querySelector('image') as any
                    if (textElement) {
                        const textWidth = textElement.getBBox().width
                        const textHeight = textElement.getBBox().height
                        const elementBBox = storyboard ? storyboard.getBBox() : pathGroup.getBBox()
                        let shiftXVertical = elementBBox.width / 2 - textWidth / 2
                        let shiftYHorizontal = elementBBox.height / 2 + textHeight / 2
                        // console.log(`Path: ${elementBBox.width} | Text: ${textWidth} | Shift: ${shiftYHorizontal}`)
                        let shiftX, shiftY
                        switch (prop.namePosition) {
                            case "top":
                                shiftY = -7
                                shiftX = shiftXVertical
                                break
                            case "bottom":
                                shiftY = elementBBox.height + textHeight + 7
                                shiftX = shiftXVertical
                                break
                            case "left":
                                shiftY = shiftYHorizontal
                                shiftX = Math.floor(-textWidth - elementBBox.width)
                                break
                            case "right":
                                shiftY = shiftYHorizontal
                                shiftX = Math.floor(elementBBox.width + 7)
                                break
                            case "center":
                                shiftY = shiftYHorizontal
                                shiftX = shiftXVertical
                                break
                        }
                        textElement.setAttribute("y", String(prop.nameYOffset + shiftY))
                        textElement.setAttribute("x", String(prop.nameXOffset + shiftX))
                        textElement.setAttribute("transform", `scale(${prop.nameScale} ${prop.nameScale})`)

                    } else {
                        switch (prop.type) {
                            case PropType.STORYBOARD:
                                //textElement.setAttribute("y", String(textHeight))
                                break
                        }
                    }
                }
            })
        }

    }

    public resetViewport(currentFrame?: number) {
        this.getViewportCtx().resetViewport(currentFrame)
        this.applyViewportAttrs()
    }

    afterRender() {
        this.mouse = {x: 0, y: 0}
        this.dragging = false
        this.resetViewport(this.propCtx.currentFrame)

        const rootView = document.getElementById(this.ids.ROOT_VIEW)


        const getMouseOffset = (e) => {
            rootView.style.cursor = 'unset'
            const interactX = e.touches == null ? e.clientX : e.touches[0].pageX
            const interactY = e.touches == null ? e.clientY : e.touches[0].pageY
            return {
                x: interactX - rootView.getBoundingClientRect().left,
                y: interactY - rootView.getBoundingClientRect().top
            }
        }

        const stopDragging = (e) => {
            if (this.dragging) {
                e.preventDefault()
                this.dragging = false
                const rootView = document.getElementById(this.ids.ROOT_VIEW)
                rootView.style.cursor = 'unset'
            }
        }

        const mousedown = (e) => {
            e.preventDefault()
            this.dragging = true
            this.mouse = getMouseOffset(e)
            rootView.style.cursor = 'grabbing'
        }

        const mousemove = (e) => {
            e.preventDefault()
            if (this.dragging) {
                const previous = this.getViewportCtx().offset
                const previousMouse = {...this.mouse}
                const currMouse = getMouseOffset(e)
                this.mouse = currMouse
                this.getViewportCtx().offset = {
                    x: previous.x + currMouse.x - previousMouse.x,
                    y: previous.y + currMouse.y - previousMouse.y,
                }
                this.applyViewportAttrs(true)
            }
        }

        const clickProp = (e) => {
            const target = (e.target as HTMLElement)
            const elementId = target.id ? target.id : target.parentElement.id
            let [id] = this.idCtx.extractIdType(elementId)
            this.propCtx.toggleSelected(id)
        }


        rootView.onmousedown = rootView.ontouchstart = mousedown

        rootView.onmousemove = rootView.ontouchmove = mousemove

        rootView.onmouseleave = rootView.onmouseup = rootView.ontouchcancel = rootView.ontouchend = stopDragging

        rootView.onwheel = (e) => {
            e.preventDefault()
            const deltaY = e.deltaY
            if (deltaY > 0) { // zoom in
                this.getViewportCtx().zoomIn()
            } else { // zoom out
                this.getViewportCtx().zoomOut()
            }
            this.applyViewportAttrs(true)
        }

        this.scene.$$('.view__prop').forEach(el => {
            el.addEventListener('click', clickProp)
            el.addEventListener('touchend', clickProp)
        })
    }

    private createConnections() {
        let connections = [...this.connections.get()].map(_c => {
            const c: number[] = _c.split(",").map(s => Number(s))
            const propLeft = this.propCtx.getPropById(c[0])
            const propRight = this.propCtx.getPropById(c[1])
            const leftGroupElement = document.getElementById(this.idCtx.VIEW_GROUP(propLeft))
            const rightGroupElement = document.getElementById(this.idCtx.VIEW_GROUP(propRight))
            const propLeftPosition = this.propCtx.getPropPositionByCurrentFrame(propLeft)
            const propRightPosition = this.propCtx.getPropPositionByCurrentFrame(propRight)
            const propLeftRect = leftGroupElement.querySelector("text").getBoundingClientRect()
            const propRightRect = rightGroupElement.querySelector("text").getBoundingClientRect()
            // console.log("bounding: " + propLeftPosition.x + "," + propLeftPosition.y)
            // console.log(this.ctx.getPropPositionByCurrentFrame(propLeft))
            return `<g stroke-width="1" stroke="red"><path d="M${propLeftPosition.x + propLeftRect.width / 2} ${propLeftPosition.y + propLeftRect.height / 2} L${propRightPosition.x + propRightRect.width / 2} ${propRightPosition.y + propRightRect.height / 2}"/></g>
<g class="view__prop__connection"><path d="M${propLeftPosition.x} ${propLeftPosition.y} L${propRightPosition.x} ${propRightPosition.y}"/></g>`
        })
        document.getElementById(this.ids.VIEW_CONNECTIONS).innerHTML = connections.join('')
    }

    render(): string | string[] {
        const gs = []
        this.scene.config.lines.forEach(([start, end, line]) => {
            gs.push(getLineGroup(start.x, start.y, end.x, end.y, line.width, line.color))
        })
        let s = []
        this.forEachPropWithPosition((prop, position) => {
            const hide = position.hide
            if (position) {
                const isSelected = this.propCtx.isPropSelected(prop)
                const group = document.createElementNS("http://www.w3.org/2000/svg", "g")
                group.classList.add("view__prop", isSelected ? 'view__prop--selected' : 'view__prop--not-selected')
                group.style.transitionTimingFunction = position.transitionTimingFunction
                group.id = this.idCtx.VIEW_GROUP(prop)
                group.setAttribute("transform", `translate(${position.x}, ${position.y}) rotate(${position.degree}) scale(${position.scaleX} ${position.scaleY})`)
                switch (prop.type) {
                    case PropType.STORYBOARD:
                        if (position.thumbnail) {
                            const img = document.createElementNS('http://www.w3.org/2000/svg', 'image')
                            if (position.thumbnail.width == null && position.thumbnail.height == null) {
                                position.thumbnail.width = 50
                            }
                            if (position.thumbnail.height) {
                                img.setAttributeNS(null, 'height', String(position.thumbnail.height))
                            }
                            if (position.thumbnail.width) {
                                img.setAttributeNS(null, 'width', String(position.thumbnail.width))
                            }
                            img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', position.thumbnail.imageURL)
                            img.setAttributeNS(null, 'x', String(position.x))
                            img.setAttributeNS(null, 'y', String(position.y))
                            group.append(img)
                        }
                        break
                    default:
                        const pathGroupEnabled = getPathGroupByHTML(this.propCtx.propTypePool[prop.type][prop.style]['enabledPaths'], prop)
                        const pathGroupDisabled = getPathGroupByHTML(this.propCtx.propTypePool[prop.type][prop.style]['disabledPaths'], prop)
                        pathGroupEnabled.id = this.idCtx.VIEW_ICON_PATH_GROUP_ENABLED(prop)
                        pathGroupDisabled.id = this.idCtx.VIEW_ICON_PATH_GROUP_DISABLED(prop)
                        if (this.propCtx.isPropEnabled(prop)) {
                            pathGroupDisabled.style.opacity = "0"
                        } else {
                            pathGroupEnabled.style.opacity = "0"
                        }
                        group.append(pathGroupEnabled, pathGroupDisabled)

                }
                if (prop.shouldDisplayName) {
                    const text = document.createElement("text")
                    text.id = this.idCtx.VIEW_PROP_TEXT(prop)
                    text.innerText = prop.name
                    text.style.fill = prop.nameColor ?? prop.color
                    group.appendChild(text)
                }
                if (hide) {
                    group.style.display = "none"
                }
                //path.id = this.context.getId(prop, 'view', 'prop', 'icon')
                s.push(group.outerHTML)
            }
        })
        for (let key in this.scene.config.attachment) {
            const keyProps = this.propCtx.getPropsByName(key)
            let valueProps = []
            this.scene.config.attachment[key].forEach(name => {
                valueProps = valueProps.concat(this.propCtx.getPropsByName(name))
            })
            keyProps.forEach(keyProp => {
                valueProps.forEach(valueProp => {
                    if (keyProp !== valueProp) {
                        this.connections.get().addIdTuple([keyProp.id, valueProp.id])
                    }
                })
            })
        }

        return `<svg id="${this.ids.VIEW_SVG}" class="view-svg" xmlns="http://www.w3.org/2000/svg"><g id="${this.ids.VIEW_CONNECTIONS}"></g>${s.join('')}
<g id="${this.ids.VIEW_LINES_GROUP}">${gs.join('')}</g></svg>`
    }
}