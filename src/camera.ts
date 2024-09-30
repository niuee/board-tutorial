import { Point } from "vector";
import { multiplyByScalar, rotateVector, vectorAddition, vectorSubtraction, getLineSegmentIntersection } from "./vector";

export type PositionBoundary = {
    min: Point;
    max: Point;
}

export type ZoomLevelBoundary = {
    min: number;
    max: number;
}
class Camera {
    private _position: Point;
    private _zoomLevel: number;
    private _rotation: number;
    private _positionBoundary: PositionBoundary;
    private _zoomLevelBoundary: ZoomLevelBoundary;

    public viewPortWidth: number;
    public viewPortHeight: number;

    public limitEntireViewPort: boolean;

    constructor(viewPortWidth: number = 500, viewPortHeight: number = 500, positionBoundary: PositionBoundary = {min: {x: -1000, y: -1000}, max: {x: 1000, y: 1000}}, zoomLevelBoundary: ZoomLevelBoundary = {min: 0.1, max: 10}){
        this._position = {x: 0, y: 0};
        this._zoomLevel = 1; // 縮放程度不能夠小於或是等於 0。
        this._rotation = 0;
        this._positionBoundary = positionBoundary;
        this._zoomLevelBoundary = zoomLevelBoundary;
        this.viewPortHeight = viewPortHeight;
        this.viewPortWidth = viewPortWidth;
        this.limitEntireViewPort = false;
    }

    get positionBoundary(): PositionBoundary {
        return this._positionBoundary;
    }

    get zoomLevelBoundary(): ZoomLevelBoundary {
        return this._zoomLevelBoundary;
    }

    set zoomLevelBoundary(zoomLevelBoundary: ZoomLevelBoundary){
        if (zoomLevelBoundary.min > zoomLevelBoundary.max){
            const temp = zoomLevelBoundary.min;
            zoomLevelBoundary.min = zoomLevelBoundary.max;
            zoomLevelBoundary.max = temp;
        }
        this._zoomLevelBoundary = zoomLevelBoundary;
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
        if(this.limitEntireViewPort && !viewPortWithinPositionBoundary(this.viewPortWidth, this.viewPortHeight, destination, this._zoomLevel, this._rotation, this._positionBoundary)){
            return;
        }
        if(!withinPositionBoundary(destination, this._positionBoundary)){
            return;
        }
        this._position = destination;
    }

    setPositionBy(offset: Point){
        const destination = vectorAddition(this._position, offset);
        if(this.limitEntireViewPort){
            this.setPosition(clampingEntireViewPort(this.viewPortWidth, this.viewPortHeight, destination, this._rotation, this._zoomLevel, this._positionBoundary));
            return;
        }
        const clampedDestination = simpleClamping(destination, this._positionBoundary);
        this.setPosition(clampedDestination);
    }

    setZoomLevelBy(deltaZoomLevel: number){
        this.setZoomLevel(this._zoomLevel + deltaZoomLevel);
    }
    
    setZoomLevel(targetZoom: number){
        if(!withinZoomLevelBoundary(targetZoom, this._zoomLevelBoundary)){
            return;
        }
        this._zoomLevel = targetZoom;
    }
    
    setRotation(rotation: number){
        this._rotation = rotation;
    }

