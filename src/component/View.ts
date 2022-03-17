import {SceneComponent} from "./Component";
import {AnimationConfig, PropConfig} from "../props/Props";

export default abstract class View extends SceneComponent {
    public abstract resetViewport(currentFrame?: number): void

    public forEachPropWithPosition(f: (prop: PropConfig, position: AnimationConfig) => void) {
        this.ctx.propsState.get().forEach(prop => {
            const position = this.ctx.getPropPositionByCurrentFrame(prop)
            if(position){
                f(prop, position)
            }
        })
    }
}