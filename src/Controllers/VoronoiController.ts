import { isUndefined } from "lodash";
import { SetterOrUpdater } from "recoil";
import voronoi from "voronoi-diagram";
import {
  DrawPosition,
  DrawSize,
  PixiDrawManager,
} from "../Graphics/PixiDrawManager";
import { Graph, GraphSolver } from "../Solvers/Solvers";
import { DemoAction } from "../Views/ActionsViewer";
import { CanvasInfo, inCanvasFilter } from "./CanvasInfo";
import { ControllerProvider, PathfinderController } from "./Controller";
import { ExpandedObstacles } from "./ExpandedObstacles";
import { GraphSolutionController } from "./GraphSolutionController";
import { ObstaclesController } from "./ObstaclesController";

export class VoronoiController implements PathfinderController {
  private solutionController?: GraphSolutionController;
  private expandedObstacles: ExpandedObstacles;

  static provider: ControllerProvider = {
    get: (a, b, c, d, e) => new VoronoiController(a, b, c, d, e),
    name: "Voronoi Diagram",
  };

  constructor(
    private drawManager: PixiDrawManager,
    private solver: GraphSolver,
    private obstaclesController: ObstaclesController,
    private readonly canvas: CanvasInfo,
    private setActions: SetterOrUpdater<DemoAction[]>
  ) {
    this.obstaclesController.drawObstacles();
    this.expandedObstacles = new ExpandedObstacles(
      drawManager,
      obstaclesController,
      canvas
    );
    setActions([
      { name: "Show Expanded Obstacles", fn: this.showExpandedObstacles },
    ]);
  }

  public showExpandedObstacles = () => {
    this.expandedObstacles.draw();

    this.setActions([{ name: "Show Graph", fn: this.drawGraph }]);
  };

  public drawSolution = () => {
    this.solutionController?.drawSolution();
  };

  public drawGraph = () => {
    let graph = new Graph();

    const expandBox = (pos: DrawPosition, size: DrawSize): voronoi.Point[] => {
      let res: voronoi.Point[] = [];
      const density = 20;

      for (let i = 1; i <= density - 1; i++) {
        res.push([pos.x + (size.x / density) * i, pos.y]);
        res.push([pos.x + (size.x / density) * i, pos.y + size.y]);

        res.push([pos.x, pos.y + (size.y / density) * i]);
        res.push([pos.x + size.x, pos.y + (size.y / density) * i]);
      }
      return res;
    };

    const points: voronoi.Point[] = this.expandedObstacles.all.flatMap(
      (obs): voronoi.Point[] => {
        const { position, size } = obs;
        return expandBox(position, size);
      }
    );

    points.push(...expandBox({ x: 0, y: 0 }, { x: 900, y: 600 }));
    points.push(...this.expandPoint(this.canvas.heroPosition));
    points.push(...this.expandPoint(this.canvas.princessPosition));

    const gr = voronoi(points);

    const isInCavas = inCanvasFilter(this.canvas);

    gr.positions.forEach((pos, index) => {
      const drawPos: DrawPosition = { x: pos[0], y: pos[1] };
      if (!this.expandedObstacles.hitsAny(drawPos) && isInCavas(drawPos)) {
        graph.vertices.set(index.toString(), { x: pos[0], y: pos[1] });
        graph.adjecent.set(index.toString(), []);
      }
    });

    gr.cells.forEach((cell) => {
      for (let i = 0; i < cell.length; i++) {
        const nextPos = cell[(i + 1) % cell.length];
        const pos = cell[i];
        if (
          pos !== -1 &&
          nextPos !== -1 &&
          !isUndefined(graph.vertices.get(pos.toString())) &&
          !isUndefined(graph.vertices.get(nextPos.toString()))
        ) {
          graph.adjecent.get(pos.toString())?.push(nextPos.toString());

          graph.adjecent.get(nextPos.toString())?.push(pos.toString());
        }
      }
    });
    this.drawManager.drawGraph(graph);

    this.solutionController = new GraphSolutionController(this.drawManager, {
      graph,
      soln: this.solver.solve(
        graph,
        this.findIndex(this.canvas.heroPosition, gr.positions).toString(),
        this.findIndex(this.canvas.princessPosition, gr.positions).toString()
      ),
    });

    this.setActions([{ name: "Draw Solution", fn: this.drawSolution }]);
  };

  private findIndex = (pos: DrawPosition, points: voronoi.Point[]): number => {
    let best = -1;
    let bestDist = 10000000000;

    points.forEach((point, index) => {
      const dist = this.sqDist(pos, { x: point[0], y: point[1] });
      if (dist < bestDist) {
        best = index;
        bestDist = dist;
      }
    });
    return best;
  };

  private sqDist = (p1: DrawPosition, p2: DrawPosition) => {
    const xdist = p1.x - p2.x;
    const ydist = p1.y - p2.y;
    return xdist * xdist + ydist * ydist;
  };

  private expandPoint = (pos: DrawPosition): voronoi.Point[] => {
    const { x, y } = pos;
    return [
      [x - 0.1, y - 0.1],
      [x - 0.1, y + 0.1],
      [x + 0.1, y - 0.1],
      [x + 0.1, y + 0.1],
    ];
  };
}
