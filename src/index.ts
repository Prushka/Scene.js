/*
 * Copyright 2022 Dan Lyu.
 */

import {
    AnimationConfig,
    DefaultLine,
    ImageConfig, PositionConfig,
    PropConfig,
    PropNamePosition,
    PropType,
    PropTypeIcons,
    StepsConfig
} from "./props/Props";
import State, {createState} from "./state/State";
import {getRandomFromList, randBoolean, randInclusive} from "./utils/Utils";
import {PropDialog} from "./component/PropDialog";
import {Footer} from "./component/Footer";
import {ViewSVG} from "./component/ViewSVG";
import {Config, DebugTabFormats, DefaultConfig, ThemeScope} from "./config/Config";
import {Snackbar} from "./component/Snackbar";
import {CustomComponent, SceneComponent} from "./component/Component";
import {Overlay} from "./component/Overlay";
import PropContext from "./context/PropContext";
import ViewPortContext from "./context/ViewPortContext";
import {useSnackbar} from "./context/SnackbarContext";
import {useOverlay} from "./context/OverlayContext";
import View from "./component/View";
import {useId} from "./context/IdContext";
import {PropList} from "./component/PropList";

import './index.css'
import ThemeContext, {Theme} from "./context/ThemeContext";

export * from './utils/Utils'
export * from './props/Props'
export * from './context/SnackbarContext'

let globalSceneIds = 0

const globalScenes: { [key: number]: Scene } = {}

export class Scene {
    public viewportsState: State<ViewPortContext[]> = createState([])
    public readonly config: Config
    public readonly rootContainerId: string
    public readonly rootContainerIdSymbol: string

    public readonly snackbarCtx = useSnackbar()
    public readonly overlayCtx = useOverlay()
    public readonly themeCtx
    public readonly propCtx
    public readonly ids
    public readonly idContext

    public viewComponent: View
    public propDialogComponent: PropDialog
    public footerComponent: Footer

    public readonly originalConfig: string

    public constructor(rootContainerId: string, config?: Config) {
        [this.ids, this.idContext] = useId()

        this.originalConfig = JSON.stringify(config, null, 2)

        this.rootContainerId = rootContainerId
        this.rootContainerIdSymbol = '#' + this.rootContainerId
        this.config = config ? {...DefaultConfig, ...config} : {...DefaultConfig}
        this.config.lines.forEach((l) => {
            l[2] = {...DefaultLine, ...l[2]}
        })

        this.themeCtx = new ThemeContext(this)
        this.propCtx = new PropContext(this)
        this.propCtx.addPropType(config.propTypes)

        this.config.props.forEach(propConfig => {
            this.propCtx.addProp(propConfig)
        })
    }

    public getRootDocument() {
        return document.getElementById(this.rootContainerId)
    }

    public getRootWidth() {
        return this.getRootDocument().getBoundingClientRect().width
    }

    public getRootHeight() {
        return this.getRootDocument().getBoundingClientRect().height
    }

    public isRootMobile() {
        return this.getRootWidth() < 500
    }

    public getFrameSeconds(frame: number): number {
        return frame in this.config.frameSpeed ? this.config.frameSpeed[frame] : this.config.defaultFrameSpeed
    }

    public getViewportGetter(): () => ViewPortContext {
        return () => {
            return this.viewportsState.get()[0]
        }
    }

    public getViewportCtx(): ViewPortContext {
        return this.viewportsState.get()[0]
    }

    private beforeDisplay() {
        this.propCtx.totalFrames = this.propCtx.findMaxFrames()
        const viewports = []
        for (let i = 0; i <= this.propCtx.totalFrames; i++) {
            // populate one more frame since 0's used for static/animation
            const viewport = new ViewPortContext(this)
            viewports.push(viewport)
        }
        this.viewportsState.set(viewports)
        this.propCtx.sortPropsByRenderOrder()
        this.propCtx.resetFilter()
    }

    components: CustomComponent[] = []

    private register<T extends SceneComponent>(c: new(T) => T) {
        const component = new c(this)
        component.renderComponent()
        this.components.push(component)
        return component
    }

    public $(selector) {
        return document.querySelector(`${this.rootContainerIdSymbol} ${selector}`)
    }

    public $$(selector) {
        return document.querySelectorAll(`${this.rootContainerIdSymbol} ${selector}`)
    }

