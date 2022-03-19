/*
 * Copyright 2022 Dan Lyu.
 */

import {AnimationConfig, PropConfig} from "../props/Props";

export function convertTypeToReadable(type: string): string {
    return `${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()}`
}

export function createElement(html: string): HTMLElement {
    const template = document.createElement('template')
    template.innerHTML = html.trim()
    return template.content.children[0] as HTMLElement
}

// Min, Max both inclusive
export function randInclusive(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function randBoolean():boolean{
    return !!randInclusive(0, 1)
}


export function generateDarkColor() {
    const c = () => randInclusive(0, 125)
    return `rgb(${c()},${c()},${c()})`
}

export function generateLightColor() {
    const c = () => randInclusive(125, 255)
    return `rgb(${c()},${c()},${c()})`
}

export function createSVGElement(width: number, height: number) {
    const svg = document.createElement("svg")
    svg.setAttribute('xmlns', "http://www.w3.org/2000/svg")
    svg.setAttribute("width", String(width))
    svg.setAttribute("height", String(height))
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`)
    return svg
}

export function createIconFontElement(id?: string, ...classes: string[]) {
    const icon = document.createElement('i')
    if (id) {
        icon.id = id
    }
    classes.forEach(c => icon.classList.add(c))
    return icon
}


export function createSVGIcon(scale?: number) {
    const svg = createSVGElement(16, 16)
    svg.setAttribute("transform", `scale(${scale} ${scale})`)
    return svg
}

export function setClassList(element: Element, ...classes: string[]) {
    element.removeAttribute("class")
    element.classList.add(...classes)
}

export function getLineGroup(startX, startY, endX, endY, width, color) {
    return `<g stroke-width="${width}" stroke="${color}"><path d="M${startX} ${startY}  L${endX} ${endY}"/></g>`
}

export function setStyles(styleKey, styleValue, ...elements) {
    elements.forEach(e => {
        if (e) {
            e.style[styleKey] = styleValue
        }
    })
}

export function positionToDisplay(position: AnimationConfig): AnimationConfig {
    const pos = {...position}
    for (let key in pos) {
        const value = pos[key]
        if (typeof value === 'number') {
            pos[key] = key.includes('scale') ? Math.round(value * 10) / 10 : Math.round(value)
        }
    }
    return pos
}

export function camelToDisplay(input: string) {
    input = input.charAt(0).toUpperCase() + input.slice(1)
    return input.replace(/[A-Z]/g, letter => ` ${letter}`).trim()
}

export function createSpan(text: string, color?: string) {
    const span = document.createElement("span")
    span.innerText = text
    span.style.color = color ? color : "black"
    return span
}

export function getPathGroupByHTML(pathsHTML: string, prop: PropConfig, color ?: string) {
    let pathId = 0
    const pathGroup = document.createElement("g")
    forEachPathHTML(pathsHTML, (pathHTML) => {
        const path = createElement(pathHTML)
        path.style.fill = color ? color : prop.color
        pathGroup.appendChild(path)
        pathId++
    })
    return pathGroup
}

export function forEachPathHTML(pathsHTML, f: (pathHTML: string) => void) {
    pathsHTML.match(/<path.*?\/>|<path.*?><\/path>/g).forEach(pathHTML => {
        f(pathHTML)
    })
}

export function extractPathD(pathHTML) {
    const res = pathHTML.match(/d=["'`](.*?)["'`]/)
    return res == null ? "" : res[1]
}

export function flatObject(obj) {
    const newObj = {}
    const _flatValues = (_obj, rootKeys) => {
        Object.keys(_obj).sort().forEach(key => {
            const _rootKeys = rootKeys
            rootKeys = rootKeys + `.${key}`
            if (typeof _obj[key] === "object") {
                _flatValues(_obj[key], rootKeys)
            } else {
                newObj[rootKeys.slice(1)] = _obj[key]
            }
            rootKeys = _rootKeys
        })
    }
    _flatValues(obj, "")
    return newObj
}