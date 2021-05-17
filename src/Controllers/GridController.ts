import { isUndefined } from "lodash";
import { SetterOrUpdater } from "recoil";
import { v4 as uuidv4 } from "uuid";
import { CanvasInfo } from "./CanvasInfo";
import { ControllerProvider, PathfinderController } from "./Controller";
import { GraphSolutionController } from "./GraphSolutionController";
import { ObstaclesController } from "./ObstaclesController";
import { Graph, GraphSolver, VertexId } from "../Solvers/Solvers";
import { GridType, PixiDrawManager } from "../Graphics/PixiDrawManager";
import { DemoAction } from "../Views/ActionsViewer";

export interface ObjPos {
  x: number;
  y: number;
}
export interface ObjDimensions {
  x: number;
  y: number;
}

export interface Obstacle {
  position: ObjPos;
  dimensions: ObjDimensions;
}

export class GridAlgorithmsController implements PathfinderController {
  private squareSize: number = 50;
  private readonly gridWidth = this.canvas.width / this.squareSize;
  private readonly gridHeight = this.canvas.height / this.squareSize;

  private solutionController?: GraphSolutionController;

  private availablityGrid: Array<Array<string | undefined>> = Array(
    this.gridWidth
  )
    .fill(0)
    .map(() => Array(this.gridHeight).fill(undefined));

  static provider: ControllerProvider = {
    get: (a, b, c, d, e) => new GridAlgorithmsController(a, b, c, d, e),
    name: "Grid",
  };

  constructor(
    private drawManager: PixiDrawManager,
    private solver: GraphSolver,
    private obstaclesController: ObstaclesController,
    private canvas: CanvasInfo,
    private setActions: SetterOrUpdater<DemoAction[]>
  ) {
    this.obstaclesController.drawObstacles();
    setActions([{ name: "Show Grid", fn: this.initializeGrid }]);
  }

  public drawSolution = () => {
    this.solutionController?.drawSolution();
  };

  public initializeGrid = () => {
    this.overGrid((i, j) =>
      this.drawDelayedSquare(i, j, (i + j) % 2 ? "initial" : "initialDark")
    );
    this.setActions([
      { name: "Show Accessible Squares", fn: this.computeAccessibleSquares },
    ]);
  };

  private overGrid = <T>(fn: (x: number, y: number) => T) => {
    for (let i = 0; i < this.gridWidth; i++) {
      for (let j = 0; j < this.gridHeight; j++) {
        fn(i, j);
      }
    }
  };

  public computeAccessibleSquares = () => {
    this.overGrid((i, j) => {
      const isAccessible = !this.obstaclesController.hitsAnyObstacle({
        position: { x: i, y: j },
        dimensions: { x: 1, y: 1 },
      });

      this.drawDelayedSquare(
        i,
        j,
        isAccessible
          ? (i + j) % 2
            ? "accessible"
            : "accessibleDark"
          : "inaccessible"
      );

      this.availablityGrid[i][j] = isAccessible ? uuidv4() : undefined;
    });
    this.setActions([{ name: "Compute Graph", fn: this.drawGraph }]);
  };

  public drawGraph = () => {
    let graph = new Graph();
    this.overGrid((i, j) => {
      this.addNeighboursToGraph(i, j, this.availablityGrid, graph);
    });
    this.drawManager.drawGraph(graph);
    this.solutionController = new GraphSolutionController(this.drawManager, {
      graph,
      soln: this.solver.solve(
        graph,
        this.availablityGrid[0][0]!,
        this.availablityGrid[this.gridWidth - 1][this.gridHeight - 1]!
      ),
    });
    this.setActions([{ name: "Compute Solution", fn: this.drawSolution }]);
  };

  private addNeighboursToGraph(
    x: number,
    y: number,
    gridGraph: Array<Array<string | undefined>>,
    graph: Graph
  ) {
    const currentId = gridGraph[x][y];
    if (!isUndefined(currentId)) {
      graph.vertices.set(currentId, {
        x: (x + 0.5) * this.squareSize,
        y: (y + 0.5) * this.squareSize,
      });
      const adj: VertexId[] = [];
      const addIfNotUndefined = (xx: number, yy: number) => {
        const v = gridGraph[xx][yy];
        if (!isUndefined(v)) {
          adj.push(v);
        }
      };
      if (x > 0) {
        addIfNotUndefined(x - 1, y);
      }
      if (y > 0) {
        addIfNotUndefined(x, y - 1);
      }
      if (x < this.gridWidth - 1) {
        addIfNotUndefined(x + 1, y);
      }
      if (y < this.gridHeight - 1) {
        addIfNotUndefined(x, y + 1);
      }

      graph.adjecent.set(currentId, adj);
    }
  }

  private drawDelayedSquare = (i: number, j: number, type: GridType) => {
    setTimeout(
      () =>
        this.drawManager.DrawSquare({
          type,
          position: { x: i * this.squareSize, y: j * this.squareSize },
          size: this.squareSize,
        }),
      Math.sqrt(i * i + j * j) * 20
    );
  };
}
