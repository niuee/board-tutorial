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
