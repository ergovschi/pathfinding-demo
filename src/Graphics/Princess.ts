import * as PIXI from "pixi.js";
import gsap, { Power4 } from "gsap";
import { NumberColors } from "../NumberColors";

export class Princess {
  private princessContainer = new PIXI.Container();
  constructor() {
    this.initPrincessGraphic();
  }

  private initPrincessGraphic = () => {
    const head = PIXI.Sprite.from("princessHead.png");
    const flag = PIXI.Sprite.from("princessFlag.png");
    const dog = PIXI.Sprite.from("princessDog.png");

    const duration = 3;
    flag.position.y = 2;
    gsap.to(flag, {
      pixi: {
        positionY: -3,
      },
      duration,
      repeat: -1,
      yoyo: true,
    });

    const eyes = new PIXI.Graphics();
    eyes.beginFill(NumberColors.BLACK).drawCircle(27, 102, 2);
    eyes.beginFill(NumberColors.BLACK).drawCircle(36, 102, 2);

    const durationEyes = 2;
    gsap.to(eyes, {
      pixi: {
        positionX: -5,
        positionY: -3
      },
      duration: durationEyes,
      repeat: -1,
      yoyo: true,
      ease: Power4.easeInOut,
    });

    this.princessContainer.addChild(head);
    this.princessContainer.addChild(flag);
    this.princessContainer.addChild(dog);
    this.princessContainer.addChild(eyes);
    this.princessContainer.scale.set(0.58, 0.58);
    this.princessContainer.position.x = -43;
    this.princessContainer.position.y = -43;
  };

  public get graphic() {
    return this.princessContainer;
  }
}