    public idOn(id: string, event: string, f: (e: any) => void) {
        const el = document.getElementById(id)
        if (el) {
            el.addEventListener(event, f)
        }
    }

    public timeouts = []

    public registerTimeOut(s: () => void, ms: number) {
        const timeout = setTimeout(() => {
            if (this.canRootBeFound()) {
                s()
            } else {
                this.unmountIfMount()
            }
        }, ms)
        this.timeouts.push(timeout)
        return timeout
    }

    private unmountIfMount() {
        console.log("Scene: going to unmount scene: " + this.rootContainerId)
        this.components.forEach(c => {
            c.unmount()
        })
        this.timeouts.forEach(t => {
            clearTimeout()
        })
    }

    private afterRender: Array<() => void> = []

    public addAfterRender(f: () => void) {
        this.afterRender.push(f)
    }

    public play(v: boolean) {
        this.footerComponent && this.footerComponent.play(v)
    }

    public canRootBeFound() {
        return document.getElementById(this.rootContainerId) != null
    }

    public display(checkDOMContentLoaded: boolean = false) {
        console.log(`Going to render scene: ${this.rootContainerId}`)
        this.unmountIfMount()
        this.beforeDisplay()

        const render = () => {
            const root = document.getElementById(this.rootContainerId)
            if (!root) {
                console.warn(`Scene: display() has been called but root container: ${this.rootContainerId} cannot be found`)
                return
            }
            root.innerHTML = ''
            const container = document.createElement('div')
            container.classList.add('root-container')
            container.innerHTML = `<div id="${this.ids.ROOT_SNACKBAR}" class='snackbar-container'></div>
                                     <div id="${this.ids.ROOT_PROP_LIST}" class='prop__list-container'></div>
                                    <div id="${this.ids.ROOT_PROP_DIALOG}" class='prop__property-container'></div>
                                    <div id="${this.ids.ROOT_VIEW}" class='view-container'></div>
                                    <div id="${this.ids.ROOT_FOOTER}" class="footer-container"></div>
                                    <div id="${this.ids.ROOT_OVERLAY}" class="overlay-container"></div>`
            root.append(container)
            if (this.config.displayPropList) {
                this.register(PropList)
            }

            this.viewComponent = this.register(ViewSVG)
            this.propDialogComponent = this.register(PropDialog)
            this.footerComponent = this.register(Footer)
            this.register(Snackbar)
            this.register(Overlay)

            this.themeCtx.renderTheme()

            if (this.config.autoPlay) {
                this.play(true)
            }

            this.afterRender.forEach(f => f())
        }

        if (checkDOMContentLoaded) {
            document.addEventListener("DOMContentLoaded", e => {
                render()
            })
        } else {
            render()
        }
    }

}

export abstract class ConfigGenerator<T extends { [K in keyof T]: any }> {
    config: T

    public constructor() {
        this.config = this.initializeConfig()
    }

    protected abstract initializeConfig(): T;

    public getConfig(): T {
        return this.config
    }
}

export class GlobalConfigGenerator extends ConfigGenerator<Config> {

    static randomFrames = 6
    static randomNumberOfProps = 6

    protected initializeConfig() {
        return {
            frameSpeed: {},
            props: [],
            customThemes: {},
            lines: [],
            propTypes: {}
        };
    }

    public addPropType(type: string, style: string, enabledPath: string, disabledPath: string) {
        const propType = this.config.propTypes[type]
        if (!propType) {
            this.config.propTypes[type] = {}
        }
        this.config.propTypes[type][style] = {
            enabledPaths: enabledPath,
            disabledPaths: disabledPath
        }
        return this
    }

    public addLine(start: PositionConfig, end: PositionConfig, width?: number, color?: string) {
        this.config.lines.push([start, end, {
            color: color ?? 'var(--scene-base-inv-s2)',
            width: width ?? 3
        }])
        return this
    }

    public defaultFrameSpeed(n: number) {
        this.config.defaultFrameSpeed = n
        return this
    }

    public frameSelectionSpeed(n: number) {
        this.config.frameSelectionSpeed = n
        return this
    }

