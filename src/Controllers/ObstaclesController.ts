import { DrawObstacle, PixiDrawManager } from "../Graphics/PixiDrawManager";
import { Obstacle } from "./GridController";
import { ObstacleSet } from "../Obstacles/ObstacleSets";
import { v4 as uuidv4 } from "uuid";

export class ObstaclesController {
  private _obstacles: Map<string, Obstacle> = new Map();
  private squareSize: number = 50;

  constructor(private drawManager: PixiDrawManager, set: ObstacleSet) {
    this.initializeObstacles(set.obstacles);
  }

  public get obstacles() {
    return this._obstacles;
  }

  public drawObstacles = () => {
    this._obstacles.forEach((obstacle, key) => {
      this.drawManager.drawObstacle(
        key,
        this.expandObstacleForDrawing(obstacle)
      );
    });
  };

  public expandObstacleForDrawing = (obstacle: Obstacle): DrawObstacle => {
    return {
      position: {
        x: obstacle.position.x * this.squareSize,
        y: obstacle.position.y * this.squareSize,
      },
      size: {
        x: obstacle.dimensions.x * this.squareSize,
        y: obstacle.dimensions.y * this.squareSize,
      },
    };
  };

  public hitsAnyObstacle = (sq: Obstacle): boolean => {
    let result = false;
    this.obstacles.forEach((obstacle) => {
      result = result || this.obstaclesIntersect(sq, obstacle);
    });
    return result;
  };

  public obstaclesIntersect = (o1: Obstacle, o2: Obstacle): boolean => {
    const l1 = o1.position;
    const r1 = {
      x: o1.position.x + o1.dimensions.x,
      y: o1.position.y + o1.dimensions.y,
    };

    const l2 = o2.position;
    const r2 = {
      x: o2.position.x + o2.dimensions.x,
      y: o2.position.y + o2.dimensions.y,
    };

    console.log("BB", l1, r1, l2, r2);

    // If one rectangle is on left side of other
    if (l1.x >= r2.x || l2.x >= r1.x) {
      console.log("X1");
      return false;
    }

    // If one rectangle is above other
    if (l1.y >= r2.y || l2.y >= r1.y) {
      console.log("X2");
      return false;
    }
    return true;
  };

  private initializeObstacles = (obstacleSet: Obstacle[]) => {
    this.obstacles.clear();
    obstacleSet.forEach((obstacle) => {
      this.obstacles.set(uuidv4(), obstacle);
    });
  };
}
