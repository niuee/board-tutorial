import { Point } from "vector";

class Camera {
    private _position: Point;
    private _zoomLevel: number;
    private _rotation: number;

    constructor(){
        this._position = {x: 0, y: 0};
        this._zoomLevel = 1; // 縮放程度不能夠小於或是等於 0。
        this._rotation = 0;
    }

    get position(): Point {
        return this._position;
    }

    get zoomLevel(): number {
        return this._zoomLevel;
    }

    get rotation(): number {
        return this._rotation;
    }

    setPosition(destination: Point){
        this._position = destination;
    }
    
    setZoomLevel(targetZoom: number){
        this._zoomLevel = targetZoom;
    }
    
    setRotation(rotation: number){
        this._rotation = rotation;
    }
}

export { Camera };
