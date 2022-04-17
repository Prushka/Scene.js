# Scene.js

# Landing / Docs Page:

The site is deployed here: **[https://scene.muddy.ca](https://scene.muddy.ca)**

In case anything went wrong, here's a Heroku deployment with the exact same content:

**[https://thawing-coast-29357.herokuapp.com](https://thawing-coast-29357.herokuapp.com)**

Note that  the landing / docs website is static.

---

Every category contains multiple documents and/or subcategories.

**Please access them using the sidebar in the landing/docs page**

* [Intro](https://scene.muddy.ca/docs/intro)
* [User Interactions](https://scene.muddy.ca/docs/user-interactions)
* [Developer Interactions](https://scene.muddy.ca/docs/developer-interactions/)
* [Global Config](https://scene.muddy.ca/docs/global-config/)
* [Prop Config](https://scene.muddy.ca/docs/prop-config/)

# Getting Started

All my docs are written in `mdx` (essentially markdown with JSX).

They are located here and you can sort of view them using a markdown interpreter (*e.g.,* Github):

[https://github.com/csc309-winter-2022/js-library-lyudan1/tree/main/docs/docs](https://github.com/csc309-winter-2022/js-library-lyudan1/tree/main/docs/docs)

**Note that these files don't render any JSX content or my library's demo**, please refer to the landing page for more information.

## For the purpose of including a *Getting Started* here, I've included part of the intro:

This is a **JavaScript** library. It can be used to display one or multiple instances of **scene(s)**.

**Scene** refers to a stage or scene used in **theater and film** (See: **[Wikipedia](https://en.wikipedia.org/wiki/Blocking_(stage))**).

Such scene consists of **characters, props, cameras, lights** etc., their **positions** and their **animations**.

This library is used to display **dynamic or static** layout of a scene with such props and characters.

The style and functionalities of this doc website and library work on both desktop and mobile.

However, there's an issue affecting **Webkit** browsers (see **[Known Issues](known-issues)**).

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

---

# Disclaimer

Even though this landing page is built using React and Docusaurus, the library doesn't use React.

In fact, the library itself **doesn't use any external js/css libraries** and can be used both in vanilla html/js with script tag and ESM environments.


### Libraries used for development and docs

The library is written in **TypeScript**.

* **Webpack** is used to bundle its TypeScript files to a single js file.
* Bootstrap icon font is used for button icons and props.
* I don't own any images used in this docs page.

#### DOM Manipulation

Even though some part of this library uses SVG tags (including `<g>`, `<path>`).

DOM manipulation were mainly used to layer them,
apply different attributes to different layers of elements and attach event listeners.

Apart from the SVG part, the library also contains a large amount of DOM manipulation (see **[User - Interactions](user-interactions)**).

---

# Getting Started

To import this library, all you need to do is include one script tag in your header:

(You don't need to include any extra libraries or css files)


**Do note that if you import it using script tag,
you will need to prefix your calls with `SceneJS` (*e.g.,* `new SceneJS.Scene(id, config)` (see below))**


```html
<script type="text/javascript" src="https://scene.muddy.ca/scene.js"></script>
```

### Support for multiple instances

You can **safely create multiple instances** of scenes in a single page.

### Mount / Unmount

You can expect a scene to **safely unmount itself** and cancel all its timeouts
when the scene cannot find its root element. (*e.g.,* you removed its root container)

You don't need to handle any of the above-mentioned features on your side.

If you need to display the scene again after it's been unmounted. You can use the same `scene` instance and call `scene.display()` again.


#### Scene Instances

By design, a `scene` object can only be attached to 1 container id.

Even though you can change its container or mount / unmount it, you **cannot** render the same scene instance in multiple containers.

To render **multiple instances** of scenes, either clone your config or create new ones and pass them to a new `scene` object.

---

# Create a scene

The scene will be rendered in your container. **It will take up all your container's space** (see below).

You don't need to set any size related configs in the library.

Note that you can use a css class for your container.

**For instance**, you can have a scene with mobile width by setting its container width:

### Set up scene configs

Essentially, there are 3 types of objects you need to create:

1. [Global Config](global-config): contains all global settings of your scene instance
2. [Prop Config](prop-config): contains all prop related config of any prop
3. [Animation Config](prop-config/animation-config/what-is-animation-config): contains all animation (position, scale, rotation etc.) config of your prop (frame based)


There are 2 ways to create any scene, its props and prop animation configs:

1. Use their related generators: **GlobalConfigGenerator**, **PropConfigGenerator** and **PositionConfigGenerator**
2. Create their json and pass the config to the scene

#### Generator chaining and callbacks

You can chain methods in all generators.

**For instance:**

```js
new GlobalConfigGenerator()
    .withFrameSpeed()
    .showPropList(false)
    .showTimeline(false)
    .withProps().getConfig()
```

You can also use callbacks in **GlobalConfigGenerator** and **PropConfigGenerator** to configure a prop or position:

**For instance:**

```js
new GlobalConfigGenerator()
    .addProp((propGenerator) => {
    propGenerator.type('TABLE').addPosition((positionGenerator) => {
       positionGenerator.x(50).y(50).transitionTimingFunction('ease-in')
    }, 1).addPosition((positionGenerator) => {
       positionGenerator.x(100).y(100).scale(2)
    }, 2).getConfig()
```

### Create a demo scene

Please see sidebar [Global Config](global-config) and [Prop Config](prop-config) for more information.

Below is a simple example to create a demo scene.

I've included all 3 ways to create it:

Note that I chose to include the entire `index.html` file in case any part is confusing. Any other example used in this docs website will not contain the html file.

<details>
    <summary>Code Snippet</summary>

#### Using Global Config Generator Chaining

```html title="index.html"
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Scene.js demo</title>
<script type="text/javascript" src="https://scene.muddy.ca/scene.js"></script>
<body>

<div id="some-container-id" style="width: 800px; height: 600px"></div>

<script defer>
    const globalConfigGenerator = new SceneJS.GlobalConfigGenerator()
    .defaultOpenToolbar(false)
    .autoPlay(true)
    .addProp((generator) => {
    generator.type('TABLE').addPosition((positionGenerator) => {
        positionGenerator.x(50).y(50)
    }, 1).addPosition((positionGenerator) => {
        positionGenerator.x(90).y(90)
    }, 2)
})
    .addProp((generator) => {
    generator.type('CAMERA').addPosition((positionGenerator) => {
        positionGenerator.x(200).y(200)
    }, 1).addPosition((positionGenerator) => {
        positionGenerator.x(50).y(50)
    }, 2)
})
    const scene = new SceneJS.Scene('some-container-id', globalConfigGenerator.getConfig())
    scene.display();
</script>

</body>
</html>
```

---

#### Using json config

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Scene.js demo</title>
<script type="text/javascript" src="https://scene.muddy.ca/scene.js"></script>
<body>

<div id="some-container-id" style="width: 800px; height: 600px"></div>

<script defer>
    const config = {
    "frameSpeed": {},
    "props": [
    {
        "frameAnimationConfig": {
        "1": {
        "x": 50,
        "y": 50
    },
        "2": {
        "x": 90,
        "y": 90
    }
    },
        "type": "TABLE"
    },
    {
        "frameAnimationConfig": {
        "1": {
        "x": 200,
        "y": 200
    },
        "2": {
        "x": 50,
        "y": 50
    }
    },
        "type": "CAMERA"
    }
    ],
    "defaultOpenToolbar": false,
    "autoPlay": true
}
    const scene = new SceneJS.Scene('some-container-id', config)
    scene.display();
</script>

</body>
</html>
```

---

#### Using separate generators

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Scene.js demo</title>
<script type="text/javascript" src="https://scene.muddy.ca/scene.js"></script>
<body>

<div id="some-container-id" style="width: 800px; height: 600px"></div>

<script defer>
    const tableProp = new SceneJS.PropConfigGenerator().type('TABLE')
    const tableFrame1 = new SceneJS.PositionConfigGenerator().x(50).y(50)
    const tableFrame2 = new SceneJS.PositionConfigGenerator().x(90).y(90)

    tableProp.withPosition(1, tableFrame1)
    tableProp.withPosition(2, tableFrame2)

    const cameraProp = new SceneJS.PropConfigGenerator().type('CAMERA')
    const cameraFrame1 = new SceneJS.PositionConfigGenerator().x(200).y(200)
    const cameraFrame2 = new SceneJS.PositionConfigGenerator().x(50).y(50)

    cameraProp.withPosition(1, cameraFrame1)
    cameraProp.withPosition(2, cameraFrame2)

    const config = new SceneJS.GlobalConfigGenerator()
    .defaultOpenToolbar(false)
    .autoPlay(true)
    .withProps([tableProp, cameraProp]).getConfig()
    console.log(config)
    const scene = new SceneJS.Scene('some-container-id', config)
    scene.display();
</script>

</body>
</html>
```

</details>