    transformViewPort2WorldSpace(point: Point): Point {
        return transformViewPort2WorldSpaceWithCameraAttributes(point, this._position, this._zoomLevel, this._rotation);
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

function withinPositionBoundary(destination: Point, positionBoundary: PositionBoundary): boolean {
    if(destination.x > positionBoundary.max.x || destination.x < positionBoundary.min.x){
        return false;
    }
    if(destination.y > positionBoundary.max.y || destination.y < positionBoundary.min.y){
        return false;
    }
    return true;
}

export function simpleClamping(destination: Point, positionBoundary: PositionBoundary): Point {
    if(withinPositionBoundary(destination, positionBoundary)){
        return destination;
    }

    const res = {...destination};

    res.x = Math.min(res.x, positionBoundary.max.x);
    res.x = Math.max(res.x, positionBoundary.min.x);

    res.y = Math.min(res.y, positionBoundary.max.y);
    res.y = Math.max(res.y, positionBoundary.min.y);

    return res;
}

export function clampingV2(origin: Point, destination: Point, positionBoundary: PositionBoundary): Point {
    if (withinPositionBoundary(destination, positionBoundary)){
        return destination;
    }

    const topRight = {x: positionBoundary.max.x, y: positionBoundary.max.y};
    const bottomRight = {x: positionBoundary.max.x, y: positionBoundary.min.y};
    const topLeft = {x: positionBoundary.min.x, y: positionBoundary.max.y};
    const bottomLeft = {x: positionBoundary.min.x, y: positionBoundary.min.y};

    const surpassedTop = destination.y > topLeft.y;
    const surpassedRight = destination.x > topRight.x;
    const surpassedBottom = destination.y < bottomRight.y;
    const surpassedLeft = destination.x < bottomLeft.x;

    let manipulatePoint = {...destination};

    if(surpassedTop && surpassedRight){
        console.log("top right");
        return topRight;
    }
    if(surpassedTop && surpassedLeft){
        console.log("top left");
        return topLeft;
    }
    if(surpassedBottom && surpassedRight){
        console.log("bottom right");
        return bottomRight;
    }
    if(surpassedBottom && surpassedLeft){
        console.log("bottom left");
        return bottomLeft;
    }

    let boundaryStart = bottomRight;
    let boundaryEnd = topRight;
    
    if(surpassedTop){
        boundaryStart = topLeft;
        boundaryEnd = topRight;
    } else if(surpassedBottom){
        boundaryStart = bottomLeft;
        boundaryEnd = bottomRight;
    } else if(surpassedLeft){
        boundaryStart = bottomLeft;
        boundaryEnd = topLeft;
    }
    const res = getLineSegmentIntersection(origin, destination, boundaryStart, boundaryEnd);
    if(!res.intersects){
        throw new Error("should have intersection but cannot calculate one");
    }
    switch(res.intersections.intersectionType){
    case "point":
        manipulatePoint = {...res.intersections.intersectionPoint};
        break;
    case "interval":
        manipulatePoint = {...res.intersections.intervalEndPoint};
        break;
    default:
        throw new Error("with intersections but the type is unknown");
    }
    return manipulatePoint;
}

function transformViewPort2WorldSpaceWithCameraAttributes(point: Point, cameraPosition: Point, cameraZoomLevel: number, cameraRotation: number): Point{
    const scaledBack = multiplyByScalar(point, 1 / cameraZoomLevel);
    const rotatedBack = rotateVector(scaledBack, cameraRotation);
    const withOffset = vectorAddition(rotatedBack, cameraPosition);
    return withOffset;
}

function viewPortWithinPositionBoundary(viewPortWidth: number, viewPortHeight: number, cameraPosition: Point, cameraZoomLevel: number, cameraRotation: number, positionBoundary: PositionBoundary): boolean {
    const topLeftCorner = {x: -viewPortWidth / 2, y: viewPortHeight / 2};
    const topRightCorner = {x: viewPortWidth / 2, y: viewPortHeight / 2};
    const bottomLeftCorner = {x: -viewPortWidth / 2, y: -viewPortHeight / 2};
    const bottomRightCorner = {x: viewPortWidth / 2, y: -viewPortHeight / 2};
    
    const topLeftCornerTransformed = transformViewPort2WorldSpaceWithCameraAttributes(topLeftCorner, cameraPosition, cameraZoomLevel, cameraRotation);
    const topRightCornerTransformed = transformViewPort2WorldSpaceWithCameraAttributes(topRightCorner, cameraPosition, cameraZoomLevel, cameraRotation);
    const bottomLeftCornerTransformed = transformViewPort2WorldSpaceWithCameraAttributes(bottomLeftCorner, cameraPosition, cameraZoomLevel, cameraRotation);
    const bottomRightCornerTransformed = transformViewPort2WorldSpaceWithCameraAttributes(bottomRightCorner, cameraPosition, cameraZoomLevel, cameraRotation);
    
    return withinPositionBoundary(topLeftCornerTransformed, positionBoundary) && withinPositionBoundary(topRightCornerTransformed, positionBoundary) && withinPositionBoundary(bottomLeftCornerTransformed, positionBoundary) && withinPositionBoundary(bottomRightCornerTransformed, positionBoundary);
}

function clampingEntireViewPort(viewPortWidth: number, viewPortHeight: number, targetCameraPosition: Point, cameraRotation: number, cameraZoomLevel: number, positionBoundary: PositionBoundary): Point {
    const topLeftCorner = {x: -viewPortWidth / 2, y: viewPortHeight / 2};
    const topRightCorner = {x: viewPortWidth / 2, y: viewPortHeight / 2};
    const bottomLeftCorner = {x: -viewPortWidth / 2, y: -viewPortHeight / 2};
    const bottomRightCorner = {x: viewPortWidth / 2, y: -viewPortHeight / 2};
    
    const topLeftCornerTransformed = transformViewPort2WorldSpaceWithCameraAttributes(topLeftCorner, targetCameraPosition, cameraZoomLevel, cameraRotation);
    const topRightCornerTransformed = transformViewPort2WorldSpaceWithCameraAttributes(topRightCorner, targetCameraPosition, cameraZoomLevel, cameraRotation);
    const bottomLeftCornerTransformed = transformViewPort2WorldSpaceWithCameraAttributes(bottomLeftCorner, targetCameraPosition, cameraZoomLevel, cameraRotation);
    const bottomRightCornerTransformed = transformViewPort2WorldSpaceWithCameraAttributes(bottomRightCorner, targetCameraPosition, cameraZoomLevel, cameraRotation);
    
    if( withinPositionBoundary(topLeftCornerTransformed, positionBoundary) && withinPositionBoundary(topRightCornerTransformed, positionBoundary) && withinPositionBoundary(bottomLeftCornerTransformed, positionBoundary) && withinPositionBoundary(bottomRightCornerTransformed, positionBoundary)){
        return targetCameraPosition;
    }   
    const topLeftCornerClamped = simpleClamping(topLeftCornerTransformed, positionBoundary);
    const topRightCornerClamped = simpleClamping(topRightCornerTransformed, positionBoundary);
    const bottomLeftCornerClamped = simpleClamping(bottomLeftCornerTransformed, positionBoundary);
    const bottomRightCornerClamped = simpleClamping(bottomRightCornerTransformed, positionBoundary);

    const topLeftCornerDelta = vectorSubtraction(topLeftCornerClamped, topLeftCornerTransformed);
    const topRightCornerDelta = vectorSubtraction(topRightCornerClamped, topRightCornerTransformed);
    const bottomLeftCornerDelta = vectorSubtraction(bottomLeftCornerClamped, bottomLeftCornerTransformed);
    const bottomRightCornerDelta = vectorSubtraction(bottomRightCornerClamped, bottomRightCornerTransformed);
    
    let diffs = [topLeftCornerDelta, topRightCornerDelta, bottomLeftCornerDelta, bottomRightCornerDelta];
    let maxXDiff = Math.abs(diffs[0].x);
    let maxYDiff = Math.abs(diffs[0].y);
    let delta = diffs[0];
    diffs.forEach((diff)=>{
        if(Math.abs(diff.x) > maxXDiff){
            maxXDiff = Math.abs(diff.x);
            delta.x = diff.x;
        }
        if(Math.abs(diff.y) > maxYDiff){
            maxYDiff = Math.abs(diff.y);
            delta.y = diff.y;
        }
    });

    return vectorAddition(delta, targetCameraPosition);
}

export function withinZoomLevelBoundary(zoomLevel: number, zoomLevelBoundary: ZoomLevelBoundary): boolean {
    return zoomLevel <= zoomLevelBoundary.max && zoomLevel >= zoomLevelBoundary.min;
}

export function getMinZoomLevel(viewPortWidth: number, viewPortHeight: number, positionBoundary: PositionBoundary): number{
    const minZoomLevelBasedOnWidth = viewPortWidth / (positionBoundary.max.x - positionBoundary.min.x);
    const minZoomLevelBasedOnHeight = viewPortHeight / (positionBoundary.max.y - positionBoundary.min.y);
    return minZoomLevelBasedOnWidth > minZoomLevelBasedOnHeight ? minZoomLevelBasedOnWidth : minZoomLevelBasedOnHeight;
}

export function getMinZoomLevelWithCameraRotation(viewPortWidth: number, viewPortHeight: number, positionBoundary: PositionBoundary): number {
    const steps = 10;
    let rotation = 0;
    const increment = Math.PI / (2 * steps);
    const boundaryWidth = positionBoundary.max.x - positionBoundary.min.x;
    const boundaryHeight = positionBoundary.max.y - positionBoundary.min.y;
    let maxMinWidthZoomLevel = viewPortWidth / boundaryWidth;
    let maxMinHeightZoomLevel = viewPortHeight / boundaryHeight;
    for(let i = 0;  i < steps + 1; i++){
        const widthPrime = viewPortHeight * Math.sin(rotation) + viewPortWidth * Math.cos(rotation);
        const heightPrime = viewPortHeight * Math.cos(rotation) + viewPortWidth * Math.sin(rotation);

        maxMinWidthZoomLevel = Math.max(maxMinWidthZoomLevel, widthPrime / boundaryWidth);
        maxMinHeightZoomLevel = Math.max(maxMinHeightZoomLevel, heightPrime / boundaryHeight);
        rotation += increment;
    }
    return maxMinWidthZoomLevel > maxMinHeightZoomLevel ? maxMinWidthZoomLevel : maxMinHeightZoomLevel;
}

export { Camera };
