import {SceneComponent} from "./Component";
import {AnimationConfig, PositionConfig, PropTypeIcons} from "../props/Props";
import State from "../state/State";

// Note I only implemented dragging (i.e., pan)
// I didn't come up with this algorithm to pan plus zoom with mouse position
// The algorithm part comes from https://stackoverflow.com/questions/38810242/set-canvas-zoom-scale-origin with modifications
// TODO: This should be added to README

export class View extends SceneComponent {

    mousePos: PositionConfig
    mouseRPos: PositionConfig
    mouseSPos: PositionConfig
    zoomOrigin: PositionConfig
    dragging: boolean

    listen(): State<any>[] {
        return [this.context.props, this.context.ctx.currentFrameState]
    }

    subscribe() {
        return [".view-container"]
    }

    afterRender() {
        console.log("Reset")
        this.mousePos = {x: 0, y: 0}
        this.mouseRPos = {...this.mousePos}
        this.mouseSPos = {...this.mousePos}
        this.zoomOrigin = {...this.mousePos}
        this.dragging = false


        const zoomedXInv = (number) => {
            return Math.floor((number - this.mouseSPos.x) * (1 / this.context.viewportScale) + this.zoomOrigin.x);
        }

        const zoomedYInv = (number) => {
            return Math.floor((number - this.mouseSPos.y) * (1 / this.context.viewportScale) + this.zoomOrigin.y);
        }

        const zoomed = (number) => {
            return Math.floor(number * this.context.viewportScale);
        }
        const zoomedX = (number) => {
            return Math.floor((number - this.zoomOrigin.x) * this.context.viewportScale + this.mouseSPos.x);
        }

        const zoomedY = (number) => { // scale & origin Y
            return Math.floor((number - this.zoomOrigin.y) * this.context.viewportScale + this.mouseSPos.y);
        }

        const stopDragging = (e) => {
            if (this.dragging) {
                e.preventDefault()
                this.dragging = false
                const previous = this.context.viewportOffset
                this.context.viewportOffset = {
                    x: zoomedX(this.context.viewportScale) + previous.x,
                    y: zoomedY(this.context.viewportScale) - e.clientY + previous.y
                }
                $('.view-container').css('cursor', 'unset')
            }
        }

        const regMouse = (e) => {
            this.mousePos.x = e.clientX - this.context.offset.left
            this.mousePos.y = e.clientY - this.context.offset.top
            let xx = this.mouseRPos.x
            let yy = this.mouseRPos.y
            this.mouseRPos.x = zoomedXInv(this.mousePos.x);
            this.mouseRPos.y = zoomedYInv(this.mousePos.y);
            return [xx, yy]
        }

        $('.view__prop').on("dragstart", (e) => {
            console.log(e)
        })
        $('.view-container').on("mousedown", (e) => {
            e.preventDefault()
            regMouse(e)
            this.dragging = true
            $('.view-container').css('cursor', 'grabbing')
        }).on("mousemove", (e) => {
            e.preventDefault()
            if (this.dragging) {
                const [xx, yy] = regMouse(e)
                this.zoomOrigin.x -= this.mouseRPos.x - xx;
                this.zoomOrigin.y -= this.mouseRPos.y - yy;
                this.mouseRPos.x = zoomedXInv(this.mousePos.x);
                this.mouseRPos.y = zoomedYInv(this.mousePos.y);

                const newX = zoomedX(this.context.viewportScale)
                const newY = zoomedY(this.context.viewportScale)
                $(`.view-svg`).attr("transform", `matrix(1,0,0,1,${newX}, ${newY})`);
                this.context.props.get().forEach(prop => {
                    const position: AnimationConfig = this.context.getPropPosition(prop)
                    if (position) {
                    }
                })
            }
        }).on("mouseup mouseleave mouseout", (e) => {
            stopDragging(e)
        }).on('wheel', (e) => {
            const deltaY = (<WheelEvent>e.originalEvent).deltaY
            if (deltaY < 0) { // zoom in
                console.log("zooming in")
                this.context.viewportScale = Math.min(5, this.context.viewportScale * 1.1)
            } else { // zoom out
                this.context.viewportScale = Math.max(0.1, this.context.viewportScale * (1 / 1.1))
            }
            this.zoomOrigin = {...this.mouseRPos}
            this.mouseSPos = {...this.mousePos}
            this.mouseRPos = {
                x: zoomedXInv(this.mousePos.x),
                y: zoomedYInv(this.mousePos.y)
            }
        })
    }

    render(): string | string[] {
        const makeSVGEl = (tag, attrs) => {
            var el = document.createElementNS('http://www.w3.org/2000/svg', tag);
            for (var k in attrs) {
                el.setAttribute(k, attrs[k]);
            }
            return el;
        }
        const props = this.context.props.get()
        let s = props.map(prop => {
            const position: AnimationConfig = this.context.getPropPosition(prop)
            return position && `<g class="view__prop" id="view-prop-${prop.propId}" transform="translate(${position.x}, ${position.y}) rotate(${position.degree * (Math.PI/180)})">
                        <text y="-5">test</text>
                        <path style="transform-origin: center center;" fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                    </g>`
        })
        return `<svg class="view-svg" xmlns="http://www.w3.org/2000/svg">${s}</svg>`
    }
}

//<i id='prop-icon-${prop.propId}' class="${PropTypeIcons[prop.type][prop.iconStyle][this.context.isPropEnabled(prop) ? 'enabled' : 'disabled']}"></i>