    public withProps(props?: PropConfig[] | number | PropConfigGenerator[], frames?: number) {
        if (Array.isArray(props) && props.length > 0) {
            if (props[0] instanceof PropConfigGenerator) {
                this.config.props = props.map(generator => generator.getConfig())
            } else {
                this.config.props = props as PropConfig[]
            }
        } else {
            this.config.props = PropConfigGenerator.generateRandomProps(props ?? GlobalConfigGenerator.randomNumberOfProps, frames ?? GlobalConfigGenerator.randomFrames)
        }
        return this
    }

    public addProp(f: (generator: PropConfigGenerator) => void) {
        const propConfigGenerator = new PropConfigGenerator()
        f(propConfigGenerator)
        this.config.props.push(propConfigGenerator.getConfig())
        return this
    }

    public autoPlay(v: boolean) {
        this.config.autoPlay = v
        return this
    }

    public zoomUpperBound(n: number) {
        this.config.zoomUpperBound = n
        return this
    }

    public zoomLowerBound(n: number) {
        this.config.zoomLowerBound = n
        return this
    }

    public zoomStep(n: number) {
        this.config.zoomStep = n
        return this
    }

    public themeScope(v: ThemeScope) {
        this.config.themeScope = v
        return this
    }

    public customTheme(key: string, theme: Theme) {
        this.config.customThemes[key] = theme
        return this
    }

    public defaultTheme(defaultTheme: string) {
        this.config.defaultTheme = defaultTheme
        return this
    }

    public alwaysShowAllDialogTabs(v: boolean) {
        this.config.alwaysShowAllDialogTabs = true
        return this
    }

    public showDialogDebugTab(v: boolean) {
        this.config.showDialogDebugTab = true
        return this
    }

    public dialogDebugTabFormat(v: DebugTabFormats) {
        this.config.dialogDebugTabFormat = v
        return this
    }

    public viewOffset(offset: number) {
        this.config.viewOffset = offset
        return this
    }

    public withTransitionTimingFunction(transitionTimingFunction: string) {
        this.config.transitionTimingFunction = transitionTimingFunction
        return this
    }

    public defaultOpenToolbar(v: boolean = true) {
        this.config.defaultOpenToolbar = v
        return this
    }

    public defaultOpenPropList(v: boolean = true) {
        this.config.defaultOpenPropList = v
        return this
    }

    public showTimeline(v: boolean = true) {
        this.config.displayTimeline = v
        return this
    }

    public showToolbar(v: boolean = true) {
        this.config.displayToolbar = v
        return this
    }

    public showPropList(v: boolean = true) {
        this.config.displayPropList = v
        return this
    }

    public transitionTimingFunction(v: string) {
        this.config.transitionTimingFunction = v
        return this
    }

    public withFrameSpeed(frame: number = GlobalConfigGenerator.randomFrames, allocation?: number) {
        if (allocation) {
            this.config.frameSpeed[frame] = allocation
        } else {
            const s = {}
            for (let i = 0; i < frame; i++) {
                s[i + 1] = randInclusive(3, 30) / 10
            }
            this.config.frameSpeed = s
        }
        return this
    }

}

export class PositionConfigGenerator extends ConfigGenerator<AnimationConfig> {

    protected initializeConfig(): AnimationConfig {
        return {};
    }

    public enable() {
        this.config.enabled = true
        return this
    }

    public disable() {
        this.config.enabled = false
        return this
    }

    public hide() {
        this.config.hide = true
        return this
    }

    public show() {
        this.config.hide = false
        return this
    }

    public transitionTimingFunction(v: string) {
        this.config.transitionTimingFunction = v
        return this
    }

    public degree(v: number) {
        this.config.degree = v
        return this
    }

    public x(v: number) {
        this.config.x = v
        return this
    }

    public y(v: number) {
        this.config.y = v
        return this
    }

    public scaleX(v: number) {
        this.config.scaleX = v
        return this
    }

    public scale(v: number) {
        this.scaleX(v)
        this.scaleY(v)
        return this
    }

    public scaleY(v: number) {
        this.config.scaleY = v
        return this
    }

    public thumbnail(imageURL: string, width?: number, height?: number) {
        this.config.thumbnail = {
            imageURL: imageURL,
            width: width,
            height: height
        }
        return this
    }
}

export class PropConfigGenerator extends ConfigGenerator<PropConfig> {

