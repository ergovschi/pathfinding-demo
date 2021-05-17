import { SetterOrUpdater } from "recoil";
import { DrawPosition, PixiDrawManager } from "../Graphics/PixiDrawManager";
import { Graph, GraphSolver } from "../Solvers/Solvers";
import { DemoAction } from "../Views/ActionsViewer";
import { CanvasInfo } from "./CanvasInfo";
import { ControllerProvider, PathfinderController } from "./Controller";
import { ObstaclesController } from "./ObstaclesController";

export class LessonController implements PathfinderController {
  static provider: ControllerProvider = {
    get: (a, b, c, d, e) => new LessonController(a, b, c, d, e),
    name: "Lesson",
  };
  private graph = new Graph();
  private pos1: DrawPosition = { x: 225, y: 75 };
  private pos2: DrawPosition = { x: 75, y: 475 };
  private pos3: DrawPosition = { x: 525, y: 125 };
  private pos4: DrawPosition = { x: 525, y: 475 };

  constructor(
    private drawManager: PixiDrawManager,
    private solver: GraphSolver,
    private obstaclesController: ObstaclesController,
    private canvas: CanvasInfo,
    private setActions: SetterOrUpdater<DemoAction[]>
  ) {
    this.drawObstacles();

    this.graph.vertices.set("h", this.canvas.heroPosition);
    this.graph.vertices.set("p", this.canvas.princessPosition);
    this.graph.vertices.set("1", this.pos1);
    this.graph.vertices.set("2", this.pos2);
    this.graph.vertices.set("3", this.pos3);
    this.graph.vertices.set("4", this.pos4);

    this.graph.adjecent.set("h", ["1"]);
    this.graph.adjecent.set("1", ["h", "2", "3", "4"]);
    this.graph.adjecent.set("2", ["1"]);
    this.graph.adjecent.set("3", ["1", "4", "p"]);
    this.graph.adjecent.set("4", ["1", "3", "p"]);
    this.graph.adjecent.set("p", ["4", "3"]);

    this.moveTo("h");
    this.drawGraph();
  }

  private moveTo = (node: string) => {
    this.drawManager.moveHero(this.graph.vertices.get(node)!);

    this.setActions(
      this.graph.adjecent
        .get(node)!
        .map((n) => ({ name: `Move to ${n}`, fn: () => this.moveTo(n) }))
    );
  };

  private drawGraph = () => {
    this.drawManager.drawGraph(this.graph);
  };

  private drawObstacles = () => {
    this.obstaclesController.drawObstacles();
  };
}
