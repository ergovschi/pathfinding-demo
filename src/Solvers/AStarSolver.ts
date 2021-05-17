import * as Collections from "typescript-collections";
import { ObjPos } from "../Controllers/GridController";

import {
  Graph,
  GraphEdge,
  GraphSolution,
  GraphSolver,
  VertexId,
} from "./Solvers";

export class AStarSolver implements GraphSolver {
  public solve = (
    graph: Graph,
    start: VertexId,
    goal: VertexId
  ): GraphSolution => {
    let explorationOrder: GraphEdge[] = [];

    const distance = (p1: ObjPos, p2: ObjPos) => {
      const xdist = p1.x - p2.x;
      const ydist = p1.y - p2.y;

      return xdist * xdist + ydist * ydist;
    };
    const goalPoint = graph.vertices.get(goal)!;

    const visitedNodes: Set<VertexId> = new Set();
    const solution: Array<VertexId> = [];
    let nodesToProcess = new Collections.PriorityQueue<{ path: VertexId[] }>(
      (p1, p2) => {
        const n1 = p1.path[p1.path.length - 1];
        const n2 = p2.path[p2.path.length - 1];

        const c1 = graph.vertices.get(n1)!;
        const c2 = graph.vertices.get(n2)!;

        return distance(c2, goalPoint) - distance(c1, goalPoint);
      }
    );
    nodesToProcess.enqueue({ path: [start] });

    while (!nodesToProcess.isEmpty()) {
      let { path } = nodesToProcess.dequeue()!;
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

        graph.adjecent.get(currentNode)!.forEach((id) => {
          nodesToProcess.enqueue({ path: path.concat([id]) });
        });
      }
    }

    console.log("Could not find solution", visitedNodes);
    return { solution: [], explorationOrder };
  };

  public get name() {
    return "A-Star Solver";
  }
}
