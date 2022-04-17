import React, {useEffect, useState} from "react";
import {
    generateRandomString,
    getDemoScene,
    GlobalConfigGenerator,
    PropConfigGenerator,
    Scene, getDemoGlobalConfigGenerator
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

export const SceneOnlyShort = ({scene, uid, autoPlay = false}) => {
    if (autoPlay) {
        scene.addAfterRender(() => {
            scene.play(true)
        })
    }
    return (<BrowserOnly>
        {
            () =>
                <div className='docs__actions'>
                    <SceneComponent scene={scene} uid={uid} width={'100%'} height={'460px'}/>
                </div>

        }
    </BrowserOnly>)
}

export const SceneWithSelection = ({scene, uid, propSelected, tabSelected}) => {
    scene.addAfterRender(() => {
        const prop = scene.propCtx.getPropByName(propSelected)
        if (prop) {
            scene.propCtx.selectedProp = prop
            if (tabSelected) {
                const propDialog = scene.propDialogComponent
                if (propDialog) {
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
    return (<div className={'action__card'}>
        <div className={'action__header'}>
            <h4>{title}</h4>
            <Button className={'action__button'} onClick={() => eval(action)}>{buttonText}</Button>
        </div>
        <CodeBlock language="js">
            {`${action}`}
        </CodeBlock>
    </div>)
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

function getPropSelectionDemo() {
    const config = new GlobalConfigGenerator().withFrameSpeed(1).withProps(1, 3).getConfig()
    config.props.push(
        new PropConfigGenerator().asRandom().shouldDisplayName(true).name('Select Me').withPosition(3).getConfig()
    )
    return config
}

export const sceneDeveloperInteractionManualSelection = getCustomScene(() => {
    return getPropSelectionDemo()
})

export const sceneDeveloperInteractionTabSelection = getCustomScene(() => {
    return getPropSelectionDemo()
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
    scene.addAfterRender(() => {
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
        .addProp((generator) => {
            generator.type('CHARACTER')
                .name('Eula')
                .scripts("Good Morning\n\nHow's your day???")
                .addPosition((positionGenerator) => {
                    positionGenerator.x(0).y(0)
                })
        }).getConfig()
})

export const sceneNote = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.type('TABLE')
                .name('Great Table')
                .note("Some note")
                .addPosition((positionGenerator) => {
                    positionGenerator.x(0).y(0)
                })
        }).getConfig()
})

export const sceneImages = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.type('LIGHT')
                .name("Here's LIGHT")
                .addImage("https://s2.loli.net/2022/04/16/YwqJ74RUlGaCv6H.jpg", "Light Style 1")
                .addImage("https://s2.loli.net/2022/04/16/2MOenGxdwJPl1Hz.jpg", "Light Style 2")
                .addImage("https://s2.loli.net/2022/03/16/KZw7yAWXudMGL21.png")
                .addPosition((positionGenerator) => {
                    positionGenerator.x(0).y(0)
                })
        }).getConfig()
})

export const sceneSteps = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.type('SHELF')
                .name("Bookcase")
                .addStep(5)
                .addStep(1, "Move this", "I mean move this")
                .addStep(2, "Paint this")
                .addStep(3, null, "I have empty title")
                .addPosition((positionGenerator) => {
                    positionGenerator.x(0).y(0)
                })
        }).getConfig()
})


export const sceneExtraKeys = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.type('LIGHT').name('Brand')
                .addData('brand', "I have a brand!")
                .addData('light type', "hard")
                .addData('color temperature', "5000")
                .addPosition((positionGenerator) => {
                    positionGenerator.x(0).y(0)
                })
        }).getConfig()
})

export const sceneExtraKeysExclude = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.type('LIGHT').name('Brand')
                .addData('brand', "I have a brand!")
                .addData('light type', "hard")
                .addData('color temperature', "5000")
                .addExcludeKey('style', 'color temperature')
                .addPosition((positionGenerator) => {
                    positionGenerator.x(0).y(0)
                })
        }).getConfig()
})

function getDemoMultipleFrame() {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.type('TABLE').addPosition((positionGenerator) => {
                positionGenerator.x(50).y(50)
            }).addPosition((positionGenerator) => {
                positionGenerator.x(90).y(90)
            }, 2)
        })
        .addProp((generator) => {
            generator.type('CAMERA').addPosition((positionGenerator) => {
                positionGenerator.x(200).y(200)
            }).addPosition((positionGenerator) => {
                positionGenerator.x(50).y(50)
            }, 2)
        })
}

