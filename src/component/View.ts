import {SceneComponent} from "./Component";
import {AnimationConfig, PositionConfig} from "../props/Props";
import State from "../state/State";

export class View extends SceneComponent {

    mouse: PositionConfig
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
        this.dragging = false

        const stopDragging = (e) => {
            if (this.dragging) {
                e.preventDefault()
                this.dragging = false
                $('.view-container').css('cursor', 'unset')
            }
        }

        const render = () => {
            $(`.view-svg`)
                .attr("transform",
                    `scale(${this.context.viewportScale} ${this.context.viewportScale}) translate(${this.context.viewportOffset.x}, ${this.context.viewportOffset.y})`);
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
            console.log(this.mouse)
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
                console.log(this.context.viewportOffset)
                render()
            }
        }).on("mouseup mouseleave", (e) => {
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
            return position && `<g class="view__prop" id="view-prop-${prop.propId}" transform="translate(${position.x}, ${position.y}) rotate(${position.degree * (Math.PI / 180)})">
                        <text y="-5">test</text>
                        <path style="transform-origin: center center;" fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                    </g>`
        })
        return `<svg class="view-svg" xmlns="http://www.w3.org/2000/svg">${s}</svg>`
    }
}

//<i id='prop-icon-${prop.propId}' class="${PropTypeIcons[prop.type][prop.iconStyle][this.context.isPropEnabled(prop) ? 'enabled' : 'disabled']}"></i>