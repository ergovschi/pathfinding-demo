import * as PIXI from "pixi.js";
import { DrawObstacle } from "./PixiDrawManager";
import gsap from "gsap";
import { DemoColors } from "./DemoColors";

export class ObstacleDrawer {
  public mainLayer = new PIXI.Container();
  public shadowLayer = new PIXI.Container();

  public static drawObstacle(obstacle: DrawObstacle) {
    const { position, size } = obstacle;
    const square = new PIXI.Graphics();
    square
      .beginFill(DemoColors.obstacle.highlights)
      .drawRoundedRect(2, 2, size.x - 4, size.y - 10, 10)

      .beginFill(DemoColors.obstacle.grayMain)
      .drawRoundedRect(2, 2, size.x - 4, size.y - 9, 10);

    const duration = 2.0;
    gsap.to(square, {
      pixi: {
        tint: DemoColors.obstacle.color,
      },
      duration,
      repeat: 0,
    });

    square.x = position.x;
    square.y = position.y;
    return square;
  }

  public static drawObstacleEdge(obstacle: DrawObstacle) {
    const { position, size } = obstacle;
    const square = new PIXI.Graphics();
    square
      .beginFill(DemoColors.obstacle.shadow)
      .drawRoundedRect(0, 0, size.x, size.y, 10);

    square.x = position.x;
    square.y = position.y;
    return square;
  }

  public static drawShadow = (obstacle: DrawObstacle) => {
    const { position, size } = obstacle;
    const square = new PIXI.Graphics();
    square
      .beginFill(DemoColors.shadowsColor)
      .drawShape(
        new PIXI.RoundedRectangle(
          position.x - 5,
          position.y + 5,
          size.x,
          size.y,
          10
        )
      );
    square.filters = [new PIXI.filters.BlurFilter(4, 1)];
    square.alpha = 0.3;
    square.blendMode = PIXI.BLEND_MODES.MULTIPLY;

    return square;
  };
}
