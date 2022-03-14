/*
 * Copyright 2022 Dan Lyu.
 */

export function convertTypeToReadable(type: string): string {
    return `${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()}`
}

export function createElement(html:string):HTMLElement {
    const template = document.createElement('template')
    template.innerHTML = html.trim()
    return template.content.children[0] as HTMLElement
}

export function generateRandomColor(){
    // TODO: generate a dark color
    // https://stackoverflow.com/questions/5092808/how-do-i-randomly-generate-html-hex-color-codes-using-javascript
    return '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')
}