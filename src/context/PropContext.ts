/*
 * Copyright 2022 Dan Lyu.
 */

import State, {createState} from "../state/State";
import {
    AnimationConfig,
    DefaultAnimationConfig,
    DefaultPropConfig,
    FrameAnimationConfig,
    PropConfig, PropType, PropTypeIcon, PropTypeIcons
} from "../props/Props";
import {
    convertTypeToReadable,
    createSpan,
    createSVGIcon,
    generateDarkColor,
    generateLightColor,
    getPathGroupByHTML
} from "../utils/Utils";
import ThemeContext from "./ThemeContext";
import Context from "./Context";
import {Scene} from "../index";

export default class PropContext extends Context {
    public currentFrameState: State<number> = createState(1)
    protected totalFramesState: State<number> = createState(0)

    public selectedPropState: State<PropConfig> = createState()
    public propsState: State<PropConfig[]> = createState([])
    protected propIds: number = 0
    public propTypePool: { [key in PropType]: PropTypeIcon }

    public selectedPropTypesState: State<string[]> = createState([])
    public searchPropValueState: State<string> = createState('')

    public get searchValue() {
        return this.searchPropValueState.get()
    }

    public set searchValue(value: string) {
        this.searchPropValueState.set(value)
    }

    public toggleSelectedPropType(type: string) {
        if (this.isPropTypeSelected(type)) {
            this.selectedPropTypesState.set(this.selectedPropTypes.filter(t => t !== type))
        } else {
            this.selectedPropTypesState.set([...this.selectedPropTypes, type])
        }
    }

    public isPropTypeSelected(type: string) {
        return this.selectedPropTypes.includes(type.toUpperCase())
    }

    public deselectAllPropTypes() {
        this.selectedPropTypesState.set([])
    }

    public selectAllPropTypes() {
        this.selectedPropTypesState.set(this.allPropTypes)
    }

    public resetFilter() {
        this.selectAllPropTypes()
        this.searchValue = ''
    }

    public get allPropTypes(): string[] {
        return Object.keys(this.propTypePool)
    }

    public get selectedPropTypes() {
        return this.selectedPropTypesState.get()
    }

    public constructor(scene: Scene) {
        super(scene);
        this.propTypePool = {...PropTypeIcons}
    }

    public clearSelectedProp() {
        this.selectedPropState.set(null)
    }

    public get props() {
        return this.propsState.get()
    }

    public get filteredProps() {
        return this.props.filter(prop => {
            return this.selectedPropTypes.includes(prop.type) && (this.searchValue ? prop.name.toLowerCase().includes(this.searchValue.toLowerCase()) : true)
        })
    }

    public addPropType(propTypes: { [key: string]: PropTypeIcon }) {
        this.propTypePool = {...this.propTypePool, ...propTypes}
    }

    public sortPropsByRenderOrder() {
        this.propsState.set(this.propsState.get().sort((a, b) => {
            if (a.orderIndex < b.orderIndex) {
                return -1
            }
            if (a.orderIndex > b.orderIndex) {
                return 1
            }
            return 0
        }));
    }

    public isPropEnabled(prop: PropConfig): boolean {
        return this.getPropPositionByCurrentFrame(prop).enabled
    }

    public getPropPositionByCurrentFrame(prop: PropConfig): AnimationConfig | null {
        return this.getPropPositionByFrame(prop, this.currentFrame, false)
    }

    public getPropById(id: number): PropConfig | null {
        for (const prop of this.propsState.get()) {
            if (prop.id === id) {
                return prop
            }
        }
        return null
    }

    public getPropByName(name: string): PropConfig | undefined{
        const props = this.getPropsByName(name)
        if(props.length === 0){
            return undefined
        }
        return props[0]
    }

    public getPropsByName(name: string): PropConfig[] {
        const props = []
        for (const prop of this.propsState.get()) {
            if (prop.name.toLowerCase() === name.toLowerCase()) {
                props.push(prop)
            }
        }
        return props
    }

    public addProp(...propConfigs: PropConfig[]) {
        const _props = [...this.propsState.get()]
        propConfigs.forEach(propConfig => {
            propConfig = {...DefaultPropConfig, ...propConfig}
            propConfig.color = propConfig.color ?? (this.themeCtx.currentTheme.isLight ? generateDarkColor() : generateLightColor())
            propConfig.id = propConfig.id ?? this.propIds
            propConfig.name = propConfig.name ?? `${convertTypeToReadable(propConfig.type)} ${propConfig.id}`
            if (propConfig.frameAnimationConfig) {
                propConfig.frameAnimationConfig
                for (let key in propConfig.frameAnimationConfig) {
                    const a = {...DefaultAnimationConfig, ...propConfig.frameAnimationConfig[key]}
                    a.transitionTimingFunction = a.transitionTimingFunction || this.config.transitionTimingFunction
                    propConfig.frameAnimationConfig[key] = a
                }
            }
            this.propIds += 1
            _props.push(propConfig)
        })
        this.propsState.set(_props)
        return this
    }

