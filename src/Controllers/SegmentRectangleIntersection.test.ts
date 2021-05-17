import { DrawObstacle } from "../Graphics/PixiDrawManager";
import { SegmentIntersectionCalculator } from "./SegmentRectacleIntersection";

test("Intersection correct for X parallel lines", () => {
  let calc = new SegmentIntersectionCalculator();

  let p1 = { x: 3, y: 0 };
  let p2 = { x: 3, y: 10 };
  let o: DrawObstacle = {
    position: { x: 1, y: 1 },
    size: { x: 5, y: 5 },
  };

  expect(calc.intresectsLine(p1, p2, o)).toBeTruthy();
  expect(calc.intresectsLine(p2, p1, o)).toBeTruthy();
});

test("Intersection correct for X parallel lines", () => {
  let calc = new SegmentIntersectionCalculator();

  let p1 = { x: 0, y: 3 };
  let p2 = { x: 10, y: 3 };
  let o: DrawObstacle = {
    position: { x: 1, y: 1 },
    size: { x: 5, y: 5 },
  };

  expect(calc.intresectsLine(p1, p2, o)).toBeTruthy();
  expect(calc.intresectsLine(p2, p1, o)).toBeTruthy();
});

test("Intersection correct when outside", () => {
  let calc = new SegmentIntersectionCalculator();

  let p1 = { x: 6, y: 6 };
  let p2 = { x: 10, y: 20 };
  let o: DrawObstacle = {
    position: { x: 1, y: 1 },
    size: { x: 5, y: 5 },
  };

  expect(calc.intresectsLine(p1, p2, o)).toBeFalsy();
  expect(calc.intresectsLine(p2, p1, o)).toBeFalsy();
});

test("Intersection correct when partial", () => {
  let calc = new SegmentIntersectionCalculator();

  let p1 = { x: 1, y: 2 };
  let p2 = { x: 4, y: 5 };
  let o: DrawObstacle = {
    position: { x: 2, y: 2 },
    size: { x: 2, y: 2 },
  };

  expect(calc.intresectsLine(p1, p2, o)).toBeTruthy();
  expect(calc.intresectsLine(p2, p1, o)).toBeTruthy();
});

test("No intersection if only touching", () => {
  let calc = new SegmentIntersectionCalculator();

  let p1 = { x: 2, y: 2 };
  let p2 = { x: 1, y: 3 };
  let o: DrawObstacle = {
    position: { x: 2, y: 2 },
    size: { x: 2, y: 2 },
  };

  expect(calc.intresectsLine(p1, p2, o)).toBeFalsy();
  expect(calc.intresectsLine(p2, p1, o)).toBeFalsy();
});

test("No intersection if only touching inside", () => {
  let calc = new SegmentIntersectionCalculator();

  let p1 = { x: 4, y: 4 };
  let p2 = { x: 5, y: 0 };
  let o: DrawObstacle = {
    position: { x: 2, y: 2 },
    size: { x: 2, y: 2 },
  };

  expect(calc.intresectsLine(p1, p2, o)).toBeFalsy();
  expect(calc.intresectsLine(p2, p1, o)).toBeFalsy();
});

test("No intersection if only touching inside", () => {
  let calc = new SegmentIntersectionCalculator();

  expect(calc.intresectsLine(p1, p2, o)).toBeFalsy();
  expect(calc.intresectsLine(p2, p1, o)).toBeFalsy();
});
