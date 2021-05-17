import { ObjPos } from "../Controllers/GridController";

export type VertexId = string;

export type GraphEdge = {
  v1: VertexId;
  v2: VertexId;
};

export type GraphSolution = {
  solution: VertexId[];
  explorationOrder: GraphEdge[];
};

export type GraphSolved = "solved";

export class Graph {
  public adjecent: Map<VertexId, VertexId[]> = new Map();
  public vertices: Map<VertexId, ObjPos> = new Map();
}

export interface GraphSolver {
  solve: (graph: Graph, start: VertexId, goal: VertexId) => GraphSolution;
  name: string;
}
