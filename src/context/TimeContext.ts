/*
 * Copyright 2022 Dan Lyu.
 */

import State, {createState} from "../state/State";

export default class TimeContext {
    public currentFrameState: State<number> = createState(1)
    protected totalFramesState: State<number> = createState(0)

    public constructor() {
    }

    public get isStatic() {
        return this.totalFrames <= 1
    }

    public get totalFrames() {
        return this.totalFramesState.get()
    }

    public set totalFrames(f: number) {
        this.totalFramesState.set(f)
    }

    public get currentFrame() {
        return this.currentFrameState.get()
    }

    public set currentFrame(f: number) {
        this.currentFrameState.set(f)
    }

    public ifJumpOne(oldFrame, newFrame){
        return newFrame - oldFrame === 1 || (newFrame === 1 && oldFrame === this.totalFrames)
    }

    public nextFrame(): number {
        const previousFrame = this.currentFrame
        if (this.currentFrame < this.totalFrames) {
            this.currentFrame++
        } else if (this.currentFrame === this.totalFrames) {
            this.currentFrame = 1
        }
        return previousFrame
    }
}