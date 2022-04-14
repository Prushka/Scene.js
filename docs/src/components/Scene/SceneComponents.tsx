import React, {useEffect} from "react";
import {generateRandomString, getDemoScene, GlobalConfigGenerator, PropConfigGenerator, Scene} from '../../../../src/index';
import './scene.css';
import BrowserOnly from "@docusaurus/BrowserOnly";
import CodeBlock from '@theme/CodeBlock';

export const SceneComponent = ({scene, uid, width, height}) => {
    useEffect(() => {
        scene.display()
    }, [])
    return (<div id={uid} style={{width: width, height: height}}></div>)
}

export const Button = ({className='',
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
        <Button onClick={()=>eval(action)}>{buttonText}</Button>
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
}`} />
                    <CodeBlockWithAction title={`Toggle a prop's selection: `}
                                         buttonText={`Click to toggle prop selection with name: 'Select Me'`}
                                         scene={scene}
                                         action={
`const props = scene.propCtx.getPropsByName('Select Me')
if(props && props.length > 0){
    scene.propCtx.toggleSelected(props[0])
}`} />
                    <CodeBlockWithAction title={`Check if a prop is selected: `}
                                         buttonText={`Click to check if prop: 'Select Me' is selected`}
                                         scene={scene}
                                         action={
                                             `const props = scene.propCtx.getPropsByName('Select Me')
if(props && props.length > 0){
    const isSelected = scene.propCtx.isPropSelected(props[0])
    const selectedString = isSelected ? 'is' : 'is not'
    scene.snackbarCtx.snackbar("Prop: Select Me "+selectedString+" selected", !isSelected)
}`} />



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