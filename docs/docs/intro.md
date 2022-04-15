---
sidebar_position: 1
---

# Scene.js Intro

This is a **JavaScript** library. It can be used to display one or multiple instances of **scene(s)**.

**Scene** refers to a stage or scene used in theater and film (See: [Wikipedia](https://en.wikipedia.org/wiki/Blocking_(stage))).

Such scene consists of **characters, props, cameras, lights** etc., their **positions** and their **animations**.

## Movie Prop Properties

Every prop can also contain following properties:
* Type
* Style
* Is enabled
* Color
* Name
* Note
* Scripts
* Steps (a list of step number with instructions)
* Multiple images with titles (*e.g.,* storyboard/director's viewfinder)


## Getting Started

To import this library, all you need to do is include one script tag in your header:

(You don't need to include any extra libraries or css files)


```html
<script defer type="text/javascript" src="js/scene.js"></script>
```

### Disclaimer

Even though this landing page is built using React and Docusaurus, the library doesn't use React.

In fact, the library doesn't use any external js/css libraries and can be used both in vanilla html/js with script tag and ESM environments.

The library uses Webpack to bundle its TypeScript files.

Bootstrap icon font is used for button icons and props.

## Create a scene

:::tip

The scene will be rendered in your container. It will take all your container's space (see below).

Note that you can use a css class for your container.

:::

### Create a demo scene

After you've included the library, you can use the following to create a demo scene to check if it works:

```html
<div id="some-container-id" style="width: 800px; height: 600px"/>
<script defer>
  const scene = sceneBlocking.getDemoScene('some-container-id');
  scene.display();
</script>
```

### Create a scene with config

Here's an example on how to create the scene using your own configurations.

You don't have to understand the following config. It will be covered in sections `Prop - Config` and `Global - Config`.

```html
<div id="some-container-id" style="width: 800px; height: 600px"/>
<script defer>
    const config = {
        "defaultTheme": "light",
        "themeScope": "container",
        "dialog": "embedded",
        "viewOffset": 0.2,
        "transitionTimingFunction": "linear",
        "frameSpeed": {
            "1": 2,
            "2": 0.8,
            "3": 1.5,
            "4": 1.5,
            "5": 3,
            "6": 1.2
        },
        "attachment": {},
        "defaultFrameSpeed": 1,
        "frameSelectionSpeed": 5,
        "defaultOpenPropList": true,
        "defaultOpenToolbar": true,
        "propTypes": {
            "HOUSE": {
                "default": {
                    "enabledPaths": "<path d=\"M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09zM4.157 8.5H7a.5.5 0 0 1 .478.647L6.11 13.59l5.732-6.09H9a.5.5 0 0 1-.478-.647L9.89 2.41 4.157 8.5z\"/>",
                    "disabledPaths": "<path d=\"M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z\"/>"
                }
            }
        },
        "lines": [],
        "alwaysShowAllDialogTabs": false,
        "props": [
            {
                "scripts": "Lorem ipsum dolor sit amet, consectetur adipiscing elit,\n123\n\na: c",
                "steps": {
                    "1": {},
                    "2": {
                        "title": "Here's step 2",
                        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris"
                    },
                    "3": {
                        "title": "Here's step 1",
                        "content": "Here's some content"
                    },
                    "4": {
                        "content": "aha"
                    },
                    "5": {
                        "title": "A title"
                    },
                    "6": {},
                    "7": {}
                },
                "nameScale": 1,
                "type": "DISPLAY",
                "brand": "Random",
                "style": "default",
                "someValue": 5000,
                "frameAnimationConfig": {
                    "1": {
                        "degree": 85.00407750344219,
                        "scaleX": 3.7,
                        "scaleY": 3.7,
                        "hide": false,
                        "enabled": false,
                        "x": 326.48311082572525,
                        "y": 569.7339851257781,
                        "transitionTimingFunction": "linear"
                    },
                    "2": {
                        "degree": 270.6461312142452,
                        "scaleX": 0.8,
                        "scaleY": 0.8,
                        "hide": false,
                        "enabled": false,
                        "x": 708.0025617647638,
                        "y": 571.4327721860516,
                        "transitionTimingFunction": "linear"
                    },
                    "3": {
                        "degree": 264.25216136801316,
                        "scaleX": 2.6,
                        "scaleY": 2.6,
                        "hide": false,
                        "enabled": false,
                        "x": 335.18844960624375,
                        "y": 323.77636158853255,
                        "transitionTimingFunction": "linear"
                    },
                    "4": {
                        "degree": 173.45872435201187,
                        "scaleX": 2,
                        "scaleY": 2,
                        "hide": false,
                        "enabled": true,
                        "x": 96.81709058773153,
                        "y": 282.88318661217664,
                        "transitionTimingFunction": "linear"
                    },
                    "5": {
                        "degree": 146.19829762864842,
                        "scaleX": 1.5,
                        "scaleY": 1.5,
                        "hide": false,
                        "enabled": true,
                        "x": 311.6396962089854,
                        "y": 149.39939972073873,
                        "transitionTimingFunction": "linear"
                    },
                    "6": {
                        "degree": 47.93236123502368,
                        "scaleX": 3.1,
                        "scaleY": 3.1,
                        "hide": false,
                        "enabled": false,
                        "x": 115.0014666889293,
                        "y": 742.0727115724357,
                        "transitionTimingFunction": "linear"
                    }
                },
                "shouldDisplayName": true,
                "namePosition": "top"
            },
            {
                "images": [
                    {
                        "title": "test",
                        "imageURL": "https://s2.loli.net/2022/02/10/grldkO4LeDjxmY8.png"
                    },
                    {
                        "imageURL": "https://s2.loli.net/2022/03/16/KZw7yAWXudMGL21.png"
                    },
                    {
                        "title": "A long picture",
                        "imageURL": "https://s2.loli.net/2022/03/16/tukpnVKZaUC7GIF.png"
                    }
                ],
                "nameScale": 1,
                "type": "LIGHT",
                "brand": "Random",
                "style": "lightning",
                "someValue": 5000,
                "frameAnimationConfig": {
                    "1": {
                        "degree": 291.14237528963156,
                        "scaleX": 4.1,
                        "scaleY": 4.1,
                        "hide": false,
                        "enabled": true,
                        "x": 640.8825991240356,
                        "y": 73.05043292860259,
                        "transitionTimingFunction": "linear"
                    },
                    "2": {
                        "degree": 155.18554586378235,
                        "scaleX": 1.4,
                        "scaleY": 1.4,
                        "hide": false,
                        "enabled": true,
                        "x": 177.84609428984544,
                        "y": 86.83551770405128,
                        "transitionTimingFunction": "linear"
                    },
                    "3": {
                        "degree": 203.59033678089912,
                        "scaleX": 4.4,
                        "scaleY": 4.4,
                        "hide": false,
                        "enabled": false,
                        "x": 301.36181917737395,
                        "y": 205.50614618299406,
                        "transitionTimingFunction": "linear"
                    },
                    "4": {
                        "degree": 127.37054845261929,
                        "scaleX": 1.1,
                        "scaleY": 1.1,
                        "hide": false,
                        "enabled": true,
                        "x": 667.5202017917915,
                        "y": 274.0835252766599,
                        "transitionTimingFunction": "linear"
                    },
                    "5": {
                        "degree": 33.11227600824448,
                        "scaleX": 2.8,
                        "scaleY": 2.8,
                        "hide": false,
                        "enabled": false,
                        "x": 744.643759466197,
                        "y": 86.67190828674237,
                        "transitionTimingFunction": "linear"
                    },
                    "6": {
                        "degree": 119.74419945189018,
                        "scaleX": 0.8,
                        "scaleY": 0.8,
                        "hide": false,
                        "enabled": false,
                        "x": 160.18208919798798,
                        "y": 350.09677349073434,
                        "transitionTimingFunction": "linear"
                    }
                },
                "shouldDisplayName": false,
                "namePosition": "top"
            },
            {
                "scripts": "Lorem ipsum dolor sit amet, consectetur adipiscing elit,\n123\n\na: c",
                "images": [
                    {
                        "title": "test",
                        "imageURL": "https://s2.loli.net/2022/02/10/grldkO4LeDjxmY8.png"
                    },
                    {
                        "imageURL": "https://s2.loli.net/2022/03/16/KZw7yAWXudMGL21.png"
                    },
                    {
                        "title": "A long picture",
                        "imageURL": "https://s2.loli.net/2022/03/16/tukpnVKZaUC7GIF.png"
                    }
                ],
                "nameScale": 1,
                "type": "TABLE",
                "brand": "Random",
                "style": "fillSquare",
                "someValue": 5000,
                "frameAnimationConfig": {
                    "1": {
                        "degree": 0.2835934617047542,
                        "scaleX": 2.8,
                        "scaleY": 2.8,
                        "hide": false,
                        "enabled": false,
                        "x": 472.46325667340363,
                        "y": 438.2057197786579,
                        "transitionTimingFunction": "linear"
                    },
                    "2": {
                        "degree": 311.94787564823486,
                        "scaleX": 1.3,
                        "scaleY": 1.3,
                        "hide": false,
                        "enabled": false,
                        "x": 513.8173427517745,
                        "y": 127.8808166790863,
                        "transitionTimingFunction": "linear"
                    },
                    "3": {
                        "degree": 73.08247954702222,
                        "scaleX": 3.1,
                        "scaleY": 3.1,
                        "hide": false,
                        "enabled": false,
                        "x": 10.093040775729534,
                        "y": 9.05865583968618,
                        "transitionTimingFunction": "linear"
                    },
                    "4": {
                        "degree": 288.25913534723753,
                        "scaleX": 1.6,
                        "scaleY": 1.6,
                        "hide": false,
                        "enabled": true,
                        "x": 360.6289816649282,
                        "y": 20.768596934202797,
                        "transitionTimingFunction": "linear"
                    },
                    "5": {
                        "degree": 90.83961363448776,
                        "scaleX": 2.8,
                        "scaleY": 2.8,
                        "hide": false,
                        "enabled": false,
                        "x": 288.3051909243631,
                        "y": 212.71823634923643,
                        "transitionTimingFunction": "linear"
                    },
                    "6": {
                        "degree": 357.0923811073246,
                        "scaleX": 4.1,
                        "scaleY": 4.1,
                        "hide": false,
                        "enabled": true,
                        "x": 125.89215945023969,
                        "y": 206.9341039785251,
                        "transitionTimingFunction": "linear"
                    }
                },
                "shouldDisplayName": false,
                "namePosition": "top"
            },
            {
                "steps": {
                    "1": {},
                    "2": {
                        "title": "Here's step 2",
                        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris"
                    },
                    "3": {
                        "title": "Here's step 1",
                        "content": "Here's some content"
                    },
                    "4": {
                        "content": "aha"
                    },
                    "5": {
                        "title": "A title"
                    },
                    "6": {},
                    "7": {}
                },
                "nameScale": 1,
                "type": "LIGHT",
                "brand": "Random",
                "style": "default",
                "someValue": 5000,
                "frameAnimationConfig": {
                    "1": {
                        "degree": 328.3656793531131,
                        "scaleX": 4.4,
                        "scaleY": 4.4,
                        "hide": false,
                        "enabled": true,
                        "x": 251.13873814721416,
                        "y": 266.1390234547366,
                        "transitionTimingFunction": "linear"
                    },
                    "2": {
                        "degree": 5.5191107044806476,
                        "scaleX": 1.2,
                        "scaleY": 1.2,
                        "hide": false,
                        "enabled": true,
                        "x": 414.67687648715093,
                        "y": 69.86039710593367,
                        "transitionTimingFunction": "linear"
                    },
                    "3": {
                        "degree": 261.4705317831761,
                        "scaleX": 3.4,
                        "scaleY": 3.4,
                        "hide": false,
                        "enabled": true,
                        "x": 203.03502230256098,
                        "y": 1.7134740595995401,
                        "transitionTimingFunction": "linear"
                    },
                    "4": {
                        "degree": 72.6521087207461,
                        "scaleX": 1.5,
                        "scaleY": 1.5,
                        "hide": false,
                        "enabled": false,
                        "x": 742.9229694787398,
                        "y": 80.93189492510777,
                        "transitionTimingFunction": "linear"
                    },
                    "5": {
                        "degree": 234.5036007147911,
                        "scaleX": 1.7,
                        "scaleY": 1.7,
                        "hide": false,
                        "enabled": true,
                        "x": 519.8131046662031,
                        "y": 673.3435359249644,
                        "transitionTimingFunction": "linear"
                    },
                    "6": {
                        "degree": 18.04749572279274,
                        "scaleX": 2.5,
                        "scaleY": 2.5,
                        "hide": false,
                        "enabled": false,
                        "x": 527.3361137135425,
                        "y": 463.6938099946931,
                        "transitionTimingFunction": "linear"
                    }
                },
                "shouldDisplayName": true,
                "namePosition": "top"
            },
            {
                "note": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                "steps": {
                    "1": {},
                    "2": {
                        "title": "Here's step 2",
                        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris"
                    },
                    "3": {
                        "title": "Here's step 1",
                        "content": "Here's some content"
                    },
                    "4": {
                        "content": "aha"
                    },
                    "5": {
                        "title": "A title"
                    },
                    "6": {},
                    "7": {}
                },
                "nameScale": 1,
                "type": "SHELF",
                "brand": "Random",
                "style": "default",
                "someValue": 5000,
                "frameAnimationConfig": {
                    "1": {
                        "degree": 60.0961775389004,
                        "scaleX": 3.5,
                        "scaleY": 3.5,
                        "hide": false,
                        "enabled": true,
                        "x": 461.6338941533856,
                        "y": 637.5434572236807,
                        "transitionTimingFunction": "linear"
                    },
                    "2": {
                        "degree": 6.737512750388559,
                        "scaleX": 1.7,
                        "scaleY": 1.7,
                        "hide": false,
                        "enabled": true,
                        "x": 386.90912237088935,
                        "y": 696.8068704098714,
                        "transitionTimingFunction": "linear"
                    },
                    "3": {
                        "degree": 321.2037682718442,
                        "scaleX": 2.7,
                        "scaleY": 2.7,
                        "hide": false,
                        "enabled": true,
                        "x": 592.6980207528514,
                        "y": 307.97241868917615,
                        "transitionTimingFunction": "linear"
                    },
                    "4": {
                        "degree": 66.79285893099481,
                        "scaleX": 4,
                        "scaleY": 4,
                        "hide": false,
                        "enabled": false,
                        "x": 621.0399225201525,
                        "y": 444.43363046403294,
                        "transitionTimingFunction": "linear"
                    },
                    "5": {
                        "degree": 263.78175435516226,
                        "scaleX": 1.8,
                        "scaleY": 1.8,
                        "hide": false,
                        "enabled": true,
                        "x": 488.7846785753991,
                        "y": 195.19812705487132,
                        "transitionTimingFunction": "linear"
                    },
                    "6": {
                        "degree": 323.63940045428933,
                        "scaleX": 4.2,
                        "scaleY": 4.2,
                        "hide": false,
                        "enabled": false,
                        "x": 226.0823919185913,
                        "y": 152.5355654033076,
                        "transitionTimingFunction": "linear"
                    }
                },
                "shouldDisplayName": true,
                "namePosition": "top"
            },
            {
                "type": "STORYBOARD",
                "script": "Some storyboard script",
                "orderIndex": 20,
                "namePosition": "bottom",
                "shouldDisplayName": false,
                "frameAnimationConfig": {
                    "1": {
                        "degree": 0,
                        "scaleX": 1,
                        "scaleY": 1,
                        "hide": false,
                        "enabled": true,
                        "x": 100,
                        "y": 100,
                        "thumbnail": {
                            "title": "something",
                            "imageURL": "https://s2.loli.net/2022/03/19/kfoHSKL792r4cvD.jpg",
                            "width": 400
                        },
                        "transitionTimingFunction": "linear"
                    },
                    "2": {
                        "degree": 40,
                        "scaleX": 1,
                        "scaleY": 1,
                        "hide": false,
                        "enabled": true,
                        "x": 60,
                        "y": 60,
                        "thumbnail": {
                            "title": "something",
                            "imageURL": "https://s2.loli.net/2022/03/19/kfoHSKL792r4cvD.jpg",
                            "width": 400
                        },
                        "transitionTimingFunction": "linear"
                    }
                },
                "images": [
                    {
                        "title": "test",
                        "imageURL": "https://s2.loli.net/2022/02/10/grldkO4LeDjxmY8.png"
                    },
                    {
                        "imageURL": "https://s2.loli.net/2022/03/16/KZw7yAWXudMGL21.png"
                    },
                    {
                        "title": "A long picture",
                        "imageURL": "https://s2.loli.net/2022/03/16/tukpnVKZaUC7GIF.png"
                    }
                ]
            }
        ],
        "renderMethod": "svg",
        "zoomLowerBound": 0.15,
        "zoomUpperBound": 2,
        "zoomStep": 1.02,
        "dialogShowAllProperties": false,
        "dialogAllPropertiesFormat": "json",
        "customThemes": {
            "light-custom": {
                "icon": "bi bi-arrow-through-heart-fill",
                "isLight": true,
                "colors": {
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
                    "--scene-trans-base": "rgba(255, 255, 255, 0.95)"
                }
            }
        },
        "displayToolbar": true,
        "displayPropList": true,
        "displayTimeline": true
    };
  const scene = new sceneBlocking.Scene('some-container-id', config)
  scene.display();
</script>
```