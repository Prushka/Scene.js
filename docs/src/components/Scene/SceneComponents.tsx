import React from "react";
import {useEffect} from "react";
import {getDemoScene, generateRandomString, GlobalConfigGenerator} from '../../../../src/index';
import styles from './styles.module.css';
import BrowserOnly from "@docusaurus/BrowserOnly";


export const Scene = ({scene, uid, width, height}) => {
    useEffect(() => {
        scene.display()
    }, [])
    return (<div id={uid} style={{width: width, height: height}}></div>)
}


export const Button = ({
                           children, onClick = () => {
    }
                       }) => {
    return (
        <div className={styles.button}
             onClick={onClick}>
            <span>{children}</span>
        </div>
    )
};

export const SceneUserInteraction = ({scene, uid}) => {
    return (<BrowserOnly>
        {
            () =>
                <div className={styles.scene__actions}>
                    <Scene scene={scene} uid={uid} width={'100%'} height={'650px'}/>
                </div>

        }
    </BrowserOnly>)
}

export const SceneNormal = ({scene, uid}) => {
    return (<BrowserOnly>
        {
            () =>
                <div className={styles.scene__actions}>
                    <Button onClick={() => {
                        scene.snackbarCtx.error('test')
                    }}>test</Button>
                    <Scene scene={scene} uid={uid} width={'100%'} height={'650px'}/>
                </div>
        }
    </BrowserOnly>)
}


export function getScene() {
    const uid = generateRandomString()
    const scene = getDemoScene(uid)
    return {scene, uid}
}

export const sceneNormal = getScene()
export const sceneUserInteraction = getScene()