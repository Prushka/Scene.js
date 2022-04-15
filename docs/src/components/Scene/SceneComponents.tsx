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

export const SceneWithSelection = ({scene, uid, propSelected, tabSelected}) => {
    scene.setAfterRender(()=>{
        const prop = scene.propCtx.getPropByName(propSelected)
        if(prop){
            scene.propCtx.selectedProp = prop
            if(tabSelected){
                const propDialog = scene.propDialogComponent
                if(propDialog){
                    propDialog.selectTab(tabSelected)
                }
            }
        }
    })
    return (<BrowserOnly>
        {
            () =>
                <SceneOnlyShort scene={scene} uid={uid}/>
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

export const GeneratorWithPropConfigBlock = ({generator, propGenerator, config}) => {
    return (<Tabs>
        <TabItem value="globalGenerator" label="Global Config Generator" default>

            <CodeBlock language={'js'}>
                {`${generator}`}
            </CodeBlock>


        </TabItem>

        <TabItem value="propGenerator" label="Prop Config Generator" default>

            <CodeBlock language={'js'}>
                {`${propGenerator}`}
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
        new PropConfigGenerator().asRandom().shouldDisplayName(true).name('Select Me').withPosition(3).getConfig()
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
    const [zoomStep, setZoomStep] = useState(0)
    scene.setAfterRender(() => {
        const viewportCtx = scene.getViewportCtx()
        const round = (input) => input.toFixed(2)
        setZoomFactor(round(scene.getViewportCtx().scale))
        scene.getViewportCtx().setOnZoom((n, prev) => {
            setZoomStep(round(n - prev))
            setZoomFactor(round(n))
        })
    })
    return (<BrowserOnly>
        {
            () =>
                <>
                    <Button>
                        Zoom: {zoomFactor} | Step: {zoomStep}
                    </Button>
                    <div className='docs__actions'>
                        <SceneComponent scene={scene} uid={uid} width={'100%'} height={'650px'}/>
                    </div>
                </>

        }
    </BrowserOnly>)
}

export const sceneZoomInLimit = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .zoomUpperBound(0.9)
        .zoomLowerBound(0.6)
        .withFrameSpeed()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .withProps().getConfig()
})

export const sceneZoomStep = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .zoomUpperBound(3)
        .zoomLowerBound(0.2)
        .zoomStep(1.3)
        .withFrameSpeed()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .withProps().getConfig()
})

function getDialogDemoGenerator() {
    return new GlobalConfigGenerator()
        .withFrameSpeed(4)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.name('Only General').type().withPosition(4)
        })
        .addProp((generator) => {
            generator.name('With Note').note("Here's some note").type().withPosition(4)
        })
        .addProp((generator) => {
            generator.name('With Scripts, Images')
                .type().scripts('Some SCRIPT!\nSCRIPT!')
                .images().withPosition(4)
        })
        .addProp((generator) => {
            generator.name('With Steps, Images')
                .type().images()
                .steps().withPosition(4)
        })
}

export const sceneDialogMissing = getCustomScene(() => {
    return getDialogDemoGenerator()
        .getConfig()
})

export const sceneDialogAll = getCustomScene(() => {
    return getDialogDemoGenerator()
        .alwaysShowAllDialogTabs(true)
        .getConfig()
})

export const sceneDialogShowDebug = getCustomScene(() => {
    return getDialogDemoGenerator()
        .showDialogDebugTab(true)
        .getConfig()
})

export const sceneDialogShowDebugFlat = getCustomScene(() => {
    return getDialogDemoGenerator()
        .showDialogDebugTab(true)
        .dialogDebugTabFormat('flat')
        .getConfig()
})

export const sceneFrameSpeed124 = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .withFrameSpeed(1, 1)
        .withFrameSpeed(2, 2)
        .withFrameSpeed(3, 4)
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .withProps(5, 3).getConfig()
})

export const sceneFrameSpeedDefaultFS = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .withFrameSpeed(1, 1)
        .withFrameSpeed(2, 2)
        .withFrameSpeed(3, 4)
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .withProps(5, 6).getConfig()
})

export const sceneFrameSpeedDefaultFS5s = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .withFrameSpeed(1, 1)
        .withFrameSpeed(2, 2)
        .withFrameSpeed(3, 4)
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .defaultFrameSpeed(5)
        .withProps(5, 6).getConfig()
})

export const sceneSelectionSpeed = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .withFrameSpeed(1, 10)
        .withFrameSpeed(2, 10)
        .withFrameSpeed(3, 10)
        .withFrameSpeed(4, 10)
        .withProps(5, 4).getConfig()
})

export const sceneSelectionSpeed0 = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .withFrameSpeed(1, 10)
        .withFrameSpeed(2, 10)
        .withFrameSpeed(3, 10)
        .withFrameSpeed(4, 10)
        .frameSelectionSpeed(0)
        .withProps(5, 4).getConfig()
})

