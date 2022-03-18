/*
 * Copyright 2022 Dan Lyu.
 */

import State, {createState} from "../state/State";

export function useFrames(){
    return new FrameContext()
}

export default class FrameContext {
    public currentFrameState: State<number> = createState(1)
    protected totalFramesState: State<number> = createState(0)

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

    public ifJumpOneLiterally(oldFrame, newFrame){
        return newFrame - oldFrame === 1
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