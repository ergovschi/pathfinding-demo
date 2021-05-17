import { isUndefined } from "lodash";
import { PixiDrawManager } from "../Graphics/PixiDrawManager";
import { Graph, GraphSolution } from "../Solvers/Solvers";

export type GraphWithSolution = { graph: Graph; soln: GraphSolution };

export class GraphSolutionController {
  constructor(
    private drawManager: PixiDrawManager,
    private solution: GraphWithSolution
  ) {}

  public drawSolution = () => {
    const { solution } = this;
    const delay = 60;
    if (!isUndefined(solution)) {
      const { graph, soln } = solution;
      soln.explorationOrder.forEach((edge, index) => {
        setTimeout(() => {
          this.drawManager.glowEdge(
            graph.vertices.get(edge.v1)!,
            graph.vertices.get(edge.v2)!
          );
        }, index * delay);
      });

      setTimeout(
        () =>
          this.drawManager.drawSolution(
            soln.solution.map((p) => graph.vertices.get(p)!)
          ),
        soln.explorationOrder.length * delay
      );
    }
  };
}
