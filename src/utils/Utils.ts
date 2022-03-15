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