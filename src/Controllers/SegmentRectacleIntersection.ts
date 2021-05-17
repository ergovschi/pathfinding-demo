import { DrawObstacle, DrawPosition } from "../Graphics/PixiDrawManager";

export class SegmentIntersectionCalculator {
  private ge = (a: number, b: number) => {
    return a - b > -0.000001;
  };
  public intresectsLine = (
    p1: DrawPosition,
    p2: DrawPosition,
    obs: DrawObstacle
  ): boolean => {
    const { position, size } = obs;
    // Figure out if projections intersect.
    let minX = Math.min(p1.x, p2.x);
    let maxX = Math.max(p1.x, p2.x);

    if (
      this.ge(obs.position.x, maxX) ||
      this.ge(minX, obs.position.x + obs.size.x)
    ) {
      // Projections do not intersect on X
      return false;
    }
    maxX = Math.min(maxX, position.x + size.x);
    minX = Math.max(minX, position.x);

    var minY = p1.y;
    var maxY = p2.y;
    var dx = p2.x - p1.x;

    if (Math.abs(dx) > 0.0000001) {
      var slope = (p2.y - p1.y) / dx;
      var offset = p1.y - slope * p1.x;
      minY = slope * minX + offset;
      maxY = slope * maxX + offset;
    }

    if (minY > maxY) {
      var tmp = maxY;
      maxY = minY;
      minY = tmp;
    }

    if (
      this.ge(obs.position.y, maxY) ||
      this.ge(minY, obs.position.y + obs.size.y)
    ) {
      // Projections do not intersect on X
      return false;
    }

    console.log("Intersection", p1, p2, obs);
    return true;
  };
}
