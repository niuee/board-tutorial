import { Point } from "vector";
import { multiplyByScalar, rotateVector, vectorAddition, vectorSubtraction } from "./vector";


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

    setPositionBy(offset: Point){
        const destination = vectorAddition(this._position, offset);
        this.setPosition(destination);
    }
    
    setZoomLevel(targetZoom: number){
        this._zoomLevel = targetZoom;
    }
    
    setRotation(rotation: number){
        this._rotation = rotation;
    }

    transformViewPort2WorldSpace(point: Point): Point {
        const scaledBack = multiplyByScalar(point, 1 / this._zoomLevel);
        const rotatedBack = rotateVector(scaledBack, this._rotation);
        const withOffset = vectorAddition(rotatedBack, this._position);
        return withOffset;
    }

    transformWorldSpace2ViewPort(point: Point): Point {
        const withOffset = vectorSubtraction(point, this._position);
        const scaled = multiplyByScalar(withOffset, this._zoomLevel);
        const rotated = rotateVector(scaled, -this._rotation);
        return rotated;
    }

    transformVector2WorldSpace(vector: Point): Point{
        return rotateVector(multiplyByScalar(vector, 1 / this._zoomLevel), this._rotation);
    }
}

export { Camera };
