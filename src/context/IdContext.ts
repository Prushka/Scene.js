/*
 * Copyright 2022 Dan Lyu.
 */

import {HasId} from "../props/Props";

export class IdContext{
    private static contextIds = 0
    private readonly contextId

    public constructor() {
        this.contextId = IdContext.contextIds
        IdContext.contextIds += 1
    }

    public getIdType(...type: string[]) {
        return this.getId(null, ...type)
    }

    public getId(id: HasId | number | null, ...type: string[]) {
        type.sort((a, b) => a.localeCompare(b))
        const _id = id === null || undefined ? "" : (typeof id === 'number' ? "-" + id : (id.id === null || undefined) ? "" : "-" + id.id)
        return `${this.contextId}-${type.join('-')}${_id}`
    }
}