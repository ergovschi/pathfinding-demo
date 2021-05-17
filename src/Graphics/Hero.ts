import * as PIXI from "pixi.js";
import gsap, { Power4 } from "gsap";
import { NumberColors } from "../NumberColors";

export class Hero {
  private heroGroup = new PIXI.Container();
  constructor() {
    this.initHeroGraphic();
  }

  private initHeroGraphic = () => {
    const heroBody = PIXI.Sprite.from("heroHead.png");
    const heroHands = PIXI.Sprite.from("heroHands.png");

    const duration = 0.5;
    heroHands.position.y = 2;
    gsap.to(heroHands, {
      pixi: {
        positionY: -3,
      },
      duration,
      repeat: -1,
      yoyo: true,
    });

    const eyes = new PIXI.Graphics();
    eyes.beginFill(NumberColors.BLACK).drawCircle(55, 60, 7);
    eyes.beginFill(NumberColors.BLACK).drawCircle(99, 60, 5);

    const durationEyes = 2;
    gsap.to(eyes, {
      pixi: {
        positionX: -10,
      },
      duration: durationEyes,
      repeat: -1,
      yoyo: true,
      ease: Power4.easeInOut,
    });

    this.heroGroup.addChild(heroBody);
    this.heroGroup.addChild(heroHands);
    this.heroGroup.addChild(eyes);
    this.heroGroup.scale.set(0.58, 0.58);
    this.heroGroup.position.x = -43;
    this.heroGroup.position.y = -43;
  };

  public get graphic() {
    return this.heroGroup;
  }
}
