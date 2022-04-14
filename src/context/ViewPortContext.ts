/*
 * Copyright 2022 Dan Lyu.
 */

import State, {createState} from "../state/State";
import {PositionConfig} from "../props/Props";
import {Scene} from "../index";
import Context from "./Context";

export default class ViewPortContext extends Context {
    private offsetState: State<PositionConfig> = createState({
        x: 0, y: 0
    })
    private scaleState: State<number> = createState(0.75)

    public constructor(scene: Scene) {
        super(scene)
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
        this.scene.propCtx.props.forEach(prop => {
            if (currentFrame) {
                updateMinMax(this.scene.propCtx.getPropPositionByCurrentFrame(prop))
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
        const svgE = document.getElementById(this.scene.rootContainerId)
        const viewWidthRatio = (maxX - minX) / svgE.clientWidth
        const viewHeightRatio = (maxY - minY) / svgE.clientHeight
        let viewRatio = viewWidthRatio > viewHeightRatio ? viewWidthRatio : viewHeightRatio
        viewRatio += this.config.viewOffset
        const viewX = minX - (this.config.viewOffset / 2) * svgE.clientWidth
        const viewY = minY - (this.config.viewOffset / 2) * svgE.clientHeight
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
        if (scale > this.config.zoomLowerBound && scale < this.config.zoomUpperBound) {
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
        this.scale = this.scale * this.config.zoomFactor
    }

    public zoomOut() {
        this.scale = this.scale * (1 / this.config.zoomFactor)
    }
}