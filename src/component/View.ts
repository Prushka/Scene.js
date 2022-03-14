/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import {AnimationConfig, PositionConfig, PropTypeIcons} from "../props/Props";
import State from "../state/State";
import {createElement} from "../utils/Utils";

export class View extends SceneComponent {

    mouse: PositionConfig
    dragging: boolean

    listen(): State<any>[] {
        return [this.context.props, this.context.ctx.currentFrameState, this.context.selectedState]
    }

    subscribe() {
        return [".view-container"]
    }

    private applyViewportAttrs() {
        const svgE =
            $(`.view-svg`)
        svgE.attr("viewBox",
            `${-this.context.viewportOffset.x} ${-this.context.viewportOffset.y} ${svgE.width() * this.context.viewportScale} ${svgE.height() * this.context.viewportScale}`);
        // scale(${this.context.viewportScale} ${this.context.viewportScale}) translate(${this.context.viewportOffset.x}, ${this.context.viewportOffset.y})
        $('.view__prop').each((index, element) => {
            const textElement = element.querySelector('text')
            const textWidth = textElement.getBBox().width
            const pathGroup = element.querySelector('g')
            pathGroup.setAttribute("transform", `translate(${textWidth / 2 - pathGroup.getBBox().width/2}, 0)`)
        })
    }

    afterRender() {
        this.mouse = {x: 0, y: 0}
        this.dragging = false
        this.applyViewportAttrs()

        const stopDragging = (e) => {
            if (this.dragging) {
                e.preventDefault()
                this.dragging = false
                $('.view-container').css('cursor', 'unset')
            }
        }


        const getMouseOffset = (e) => {
            const c = $('.view-container')
            return {x: e.clientX - c[0].getBoundingClientRect().left, y: e.clientY - c[0].getBoundingClientRect().top}
        }

        $('.view-container').on("mousedown", (e) => {
            e.preventDefault()
            this.dragging = true
            const c = $('.view-container')
            this.mouse = getMouseOffset(e)
            c.css('cursor', 'grabbing')
        }).on("mousemove", (e) => {
            e.preventDefault()
            if (this.dragging) {
                const previous = this.context.viewportOffset
                const previousMouse = {...this.mouse}
                const currMouse = getMouseOffset(e)
                this.mouse = currMouse
                this.context.viewportOffset = {
                    x: previous.x + currMouse.x - previousMouse.x,
                    y: previous.y + currMouse.y - previousMouse.y,
                }
                this.applyViewportAttrs()
            }
        }).on("mouseup mouseleave", (e) => {
            stopDragging(e)
        }).on('wheel', (e) => {
            e.preventDefault()
            const deltaY = (<WheelEvent>e.originalEvent).deltaY
            if (deltaY > 0) { // zoom in
                this.context.viewportScale = Math.min(3, this.context.viewportScale * 1.01)
            } else { // zoom out
                this.context.viewportScale = Math.max(0.4, this.context.viewportScale * (1 / 1.01))
            }
            this.applyViewportAttrs()
        })

        $('.view__prop').on('click', (e) => {
            const [id] = this.context.extractIdType(e.target.id)
            console.log(e.target.id)
            this.context.selected = this.context.getPropById(id)
        })
    }

    render(): string | string[] {
        const props = this.context.props.get()
        let s = props.map(prop => {
            const position: AnimationConfig = this.context.getPropPosition(prop)
            const selected = this.context.propSelected(prop)
            const group = document.createElement("g")
            group.classList.add("view__prop", selected ? 'view__prop--selected' : 'view__prop--not-selected')
            group.id = this.context.getId(prop, 'view', 'prop')
            group.setAttribute("transform", `translate(${position.x}, ${position.y}) rotate(${position.degree})`)
            const text = document.createElement("text")
            text.id = this.context.getId(prop, 'view', 'prop', 'text')
            text.innerText = prop.name
            text.setAttribute("y", "-7")
            group.appendChild(text)
            // It's not possible to set innerHTML to format: <path ... /><path ... />
            // The above line will be formatted to: <path ...><path ...></path></path>
            // As such, I'm mapping every element to a DOM instead of mapping all fragments and get the child nodes
            // (until I find a workaround or figure out what the issue is)
            const pathsHTML: string = PropTypeIcons[prop.type][prop.iconStyle][this.context.isPropEnabled(prop) ? 'enabledPaths' : 'disabledPaths']
            let pathId = 0
            const pathGroup = document.createElement("g")
            pathGroup.id = this.context.getId(prop, 'view', 'prop', 'icon', 'group')
            pathsHTML.match(/<path.*?\/>/g).forEach(pathHTML => {
                const path = createElement(pathHTML)
                path.id = this.context.getId(prop, 'view', 'prop', 'icon', `[${pathId}]`)
                pathGroup.appendChild(path)
                pathId++
            })
            group.appendChild(pathGroup)
            //path.id = this.context.getId(prop, 'view', 'prop', 'icon')
            return position && group.outerHTML
        })
        return `<svg class="view-svg" xmlns="http://www.w3.org/2000/svg">${s.join('')}</svg>`
    }
}

//<i id='prop-icon-${prop.propId}' class="${PropTypeIcons[prop.type][prop.iconStyle][this.context.isPropEnabled(prop) ? 'enabled' : 'disabled']}"></i>