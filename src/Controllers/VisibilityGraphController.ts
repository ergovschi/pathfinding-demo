import { SetterOrUpdater } from "recoil";
import {
  DrawPosition,
  PixiDrawManager,
} from "../Graphics/PixiDrawManager";
import { Graph, GraphSolver } from "../Solvers/Solvers";
import { DemoAction } from "../Views/ActionsViewer";
import { CanvasInfo, inCanvasFilter } from "./CanvasInfo";
import { ControllerProvider, PathfinderController } from "./Controller";
import { ExpandedObstacles } from "./ExpandedObstacles";
import { GraphSolutionController } from "./GraphSolutionController";
import { ObstaclesController } from "./ObstaclesController";
import { SegmentIntersectionCalculator } from "./SegmentRectacleIntersection";

export class VisibilityGraphController implements PathfinderController {
  private readonly intersectionCalc = new SegmentIntersectionCalculator();
  private expandedObstacles: ExpandedObstacles;
  static provider: ControllerProvider = {
    get: (a, b, c, d, e) => new VisibilityGraphController(a, b, c, d, e),
    name: "Visibility Graph",
  };

  constructor(
    private drawManager: PixiDrawManager,
    private solver: GraphSolver,
    private obstaclesController: ObstaclesController,
    private canvas: CanvasInfo,
    private setActions: SetterOrUpdater<DemoAction[]>
  ) {
    this.drawObstacles();
    this.expandedObstacles = new ExpandedObstacles(
      drawManager,
      obstaclesController,
      canvas
    );
    setActions([{ name: "Show Inccessible Area", fn: this.showInaccessible }]);
  }

  public showInaccessible = () => {
    this.expandedObstacles.draw();
    this.setActions([{ name: "Draw Graph", fn: this.computeSolution }]);
  };

  private drawObstacles = () => {
    this.obstaclesController.drawObstacles();
  };

  private computeSolution = () => {
    const allPoints: DrawPosition[] = this.expandedObstacles.all
      .flatMap((obs) => {
        const { position, size } = obs;
        return [
          { x: position.x, y: position.y },
          { x: position.x, y: position.y + size.y },
          { x: position.x + size.x, y: position.y },
          { x: position.x + size.x, y: position.y + size.y },
        ];
      })
      .concat([this.canvas.heroPosition, this.canvas.princessPosition])
      .filter(inCanvasFilter(this.canvas));

    let graph = new Graph();
    for (let i = 0; i < allPoints.length; i++) {
      graph.vertices.set(i.toString(), allPoints[i]);
      graph.adjecent.set(i.toString(), []);
    }

    for (let i = 0; i < allPoints.length; ++i) {
      for (let j = 0; j < allPoints.length; ++j) {
        if (this.isViableLine(allPoints[i], allPoints[j])) {
          graph.adjecent.get(i.toString())?.push(j.toString());
          graph.adjecent.get(j.toString())?.push(i.toString());
        }
      }
    }

    this.drawManager.drawGraph(graph);

    let solutionController = new GraphSolutionController(this.drawManager, {
      graph,
      soln: this.solver.solve(
        graph,
        (allPoints.length - 2).toString(),
        (allPoints.length - 1).toString()
      ),
    });
    this.setActions([
      { name: "Compute Solution", fn: solutionController.drawSolution },
    ]);
  };

  private isViableLine = (p1: DrawPosition, p2: DrawPosition): boolean => {
    let result = true;
    this.expandedObstacles.all.forEach((obstacle) => {
      result =
        result && !this.intersectionCalc.intresectsLine(p1, p2, obstacle);
    });
    return result;
  };
}
