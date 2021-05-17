import { DrawPosition } from "../Graphics/PixiDrawManager";

export type CanvasInfo = {
  height: number;
  width: number;
  heroSize: number;
  heroPosition: DrawPosition;
  princessPosition: DrawPosition;
  padding: number;
};

export const inCanvasFilter = (canvas: CanvasInfo) => (p: DrawPosition) =>
  p.x >= 0 && p.x <= canvas.width && p.y >= 0 && p.y <= canvas.height;
