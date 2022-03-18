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
    ROOT_OVERLAY: ['overlay', 'root__container'],
    VIEW_ICON_PATH_GROUP: ['view', 'prop', 'icon', 'group'],
    VIEW_ICON_PATH_GROUP_ENABLED: ['view', 'prop', 'icon', 'group', 'enabled'],
    VIEW_ICON_PATH_GROUP_DISABLED: ['view', 'prop', 'icon', 'group', 'disabled'],
    VIEW_PROP_TEXT: ['view', 'prop', 'text'],
    VIEW_GROUP: ['view', 'prop'],
    VIEW_CONNECTIONS: ['view', 'connections'],
    VIEW_LINES_GROUP: ['view', 'lines', 'group'],
    VIEW_PROP: ['view', 'prop'],
    OVERLAY: ['overlay'],
    FRAME_PROGRESS_FINISHED: ['frame', 'progress', 'finished'],
    FRAME_PROGRESS_UNFINISHED: ['frame', 'progress', 'unfinished'],
    TIMELINE_FRAME: ['timeline', 'frame'],
    TOOLBAR: ['toolbar'],
    TOOLBAR_PLAY_BUTTON: ["toolbar", "play"],
    TOOLBAR_COLLAPSE_BUTTON: ["toolbar", "collapse"],
    TOOLBAR_RESET_CURRENT_BUTTON: ["toolbar", "reset", "current"],
    TOOLBAR_RESET_FRAMES_BUTTON: ["toolbar", "reset", "frames"],
    TOOLBAR_EXPORT_BUTTON: ["toolbar", "export"],
    TOOLBAR_THEME_BUTTON: ["toolbar", "theme"],
    PROP_DIALOG_CLOSE_ICON: ['prop', 'dialog', 'property'],
    PROP_DIALOG_FOOTER_ICON: ['prop', 'dialog', 'property', 'icon'],
    PROP_DIALOG_FOOTER_POSITION: ['prop', 'dialog', 'footer', 'position'],
    PROP_DIALOG_FOOTER_SCALE: ['prop', 'dialog', 'footer', 'scale'],
    PROP_DIALOG_HEADER_TAB: ['dialog'],
    PROP_LIST: ['prop', 'list'],
    PROP_LIST_ICON: ['prop', 'list', 'icon'],
    PROP_LIST_TITLE: ['prop', 'list', 'icon'],
    PROP_LIST_HIDE: ['prop', 'list', 'hide'],
    PROP_LIST_HIDE_ICON: ['prop', 'list', 'hide', 'icon'],
    SNACKBAR: ['snackbar'],
    CANVAS: ['canvas']
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
            this[key] = (id, ...extra) => this.getId(id, ...extra, ...IdTypes[key])
        }
    }

    public getType(...type: string[]) {
        return this.getId(null, ...type)
    }

    public getId(id: HasId | number | null, ...type: string[]) {
        type.sort((a, b) => a.localeCompare(b))
        const _id = id == null ? "" : (typeof id === 'number' ? "-" + id : (id.id === null || undefined) ? "" : "-" + id.id)
        return `${this.contextId}-${type.join('-')}${_id}`
    }

    public extractIdType(htmlID: string, ...exclude: string[]): [number, string[]] {
        const elementId = htmlID.match(/-\d+/)
        const contextId = htmlID.match(/\d+-/)
        if (!contextId || parseInt(contextId[0].replace('-', '')) != this.contextId) {
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


// const [ids, idContext] = useId()
// console.log(ids.ROOT_SNACKBAR, idContext.ROOT_SNACKBAR(2, "test"))