export type Point = {
    x: number;
    y: number;
}

export function magnitude(vector: Point): number {
    return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
}

export function unitVector(vector: Point): Point{
    const mag = magnitude(vector);
    return {x: vector.x / mag, y: vector.y / mag};
}

export function vectorAddition(vectorA: Point, vectorB: Point): Point {
    return {x: vectorA.x + vectorB.x, y: vectorA.y + vectorB.y};
}

export function vectorSubtraction(vectorA: Point, vectorB: Point): Point {
    return {x: vectorA.x - vectorB.x, y: vectorA.y - vectorB.y};
}

export function multiplyByScalar(vector: Point, scalar: number): Point {
    return {x: vector.x * scalar, y: vector.y * scalar};
}

export function dotProduct(vectorA: Point, vectorB: Point): number {
    return vectorA.x * vectorB.x + vectorA.y * vectorB.y;
}

export function rotateVector(vector: Point, angle: number): Point {
    return {x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle), y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle)};
}

export function angleFromA2B(vectorA: Point, vectorB: Point): number {
    return Math.atan2(vectorA.x * vectorB.y - vectorA.y * vectorB.x, vectorA.x * vectorB.x + vectorA.y * vectorB.y);
}

export type PointIntersection = {
    intersectionType: "point";
    intersectionPoint: Point;
    ratio: number;
}

export type IntervalIntersection = {
    intersectionType: "interval";
    intervalStartPoint: Point;
    intervalEndPoint: Point;
    startRatio: number;
    endRatio: number;
}

export type IntersectionPositive = {
    intersects: true;
    intersections: IntervalIntersection | PointIntersection;
}

export type IntersectionNegative = {
    intersects: false;
}

export type IntersectionResult = IntersectionPositive | IntersectionNegative;

export function pointLiesOnSegment(point: Point, startPoint: Point, endPoint: Point): boolean {
    const areaCheck = startPoint.x * (endPoint.y - point.y) + endPoint.x * (point.y - startPoint.y) + point.x * (startPoint.y - endPoint.y);
    if(areaCheck !== 0) {
        return false;
    }
    let xInRange = Math.min(endPoint.x, startPoint.x) <= point.x;
    xInRange = Math.max(endPoint.x, startPoint.x) >= point.x;
    let yInRange = Math.min(endPoint.y, startPoint.y) <= point.y;
    yInRange = Math.max(endPoint.y, startPoint.y) >= point.y;

    return xInRange && yInRange;
}

export function intervalsOverlap(interval1: {start: number, end: number}, interval2: {start: number, end: number}): boolean {
    const transformedInterval1 = interval1.start > interval1.end ? {start: interval1.end, end: interval1.start} : interval1;
    const transformedInterval2 = interval2.start > interval2.end ? {start: interval2.end, end: interval2.start} : interval2;
    return transformedInterval1.start <= transformedInterval2.end && transformedInterval2.start <= transformedInterval1.end;
}

export function pointsAreEqual(point: Point, point2: Point): boolean {
    return point.x === point2.x && point.y === point2.y;
}

export function slopeOf(startPoint: Point, endPoint: Point): number {
    return (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x);
}

export function offsetOf(startPoint: Point, endPoint: Point): number {
    return startPoint.y - slopeOf(startPoint, endPoint) * startPoint.x;
}

export type PositiveOverlapInterval = {
    overlaps: true;
    start: number;
    end: number;
}

export type NegativeOverlapInterval = {
    overlaps: false;
}

export type OverlapIntervalResult = PositiveOverlapInterval | NegativeOverlapInterval;

export function getOverlapStartAndEnd(interval1: {start: number, end: number}, interval2: {start: number, end: number}): OverlapIntervalResult{
    const transformedInterval1 = interval1.start > interval1.end ? {start: interval1.end, end: interval1.start} : interval1;
    const transformedInterval2 = interval2.start > interval2.end ? {start: interval2.end, end: interval2.start} : interval2;
    if(!intervalsOverlap(transformedInterval1, transformedInterval2)) {
        return {
            overlaps: false,
        }
    }
    return {overlaps: true, start: Math.max(transformedInterval1.start, transformedInterval2.start), end: Math.min(transformedInterval1.end, transformedInterval2.end)};
}

export function linearInterpolation(startPoint: Point, endPoint: Point, ratio: number): Point {
    return {x: startPoint.x + (endPoint.x - startPoint.x) * ratio, y: startPoint.y + (endPoint.y - startPoint.y) * ratio};
}

