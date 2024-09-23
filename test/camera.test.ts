import { Camera } from '../src/camera';
import { Point } from '../src/vector';
import { expect, describe, test, beforeEach } from 'vitest';

describe('Camera', () => {
  let camera: Camera;

  beforeEach(() => {
    camera = new Camera();
  });

  describe('transformWorldSpace2ViewPort', () => {
    test('identity transformation', () => {
      const worldPoint: Point = { x: 10, y: 20 };
      const viewportPoint = camera.transformWorldSpace2ViewPort(worldPoint);
      expect(viewportPoint).toEqual({ x: 10, y: 20 });
    });

    test('with camera position offset', () => {
      camera.setPosition({ x: 5, y: 5 });
      const worldPoint: Point = { x: 10, y: 20 };
      const viewportPoint = camera.transformWorldSpace2ViewPort(worldPoint);
      expect(viewportPoint).toEqual({ x: 5, y: 15 });
    });

    test('with zoom', () => {
      camera.setZoomLevel(2);
      const worldPoint: Point = { x: 10, y: 20 };
      const viewportPoint = camera.transformWorldSpace2ViewPort(worldPoint);
      expect(viewportPoint).toEqual({ x: 20, y: 40 });
    });

    test('with rotation', () => {
      camera.setRotation(Math.PI / 2); // 90 degrees
      const worldPoint: Point = { x: 10, y: 0 };
      const viewportPoint = camera.transformWorldSpace2ViewPort(worldPoint);
      expect(viewportPoint.x).toBeCloseTo(0);
      expect(viewportPoint.y).toBeCloseTo(-10);
    });

    test('with position, zoom, and rotation', () => {
      camera.setPosition({ x: 5, y: 5 });
      camera.setZoomLevel(2);
      camera.setRotation(Math.PI / 4); // 45 degrees

      const worldPoint: Point = { x: 10, y: 20 };
      const viewportPoint = camera.transformWorldSpace2ViewPort(worldPoint);

      // Calculate expected result
      // 1. Translation
      const tx = 10 - 5;
      const ty = 20 - 5;
      // 2. Scale (zoom)
      const sx = tx * 2;
      const sy = ty * 2;
      // 3. Rotation
      const cos45 = Math.cos(-Math.PI / 4);
      const sin45 = Math.sin(-Math.PI / 4);
      const expectedX = sx * cos45 - sy * sin45;
      const expectedY = sx * sin45 + sy * cos45;

      expect(viewportPoint.x).toBeCloseTo(expectedX);
      expect(viewportPoint.y).toBeCloseTo(expectedY);
    });
  });

  describe('transformViewPort2WorldSpace', () => {
    test('identity transformation', () => {
      const viewportPoint: Point = { x: 10, y: 20 };
      const worldPoint = camera.transformViewPort2WorldSpace(viewportPoint);
      expect(worldPoint).toEqual({ x: 10, y: 20 });
    });

    test('with camera position offset', () => {
      camera.setPosition({ x: 5, y: 5 });
      const viewportPoint: Point = { x: 5, y: 15 };
      const worldPoint = camera.transformViewPort2WorldSpace(viewportPoint);
      expect(worldPoint).toEqual({ x: 10, y: 20 });
    });

    test('with zoom', () => {
      camera.setZoomLevel(2);
      const viewportPoint: Point = { x: 20, y: 40 };
      const worldPoint = camera.transformViewPort2WorldSpace(viewportPoint);
      expect(worldPoint).toEqual({ x: 10, y: 20 });
    });

    test('with rotation', () => {
      camera.setRotation(Math.PI / 2); // 90 degrees
      const viewportPoint: Point = { x: 0, y: -10 };
      const worldPoint = camera.transformViewPort2WorldSpace(viewportPoint);
      expect(worldPoint.x).toBeCloseTo(10);
      expect(worldPoint.y).toBeCloseTo(0);
    });

    test('with position, zoom, and rotation', () => {
      camera.setPosition({ x: 5, y: 5 });
      camera.setZoomLevel(2);
      camera.setRotation(Math.PI / 4); // 45 degrees

      // Use a known viewport point
      const viewportPoint: Point = { x: 7.071067811865475, y: 24.74873734152916 };
      const worldPoint = camera.transformViewPort2WorldSpace(viewportPoint);

      // Calculate expected result
      // 1. Rotation (inverse)
      const cos45 = Math.cos(Math.PI / 4);
      const sin45 = Math.sin(Math.PI / 4);
      const rx = viewportPoint.x * cos45 - viewportPoint.y * sin45;
      const ry = viewportPoint.x * sin45 + viewportPoint.y * cos45;
      // 2. Scale (unzoom)
      const sx = rx / 2;
      const sy = ry / 2;
      // 3. Translation
      const expectedX = sx + 5;
      const expectedY = sy + 5;

      expect(worldPoint.x).toBeCloseTo(expectedX);
      expect(worldPoint.y).toBeCloseTo(expectedY);
    });
  });
});