export const sceneMultipleFrames = getCustomScene(() => {
    return getDemoMultipleFrame().getConfig()
})

export const sceneIntroDemo = getCustomScene(() => {
    return getDemoMultipleFrame().defaultOpenPropList(true).autoPlay(true).getConfig()
})

export const sceneScale = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.type('TABLE').addPosition((positionGenerator) => {
                positionGenerator.x(50).y(50).scaleY(2)
            }).addPosition((positionGenerator) => {
                positionGenerator.x(90).y(90).scaleX(2)
            }, 2).addPosition((positionGenerator) => {
                positionGenerator.x(90).y(90).scale(2)
            }, 3).shouldDisplayName(false)
        })
        .addProp((generator) => {
            generator.type('CHARACTER').addPosition((positionGenerator) => {
                positionGenerator.x(200).y(200).scale(0.5)
            }).addPosition((positionGenerator) => {
                positionGenerator.x(50).y(50).scale(2)
            }, 2).addPosition((positionGenerator) => {
                positionGenerator.x(90).y(90).scale(1)
            }, 3)
        }).getConfig()
})


export const sceneRotation = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.type('TABLE').addPosition((positionGenerator) => {
                positionGenerator.x(50).y(50).degree(60)
            }).addPosition((positionGenerator) => {
                positionGenerator.x(90).y(90).degree(180).scale(2)
            }, 2).addPosition((positionGenerator) => {
                positionGenerator.x(90).y(90).degree(300).scale(3)
            }, 3).shouldDisplayName(false)
        })
        .addProp((generator) => {
            generator.type('CHARACTER').addPosition((positionGenerator) => {
                positionGenerator.x(200).y(200)
            }).addPosition((positionGenerator) => {
                positionGenerator.x(50).y(50).degree(-40)
            }, 2).addPosition((positionGenerator) => {
                positionGenerator.x(90).y(90).degree(80)
            }, 3)
        }).getConfig()
})


export const sceneEnableDisableHide = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.type('TABLE').addPosition((positionGenerator) => {
                positionGenerator.x(50).y(50).hide()
            }).addPosition((positionGenerator) => {
                positionGenerator.x(90).y(90).show()
            }, 2).addPosition((positionGenerator) => {
                positionGenerator.x(90).y(90)
            }, 3).addPosition((positionGenerator) => {
                positionGenerator.x(90).y(90).hide()
            }, 4).shouldDisplayName(false)
        })
        .addProp((generator) => {
            generator.type('CHARACTER').addPosition((positionGenerator) => {
                positionGenerator.x(200).y(200).enable()
            }).addPosition((positionGenerator) => {
                positionGenerator.x(50).y(50).disable()
            }, 2).addPosition((positionGenerator) => {
                positionGenerator.x(90).y(90).disable()
            }, 3).addPosition((positionGenerator) => {
                positionGenerator.x(90).y(90).disable()
            }, 4)
        }).getConfig()
})

export const scenePropTransitionTimingFunction = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .withFrameSpeed(4, 2)
        .withFrameSpeed(5, 2)
        .addProp((generator) => {
            generator.type('TABLE').addPosition((positionGenerator) => {
                positionGenerator.x(50).y(50).transitionTimingFunction('ease-in')
            }).addPosition((positionGenerator) => {
                positionGenerator.x(90).y(90).transitionTimingFunction('ease-out')
            }, 2).addPosition((positionGenerator) => {
                positionGenerator.x(90).y(90)
            }, 3).addPosition((positionGenerator) => {
                positionGenerator.x(90).y(90)
            }, 4).addPosition((positionGenerator) => {
                positionGenerator.x(200).y(0).transitionTimingFunction('steps(5, jump-both)')
            }, 5).shouldDisplayName(false)
        })
        .addProp((generator) => {
            generator.type('CHARACTER').addPosition((positionGenerator) => {
                positionGenerator.x(200).y(200).transitionTimingFunction('steps(4, jump-start)')
            }).addPosition((positionGenerator) => {
                positionGenerator.x(50).y(50).transitionTimingFunction('ease, step-start, cubic-bezier(0.1, 0.7, 1.0, 0.1)')
            }, 2).addPosition((positionGenerator) => {
                positionGenerator.x(90).y(90)
            }, 3).addPosition((positionGenerator) => {
                positionGenerator.x(150).y(150).transitionTimingFunction('cubic-bezier(0.1, 0.7, 1.0, 0.1)')
            }, 4).addPosition((positionGenerator) => {
                positionGenerator.x(100).y(90).transitionTimingFunction('cubic-bezier(.09,.93,.36,1.14)')
            }, 5)
        }).getConfig()
})

