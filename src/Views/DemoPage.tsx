import { Button, ButtonGroup, Classes } from "@blueprintjs/core";
import React from "react";
import { atom, useRecoilState } from "recoil";
import { classes, style } from "typestyle";
import { ControllerProvider } from "../Controllers/Controller";
import { GridAlgorithmsController } from "../Controllers/GridController";
import { LessonController } from "../Controllers/LessonController";
import { VisibilityGraphController } from "../Controllers/VisibilityGraphController";
import { VoronoiController } from "../Controllers/VoronoiController";
import { obstacles, ObstacleSet } from "../Obstacles/ObstacleSets";
import { AStarSolver } from "../Solvers/AStarSolver";
import {
  GraphSolverMode,
  SimpleGraphSolver,
} from "../Solvers/SimpleGraphSolver";
import { GraphSolver } from "../Solvers/Solvers";
import { PixiGridView } from "./SolverView";

const solvers: GraphSolver[] = [
  new SimpleGraphSolver(true, GraphSolverMode.DFS),
  new SimpleGraphSolver(true, GraphSolverMode.BFS),
  new SimpleGraphSolver(false, GraphSolverMode.BFS),
  new SimpleGraphSolver(false, GraphSolverMode.DFS),
  new AStarSolver(),
];

const providers: ControllerProvider[] = [
  GridAlgorithmsController.provider,
  VoronoiController.provider,
  VisibilityGraphController.provider,
  LessonController.provider,
];

const ctrlProviderState = atom<ControllerProvider>({
  key: "controllerProvider",
  default: GridAlgorithmsController.provider,
});
const solverState = atom<GraphSolver>({
  key: "graphSolver",
  default: solvers[0],
});
const obstacleSetState = atom<ObstacleSet>({
  key: "obstacleSet",
  default: obstacles[0],
});

export const DemoPage: React.FC = () => {
  const [controllerProvider, setControllerProvider] =
    useRecoilState(ctrlProviderState);
  const [solver, setSolver] = useRecoilState(solverState);
  const [obstacleSet, setObstacles] = useRecoilState(obstacleSetState);
  return (
    <div className={classes(demoPageStyle, Classes.DARK)}>
      <div className={paramsStyle}>
        <h3>Graph Type</h3>
        <ButtonGroup vertical minimal>
          {providers.map((p) => (
            <Button
              key={p.name}
              active={controllerProvider === p}
              onClick={() => setControllerProvider(p)}
            >
              {p.name}
            </Button>
          ))}
        </ButtonGroup>

        <h3>Solver</h3>
        <ButtonGroup vertical minimal>
          {solvers.map((s) => (
            <Button
              key={s.name}
              active={solver === s}
              onClick={() => setSolver(s)}
            >
              {s.name}
            </Button>
          ))}
        </ButtonGroup>

        <h3>Map</h3>
        <ButtonGroup vertical minimal>
          {obstacles.map((o) => (
            <Button
              key={o.name}
              active={obstacleSet === o}
              onClick={() => setObstacles(o)}
            >
              {o.name}
            </Button>
          ))}
        </ButtonGroup>
      </div>
      <div className={contentStyle}>
        <PixiGridView
          key={solver.name + controllerProvider.name + obstacleSet.name}
          solver={solver}
          controller={controllerProvider}
          obstacleSet={obstacleSet}
        />
      </div>
    </div>
  );
};

const demoPageStyle = style({
  display: "flex",
  flex: 1,
});

const contentStyle = style({
  padding: 20,
  display: "flex",
  justifyContent: "center",
  alignContent: "center",
  flex: 1,
});

const paramsStyle = style({
  width: 200,
  padding: 10,
});
