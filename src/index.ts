/*
 * Copyright 2022 Dan Lyu.
 */

import Position from "./props/Position";
import {AnimationConfig, PropConfig, PropType, PropTypeIcons} from "./props/Props";
import StateListener, {createState} from "./StateListener";
import Coordinates = JQuery.Coordinates;

export * as position from './props/Position'

function convertTypeToReadable(type: PropType): string {
    return `${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()}`
}

function extractIdType(htmlID: string): [number, string] {
    const id: number = parseInt(htmlID.match(/\d+/)[0])
    const type: string = htmlID.replace(/-\d+/, '')
    return [id, type]
}

export interface SceneContextConfig {
    totalFrames?: number
}

export class SceneContext {
    protected _config: SceneContextConfig
    public currentFrame: StateListener<number> = createState(1).populateSelectorWith({
        listeningSelectors: [".footer-container"], renderWith: (v: number) => {
            let elements = ""
            const buttons = [`<div class="button button--purple pointer"><span>Export</span></div>`]
            if (this._config.totalFrames !== 0) {
                let frames = ""
                for (let f = 0; f < this._config.totalFrames; f++) {
                    frames += `<div id="timeline-frame-${f + 1}" class="timeline__frame ${v === f + 1 ? 'timeline__frame--selected' : 'timeline__frame--not-selected'} pointer">${f + 1}</div>`
                }
                elements = `<div class="timeline-container"><div class="timeline__frame-container">${frames}</div><div class="timeline"></div></div>`
                buttons.push(`<div class="button button--purple pointer"><span>Play</span></div>`)
            }
            return `<div class='footer'>
                    <div class="footer__button-group">${buttons.join('')}</div>
                    ${elements}
                    </div>`
        },
        afterRender: () => {
            $('.timeline__frame').on("click", (e) => {
                const [frame] = extractIdType(e.target.id)
                this.currentFrame.set(frame)
            })
        }
    })

    public constructor(config?: SceneContextConfig) {
        config = config || {}
        config.totalFrames = config.totalFrames || 5
        this._config = config
    }

    public get isStatic() {
        return this._config.totalFrames == 0
    }

    public get totalFrames() {
        return this._config.totalFrames
    }

}

export class ConfigConstructor {
    protected ids: number = 0
    protected _ctx: SceneContext
    protected _selected?: StateListener<PropConfig> = createState()
        .populateSelectorWith({
            listeningSelectors: [".prop__list-container"], renderWith: (v: PropConfig) =>
                this.props.map(prop => {
                    return `<div id='prop-list-${prop.propId}' class='pointer prop__list__item  ${v === prop ? "prop__list__item--selected" : "prop__list__item--not-selected"}'>
                    <i id='prop-list-icon-${prop.propId}' class="${PropTypeIcons[prop.type][prop.iconStyle][this.isPropEnabled(prop) ? 'enabled' : 'disabled']}"></i>
                    <span id='prop-list-text-${prop.propId}'>${prop.name}</span>
                    </div>`
                }),
            afterRender: () => {
                $('.prop__list__item').on("click", (e) => {
                    const [id] = extractIdType(e.target.id)
                    this.toggleSelected(id)
                })
            }
        }, {
            listeningSelectors: [".prop__property-container"], renderWith: (v: PropConfig) => {
                if (v) {
                    return `<div class="prop__property-dialog">
                            <div class="prop__property-dialog__header"><i id="prop-property-dialog-${v.propId}" class="bi bi-x pointer prop__property-dialog__close"></i></div>
                            <div class="prop__property-dialog__footer"><i id='prop-property-dialog-icon-${v.propId}' class="${PropTypeIcons[v.type][v.iconStyle][this.isPropEnabled(v) ? 'enabled' : 'disabled']}"></i> <span>${v.name}</span></div>
                            </div>`
                }
                return ""
            },
            afterRender: () => {
                $('.prop__property-dialog__close').on("click", (e) => {
                    const [id] = extractIdType(e.target.id)
                    console.log(e.target.id)
                    this.toggleSelected(id)
                })
            }
        })