    static allPositions = ['top', 'bottom', 'right', 'left']

    static demoImages = [
        {
            title: "test",
            imageURL: "https://s2.loli.net/2022/02/10/grldkO4LeDjxmY8.png"
        },
        {
            imageURL: "https://s2.loli.net/2022/03/16/KZw7yAWXudMGL21.png"
        },
        {
            title: "A long picture",
            imageURL: "https://s2.loli.net/2022/03/16/tukpnVKZaUC7GIF.png"
        }
    ]

    static demoSteps = {
        3: {
            title: "Here's step 1",
            content: "Here's some content"
        },
        2: {
            title: "Here's step 2",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris"
        },
        4: {
            content: "aha"
        },
        5: {title: "A title"},
        1: {},
        6: {},
        7: {}
    }


    static storyboardDemoImage = {
        title: "something",
        imageURL: "https://s2.loli.net/2022/03/19/kfoHSKL792r4cvD.jpg",
        width: 400
    }
    static directorsViewfinderDemoImage = {
        title: "something",
        imageURL: "https://s2.loli.net/2022/03/19/iN9yLYWoE28z5MI.jpg",
        width: 300
    }

    protected initializeConfig(): PropConfig {
        return {
            frameAnimationConfig: {},
            images: [],
            steps: {},
            excludeKeys: []
        };
    }

    public nameYOffset(n: number) {
        this.config.nameYOffset = n
        return this
    }

    public nameOffset(x: number, y: number) {
        this.nameXOffset(x)
        this.nameYOffset(y)
        return this
    }

    public nameXOffset(n: number) {
        this.config.nameXOffset = n
        return this
    }

    public nameColor(nameColor: string) {
        this.config.nameColor = nameColor
        return this
    }

    public renderOrder(n: number) {
        this.config.orderIndex = n
        return this
    }

    public nameScale(nameScale?: number) {
        this.config.nameScale = nameScale ?? randInclusive(5, 10) / 10
        return this
    }

    public addImage(imageURL: string, title?: string, width?: number, height?: number) {
        const image = {title: title, imageURL: imageURL, width: width, height: height}
        this.config.images.push(image)
        return this
    }

    public addData(key: string, value: string) {
        this.config[key] = value
        return this
    }

    public addExcludeKey(...v: string[]) {
        v.forEach(s => this.config.excludeKeys.push(s))
        return this
    }

    public images(images?: ImageConfig[]) {
        this.config.images = images ?? PropConfigGenerator.demoImages
        return this
    }

    public scripts(script?: string) {
        this.config.scripts = script ?? "Here's some random script\nLorem ipsum dolor sit amet, consectetur adipiscing elit,\n123\n\na: c"
        return this
    }

    public note(note?: string) {
        this.config.note = note ?? "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        return this
    }

    public addStep(index: number, title?: string, content?: string) {
        const step = {
            title: title,
            content: content
        }
        this.config.steps[index] = step
        return this
    }

    public steps(steps?: StepsConfig) {
        this.config.steps = steps ?? PropConfigGenerator.demoSteps
        return this
    }

    public style(style?: string) {
        this.config.style = style ?? getRandomFromList(Object.keys(PropTypeIcons[this.config.type]))
        return this
    }

    public namePosition(position?: PropNamePosition) {
        this.config.namePosition = position ?? getRandomFromList(PropConfigGenerator.allPositions)
        return this
    }

    public getAllPropTypes() {
        const allPropTypes = Object.values(PropType)
        let allIconPropTypes = [...allPropTypes]
        allIconPropTypes = allIconPropTypes.filter(i => {
            return i != PropType.STORYBOARD && i != PropType.SCRIPT
        })
        return allIconPropTypes
    }

    public type(type?: string) {
        this.config.type = type ?? getRandomFromList(this.getAllPropTypes())
        return this
    }

    public shouldDisplayName(shouldDisplayName?: boolean) {
        this.config.shouldDisplayName = shouldDisplayName ?? !!randBoolean()
        return this
    }


    static getRandomPosition() {
        const scale = randInclusive(8, 46) / 10
        return {
            enabled: randBoolean(),
            x: Math.random() * 750,
            y: Math.random() * 750,
            degree: Math.random() * 360,
            scaleX: scale,
            scaleY: scale,
        }
    }

