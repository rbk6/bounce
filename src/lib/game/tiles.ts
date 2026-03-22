import type { GPUContext } from '$lib/gpu/context';
import {
  buildUniformData,
  createQuadInstance,
  type QuadInstance,
  type QuadPipeline,
} from '$lib/gpu/quad';
import { CANVAS_WIDTH, TILE_A_COLOR, TILE_B_COLOR } from './config';

export const TILE_COUNT = 10;
export const TILE_WIDTH = 90;
export const TILE_HEIGHT = 24;
export const TILE_PADDING = 60;
export const TILE_SPACING = Math.floor(
  (CANVAS_WIDTH - TILE_PADDING * 2) / TILE_COUNT,
);
export const START_X = TILE_PADDING + TILE_SPACING / 2;
export const PLAYER_Y = 420;
export const TILE_Y = 510;

export const tileX = (index: number) => START_X + index * TILE_SPACING;

export const createTileInstances = (
  gpu: GPUContext,
  pipeline: QuadPipeline,
): QuadInstance[] => {
  const quads: QuadInstance[] = [];

  for (let i = 0; i < TILE_COUNT; i++) {
    const instance = createQuadInstance(
      gpu,
      pipeline,
      buildUniformData({
        x: tileX(i),
        y: TILE_Y,
        width: TILE_WIDTH,
        height: TILE_HEIGHT,
        color: i % 2 === 0 ? TILE_A_COLOR : TILE_B_COLOR,
      }),
    );

    quads.push(instance);
  }

  return quads;
};
