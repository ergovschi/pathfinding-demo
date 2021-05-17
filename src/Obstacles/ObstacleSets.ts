import { Obstacle } from "../Controllers/GridController";

export type ObstacleSet = {
  name: string;
  obstacles: Obstacle[];
};

export const obstacles: ObstacleSet[] = [
  { name: "Empty", obstacles: [] },
  {
    name: "Maze",
    obstacles: [
      {
        position: {
          x: -1,
          y: 1.5,
        },
        dimensions: {
          x: 10,
          y: 1,
        },
      },

      {
        position: {
          x: 10.5,
          y: -1,
        },
        dimensions: {
          x: 0.5,
          y: 12,
        },
      },
      {
        position: {
          x: 1.3,
          y: 4,
        },
        dimensions: {
          x: 1.2,
          y: 5,
        },
      },
      {
        position: {
          x: 4.2,
          y: 6.3,
        },
        dimensions: {
          x: 1.2,
          y: 7,
        },
      },

      {
        position: {
          x: 2,
          y: 4,
        },
        dimensions: {
          x: 10,
          y: 1,
        },
      },
      {
        position: {
          x: 5,
          y: 7,
        },
        dimensions: {
          x: 3.8,
          y: 0.3,
        },
      },
      {
        position: {
          x: 8,
          y: 9.2,
        },
        dimensions: {
          x: 4,
          y: 1.2,
        },
      },
      {
        position: {
          x: 15,
          y: 2,
        },
        dimensions: {
          x: 1,
          y: 12,
        },
      },
    ],
  },
  {
    name: "Bottom Hills",
    obstacles: [
      {
        position: {
          x: 2.2,
          y: 4.3,
        },
        dimensions: {
          x: 0.7,
          y: 10,
        },
      },
      {
        position: {
          x: 6.3,
          y: 6.3,
        },
        dimensions: {
          x: 0.4,
          y: 6,
        },
      },
      {
        position: {
          x: 9,
          y: 3,
        },
        dimensions: {
          x: 1,
          y: 12,
        },
      },
      {
        position: {
          x: 12,
          y: 7,
        },
        dimensions: {
          x: 2,
          y: 12,
        },
      },
    ],
  },

  {
    name: "Simple",
    obstacles: [
      {
        position: {
          x: 3.1,
          y: 4.7,
        },
        dimensions: {
          x: 2.8,
          y: 6,
        },
      },
      {
        position: {
          x: 7.45,
          y: 4.2,
        },
        dimensions: {
          x: 2.5,
          y: 1.23,
        },
      },
      {
        position: {
          x: 12.3,
          y: 0.1,
        },
        dimensions: {
          x: 1,
          y: 8,
        },
      },
    ],
  },
];
