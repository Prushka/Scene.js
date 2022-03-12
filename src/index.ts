import Position from "./props/Position";

export * as position from './props/Position'

export function test() {
    return new Position(1, 1)
}

$(()=>{
    $("#scene").addClass("root-container")
        .html("<p class='test'>tewst12</p>")
})