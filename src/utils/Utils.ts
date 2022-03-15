/*
 * Copyright 2022 Dan Lyu.
 */

export function convertTypeToReadable(type: string): string {
    return `${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()}`
}

export function createElement(html: string): HTMLElement {
    const template = document.createElement('template')
    template.innerHTML = html.trim()
    return template.content.children[0] as HTMLElement
}

// Min, Max both inclusive
function generateColor(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateDarkColor() {
    const c = () => generateColor(0, 125)
    return `rgb(${c()},${c()},${c()})`
}

export function generateLightColor() {
    const c = () => generateColor(125, 255)
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