export const sceneSelectionSpeed03 = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .withFrameSpeed(1, 10)
        .withFrameSpeed(2, 10)
        .withFrameSpeed(3, 10)
        .withFrameSpeed(4, 10)
        .frameSelectionSpeed(0.3)
        .withProps(5, 4).getConfig()
})

export const sceneDefaultTransitionFunction = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .withProps(5, 4).getConfig()
})

export const sceneTransitionFunctionEaseInOut = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .transitionTimingFunction('ease-in-out')
        .withProps(5, 4).getConfig()
})

function getViewOffsetDemoGenerator() {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.type('TABLE').addPosition((positionGenerator) => {
                positionGenerator.x(50).y(50)
            })
        })
        .addProp((generator) => {
            generator.type('CAMERA').addPosition((positionGenerator) => {
                positionGenerator.x(200).y(200)
            })
        })
}

export const sceneViewOffsetDefault = getCustomScene(() => {
    return getViewOffsetDemoGenerator().getConfig()
})

export const sceneViewOffset09 = getCustomScene(() => {
    return getViewOffsetDemoGenerator().viewOffset(0.9).getConfig()
})

function getThemeRootDemoGenerator() {
    return new GlobalConfigGenerator()
        .withFrameSpeed()
        .defaultOpenPropList(false)
        .withProps()
        .themeScope('root')
        .getConfig()
}

export const sceneThemeRoot1 = getCustomScene(() => {
    return getThemeRootDemoGenerator()
})

export const sceneThemeRoot2 = getCustomScene(() => {
    return getThemeRootDemoGenerator()
})

export const sceneThemeRoot3 = getCustomScene(() => {
    return getThemeRootDemoGenerator()
})

export const sceneCreateProp = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.type('TABLE').addPosition((positionGenerator) => {
                positionGenerator.x(50).y(50)
            })
        })
        .addProp((generator) => {
            generator.type('CAMERA').addPosition((positionGenerator) => {
                positionGenerator.x(200).y(200)
            })
        }).getConfig()
})

export const scenePropName = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.type('TABLE').name('I have name').addPosition((positionGenerator) => {
                positionGenerator.x(50).y(50)
            })
        })
        .addProp((generator) => {
            generator.type('CAMERA').addPosition((positionGenerator) => {
                positionGenerator.x(200).y(200)
            })
        }).getConfig()
})

export const scenePropNameScale = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.type('TABLE').name('Scale 1')
                .addPosition((positionGenerator) => {
                    positionGenerator.x(0).y(0)
                })
        })
        .addProp((generator) => {
            generator.type('TABLE').name('Scale 0.5')
                .nameScale(0.5)
                .addPosition((positionGenerator) => {
                    positionGenerator.x(0).y(200)
                })
        })
        .addProp((generator) => {
            generator.type('TABLE').name('Scale 2')
                .nameScale(2)
                .addPosition((positionGenerator) => {
                    positionGenerator.x(200).y(0)
                })
        }).getConfig()
})

export const scenePropHideName = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.type('TABLE').name(`I have name but you can't see it`)
                .shouldDisplayName(false).addPosition((positionGenerator) => {
                positionGenerator.x(50).y(50)
            })
        })
        .addProp((generator) => {
            generator.type('TABLE').name(`I have name and you can see it`).addPosition((positionGenerator) => {
                positionGenerator.x(200).y(200)
            })
        }).getConfig()
})

export const scenePropType = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.type('TABLE').addPosition((positionGenerator) => {
                positionGenerator.x(50).y(50)
            })
        })
        .addProp((generator) => {
            generator.type().addPosition((positionGenerator) => {
                positionGenerator.x(200).y(200)
            })
        }).getConfig()
})

export const scenePropStyle = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.type('TABLE').addPosition((positionGenerator) => {
                positionGenerator.x(50).y(50)
            })
        })
        .addProp((generator) => {
            generator.type('TABLE').style('fillSquare').addPosition((positionGenerator) => {
                positionGenerator.x(200).y(200)
            })
        }).getConfig()
})

export const sceneNamePosition = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.type('TABLE')
                .name('top')
                .namePosition('top')
                .addPosition((positionGenerator) => {
                    positionGenerator.x(0).y(0)
                })
        })
        .addProp((generator) => {
            generator.type('TABLE')
                .name('left')
                .namePosition('left')
                .addPosition((positionGenerator) => {
                    positionGenerator.x(150).y(150)
                })
        })
        .addProp((generator) => {
            generator.type('TABLE')
                .name('right')
                .namePosition('right')
                .addPosition((positionGenerator) => {
                    positionGenerator.x(0).y(150)
                })
        })
        .addProp((generator) => {
            generator.type('TABLE')
                .name('bottom')
                .namePosition('bottom')
                .addPosition((positionGenerator) => {
                    positionGenerator.x(150).y(0)
                })
        })
        .addProp((generator) => {
            generator.type('TABLE')
                .name('center')
                .namePosition('center')
                .addPosition((positionGenerator) => {
                    positionGenerator.x(75).y(75)
                })
        }).getConfig()
})

