/*
 * Copyright 2022 Dan Lyu.
 */

import {SceneComponent} from "./Component";
import {AnimationConfig, PositionConfig, PropConfig} from "../props/Props";
import State, {createState, StateAction} from "../state/State";
import PropTupleSet from "../utils/PropTupleSet";
import {extractPathD, forEachPathHTML, getLineGroup} from "../utils/Utils";
import View from "./View";

export class ViewCanvas extends View {

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
        const canvas = document.getElementById(this.ctx.getIdType('canvas')) as HTMLCanvasElement
        const ctx = canvas.getContext('2d')

        // ctx.fillStyle = 'green'
        // ctx.fillRect(10, 10, 150, 100)
        this.forEachPropWithPosition((prop, position) => {
            console.log(prop)
            forEachPathHTML(this.ctx.propTypeIconPool[prop.type][prop.style]['disabledPaths'], (pathHTML)=>{
                const path = extractPathD(pathHTML)
                let p = new Path2D(path)
                console.log(path)
                p.moveTo(position.x, position.y)
                ctx.fill(p);
            })
        })
    }

    render(): string | string[] {

        return `<canvas width="${this.ctx.getRootWidth()}" height="${this.ctx.getRootHeight()}"
id="${this.ctx.getIdType('canvas')}"></canvas>`
    }
}