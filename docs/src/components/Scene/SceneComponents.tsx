import React, {useEffect, useState} from "react";
import {
    generateRandomString,
    getDemoScene,
    GlobalConfigGenerator,
    PropConfigGenerator,
    Scene
} from '../../../../src/index';
import './scene.css';
import BrowserOnly from "@docusaurus/BrowserOnly";
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export const SceneComponent = ({scene, uid, width, height}) => {
    useEffect(() => {
        scene.display()
    }, [])
    return (<div id={uid} style={{width: width, height: height}}></div>)
}

export const Button = ({
                           className = '',
                           children, onClick = () => {
    }
                       }) => {
    return (
        <div className={`docs__button ${className}`}
             onClick={onClick}>
            <span>{children}</span>
        </div>
    )
};

export const SceneOnly = ({scene, uid}) => {
    return (<BrowserOnly>
        {
            () =>
                <div className='docs__actions'>
                    <SceneComponent scene={scene} uid={uid} width={'100%'} height={'650px'}/>
                </div>

        }
    </BrowserOnly>)
}

export const SceneOnlyShort = ({scene, uid}) => {
    return (<BrowserOnly>
        {
            () =>
                <div className='docs__actions'>
                    <SceneComponent scene={scene} uid={uid} width={'100%'} height={'450px'}/>
                </div>

        }
    </BrowserOnly>)
}

export const GeneratorConfigBlock = ({generator, config}) => {
    return (<Tabs>
        <TabItem value="generator" label="Global Config Generator" default>

            <CodeBlock language={'js'}>
                {`${generator}`}
            </CodeBlock>


        </TabItem>
        <TabItem value="config" label="Config">

            <CodeBlock language={'js'}>
                {`${config}`}
            </CodeBlock>

        </TabItem>
    </Tabs>)

}

export const SceneSnackbar = ({scene, uid}) => {
    return (<BrowserOnly>
        {
            () =>
                <div className='docs__actions'>
                    <h4>To display a message with success type: </h4>
                    <CodeBlock language="js">
                        {`scene.snackbarCtx.success('Your success message')`}
                    </CodeBlock>
                    <Button className='docs__button--success' onClick={() => {
                        scene.snackbarCtx.success('Your success message')
                    }}>Click to display a success message</Button>

                    <h4>To display a message with error type: </h4>
                    <CodeBlock language="js">
                        {`scene.snackbarCtx.error('Your error message')`}
                    </CodeBlock>
                    <Button className='docs__button--error' onClick={() => {
                        scene.snackbarCtx.error('Your error message')
                    }}>Click to display an error message</Button>
                    <SceneComponent scene={scene} uid={uid} width={'100%'} height={'650px'}/>
                </div>
        }
    </BrowserOnly>)
}

export const CodeBlockWithAction = ({title, buttonText, action, scene}) => {
    return (<>
        <h4>{title}</h4>
        <CodeBlock language="js">
            {`${action}`}
        </CodeBlock>
        <Button onClick={() => eval(action)}>{buttonText}</Button>
    </>)
}

export const ScenePropManualSelection = ({scene, uid}) => {
    return (<BrowserOnly>
        {
            () =>
                <div className='docs__actions'>
                    <CodeBlockWithAction title={'Select a prop by its name: '}
                                         buttonText={`Click to select prop with name: 'Select Me'`}
                                         scene={scene}
                                         action={
                                             `const props = scene.propCtx.getPropsByName('Select Me')
if(props && props.length > 0){
    scene.propCtx.selectedProp = props[0]
}`}/>
                    <CodeBlockWithAction title={`Toggle a prop's selection: `}
                                         buttonText={`Click to toggle prop selection with name: 'Select Me'`}
                                         scene={scene}
                                         action={
                                             `const props = scene.propCtx.getPropsByName('Select Me')
if(props && props.length > 0){
    scene.propCtx.toggleSelected(props[0])
}`}/>
                    <CodeBlockWithAction title={`Check if a prop is selected: `}
                                         buttonText={`Click to check if prop: 'Select Me' is selected`}
                                         scene={scene}
                                         action={
                                             `const props = scene.propCtx.getPropsByName('Select Me')
if(props && props.length > 0){
    const isSelected = scene.propCtx.isPropSelected(props[0])
    const selectedString = isSelected ? 'is' : 'is not'
    scene.snackbarCtx.snackbar("Prop: Select Me "+selectedString+" selected", !isSelected)
}`}/>


                    <SceneComponent scene={scene} uid={uid} width={'100%'} height={'650px'}/>
                </div>
        }
    </BrowserOnly>)
}