    public findMaxFrames(): number {
        let max = 0
        this.propsState.get().forEach(prop => {
            const frameConfig: FrameAnimationConfig = prop.frameAnimationConfig
            const _max: number = Number(Object.keys(frameConfig).reduce((a, b) => frameConfig[a] > frameConfig[b] ? a : b))
            if (_max > max) {
                max = _max
            }
        })
        return max
    }


    public toggleSelected(prop: PropConfig | number) {
        let _prop: PropConfig
        if (typeof prop == "number") {
            _prop = this.getPropById(prop)
        } else {
            _prop = prop
        }
        if (_prop === this.selectedProp) {
            this.clearSelectedProp()
        } else {
            this.selectedProp = _prop
        }
    }

    public getPropPositionByFrame(prop: PropConfig, frame: number, lookForward: boolean): AnimationConfig | null {
        const _get = (_lookForward: boolean) => {
            let position: AnimationConfig
            const frameConfig = prop.frameAnimationConfig
            if (frameConfig) {
                if (frameConfig[frame]) {
                    position = frameConfig[frame]
                } else {
                    let closest = -1
                    for (let key in frameConfig) {
                        const _key = Number(key)
                        if (_lookForward) {
                            if (_key > frame && (closest === -1 || Math.abs(_key - frame) < closest)) {
                                closest = _key
                            }
                        } else {
                            if (_key < frame && (closest === -1 || Math.abs(_key - frame) < closest)) {
                                closest = _key
                            }
                        }
                    }
                    position = frameConfig[closest]
                }
            }
            return position
        }
        const position = _get(lookForward) ?? _get(!lookForward)
        if (position) {
            return {...position}
        }
        return null
    }

    public isPropSelected(prop: PropConfig | number): boolean {
        const selectedProp: PropConfig = this.selectedProp
        const propId: number = typeof prop === 'number' ? prop : prop.id
        return (selectedProp && selectedProp.id === propId);
    }

    public get selectedProp() {
        return this.selectedPropState.get()
    }

    public set selectedProp(selected: PropConfig) {
        this.selectedPropState.set(selected)
    }

    public getPropSpanText(prop: PropConfig, color ?: string) {
        return createSpan(prop.name, color ? color : prop.color)
    }

    public getPropSVG(propOrType: PropConfig | string, color ?: string, scale ?: number) {
        scale = scale ? scale : 1.4
        const propIcon = this.getPathGroup(propOrType, color)
        if (propIcon) {
            const svg = createSVGIcon(scale)
            svg.append(propIcon)
            return svg
        }
        return document.createElement('div')
    }

    private getPathGroup(propOrType: PropConfig | string, color ?: string) {
        const isType = typeof propOrType === 'string'
        const type = isType ? propOrType : propOrType.type
        const style = isType ? 'default' : propOrType.style
        const pathType = isType ? 'enabledPaths' : this.isPropEnabled(propOrType) ? 'enabledPaths' : 'disabledPaths'
        const icon = this.propTypePool[type][style] ? this.propTypePool[type][style][pathType] : null
        if (icon) {
            return getPathGroupByHTML(icon, isType ? null : propOrType, color)
        }
        return null
    }

    public get isStatic() {
        return this.totalFrames <= 1
    }

    public get totalFrames() {
        return this.totalFramesState.get()
    }

    public set totalFrames(f: number) {
        this.totalFramesState.set(f)
    }

    public get currentFrame() {
        return this.currentFrameState.get()
    }

    public set currentFrame(f: number) {
        this.currentFrameState.set(f)
    }

    public ifJumpOne(oldFrame, newFrame) {
        return newFrame - oldFrame === 1 || (newFrame === 1 && oldFrame === this.totalFrames)
    }

    public ifJumpOneLiterally(oldFrame, newFrame) {
        return newFrame - oldFrame === 1
    }

    public nextFrame(): number {
        const previousFrame = this.currentFrame
        if (this.currentFrame < this.totalFrames) {
            this.currentFrame++
        } else if (this.currentFrame === this.totalFrames) {
            this.currentFrame = 1
        }
        return previousFrame
    }
}