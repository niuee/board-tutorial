import { Point, vectorSubtraction, magnitude, linearInterpolation } from "./vector";
import { Camera } from "./camera";

class TouchInput {
    
    private panStartPoint: Point;
    private isPanning: boolean;
    private camera: Camera;
    private initialTouchDistance: number;
    private canvas: HTMLCanvasElement;
    private ZOOM_SENSATIVITY: number = 0.005


    constructor(camera: Camera, canvas: HTMLCanvasElement){
        this.camera = camera;
        this.panStartPoint = {x: 0, y: 0};
        this.isPanning = false;
        this.initialTouchDistance = 0;
        this.canvas = canvas;
        this.touchstartHandler = this.touchstartHandler.bind(this);
        this.touchmoveHandler = this.touchmoveHandler.bind(this);
        this.touchendHandler = this.touchendHandler.bind(this);
        this.touchcancelHandler = this.touchcancelHandler.bind(this);
    }

    touchstartHandler(event: TouchEvent){
        if(event.targetTouches.length == 1){
            this.panStartPoint = {x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY};
            this.isPanning = true;
        } else if (event.targetTouches.length == 2){
            this.isPanning = false;
            this.initialTouchDistance = magnitude(vectorSubtraction({x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY}, {x: event.targetTouches[1].clientX, y: event.targetTouches[1].clientY}));
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
        } else if(event.targetTouches.length == 2){
            const startPoint = {x: event.targetTouches[0].clientX, y: event.targetTouches[0].clientY};
            const endPoint = {x: event.targetTouches[1].clientX, y: event.targetTouches[1].clientY};
            const curDistance = magnitude(vectorSubtraction(endPoint, startPoint));
            const diff = curDistance - this.initialTouchDistance;
            const midPoint = linearInterpolation(startPoint, endPoint, 0.5);
            const boundingBox = this.canvas.getBoundingClientRect();
            const topLeftCorner = {x: boundingBox.left, y: boundingBox.top};
            const viewPortCenter = {x: topLeftCorner.x + this.canvas.width / 2, y: topLeftCorner.y + this.canvas.height / 2};
            const midPointInViewPortSpace = {x: midPoint.x - viewPortCenter.x, y: midPoint.y - viewPortCenter.y};
            const midPointInWorldSpace = this.camera.transformViewPort2WorldSpace(midPointInViewPortSpace);
            const deltaZoomLevel = diff * 0.1 * this.camera.zoomLevel * this.ZOOM_SENSATIVITY;
            this.camera.setZoomLevelBy(deltaZoomLevel);
            const midPointInWorldSpacePostZoom = this.camera.transformViewPort2WorldSpace(midPointInViewPortSpace);
            const deltaPosition = vectorSubtraction(midPointInWorldSpacePostZoom, midPointInWorldSpace);
            this.camera.setPositionBy(deltaPosition);
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
