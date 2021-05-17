import { shuffle } from "lodash";
import {
  Graph,
  GraphEdge,
  GraphSolution,
  GraphSolver,
  VertexId,
} from "./Solvers";

export enum GraphSolverMode {
  DFS = "DFS",
  BFS = "BFS",
}

export class SimpleGraphSolver implements GraphSolver {
  constructor(private randomizeOrder: boolean, private mode: GraphSolverMode) {}
  public solve = (
    graph: Graph,
    start: VertexId,
    goal: VertexId
  ): GraphSolution => {
    let explorationOrder: GraphEdge[] = [];

    const visitedNodes: Set<VertexId> = new Set();
    const solution: Array<VertexId> = [];
    let nodesToProcess: Array<{ path: VertexId[] }> = [{ path: [start] }];

    while (nodesToProcess.length > 0) {
      let { path } =
        this.mode === GraphSolverMode.BFS
          ? nodesToProcess.shift()!
          : nodesToProcess.pop()!;
      let currentNode = path[path.length - 1];

      if (currentNode === goal) {
        return { solution: path, explorationOrder };
      }

      if (!visitedNodes.has(currentNode)) {
        if (path.length > 1) {
          explorationOrder.push({ v1: path[path.length - 2], v2: currentNode });
        }
        visitedNodes.add(currentNode);
        solution.push(currentNode);

        const adjecentNodes = graph.adjecent.get(currentNode)!;
        const orderedAdjecentNodes = this.randomizeOrder
          ? shuffle(adjecentNodes)
          : adjecentNodes;

        orderedAdjecentNodes.forEach((id) => {
          nodesToProcess.push({ path: path.concat([id]) });
        });
      }
    }

    return { solution: [], explorationOrder };
  };

  public get name() {
    return `Classic ${this.mode.toString()} ${
      this.randomizeOrder ? "Rand" : ""
    }`;
  }
}
