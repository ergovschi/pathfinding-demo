import gsap from "gsap";
import * as PIXI from "pixi.js";
import { Hero } from "./Hero";
import { ObstacleDrawer } from "./Obstacle";
import { Princess } from "./Princess";
import { Graph } from "../Solvers/Solvers";
import { CanvasInfo } from "../Controllers/CanvasInfo";
import { DemoColors } from "./DemoColors";

export type GridType =
  | "initial"
  | "initialDark"
  | "accessible"
  | "accessibleDark"
  | "inaccessible";

export class PixiDrawManager {
  private squareGraphics: Map<string, PIXI.Graphics> = new Map();
  private obstacleGraphics: Map<string, PIXI.Graphics> = new Map();
  private obstacleEdgeGraphics: Map<string, PIXI.Graphics> = new Map();
  private shadowGraphics: Map<string, PIXI.Graphics> = new Map();

  private backgroundLayer = new PIXI.Container();
  private gridLayer = new PIXI.Container();
  private graphLayer = new PIXI.Container();
  private solutionLayer = new PIXI.Container();
  private shadowLayer = new PIXI.Container();

  private obstacleLayer = new PIXI.Container();

  private heroContainer = new PIXI.Container();
  private princessLayer = new PIXI.Container();

  private obstacleEdgeLayer = new PIXI.Container();
  private hero = new Hero();
  private princess = new Princess();

  constructor(app: PIXI.Application, readonly canvas: CanvasInfo) {
    app.stage.addChild(this.backgroundLayer);

    app.stage.addChild(this.gridLayer);
    app.stage.addChild(this.graphLayer);
    app.stage.addChild(this.solutionLayer);

    app.stage.addChild(this.shadowLayer);

    app.stage.addChild(this.obstacleEdgeLayer);
    app.stage.addChild(this.obstacleLayer);

    app.stage.addChild(this.heroContainer);
    app.stage.addChild(this.princessLayer);

    this.heroContainer.addChild(this.hero.graphic);
    this.princessLayer.addChild(this.princess.graphic);

    this.heroContainer.x = canvas.heroPosition.x;
    this.heroContainer.y = canvas.heroPosition.y;

    this.princessLayer.x = canvas.princessPosition.x;
    this.princessLayer.y = canvas.princessPosition.y;

    this.obstacleLayer.filters = [new PIXI.filters.NoiseFilter(0.09)];
    this.obstacleEdgeLayer.filters = [new PIXI.filters.NoiseFilter(0.09)];
    this.backgroundLayer.filters = [new PIXI.filters.NoiseFilter(0.03, 3)];

    this.initBackgroundLayer();
  }

  public moveHero = (pos: DrawPosition) => {
    gsap.to(this.heroContainer, {
      pixi: {
        ...pos,
      },
      duration: 1,
      repeat: 0,
    });
  };

  private initBackgroundLayer = () => {
    const bg = new PIXI.Graphics();

    bg.beginFill(DemoColors.background).drawRect(
      -this.canvas.padding,
      -this.canvas.padding,
      this.canvas.width + 2 * this.canvas.padding,
      this.canvas.height + 2 * this.canvas.padding
    );
    this.backgroundLayer.addChild(bg);
    this.backgroundLayer.cacheAsBitmap = true;

    const wall = this.getWallGraphic(DemoColors.obstacle.grayMain);
    wall.tint = DemoColors.obstacle.color;
    this.obstacleLayer.addChild(wall);

    const wallStroke = this.getWallGraphic(DemoColors.borderShadow);
    wallStroke.x = -2;
    wallStroke.y = -2;

    const stroke2 = this.getWallGraphic(DemoColors.borderShadow);
    stroke2.x = 2;
    stroke2.y = 2;

    const wallShadow = this.getWallGraphic(DemoColors.borderShadow);
    wallShadow.filters = [new PIXI.filters.BlurFilter(3, 1)];
    wallShadow.moveTo(-5, -5);
    wallShadow.blendMode = PIXI.BLEND_MODES.DARKEN;

    this.shadowLayer.addChild(wallShadow);

    this.obstacleEdgeLayer.addChild(wallStroke);
    this.obstacleEdgeLayer.addChild(stroke2);
  };

  getWallGraphic = (color: number) => {
    const wall = new PIXI.Graphics();
    wall
      .lineStyle({
        width: this.canvas.padding - 2,
        color,
      })
      .moveTo(-this.canvas.padding / 2, -this.canvas.padding / 2)
      .lineTo(
        -this.canvas.padding / 2,
        this.canvas.height + this.canvas.padding / 2
      )
      .lineTo(
        this.canvas.width + this.canvas.padding / 2,
        this.canvas.height + this.canvas.padding / 2
      )
      .lineTo(
        this.canvas.width + this.canvas.padding / 2,
        -this.canvas.padding / 2
      )
      .lineTo(-this.canvas.padding, -this.canvas.padding / 2);

    return wall;
  };

  public drawObstacle(id: string, obstacle: DrawObstacle) {
    const square = ObstacleDrawer.drawObstacle(obstacle);
    this.replaceGraphic(id, this.obstacleGraphics, this.obstacleLayer, square);

    const edge = ObstacleDrawer.drawObstacleEdge(obstacle);
    this.replaceGraphic(
      id,
      this.obstacleEdgeGraphics,
      this.obstacleEdgeLayer,
      edge
    );
    this.drawShadow(id, obstacle);
  }