export const sceneThumbnails = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addProp((generator) => {
            generator.type('STORYBOARD').addPosition((positionGenerator) => {
                positionGenerator.x(0).y(0).thumbnail('https://s2.loli.net/2022/03/16/KZw7yAWXudMGL21.png', 100)
            }).addPosition((positionGenerator) => {
                positionGenerator.x(25).y(25).thumbnail('https://s2.loli.net/2022/03/19/kfoHSKL792r4cvD.jpg', 200)
            }, 2).addPosition((positionGenerator) => {
                positionGenerator.x(90).y(90).degree(300).scale(0.5).degree(20)
            }, 3).shouldDisplayName(false)
        }).addProp((generator) => {
            generator.type('CHARACTER').addPosition((positionGenerator) => {
                positionGenerator.x(200).y(200)
            }).addPosition((positionGenerator) => {
                positionGenerator.x(50).y(50)
            }, 2).addPosition((positionGenerator) => {
                positionGenerator.x(90).y(90)
            }, 3)
        }).getConfig()
})

export const sceneWalls = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .viewOffset(1)
        .addLine({x: 300, y: -2}, {x: 300, y: 100})
        .addLine({x: 300, y: 98}, {x: 600, y: 98}, 5, '#355070')
        .addLine({x: 0, y: 0}, {x: 0, y: 200}, 10, '#6D597A')
        .addLine({x: 0, y: 0}, {x: 300, y: 0}, 3)
        .addProp((generator) => {
            generator.type('CHARACTER').addPosition((positionGenerator) => {
                positionGenerator.x(200).y(200).scale(2)
            }).addPosition((positionGenerator) => {
                positionGenerator.x(50).y(50).scale(2)
            }, 2).addPosition((positionGenerator) => {
                positionGenerator.x(90).y(90).scale(2)
            }, 3)
        }).getConfig()
})

export const sceneCustomPropTypes = getCustomScene(() => {
    return new GlobalConfigGenerator()
        .defaultOpenPropList(false)
        .defaultOpenToolbar(false)
        .addPropType('HOUSE', 'default',
            '<path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4H2.5z"/>',
            '<path fill-rule="evenodd" d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/><path fill-rule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/>')
        .addProp((generator) => {
            generator.type('HOUSE').addPosition((positionGenerator) => {
                positionGenerator.x(50).y(50).enable()
            }).addPosition((positionGenerator) => {
                positionGenerator.x(90).y(90).disable()
            }, 2)
        })
        .addProp((generator) => {
            generator.type('CAMERA').addPosition((positionGenerator) => {
                positionGenerator.x(200).y(200)
            }).addPosition((positionGenerator) => {
                positionGenerator.x(50).y(50)
            }, 2)
        }).getConfig()
})

export const sceneThemeInteraction = getCustomScene(() => {
    return getDemoGlobalConfigGenerator().getConfig()
})

export const sceneFilterPropsInteraction = getCustomScene(() => {
    return getViewOffsetDemoGenerator().defaultOpenPropList(true).addProp((generator) => {
        generator.type('TABLE').addPosition((positionGenerator) => {
            positionGenerator.x(100).y(100)
        })
    })
        .addProp((generator) => {
            generator.type('CAMERA').addPosition((positionGenerator) => {
                positionGenerator.x(150).y(150)
            })
        }).addProp((generator) => {
            generator.type('TABLE').addPosition((positionGenerator) => {
                positionGenerator.x(100).y(0)
            })
        })
        .addProp((generator) => {
            generator.type('CAMERA').addPosition((positionGenerator) => {
                positionGenerator.x(0).y(100)
            })
        }).addProp((generator) => {
            generator.type('CAMERA').addPosition((positionGenerator) => {
                positionGenerator.x(200).y(100)
            })
        }).getConfig()
})

export const scenePlayPauseFrames = getCustomScene(() => {
    return getDemoGlobalConfigGenerator().getConfig()
})

export const sceneDemo = getCustomScene(() => {
    return getDemoGlobalConfigGenerator().getConfig()
})

export const sceneDemoLanding = getCustomScene(() => {
    return getDemoGlobalConfigGenerator().getConfig()
})

export const sceneDemoShort = getCustomScene(() => {
    return getDemoGlobalConfigGenerator().getConfig()
})