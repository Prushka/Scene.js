/*
 * Copyright 2022 Dan Lyu.
 */

export function convertTypeToReadable(type: string): string {
    return `${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()}`
}