    protected _props: StateListener<PropConfig[]> = createState([]).populateSelectorWith(
        {
            listeningSelectors: [".view-container"], renderWith: (v: PropConfig[]) =>
                v.map(prop => {
                    const position: AnimationConfig = this.getPropPosition(prop)
                    return `<div class="view__prop" style="left:${position.x}px;bottom: ${position.y}px">
<i id='prop-icon-${prop.propId}' class="${PropTypeIcons[prop.type][prop.iconStyle][this.isPropEnabled(prop) ? 'enabled' : 'disabled']}"></i>
</div>`
                }),
            afterRender: () => {
                let mouseX, mouseY
                let dragging: boolean = false
                $('.view__prop').on("dragstart", (e) => {
                    console.log(e)
                })
                $('.view-container').on("mousedown", (e) => {
                    e.preventDefault()
                    mouseX = e.clientX
                    mouseY = e.clientY
                    dragging = true
                }).on("mousemove", (e) => {
                    e.preventDefault()
                    if (dragging) {

                    }
                }).on("mouseup", (e) => {
                    e.preventDefault()
                    dragging = false
                })
            }
        }
    )

    public constructor(context: SceneContext) {
        this.ctx = context
    }

    public set ctx(context: SceneContext) {
        this._ctx = context
    }

    public get ctx() {
        return this._ctx
    }

    public get props() {
        return this._props.get()
    }

    public addProp<T extends PropConfig>(...propConfigs: T[]): ConfigConstructor {
        const _props = [...this.props]
        propConfigs.forEach(propConfig => {
            propConfig.iconStyle = propConfig.iconStyle || "default"
            propConfig.propId = propConfig.propId || this.ids
            propConfig.enabled = propConfig.enabled === undefined ? true : propConfig.enabled
            propConfig.name = propConfig.name || `${convertTypeToReadable(propConfig.type)} ${propConfig.propId}`
            if (propConfig.frameAnimationConfig) {
                for (let key in propConfig.frameAnimationConfig) {
                    propConfig.frameAnimationConfig[key].enabled = propConfig.frameAnimationConfig[key].enabled === undefined ? true : propConfig.frameAnimationConfig[key].enabled
                }
            }
            this.ids += 1
            _props.push(propConfig)
        })
        this._props.set(_props)
        return this
    }

    private isPropEnabled(prop: PropConfig): boolean {
        if (this._ctx.isStatic) {
            return prop.enabled
        } else {
            return false
        }
    }

    private getPropById(id: number): PropConfig | null {
        for (const prop of this.props) {
            if (prop.propId === id) {
                return prop
            }
        }
        return null
    }

    private getPropPosition(prop: PropConfig): AnimationConfig | null {
        if (this.ctx.isStatic) {
            return prop.staticPosition
        } else {
            return prop.frameAnimationConfig[this.ctx.currentFrame.get()]
        }
    }

    private toggleSelected(prop: PropConfig | number) {
        let _prop: PropConfig
        if (typeof prop == "number") {
            _prop = this.getPropById(prop)
        } else {
            _prop = prop
        }
        if (_prop === this._selected.get()) {
            this._selected.set(null)
        } else {
            this._selected.set(_prop)
        }
    }

    private offset: Coordinates

    public displayRoot(selector: string) {
        $(() => {

            $(selector).addClass("root-container")
                .html(`<div class='prop__list-container'></div>
                                    <div class='prop__property-container'></div>
                                    <div class='view-container'></div>
                                    <div class="footer-container"></div>`)

            // this._selected.set(this.props[0])
            StateListener.renderAll()
            this.offset = $(selector).offset()
            console.log(`offset: left ${this.offset.left}, top ${this.offset.top}`)
        })
    }
}

export function demo() {
    const getDemoLight = () => {
        return {
            type: PropType.LIGHT,
            colorTemperature: 5000,
            enabled: false,
            staticPosition: {
                x: 180, y: 100, degree: 30
            },
            frameAnimationConfig: {
                1: {x: 200, y: 200, degree: 30},
                2: {x: 20, y: 20, degree: 30, isOffset: false}
            }
        }
    }

    const getDemoTable = () => {
        return {
            type: PropType.TABLE,
            enabled: true,
            staticPosition: {
                x: 280, y: 200, degree: 30
            },
            frameAnimationConfig: {
                1: {x: 280, y: 200, degree: 30},
                2: {x: 20, y: 20, degree: 30, isOffset: false}
            }
        }
    }
    const context: SceneContext = new SceneContext()
    const config: ConfigConstructor = new ConfigConstructor(context)
    config.addProp(getDemoLight(), getDemoLight(), getDemoTable(), getDemoLight(), getDemoTable()).displayRoot("#scene")
    console.log(config.props)

    return new Position(1, 1)
}