export const sceneDefaultLightColor = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .withProps(12, 2).getConfig()
})

export const sceneDefaultDarkColor = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .defaultTheme('dark')
        .withProps(12, 2).getConfig()
})

export const scenePropColor = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.type('TABLE')
                .color('#F8B195')
                .addPosition((positionGenerator) => {
                    positionGenerator.x(0).y(0)
                })
        })
        .addProp((generator) => {
            generator.type('TABLE')
                .color('#C06C84')
                .addPosition((positionGenerator) => {
                    positionGenerator.x(150).y(0)
                })
        })
        .addProp((generator) => {
            generator.type('TABLE')
                .color('#6C5B7B')
                .addPosition((positionGenerator) => {
                    positionGenerator.x(0).y(150)
                })
        })
        .addProp((generator) => {
            generator.type('TABLE')
                .color('#F67280')
                .addPosition((positionGenerator) => {
                    positionGenerator.x(150).y(150)
                })
        })
        .addProp((generator) => {
            generator.type('TABLE')
                .color('#355C7D')
                .addPosition((positionGenerator) => {
                    positionGenerator.x(75).y(75)
                })
        }).getConfig()
})


export const scenePropColorWithNameColor = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.type('TABLE')
                .color('#F8B195')
                .nameColor('#525B88')
                .addPosition((positionGenerator) => {
                    positionGenerator.x(0).y(0)
                })
        })
        .addProp((generator) => {
            generator.type('TABLE')
                .color('#C06C84')
                .nameColor('#B6B049')
                .addPosition((positionGenerator) => {
                    positionGenerator.x(150).y(0)
                })
        })
        .addProp((generator) => {
            generator.type('TABLE')
                .color('#6C5B7B')
                .nameColor('#B8293D')
                .addPosition((positionGenerator) => {
                    positionGenerator.x(0).y(150)
                })
        })
        .addProp((generator) => {
            generator.type('TABLE')
                .color('#F67280')
                .nameColor('#035956')
                .addPosition((positionGenerator) => {
                    positionGenerator.x(150).y(150)
                })
        })
        .addProp((generator) => {
            generator.type('TABLE')
                .color('#355C7D')
                .nameColor('#BFA8BB')
                .addPosition((positionGenerator) => {
                    positionGenerator.x(75).y(75)
                })
        }).getConfig()
})


export const sceneNamePositionWithOffset = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.type('TABLE')
                .name('y: -15')
                .nameYOffset(-15)
                .addPosition((positionGenerator) => {
                    positionGenerator.x(0).y(0)
                })
        })
        .addProp((generator) => {
            generator.type('TABLE')
                .name('left & x: 50 | y: 20')
                .namePosition('left')
                .nameOffset(50, 20)
                .addPosition((positionGenerator) => {
                    positionGenerator.x(150).y(150)
                })
        }).getConfig()
})

export const sceneOrderDefault = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .viewOffset(0.9)
        .addProp((generator) => {
            generator.type('TABLE')
                .style('fillSquare')
                .addPosition((positionGenerator) => {
                    positionGenerator.x(0).y(0).scale(10)
                })
        })
        .addProp((generator) => {
            generator.type('TABLE')
                .style('fillSquare')
                .addPosition((positionGenerator) => {
                    positionGenerator.x(-50).y(-50).scale(8)
                })
        })
        .addProp((generator) => {
            generator.type('TABLE')
                .style('fillSquare')
                .addPosition((positionGenerator) => {
                    positionGenerator.x(30).y(30).scale(5)
                })
        }).getConfig()
})

export const sceneOrderSet = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .viewOffset(0.9)
        .addProp((generator) => {
            generator.type('TABLE')
                .style('fillSquare')
                .renderOrder(1)
                .addPosition((positionGenerator) => {
                    positionGenerator.x(0).y(0).scale(10)
                })
        })
        .addProp((generator) => {
            generator.type('TABLE')
                .style('fillSquare')
                .renderOrder(5)
                .addPosition((positionGenerator) => {
                    positionGenerator.x(-50).y(-50).scale(8)
                })
        })
        .addProp((generator) => {
            generator.type('TABLE')
                .style('fillSquare')
                .renderOrder(4)
                .addPosition((positionGenerator) => {
                    positionGenerator.x(30).y(30).scale(5)
                })
        }).getConfig()
})

export const sceneScripts = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .viewOffset(1.8)
        .addProp((generator) => {
            generator.type('CHARACTER')
                .name('Eula')
                .scripts("Good Morning\n\nHow's your day???")
                .addPosition((positionGenerator) => {
                    positionGenerator.x(0).y(0).scale(10)
                })
        }).getConfig()
})