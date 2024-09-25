import { Point, vectorSubtraction } from "./vector";
import { Camera } from "./camera";

class TouchInput {
    
    private panStartPoint: Point;
    private isPanning: boolean;
    private camera: Camera;

    constructor(camera: Camera){
        this.camera = camera;
        this.panStartPoint = {x: 0, y: 0};
        this.isPanning = false;
        this.touchstartHandler = this.touchstartHandler.bind(this);
        this.touchmoveHandler = this.touchmoveHandler.bind(this);
        this.touchendHandler = this.touchendHandler.bind(this);
        this.touchcancelHandler = this.touchcancelHandler.bind(this);
    }

    touchstartHandler(event: TouchEvent){
        if(event.targetTouches.length == 1){
            this.panStartPoint = {x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY};
            this.isPanning = true;
        }
    }

    touchmoveHandler(event: TouchEvent) {
        event.preventDefault();
        if(this.isPanning && event.targetTouches.length == 1){
            const curTouchPoint = {x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY};
            const diff = vectorSubtraction(this.panStartPoint, curTouchPoint);
            const diffInWorld = this.camera.transformVector2WorldSpace(diff);
            this.camera.setPositionBy(diffInWorld);
            this.panStartPoint = curTouchPoint;
        }
    }

    touchendHandler(event: TouchEvent) {
        this.isPanning = false;
    }

    touchcancelHandler(event: TouchEvent) {
        this.isPanning = false;
    }
}

export { TouchInput };
