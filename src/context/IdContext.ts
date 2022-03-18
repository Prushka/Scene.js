/*
 * Copyright 2022 Dan Lyu.
 */

import {HasId} from "../props/Props";

export const IdTypes: { [key: string]: string[] } = {
    ROOT_SNACKBAR: ['snackbar', 'root__container'],
    ROOT_PROP_LIST: ['prop__list', 'root__container'],
    ROOT_PROP_DIALOG: ['prop__property', 'root__container'],
    ROOT_VIEW: ['view', 'root__container'],
    ROOT_FOOTER: ['footer', 'root__container'],
    ROOT_OVERLAY: ['overlay', 'root__container']
}
// I added context id to every id since id attributes are supposed to be unique
// (i.e.,) unique ids across different instances in the same page
// I don't know if there's a better way to achieve this

// https://github.com/microsoft/TypeScript/issues/20846
export function useId() {
    const idContext = new IdContext()
    const idTypesProxy: any = new Proxy(IdTypes, {
        get(target, prop, receiver) {
            if (Reflect.has(target, prop)) {
                const returnValue = typeof prop === 'string' ? IdTypes[prop] ?? Reflect.get(target, prop, receiver) : Reflect.get(target, prop, receiver)
                if (Array.isArray(returnValue)) {
                    return idContext.getId(null, ...returnValue)
                }
                return returnValue;
            }
            return null;
        }
    })
    return [idTypesProxy, idContext]
}

export class IdContext {
    private static contextIds = 0
    private readonly contextId

    public constructor() {
        this.contextId = IdContext.contextIds
        IdContext.contextIds += 1
        for (let key in IdTypes) {
            this[key] = (id) => this.getId(id, ...IdTypes[key])
        }
    }

    public getId(id: HasId | number | null, ...type: string[]) {
        type.sort((a, b) => a.localeCompare(b))
        const _id = id == null ? "" : (typeof id === 'number' ? "-" + id : (id.id === null || undefined) ? "" : "-" + id.id)
        return `${this.contextId}-${type.join('-')}${_id}`
    }

    public extractIdType(htmlID: string, ...exclude: string[]): [number, string[]] {
        const elementId = htmlID.match(/-\d+/)
        const contextId = htmlID.match(/\d+-/)
        if (!contextId || contextId != this.contextId) {
            return [-1, []]
        }
        let id = -1
        if (elementId) {
            id = parseInt(elementId[0].replace('-', ''))
        }
        const type: string = htmlID.replace(/-\d+/, '').replace(/\d+-/, '')
        return [id, type.split('-').filter(t => !exclude.includes(t))]
    }
}

const [ids, idContext] = useId()
console.log(ids.ROOT_SNACKBAR, idContext.ROOT_SNACKBAR(2, ids.ROOT_SNACKBAR))