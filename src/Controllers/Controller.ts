import { SetterOrUpdater } from "recoil";
import { PixiDrawManager } from "../Graphics/PixiDrawManager";
import { GraphSolver } from "../Solvers/Solvers";
import { DemoAction } from "../Views/ActionsViewer";
import { CanvasInfo } from "./CanvasInfo";
import { ObstaclesController } from "./ObstaclesController";

export type ActionName = string;
export interface PathfinderController {}

export type ControllerProvider = {
  get: (
    drawManager: PixiDrawManager,
    solver: GraphSolver,
    obstaclesController: ObstaclesController,
    canvas: CanvasInfo,
    actions: SetterOrUpdater<DemoAction[]>
  ) => PathfinderController;
  name: string;
};