    public asRandomDialogProperties() {
        this.images()
            .scripts()
            .note()
            .steps()
        return this
    }

    public asRandom() {
        this.type()
            .images()
            .scripts()
            .note()
            .steps()
            .nameScale()
            .style()
            .shouldDisplayName()
        return this
    }

    public name(name: string) {
        this.config.name = name
        return this
    }

    public color(color: string) {
        this.config.color = color
        return this
    }

    public withPosition(frame: number, position?: AnimationConfig | PositionConfigGenerator) {
        if (position) {
            if (position instanceof PositionConfigGenerator) {
                this.config.frameAnimationConfig[frame] = position.getConfig()
            } else {
                this.config.frameAnimationConfig[frame] = position
            }
        } else {
            const s = {}
            for (let i = 0; i < frame; i++) {
                s[i + 1] = PropConfigGenerator.getRandomPosition()
            }
            this.config.frameAnimationConfig = s
        }
        return this
    }

    public addPosition(f: (generator: PositionConfigGenerator) => void, frame?: number) {
        const generator = new PositionConfigGenerator()
        f(generator)
        this.withPosition(frame ?? 1, generator.getConfig())
        return this
    }

    public addPositions(f: (generator: PositionConfigGenerator) => void, frames: number[]) {
        const generator = new PositionConfigGenerator()
        f(generator)
        frames.forEach(frame => {
            this.withPosition(frame, {...generator.getConfig()})
        })
        return this
    }

    static generateRandomProps(howMany, frames) {
        const s = []
        for (let i = 0; i < howMany; i++) {
            s.push(new PropConfigGenerator().asRandom().withPosition(frames).getConfig())
        }
        return s
    }

}


// Creates a scene to demo built-in prop functionalities
// Devs can use this as a boilerplate for global config experimenting

export function getDemoScene(rootRootId): Scene {
    console.log(`Render demo scene in: ${rootRootId}`)

    const sharedConfig: Config = {
        defaultTheme: 'light',
        customThemes: {
            "light-custom": {
                icon: "bi bi-arrow-through-heart-fill",
                isLight: true,
                colors: {
                    "--scene-base": "#ffffff",
                    "--scene-base-s1": "#F5F5F5",
                    "--scene-base-inv": "#000000",
                    "--scene-base-inv-s1": "#1c1c1c",
                    "--scene-base-inv-s2": "#696969",
                    "--scene-dialog-header-button-not-selected-hover": "#355070",
                    "--scene-dialog-header-button-not-selected-text-hover": "#355070",
                    "--scene-snackbar": "#F765A3",
                    "--scene-timeline-button-selected": "#6d597a",
                    "--scene-timeline-button-selected-hover": "#6d597a",
                    "--scene-timeline-button-not-selected": "#F765A3",
                    "--scene-timeline-button-not-selected-hover": "#ea5490",
                    "--scene-timeline-button-text": "#ffffff",
                    "--scene-snackbar-text": "#ffffff",
                    "--scene-dialog-key": "#6d597a",
                    "--scene-dialog-value": "#A155B9",
                    "--scene-dialog-content": "#000000",
                    "--scene-button-text": "#ffffff",
                    "--scene-button-color": "#7ec4ef",
                    "--scene-button-hover": "#9cabde",
                    "--scene-trans-base": "rgba(255, 255, 255, 0.95)",
                },
            }
        },
        propTypes: {
            "HOUSE": {
                default: {
                    enabledPaths: `<path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09zM4.157 8.5H7a.5.5 0 0 1 .478.647L6.11 13.59l5.732-6.09H9a.5.5 0 0 1-.478-.647L9.89 2.41 4.157 8.5z"/>`,
                    disabledPaths: `<path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>`
                }
            }
        }
    }
    const config = new GlobalConfigGenerator().withFrameSpeed(6).getConfig()
    return new Scene(rootRootId, {
        ...config,
        props: PropConfigGenerator.generateRandomProps(6, 6)
    })
}