export function getLineSegmentIntersection(startPoint: Point, endPoint: Point, startPoint2: Point, endPoint2: Point): IntersectionResult {

    if(pointsAreEqual(startPoint, endPoint) && pointsAreEqual(startPoint2, endPoint2)){
        // 兩個線段皆為點，我們只需要檢查兩點是不是一樣的即可
        if(!pointsAreEqual(startPoint, startPoint2)) {
            return {
                intersects: false
            };
        }
        return {
            intersects: true,
            intersections: {
                intersectionType: "point",
                intersectionPoint: startPoint,
                ratio: 0,
            }
        }
    }

    if(pointsAreEqual(startPoint, endPoint)){
        // 第一個線段是個點
        if(!pointLiesOnSegment(startPoint, startPoint2, endPoint2)){
            return {
                intersects: false,
            };
        }
        return {
            intersects: true,
            intersections: {
                intersectionType: "point",
                intersectionPoint: startPoint,
                ratio: 0,
            }
        }
    }

    if(pointsAreEqual(startPoint2, endPoint2)){
        // 第二個線段是個點
        if(!pointLiesOnSegment(startPoint2, startPoint, endPoint)){
            return {
                intersects: false,
            };
        }
        return {
            intersects: true,
            intersections: {
                intersectionType: "point",
                intersectionPoint: startPoint2,
                ratio: (startPoint2.x - startPoint.x) / (endPoint.x - startPoint.x),
            }
        }
    }

    // complete overlap
    if((pointsAreEqual(startPoint, startPoint2) && pointsAreEqual(endPoint, endPoint2)) || (pointsAreEqual(startPoint, endPoint2) && pointsAreEqual(endPoint, startPoint2))){
        return { 
            intersects: true, 
            intersections: {
                intersectionType: "interval",
                intervalStartPoint: startPoint,
                intervalEndPoint: endPoint,
                startRatio: 0,
                endRatio: 1,
            }
        }
    }

    // point overlap
    if(pointsAreEqual(startPoint, startPoint2)){
        return {
            intersects: true,
            intersections: {
                intersectionType: "point",
                intersectionPoint: startPoint,
                ratio: 0,
            }
        }
    }

    if(pointsAreEqual(startPoint, endPoint2)){
        return {
            intersects: true,
            intersections: {
                intersectionType: "point",
                intersectionPoint: startPoint,
                ratio: 0,
            }
        }
    }

    if(pointsAreEqual(endPoint, startPoint2)){
        return {
            intersects: true,
            intersections: {
                intersectionType: "point",
                intersectionPoint: endPoint,
                ratio: 1,
            }
        }
    }

    if(pointsAreEqual(endPoint, endPoint2)){
        return {
            intersects: true,
            intersections: {
                intersectionType: "point",
                intersectionPoint: endPoint,
                ratio: 1,
            }
        }
    }
    const numerator = (endPoint2.x - startPoint2.x) * (startPoint.y - startPoint2.y) - (endPoint2.y - startPoint2.y) * (startPoint.x - startPoint2.x);
    const denominator = (endPoint2.y - startPoint2.y) * (endPoint.x - startPoint.x) - (endPoint2.x - startPoint2.x) * (endPoint.y - startPoint.y);

    if(denominator == 0 && ((endPoint.x !== startPoint.x && offsetOf(startPoint, endPoint) !== offsetOf(startPoint2, endPoint2)) || (endPoint.x === startPoint.x && endPoint.x !== endPoint2.x))){
        return { intersects: false };
    }

    if(denominator == 0){
        const unit = unitVector(vectorSubtraction(endPoint, startPoint));

        const start = dotProduct(unit, startPoint);
        const end = dotProduct(unit, endPoint);

        const start2 = dotProduct(unit, startPoint2);
        const end2 = dotProduct(unit, endPoint2);

        const res = getOverlapStartAndEnd({start, end}, {start: start2, end: end2});
        if(res.overlaps){
            const intervalStartPoint = multiplyByScalar(unit, res.start);
            const intervalEndPoint = multiplyByScalar(unit, res.end);
            const startRatio = (res.start - start) / (end - start);
            const endRatio = (res.end - start) / (end - start);
            return start > end ? {
                intersects: true, 
                intersections: {
                    intersectionType: "interval",
                    intervalStartPoint: intervalEndPoint,
                    intervalEndPoint: intervalStartPoint,
                    startRatio: endRatio,
                    endRatio: startRatio,
                }
            } : {
                intersects: true, 
                intersections: {
                    intersectionType: "interval",
                    intervalStartPoint: intervalStartPoint,
                    intervalEndPoint: intervalEndPoint,
                    startRatio: startRatio,
                    endRatio: endRatio,
                }
            };
        } else {
            return { intersects: false };
        }
    }
    const ratio = numerator / denominator;
    if (ratio >= 0 && ratio <= 1){
        return {
            intersects: true,
            intersections: {
                intersectionType: "point",
                intersectionPoint: linearInterpolation(startPoint, endPoint, ratio),
                ratio: ratio, 
            }
        }
    }

    return {
        intersects: false,
    }
}
