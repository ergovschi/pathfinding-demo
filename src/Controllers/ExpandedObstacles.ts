import {
  DrawObstacle,
  DrawPosition,
  PixiDrawManager,
} from "../Graphics/PixiDrawManager";
import { CanvasInfo } from "./CanvasInfo";
import { ObstaclesController } from "./ObstaclesController";

export class ExpandedObstacles {
  private expandedObstacles: DrawObstacle[] = [];

  constructor(
    private drawManager: PixiDrawManager,
    private obstaclesController: ObstaclesController,
    private canvas: CanvasInfo
  ) {
    this.init();
  }

  private init = () => {
    this.obstaclesController.obstacles.forEach((obstacle) => {
      const drawObs = this.obstaclesController.expandObstacleForDrawing(
        obstacle
      );
      const expandedObstacle: DrawObstacle = {
        position: {
          x: drawObs.position.x - this.canvas.heroSize,
          y: drawObs.position.y - this.canvas.heroSize,
        },
        size: {
          x: drawObs.size.x + 2 * this.canvas.heroSize,
          y: drawObs.size.y + 2 * this.canvas.heroSize,
        },
      };
      this.expandedObstacles.push(expandedObstacle);
    });
  };

  public get all() {
    return this.expandedObstacles;
  }

  public draw = () => {
    this.drawManager.drawObstacleUnavailable(this.expandedObstacles);
  };

  public hitsAny = (pos: DrawPosition): boolean => {
    let res = false;
    this.expandedObstacles.forEach((obs) => {
      res = res || this.hitsObstacle(pos, obs);
    });
    return res;
  };

  private hitsObstacle = (
    pos: DrawPosition,
    obstacle: DrawObstacle
  ): boolean => {
    return !(
      pos.x < obstacle.position.x ||
      pos.x > obstacle.position.x + obstacle.size.x ||
      pos.y < obstacle.position.y ||
      pos.y > obstacle.position.y + obstacle.size.y
    );
  };
}
