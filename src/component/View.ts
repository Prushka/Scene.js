import {CustomComponent, SceneComponent} from "./Component";

export default abstract class View extends SceneComponent{
    public abstract resetViewport(currentFrame?: number): void
}