export function getDemoGlobalConfigGenerator() {
    return new GlobalConfigGenerator()
        .withFrameSpeed(1, 1)
        .withFrameSpeed(2, 2)
        .withFrameSpeed(3, 1)
        .addProp((propGenerator) => {
            propGenerator
                .type('CAMERA')
                .name('Behind Stage Camera')
                .nameScale(0.5)
                .addPosition((positionGenerator) => {
                    positionGenerator.x(50).y(50).degree(30)
                }, 1)
                .addPosition((positionGenerator) => {
                    positionGenerator.x(20).y(150)
                }, 2)
                .addPosition((positionGenerator) => {
                    positionGenerator.x(50).y(250).degree(-30)
                }, 3)
        })
        .addProp((propGenerator) => {
            propGenerator
                .type('TABLE')
                .name('Main Table')
                .style('fillSquare')
                .shouldDisplayName(false)
                .addPositions((positionGenerator) => {
                    positionGenerator.x(150).y(70).scale(8)
                }, [1, 2, 3])
        })
        .addProp((propGenerator) => {
            propGenerator
                .type('CAMERA')
                .name('Camera A')
                .color('rgb(201,201,201)')
                .addPositions((positionGenerator) => {
                    positionGenerator.x(170).y(140).degree(210)
                }, [1, 3])
                .addPosition((positionGenerator) => {
                    positionGenerator.x(170).y(120).degree(200)
                }, 2)
        })
        .addProp((propGenerator) => {
            propGenerator
                .type('CAMERA')
                .name('Camera B')
                .color('rgb(199,199,199)')
                .addPositions((positionGenerator) => {
                    positionGenerator.x(230).y(140).degree(20)
                }, [1, 3])
                .addPosition((positionGenerator) => {
                    positionGenerator.x(230).y(140).degree(0)
                }, 2)
        })
        .addProp((propGenerator) => {
            propGenerator
                .type('SHELF')
                .addData('texture', 'wood')
                .shouldDisplayName(false)
                .addPositions((positionGenerator) => {
                    positionGenerator.x(400).y(150).degree(0)
                }, [1, 2])
                .addPosition((positionGenerator) => {
                    positionGenerator.x(320).y(170).degree(0)
                }, 3)
        })
        .addProp((propGenerator) => {
            propGenerator
                .type('CHARACTER')
                .name('Emily')
                .asRandomDialogProperties()
                .addPositions((positionGenerator) => {
                    positionGenerator.x(120).y(100).degree(20)
                }, [1, 3])
                .addPosition((positionGenerator) => {
                    positionGenerator.x(120).y(100).degree(-20)
                }, 2)
        })
        .addProp((propGenerator) => {
            propGenerator
                .type('CHARACTER')
                .name('Elizabeth')
                .asRandomDialogProperties()
                .addPositions((positionGenerator) => {
                    positionGenerator.x(290).y(170).degree(0).transitionTimingFunction('ease-in-out')
                }, [1, 3])
                .addPosition((positionGenerator) => {
                    positionGenerator.x(380).y(160).degree(-10)
                }, 2)
        })
        .addProp((propGenerator) => {
            propGenerator
                .type('CHARACTER')
                .name('Eric')
                .asRandomDialogProperties()
                .addPositions((positionGenerator) => {
                    positionGenerator.x(400).y(80).degree(100)
                }, [1, 3])
                .addPosition((positionGenerator) => {
                    positionGenerator.x(250).y(20).degree(150)
                }, 2)
        })
        .addProp((propGenerator) => {
            propGenerator
                .type('STORYBOARD')
                .asRandomDialogProperties()
                .shouldDisplayName(false)
                .addPositions((positionGenerator) => {
                    positionGenerator.x(80).y(150).thumbnail('https://s2.loli.net/2022/03/19/kfoHSKL792r4cvD.jpg', 250)
                }, [1, 2, 3])
        })
        .addProp((propGenerator) => {
            propGenerator
                .type('LIGHT')
                .name('Light 1')
                .namePosition('bottom')
                .nameScale(0.5)
                .nameXOffset(8)
                .nameYOffset(9)
                .scripts('Good Morning')
                .nameScale(0.5)
                .addPosition((positionGenerator) => {
                    positionGenerator.x(230).y(60).degree(180).scale(2)
                }, 1)
                .addPosition((positionGenerator) => {
                    positionGenerator.x(230).y(60).degree(180).scale(2).disable()
                }, 2)
                .addPosition((positionGenerator) => {
                    positionGenerator.x(230).y(60).degree(180).scale(2).enable()
                }, 3)
        })
}

console.log('Scene.js loaded')