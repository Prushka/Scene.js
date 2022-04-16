---
title: Developer Interactions
sidebar_position: 4
---

:::info States and Components

I built my own states and component render lifecycles.

By interacting with the library's states, you can easily change the corresponding components' DOM.

You can also choose to interact with the library's components directly (**not recommended**).

Not all functionalities will be covered in this section due to time constraints (see below for what you can do with these states).

All contexts are **instance based**, every action besides changing a *root scoped theme* only affects the selected scene. 

:::

You can directly interact with the library's states. They are bundled in separate contexts:

* **scene.propCtx**: Contains selected prop, filtered props, filter / search, frames and timeline actions
    * Search / Filter props
    * Reset filter
    * Select prop by prop config / id / prop name
    * Get the selected prop
    * Get all filtered props
    * Go to any frame
    * Go to the next frame
    * Check if a prop is enabled
    * Get any prop's detailed data with the current frame
* **scene.themeCtx**: Controls the theme
    * Choose a theme
    * Cycle to next theme
    * Get the current theme
* **scene.snackbarCtx**: Controls the snackbar (This is all covered in **[Embedded Snackbar](embedded-snackbar)**)
    * Popup an embedded snackbar in the scene to display **error** or **success** message
* **scene.overlayCtx**: Controls the overlay of the current scene
    * Open a popup overlay with custom **HTMLElement** or **HTML string**
    * Close the current popup overlay
* **scene.getViewportCtx()**: Controls the viewport zoom and offset
    * Zoom in or out
    * Get the current zoom factor
    * Change the viewport offset (*i.e.,* drag the viewport)
    * Get the current viewport offset

### Examples

1. How I am able to display **zoom factors** and **zoom steps** in **[Global - Config / Zoom Limit - Steps](../global-config/viewport/viewport-zoom)**
2. How I made it possible to autoplay a scene on load: **[Prop - Config / Animation Config / Transition Timing Function](../prop-config/animation-config/transition-timing-function)**
2. How I made it possible to select a prop with a specified tab on load: **[Prop - Config / Scripts, Notes, Images, Steps](../prop-config/prop-dialog-properties)**