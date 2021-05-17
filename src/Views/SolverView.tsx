import { Classes } from "@blueprintjs/core";
import * as PIXI from "pixi.js";
import React, { useEffect, useRef } from "react";
import { style } from "typestyle";
import { CanvasInfo } from "../Controllers/CanvasInfo";
import { ControllerProvider } from "../Controllers/Controller";
import { ObstaclesController } from "../Controllers/ObstaclesController";
import { NumberColors } from "../NumberColors";
import { styles } from "../styles";
import { PixiDrawManager } from "../Graphics/PixiDrawManager";
import { GraphSolver } from "../Solvers/Solvers";
import { ControllerActionsView, DemoAction } from "./ActionsViewer";
import { atom, RecoilState, useSetRecoilState } from "recoil";
import { ObstacleSet } from "../Obstacles/ObstacleSets";

const canvas: CanvasInfo = {
  height: 600,
  width: 900,
  heroSize: 25,
  heroPosition: {
    x: 25,
    y: 25,
  },
  princessPosition: {
    x: 900 - 25,
    y: 600 - 25,
  },
  padding: 30,
};

export type PixiGridViewProps = {
  solver: GraphSolver;
  controller: ControllerProvider;
  obstacleSet: ObstacleSet;
};

const graphActions: RecoilState<DemoAction[]> = atom({
  key: "graphActions",
  default: [] as DemoAction[],
});

export const PixiGridView: React.FC<PixiGridViewProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const actionsSetter = useSetRecoilState(graphActions);
  useEffect(() => {
    const container = ref.current!;

    PIXI.utils.skipHello();

    // On first render create our application
    const app = new PIXI.Application({
      width: canvas.width + 2 * canvas.padding,
      height: canvas.height + 2 * canvas.padding,
      backgroundColor: NumberColors.ORANGE1,
      antialias: true,
      resolution: 2,
    });
    app.stage.pivot.x = -canvas.padding;
    app.stage.pivot.y = -canvas.padding;
    app.view.className = styles(canvasStyle, Classes.ELEVATION_3);

    // Add app to DOM
    container.appendChild(app.view);

    // Start the PixiJS app
    app.start();

    const drawManager = new PixiDrawManager(app, canvas);
    const obstaclesController = new ObstaclesController(
      drawManager,
      props.obstacleSet
    );
    props.controller.get(
      drawManager,
      props.solver,
      obstaclesController,
      canvas,
      actionsSetter
    );

    return () => {
      for (const textureUrl in PIXI.utils.BaseTextureCache) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        delete PIXI.utils.BaseTextureCache[textureUrl];
      }

      for (const textureUrl in PIXI.utils.TextureCache) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        delete PIXI.utils.TextureCache[textureUrl];
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      container.removeChild(app.view);
      // On unload completely destroy the application and all of it's children
      app.destroy(true, true);
    };
  }, [props, actionsSetter]);

  return (
    <div>
      <div ref={ref} />
      <header className={headerStyle}>
        <ControllerActionsView actions={graphActions} />
      </header>
    </div>
  );
};

const canvasStyle = style({
  borderRadius: 10,
  height: 745,
  width: 1100,
});

const headerStyle = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 5,
});
