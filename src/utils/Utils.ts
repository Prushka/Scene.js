/*
 * Copyright 2022 Dan Lyu.
 */

export function extractIdType(htmlID: string): [number, string] {
    const id: number = parseInt(htmlID.match(/\d+/)[0])
    const type: string = htmlID.replace(/-\d+/, '')
    return [id, type]
}

export function convertTypeToReadable(type: string): string {
    return `${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()}`
}