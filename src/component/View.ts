import {SceneComponent} from "./Component";
import {AnimationConfig, PositionConfig, PropTypeIcons} from "../props/Props";
import State from "../state/State";

// Note I only implemented dragging (i.e., pan)
// I didn't come up with this algorithm to pan plus zoom with mouse position
// The algorithm part comes from https://stackoverflow.com/questions/38810242/set-canvas-zoom-scale-origin with modifications
// TODO: This should be added to README

export class View extends SceneComponent {

    mouse: PositionConfig
    mouseR: PositionConfig
    mouseS: PositionConfig
    origin: PositionConfig
    dragging: boolean

    listen(): State<any>[] {
        return [this.context.props, this.context.ctx.currentFrameState]
    }

    subscribe() {
        return [".view-container"]
    }

    afterRender() {
        console.log("Reset")
        this.mouse = {x: 0, y: 0}
        this.mouseR = {...this.mouse}
        this.mouseS = {...this.mouse}
        this.origin = {...this.mouse}
        this.dragging = false


        const zoomedXInv = (number) => {
            return Math.floor((number - this.mouseS.x) * (1 / this.context.viewportScale) + this.origin.x);
        }

        const zoomedYInv = (number) => {
            return Math.floor((number - this.mouseS.y) * (1 / this.context.viewportScale) + this.origin.y);
        }

        const zoomedX = (number) => {
            return Math.floor((number - this.origin.x) * this.context.viewportScale + this.mouseS.x);
        }

        const zoomedY = (number) => { // scale & origin Y
            return Math.floor((number - this.origin.y) * this.context.viewportScale + this.mouseS.y);
        }

        const stopDragging = (e) => {
            if (this.dragging) {
                e.preventDefault()
                this.dragging = false
                const previous = this.context.viewportOffset
                console.log(this.context.viewportScale)
                this.context.viewportOffset = {
                    x: zoomedX(this.context.viewportScale) + previous.x,
                    y: zoomedY(this.context.viewportScale) + previous.y
                }
                $('.view-container').css('cursor', 'unset')
            }
        }

        const regMouse = (e) => {
            const c = $('.view-container')
            this.mouse.x = e.clientX - c[0].getBoundingClientRect().left
            this.mouse.y = e.clientY - c[0].getBoundingClientRect().top
            let xx = this.mouseR.x
            let yy = this.mouseR.y
            this.mouseR.x = zoomedXInv(this.mouse.x);
            this.mouseR.y = zoomedYInv(this.mouse.y);
            return [xx, yy]
        }

        const render = () => {
            const newX = zoomedX(this.context.viewportScale)
            const newY = zoomedY(this.context.viewportScale)
            $(`.view-svg`).attr("transform", `matrix(${this.context.viewportScale},0,0,${this.context.viewportScale},${newX}, ${newY})`);
        }

        $('.view-container').on("mousedown", (e) => {
            e.preventDefault()
            this.dragging = true
            $('.view-container').css('cursor', 'grabbing')
        }).on("mousemove", (e) => {
            e.preventDefault()
            const [xx, yy] = regMouse(e)
            if (this.dragging) {
                this.origin.x -= this.mouseR.x - xx;
                this.origin.y -= this.mouseR.y - yy;
                this.mouseR.x = zoomedXInv(this.mouse.x);
                this.mouseR.y = zoomedYInv(this.mouse.y);
                render()
            }
        }).on("mouseup mouseleave mouseout", (e) => {
            stopDragging(e)
        }).on('wheel', (e) => {
            e.preventDefault()
            const deltaY = (<WheelEvent>e.originalEvent).deltaY
            if (deltaY < 0) { // zoom in
                console.log("zooming in")
                this.context.viewportScale = Math.min(3, this.context.viewportScale * 1.02)
            } else { // zoom out
                this.context.viewportScale = Math.max(0.4, this.context.viewportScale * (1 / 1.02))
            }
            this.origin = {...this.mouseR}
            this.mouseS = {...this.mouse}
            this.mouseR = {
                x: zoomedXInv(this.mouse.x),
                y: zoomedYInv(this.mouse.y)
            }
            render()
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