/*
 * Copyright 2022 Dan Lyu.
 */

export default class PropTupleSet extends Set<string> {
    private static sortIdTuple(id: [number, number]) {
        return id[0] < id[1] ? [id[0], id[1]] : [id[1], id[0]]
    }

    addIdTuple(id: [number, number]) {
        return super.add(PropTupleSet.sortIdTuple(id).join(','));
    }

    hasIdTuple(id: [number, number]) {
        return super.has(PropTupleSet.sortIdTuple(id).join(','));
    }
}