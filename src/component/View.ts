import {SceneComponent} from "./Component";
import {AnimationConfig, PropConfig} from "../props/Props";

export default abstract class View extends SceneComponent {
    public abstract resetViewport(currentFrame?: number): void

    public forEachPropWithPosition(f: (prop: PropConfig, position: AnimationConfig) => void) {
        this.propCtx.filteredProps.forEach(prop => {
            const position = this.propCtx.getPropPositionByCurrentFrame(prop)
            if(position){
                f(prop, position)
            }
        })
    }
}