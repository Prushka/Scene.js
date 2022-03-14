/*
 * Copyright 2022 Dan Lyu.
 */

export function convertTypeToReadable(type: string): string {
    return `${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()}`
}

export function createElement(html:string):Element {
    const template = document.createElement('template')
    template.innerHTML = html.trim()
    return template.content.children[0]
}