  private drawShadow = (id: string, obstacle: DrawObstacle) => {
    const square = ObstacleDrawer.drawShadow(obstacle);
    this.replaceGraphic(id, this.shadowGraphics, this.shadowLayer, square);
  };

  public glowEdge = (p1: DrawPosition, p2: DrawPosition) => {
    const g = new PIXI.Graphics();
    g.lineStyle(6, DemoColors.glowingGraphEdge);
    g.moveTo(p1.x, p1.y);
    g.lineTo(p2.x, p2.y);
    g.filters = [new PIXI.filters.BlurFilter(2)];

    this.solutionLayer.addChild(g);
  };

  public drawSolution(points: DrawPosition[]) {
    this.solutionLayer.removeChildren();
    let g = new PIXI.Graphics();
    g.lineStyle(10, DemoColors.solution);
    g.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; ++i) {
      g.lineTo(points[i].x, points[i].y);
    }
    g.alpha = 0;
    gsap.to(g, {
      pixi: {
        alpha: 1,
      },
      duration: 2,
      repeat: 0,
    });
    this.solutionLayer.addChild(g);
  }

  private replaceGraphic = (
    id: string,
    grSet: Map<string, PIXI.Graphics>,
    layer: PIXI.Container,
    newGraphic: PIXI.Graphics
  ) => {
    grSet.get(id)?.destroy();
    grSet.set(id, newGraphic);

    layer.addChild(newGraphic);
  };

  public drawGraph = (graph: Graph) => {
    this.graphLayer.removeChildren();

    const alreadyDrew = new Set<string>();
    const computeEdgeKey = (v1: string, v2: string): string => {
      if (v1.localeCompare(v2) > 0) {
        return v1 + v2;
      } else {
        return v2 + v1;
      }
    };
    graph.adjecent.forEach((adj, vertex1) => {
      adj.forEach((vertex2) => {
        const edgeKey = computeEdgeKey(vertex1, vertex2);
        if (!alreadyDrew.has(edgeKey)) {
          alreadyDrew.add(edgeKey);

          this.renderGraphLine(
            graph.vertices.get(vertex1)!,
            graph.vertices.get(vertex2)!
          );
        }
      });
    });
    graph.vertices.forEach((coord, vertex) => {
      this.drawPosCircle(graph.vertices.get(vertex)!);
    });
  };

  private drawPosCircle(pos: DrawPosition) {
    const g = new PIXI.Graphics();
    g.beginFill(DemoColors.posCircle.fill);
    g.drawCircle(pos.x, pos.y, 7);
    g.beginFill(DemoColors.posCircle.center);
    g.drawCircle(pos.x, pos.y, 3);

    this.graphLayer.addChild(g);
  }

  private renderGraphLine(p1: DrawPosition, p2: DrawPosition) {
    const g = new PIXI.Graphics();
    g.lineStyle(3, DemoColors.graphLine, 0.6);
    g.moveTo(p1.x, p1.y);
    g.lineTo(p2.x, p2.y);

    this.graphLayer.addChild(g);
  }
  public drawObstacleUnavailable = (expandedObstacles: DrawObstacle[]) => {
    this.gridLayer.removeChildren();

    expandedObstacles.forEach((obs) => {
      const square = new PIXI.Graphics()
        .beginFill(0xffffff)
        .drawShape(
          new PIXI.RoundedRectangle(
            obs.position.x,
            obs.position.y,
            obs.size.x,
            obs.size.y,
            10
          )
        );
      const duration = 1.0;
      gsap.to(square, {
        pixi: {
          tint: DemoColors.squareColors.inaccessible,
        },
        duration,
        repeat: 0,
      });
      this.gridLayer.addChild(square);
    });
  };

  public DrawSquare(animatedSquare: AnimatedGridSquare) {
    const { type, position, size } = animatedSquare;

    this.gridLayer.removeChild(
      this.squareGraphics.get(posKey(animatedSquare.position))!
    );
    this.squareGraphics.get(posKey(animatedSquare.position))?.destroy();

    const square = new PIXI.Graphics()
      .beginFill(0xffffff)
      .drawShape(
        new PIXI.RoundedRectangle(position.x, position.y, size, size, 10)
      );
    square.tint = DemoColors.squareColors.startsAt;
    switch (type) {
      case "inaccessible":
        square.alpha = 1;
        break;
      case "accessible":
      case "accessibleDark":
        square.alpha = 0.1;
        break;
      case "initial":
      case "initialDark":
        square.alpha = 0.2;
        break;
    }

    const duration = 1.0;
    gsap.to(square, {
      pixi: {
        tint: DemoColors.squareColors[animatedSquare.type],
      },
      duration,
      repeat: 0,
    });

    this.squareGraphics.set(posKey(position), square);
    this.gridLayer.addChild(square);
  }
}

export type DrawObstacle = {
  position: DrawPosition;
  size: DrawSize;
};

export type AnimatedGridSquare = {
  type: GridType;
  position: DrawPosition;
  size: number;
};

export type DrawPosition = PIXI.IPointData;
export type DrawSize = {
  x: number;
  y: number;
};

const posKey = (pos: DrawPosition): string => {
  return `${pos.x} ${pos.y}`;
};
