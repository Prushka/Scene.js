/*
 * Copyright 2022 Dan Lyu.
 */

import State, {createState} from "../state/State";
import {PositionConfig} from "../props/Props";
import {Context} from "../index";

export default class ViewPortContext {
    private offsetState: State<PositionConfig> = createState({
        x: 0, y: 0
    })
    private scaleState: State<number> = createState(0.75)
    private ctx:Context
    public constructor(context:Context) {
        this.ctx = context
    }

    public findMinMaxPosition(currentFrame?: number): [number, number, number, number] {
        let [minX, minY, maxX, maxY] = [null, null, null, null]
        const updateMinMax = (position) => {
            if (position.x > maxX || maxX == null) {
                maxX = position.x
            }
            if (position.y > maxY || maxY == null) {
                maxY = position.y
            }
            if (position.x < minX || minX == null) {
                minX = position.x
            }
            if (position.y < minY || minY == null) {
                minY = position.y
            }
        }
        this.ctx.propsState.get().forEach(prop => {
            if (currentFrame) {
                updateMinMax(this.ctx.getPropPositionByCurrentFrame(prop))
            } else {
                for (let key in prop.frameAnimationConfig) {
                    const position = prop.frameAnimationConfig[key]
                    if (position) {
                        updateMinMax(position)
                    }
                }
            }

        })
        return [minX, minY, maxX, maxY]
    }

    public calcViewBox([minX, minY, maxX, maxY]) {
        const svgE = $(`${this.ctx.rootContainerIdSymbol}`)
        const viewWidthRatio = (maxX - minX) / svgE.width()
        const viewHeightRatio = (maxY - minY) / svgE.height()
        let viewRatio = viewWidthRatio > viewHeightRatio ? viewWidthRatio : viewHeightRatio
        viewRatio += this.ctx.config.viewOffset
        const viewX = minX - (this.ctx.config.viewOffset / 2) * svgE.width()
        const viewY = minY - (this.ctx.config.viewOffset / 2) * svgE.height()
        return [viewRatio, viewX, viewY]
    }

    public resetViewport(currentFrame?: number) {
        const [viewRatio, viewX, viewY] = this.calcViewBox(this.findMinMaxPosition(currentFrame))
        this.scale = viewRatio
        this.offset = {
            x: -viewX, y: -viewY
        }
    }

    public get offset() {
        return this.offsetState.get()
    }

    public set offset(offset) {
        this.offsetState.set(offset)
    }

    public get scale() {
        return this.scaleState.get()
    }

    public set scale(scale) {
        if(scale > this.ctx.config.zoomLowerBound && scale < this.ctx.config.zoomUpperBound){
            this.scaleState.set(scale)
        }
    }

    public get x() {
        return this.offset.x
    }

    public get y() {
        return this.offset.y
    }

    public zoomIn() {
        console.log(this.scale)
        this.scale = this.scale * this.ctx.config.zoomFactor
    }

    public zoomOut() {
        console.log(this.scale)
        this.scale = this.scale * (1 / this.ctx.config.zoomFactor)
    }
}