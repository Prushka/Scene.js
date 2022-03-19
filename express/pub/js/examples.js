/*
 * Copyright 2022 Dan Lyu.
 */
'use strict'

function demo(rootRootId) {
    let randomNamePosition = false
    let randomNameScale = false
    const sImages = [
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
    const getSharedProp = () => {
        const s = {}
        if (sceneBlocking.randBoolean()) {
            s['note'] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        }
        if (sceneBlocking.randBoolean()) {
            s['scripts'] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit,\n123\n\na: c"
        }
        if (sceneBlocking.randBoolean()) {
            s['images'] = sImages
        }
        if (sceneBlocking.randBoolean()) {
            s['steps'] =
                {
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
                    1: {}
                }
        }
        return s
    }
    const sharedConfig = {
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
        },
        renderMethod: 'svg',
    }

    const getRandomPosition = () => {
        const scale = sceneBlocking.randInclusive(8, 46) / 10
        return {
            enabled: sceneBlocking.randBoolean(),
            x: Math.random() * 750,
            y: Math.random() * 750,
            degree: Math.random() * 360,
            scaleX: scale,
            scaleY: scale,
        }
    }

    const sImage1 = {
        title: "something",
        imageURL: "https://s2.loli.net/2022/03/19/kfoHSKL792r4cvD.jpg",
        width: 400
    }
    const sImage2 = {
        title: "something",
        imageURL: "https://s2.loli.net/2022/03/19/iN9yLYWoE28z5MI.jpg",
        width: 300
    }

    const getStoryBoard = (image) => {
        return {
            type: "STORYBOARD",
            script: "Some storyboard script",
            orderIndex: 20,
            namePosition: 'bottom',
            shouldDisplayName: false,
            frameAnimationConfig: {
                1: {
                    x: 100, y: 100, thumbnail: image,
                    degree: 0
                },
                2: {
                    x: 60, y: 60, thumbnail: image,
                    degree: 40
                }
            },
            images: sImages
        }
    }
    const allPropTypes = Object.values(sceneBlocking.PropType)
    let allIconPropTypes = [...allPropTypes]
    const allPositions = ['top', 'bottom', 'right', 'left']
    allIconPropTypes = allIconPropTypes.filter(i => {
        return i !== 'STORYBOARD' && i !== 'SCRIPT'
    })
    const getRandom = (frames) => {
        const type = sceneBlocking.getRandomFromList(allIconPropTypes)
        const s = {}
        for (let i = 0; i < frames; i++) {
            s[i + 1] = getRandomPosition()
        }
        return {
            ...getSharedProp(),
            nameScale: randomNameScale ? sceneBlocking.randInclusive(2, 20) / 10 : 1,
            type: type,
            brand: "Random",
            style: sceneBlocking.getRandomFromList(Object.keys(sceneBlocking.PropTypeIcons[type])),
            someValue: 5000,
            frameAnimationConfig: s,
            shouldDisplayName: !!sceneBlocking.randInclusive(0, 1),
            namePosition: randomNamePosition ? sceneBlocking.getRandomFromList(allPositions) : 'top',
        }
    }

    const getRandoms = (howMany, frames) => {
        const s = []
        for (let i = 0; i < howMany; i++) {
            s.push(getRandom(frames))
        }
        return s
    }

    const getRandomFrameSpeed = (frames) => {
        const s = {}
        for (let i = 0; i < frames; i++) {
            s[i + 1] = sceneBlocking.randInclusive(3, 30) / 10
        }
        return s
    }

    const rootContainer = document.getElementById(rootRootId)
    let ids = 0
    const display = (content, config, width, height) => {
        const rootRoot = document.createElement('div')
        rootRoot.id = `root-${ids}`
        const root = document.createElement('div')
        root.id = `scene-${ids}`
        ids += 1
        const contentEl = document.createElement('p')
        contentEl.innerText = content
        rootRoot.append(contentEl, root)
        rootContainer.append(rootRoot)
        if (width) {
            root.style.width = width
            root.style.height = height
        }

        const ctx = new sceneBlocking.Context(root.id, {
            ...sharedConfig,
            ...config
        })
        ctx.display()
    }

    display(
        `A scene example`,
        {
            frameSpeed: {
                1: 1,
                2: 2,
                3: 1
            },
            props: [{
                type: 'CAMERA',
                name: 'Behind Stage Camera',
                nameScale: 0.5,
                frameAnimationConfig: {
                    1: {x: 50, y: 50, degree: 30},
                    2: {x: 20, y: 150},
                    3: {x: 50, y: 250, degree: -30}
                }
            },
                {
                    type: 'TABLE',
                    name: 'Main Table',
                    style: 'fillSquare',
                    shouldDisplayName: false,
                    frameAnimationConfig: {
                        1: {x: 150, y: 70, scaleX: 8, scaleY: 8},
                        2: {x: 150, y: 70, scaleX: 8, scaleY: 8},
                        3: {x: 150, y: 70, scaleX: 8, scaleY: 8},
                    }
                },
                {
                    type: 'CAMERA',
                    name: 'Camera A',
                    color: 'rgb(201,201,201)',
                    frameAnimationConfig: {
                        1: {x: 170, y: 140, degree: 210},
                        2: {x: 170, y: 120, degree: 200},
                        3: {x: 170, y: 140, degree: 210}
                    }
                },
                {
                    type: 'CAMERA',
                    name: 'Camera B',
                    color: 'rgb(199,199,199)',
                    frameAnimationConfig: {
                        1: {x: 230, y: 140, degree: 20},
                        2: {x: 230, y: 140, degree: 0},
                        3: {x: 230, y: 140, degree: 20}
                    }
                },
                {
                    type: 'SHELF',
                    texture: 'wood',
                    shouldDisplayName: false,
                    frameAnimationConfig: {
                        1: {x: 400, y: 150, degree: 0},
                        2: {x: 400, y: 150, degree: 0},
                        3: {x: 320, y: 170, degree: 0}
                    }
                },
                {
                    type: 'CHARACTER',
                    name: 'Emily',
                    frameAnimationConfig: {
                        1: {x: 120, y: 100, degree: 20},
                        2: {x: 120, y: 100, degree: -20},
                        3: {x: 120, y: 100, degree: 20},
                    }
                }, {
                    type: 'CHARACTER',
                    name: 'Elizabeth',
                    script: 'Good Evening',
                    frameAnimationConfig: {
                        1: {x: 290, y: 170, degree: 0},
                        2: {x: 380, y: 160, degree: -10},
                        3: {x: 290, y: 170, degree: 0},
                    }
                }, {
                    type: 'CHARACTER',
                    name: 'Eric',
                    script: 'Good Morning',
                    frameAnimationConfig: {
                        1: {x: 400, y: 80, degree: 100},
                        2: {x: 250, y: 20, degree: 150},
                        3: {x: 400, y: 80, degree: 100},
                    }
                }, {
                    type: 'STORYBOARD',
                    shouldDisplayName: false,
                    frameAnimationConfig: {
                        1: {x: 210, y: 150, degree: 0, thumbnail: sImage1, scaleX: 0.5, scaleY: 0.5},
                        2: {x: 210, y: 150, degree: 0, thumbnail: sImage1, scaleX: 0.5, scaleY: 0.5},
                        3: {x: 210, y: 150, degree: 0, thumbnail: sImage1, scaleX: 0.5, scaleY: 0.5}
                    }
                }, {
                    type: 'LIGHT',
                    name: 'Light 1',
                    namePosition: 'bottom',
                    nameScale: 0.5,
                    nameYOffset: 8,
                    nameXOffset: 9,
                    frameAnimationConfig: {
                        1: {x: 230, y: 60, degree: 180, scaleX: 2, scaleY: 2},
                        2: {x: 230, y: 60, degree: 180, scaleX: 2, scaleY: 2, enabled: false},
                        3: {x: 230, y: 60, degree: 180, scaleX: 2, scaleY: 2, enabled: true}
                    }
                }]
        }, '80vw', '700px')

    let frames = 5
    display(
        `A completely random scene to demonstrate basic functionalities\nshows all interface elements (and sets them to open) and max width`,
        {
            frameSpeed: getRandomFrameSpeed(frames),
            props: [...getRandoms(11, frames)]
        }, '100vw', '700px')

    display('A random scene\nwith mobile style, hides all interface elements and another light theme', {
        frameSpeed: getRandomFrameSpeed(frames),
        defaultTheme: "light-custom",
        defaultOpenToolbar: false,
        defaultOpenPropList: false,
        props: [...getRandoms(8, frames)]
    }, '400px', '800px')
    frames = 4
    display('A random scene\nwith no toolbar or prop list, shows all debug details in prop dialog and 1 storyboard', {
        frameSpeed: getRandomFrameSpeed(frames),
        displayToolbar: false,
        displayPropList: false,
        dialogShowAllProperties: true,
        props: [...getRandoms(8, frames),
            getStoryBoard(sImage1)]
    }, '90vw', '800px')

    frames = 7
    display(`A random scene\n with walls, slower default frame speed, a dark theme and a director's viewfinder`, {
        frameSpeed: getRandomFrameSpeed(frames),
        defaultOpenPropList: false,
        defaultTheme: 'dark',
        frameSelectionSpeed: 5,
        lines: [
            [{x: 300, y: -2}, {x: 300, y: 100}, {color: 'var(--scene-base-inv-s2)', width: 3}],
            [{x: 300, y: 98}, {x: 600, y: 98}, {color: 'var(--scene-base-inv-s2)', width: 3}],
            [{x: 0, y: 0}, {x: 300, y: 0}, {color: 'var(--scene-base-inv-s2)', width: 3}]],
        props: [...getRandoms(8, frames), getStoryBoard(sImage2)]
    }, '90vw', '800px')

    frames = 1
    randomNamePosition = true
    randomNameScale = true
    display('A random static scene\n with larger zoom factors, always show all dialog tabs, another dark theme,\nrandom name position (top/bottom/right/center), random name scale and random name offsets', {
        frameSpeed: getRandomFrameSpeed(frames),
        zoomFactor: 1.2,
        defaultTheme: 'dark-classic',
        alwaysShowAllDialogTabs: true,
        props: [...getRandoms(16, frames)]
    }, '90vw', '800px')
}

demo('container')