export function getScene() {
    const uid = generateRandomString()
    const scene = getDemoScene(uid)
    return {scene, uid}
}

export function getCustomScene(f: () => {}) {
    const uid = generateRandomString()
    const scene = new Scene(uid, f())
    return {scene, uid}
}

export const sceneNormal = getScene()
export const sceneSnackbar = getScene()
export const sceneUserInteractionToolbar = getCustomScene(() => {
    return new GlobalConfigGenerator().withFrameSpeed().showPropList(false).showTimeline(false).withProps().getConfig()
})
export const sceneUserInteractionTimeline = getCustomScene(() => {
    return new GlobalConfigGenerator().withFrameSpeed().showPropList(false).showToolbar(false).withProps().getConfig()
})
export const sceneUserInteractionPropList = getCustomScene(() => {
    return new GlobalConfigGenerator().withFrameSpeed().showToolbar(false).showTimeline(false).withProps().getConfig()
})
export const sceneUserInteractionPropDialog = getCustomScene(() => {
    return new GlobalConfigGenerator().withFrameSpeed().showToolbar(false).showTimeline(false).withProps().getConfig()
})
export const sceneUserInteractionViewport = getCustomScene(() => {
    return new GlobalConfigGenerator().withFrameSpeed().withProps().getConfig()
})
export const sceneDeveloperInteractionManualSelection = getCustomScene(() => {
    const config = new GlobalConfigGenerator().withFrameSpeed(1).withProps(1, 3).getConfig()
    config.props.push(
        new PropConfigGenerator().asRandom().shouldDisplayName(true).withName('Select Me').withPosition(3).getConfig()
    )
    return config
})

export const sceneNoToolbar = getCustomScene(() => {
    return new GlobalConfigGenerator().withFrameSpeed().showToolbar(false).withProps().getConfig()
})
export const sceneHideToolbar = getCustomScene(() => {
    return new GlobalConfigGenerator().withFrameSpeed().defaultOpenToolbar(false).withProps().getConfig()
})

export const sceneNoPropList = getCustomScene(() => {
    return new GlobalConfigGenerator().withFrameSpeed().showPropList(false).withProps().getConfig()
})
export const sceneHidePropList = getCustomScene(() => {
    return new GlobalConfigGenerator().withFrameSpeed().defaultOpenPropList(false).withProps().getConfig()
})

export const sceneNoTimeline = getCustomScene(() => {
    return new GlobalConfigGenerator().withFrameSpeed().showTimeline(false).withProps().getConfig()
})

export const sceneNoTimelineToolbarPropList = getCustomScene(() => {
    return new GlobalConfigGenerator().withFrameSpeed().showPropList(false).showTimeline(false).showToolbar(false).withProps().getConfig()
})

export const sceneHideToolbarPropList = getCustomScene(() => {
    return new GlobalConfigGenerator().withFrameSpeed().defaultOpenPropList(false).defaultOpenToolbar(false).withProps().getConfig()
})

export const sceneDefaultDarkTheme = getCustomScene(() => {
    return new GlobalConfigGenerator().withFrameSpeed().defaultOpenPropList(false).defaultTheme('dark').withProps().getConfig()
})

export const sceneDefaultCustomTheme = getCustomScene(() => {
    return new GlobalConfigGenerator().withFrameSpeed()
        .defaultOpenPropList(false)
        .customTheme('my-custom-theme', {
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
        }).defaultTheme('my-custom-theme').withProps().getConfig()
})

export const SceneZoom = ({scene, uid}) => {
    const [zoomFactor, setZoomFactor] = useState(0)
    useEffect(() => {
        setZoomFactor(scene.getViewportCtx().scale)
        scene.getViewportCtx().setOnZoom((n) => {
            setZoomFactor(n)
        })
    }, [])
    return (<BrowserOnly>
        {
            () =>
                <>
                    <Button>
                        Zoom: {`${zoomFactor}`}
                    </Button>
                    <div className='docs__actions'>
                        <SceneComponent scene={scene} uid={uid} width={'100%'} height={'450px'}/>
                    </div>
                </>

        }
    </BrowserOnly>)
}

export const sceneZoomInLimit = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .zoomUpperBound(1)
        .withFrameSpeed()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .withProps().getConfig()
})