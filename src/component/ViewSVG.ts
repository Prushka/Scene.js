/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import {AnimationConfig, PositionConfig, PropConfig} from "../props/Props";
import State, {createState, StateAction} from "../state/State";
import PropTupleSet from "../utils/PropTupleSet";
import {getLineGroup, getPathGroupByHTML} from "../utils/Utils";
import View from "./View";

export class ViewSVG extends View{

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
        return [this.ctx.propsState];
    }

    actions(): StateAction<any>[] {
        return [
            [this.ctx.selectedState, (oldProp: PropConfig, newProp: PropConfig) => {
                if (oldProp) {
                    const propDOM = $(`#${this.ctx.getId(oldProp, 'view', 'prop')}`)
                    if (propDOM) {
                        propDOM.removeClass("view__prop--selected")
                    }
                }
                if (newProp) {
                    const propDOM = $(`#${this.ctx.getId(newProp, 'view', 'prop')}`)
                    if (propDOM) {
                        propDOM.removeClass("view__prop--not-selected")
                        propDOM.addClass("view__prop--selected")
                    }
                }
            }],
            [this.ctx.timeCtx.currentFrameState, (oldFrame: number, newFrame: number) => {
                console.log(`Frame: ${oldFrame} -> ${newFrame}`)
                this.ctx.propsState.get().forEach(prop => {
                    let newPosition = prop.frameAnimationConfig[newFrame]
                    let show = newPosition && !newPosition.hide
                    newPosition = this.ctx.getPropPositionByFrame(prop, newFrame, newFrame < oldFrame)
                    //const previousPosition = this.context.getPropPositionByFrame(prop, oldFrame, newFrame - oldFrame < 0)
                    const groupElement = document.getElementById(this.ctx.getId(prop, 'view', 'prop'))
                    groupElement.style.display = show ? "unset" : "none"
                    const enabledGroup = document.getElementById(this.ctx.getId(prop, 'view', 'prop', 'icon', 'group', 'enabled'))
                    const disabledGroup = document.getElementById(this.ctx.getId(prop, 'view', 'prop', 'icon', 'group', 'disabled'))
                    if (!newPosition.enabled) {
                        enabledGroup.style.opacity = "0"
                        disabledGroup.style.opacity = "1"
                    } else {
                        disabledGroup.style.opacity = "0"
                        enabledGroup.style.opacity = "1"
                    }
                    // console.log(`${previousPosition.x},${previousPosition.y} => ${newPosition.x},${newPosition.y}`)
                    groupElement.setAttribute("transform", `translate(${newPosition.x}, ${newPosition.y}) rotate(${newPosition.degree}) scale(${newPosition.scaleX} ${newPosition.scaleY})`)
                    let transitionDuration
                    if (newFrame - oldFrame === 1 || (newFrame === 1 && oldFrame === this.ctx.timeCtx.totalFrames)) {
                        transitionDuration = this.ctx.getFrameSeconds(oldFrame) + "s"
                    } else {
                        transitionDuration = this.ctx.config.frameSelectionSpeed + "s"
                    }
                    enabledGroup.style.transitionDuration = transitionDuration
                    disabledGroup.style.transitionDuration = transitionDuration
                    groupElement.style.transitionDuration = transitionDuration
                })

            }]]
    }

    subscribe() {
        return [this.getRootId("view")]
    }

    private applyViewportAttrs() {
        const svgE =
            this.ctx.$(`.view-svg`)
        svgE.attr("viewBox",
            `${-this.ctx.viewportOffset.x} ${-this.ctx.viewportOffset.y} ${svgE.width() * this.ctx.viewportScale} ${svgE.height() * this.ctx.viewportScale}`);
        this.ctx.$(`.view__prop`).each((index, element) => {
            const prop = this.ctx.getPropById(this.ctx.extractIdType(element.id)[0])
            if(prop.shouldDisplayName) {
                const pathGroups = element.querySelectorAll('g')
                const position = this.ctx.getPropPositionByCurrentFrame(prop)
                let textElement
                let textWidth
                textElement = element.querySelector('text')
                textWidth = textElement.getBBox().width
                pathGroups.forEach(pathGroup => {
                    pathGroup.setAttribute("transform", `translate(${textWidth / 2 - (pathGroup.getBBox().width * position.scaleX) / 2}, 0)`)
                })
            }
        })
    }

    public resetViewport(currentFrame?: number) {
        const [viewRatio, viewX, viewY] = this.ctx.calcViewBox(this.ctx.findMinMaxPosition(currentFrame))
        this.ctx.viewportScale = viewRatio
        this.ctx.viewportOffset = {
            x: -viewX, y: -viewY
        }
        this.applyViewportAttrs()
    }

    afterRender() {
        this.mouse = {x: 0, y: 0}
        this.dragging = false
        this.resetViewport()

        const stopDragging = (e) => {
            if (this.dragging) {
                e.preventDefault()
                this.dragging = false
                $(this.getRootId('view')).css('cursor', 'unset')
            }
        }


        const getMouseOffset = (e) => {
            const c = $(this.getRootId('view'))
            const interactX = e.touches == null? e.clientX : e.touches[0].pageX
            const interactY = e.touches == null? e.clientY : e.touches[0].pageY
            return {x: interactX - c[0].getBoundingClientRect().left, y: interactY - c[0].getBoundingClientRect().top}
        }

        $(this.getRootId('view')).on("mousedown touchstart", (e) => {
            e.preventDefault()
            this.dragging = true
            const c = $(this.getRootId('view'))
            this.mouse = getMouseOffset(e)
            c.css('cursor', 'grabbing')
        }).on("mousemove touchmove", (e) => {
            e.preventDefault()
            if (this.dragging) {
                const previous = this.ctx.viewportOffset
                const previousMouse = {...this.mouse}
                const currMouse = getMouseOffset(e)
                this.mouse = currMouse
                this.ctx.viewportOffset = {
                    x: previous.x + currMouse.x - previousMouse.x,
                    y: previous.y + currMouse.y - previousMouse.y,
                }
                this.applyViewportAttrs()
            }
        }).on("mouseup mouseleave touchend touchcancel", (e) => {
            stopDragging(e)
        }).on('wheel', (e) => {
            e.preventDefault()
            const deltaY = (<WheelEvent>e.originalEvent).deltaY
            if (deltaY > 0) { // zoom in
                this.ctx.viewportScale = Math.min(3, this.ctx.viewportScale * 1.02)
            } else { // zoom out
                this.ctx.viewportScale = Math.max(0.4, this.ctx.viewportScale * (1 / 1.02))
            }
            this.applyViewportAttrs()
        })

        this.ctx.$('.view__prop').on('click touchend', (e) => {
            const elementId = e.target.id ? e.target.id:e.target.parentElement.id
            let [id] = this.ctx.extractIdType(elementId)
            this.ctx.toggleSelected(id)
        })
    }

    private createConnections() {
        let connections = [...this.connections.get()].map(_c => {
            const c: number[] = _c.split(",").map(s => Number(s))
            const propLeft = this.ctx.getPropById(c[0])
            const propRight = this.ctx.getPropById(c[1])
            const leftGroupElement = document.getElementById(this.ctx.getId(propLeft, 'view', 'prop'))
            const rightGroupElement = document.getElementById(this.ctx.getId(propRight, 'view', 'prop'))
            const propLeftPosition = this.ctx.getPropPositionByCurrentFrame(propLeft)
            const propRightPosition = this.ctx.getPropPositionByCurrentFrame(propRight)
            const propLeftRect = leftGroupElement.querySelector("text").getBoundingClientRect()
            const propRightRect = rightGroupElement.querySelector("text").getBoundingClientRect()
            console.log("bounding: " + propLeftPosition.x + "," + propLeftPosition.y)
            console.log(this.ctx.getPropPositionByCurrentFrame(propLeft))
            return `<g stroke-width="1" stroke="red"><path d="M${propLeftPosition.x + propLeftRect.width / 2} ${propLeftPosition.y + propLeftRect.height / 2} L${propRightPosition.x + propRightRect.width / 2} ${propRightPosition.y + propRightRect.height / 2}"/></g>
<g class="view__prop__connection"><path d="M${propLeftPosition.x} ${propLeftPosition.y} L${propRightPosition.x} ${propRightPosition.y}"/></g>`
        })
        document.getElementById(this.ctx.getIdType("view", "connections")).innerHTML = connections.join('')
    }

    render(): string | string[] {
        const props = this.ctx.propsState.get()

        const gs = []
        this.ctx.config.lines.forEach(([start, end, line]) => {
            gs.push(getLineGroup(start.x, start.y, end.x, end.y, line.width, line.color))
        })
        let s = []
        this.forEachPropWithPosition((prop, position) => {
            const hide = position.hide
            if (position) {
                const selected = this.ctx.propSelected(prop)
                const group = document.createElement("g")
                group.classList.add("view__prop", selected ? 'view__prop--selected' : 'view__prop--not-selected')
                group.style.transitionTimingFunction = this.ctx.config.playTransition
                group.id = this.ctx.getId(prop, 'view', 'prop')
                group.setAttribute("transform", `translate(${position.x}, ${position.y}) rotate(${position.degree}) scale(${position.scaleX} ${position.scaleY})`)
                if (prop.shouldDisplayName) {
                    const text = document.createElement("text")
                    text.id = this.ctx.getId(prop, 'view', 'prop', 'text')
                    text.innerText = prop.name
                    text.setAttribute("y", "-7")
                    text.style.fill = prop.color
                    group.appendChild(text)
                }
                // It's not possible to set innerHTML to format: <path ... /><path ... />
                // The above line will be formatted to: <path ...><path ...></path></path>
                // As such, I'm mapping every element to a DOM instead of mapping all fragments and get the child nodes
                // (until I find a workaround or figure out what the issue is)
                const pathGroupEnabled = getPathGroupByHTML(this.ctx.propTypeIconPool[prop.type][prop.style]['enabledPaths'], prop)
                const pathGroupDisabled = getPathGroupByHTML(this.ctx.propTypeIconPool[prop.type][prop.style]['disabledPaths'], prop)
                pathGroupEnabled.id = this.ctx.getId(prop, 'view', 'prop', 'icon', 'group', 'enabled')
                pathGroupDisabled.id = this.ctx.getId(prop, 'view', 'prop', 'icon', 'group', 'disabled')
                if (this.ctx.isPropEnabled(prop)) {
                    pathGroupDisabled.style.opacity = "0"
                } else {
                    pathGroupEnabled.style.opacity = "0"
                }
                group.append(pathGroupEnabled, pathGroupDisabled)
                if (hide) {
                    group.style.display = "none"
                }
                //path.id = this.context.getId(prop, 'view', 'prop', 'icon')
                s.push(group.outerHTML)
            }
        })
        for (let key in this.ctx.config.attachment) {
            const keyProps = this.ctx.getPropsByName(key)
            let valueProps = []
            this.ctx.config.attachment[key].forEach(name => {
                valueProps = valueProps.concat(this.ctx.getPropsByName(name))
            })
            keyProps.forEach(keyProp => {
                valueProps.forEach(valueProp => {
                    if (keyProp !== valueProp) {
                        this.connections.get().addIdTuple([keyProp.id, valueProp.id])
                    }
                })
            })
        }


        console.log(this.connections.get())
        return `<svg class="view-svg" xmlns="http://www.w3.org/2000/svg"><g id="${this.ctx.getIdType("view", "connections")}"></g>${s.join('')}
<g id="${this.ctx.getIdType("view", "lines", "group")}">${gs.join('')}</g></svg>`
    }
}