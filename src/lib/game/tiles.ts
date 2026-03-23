import type { GPUContext } from '$lib/gpu/context';
import {
  buildUniformData,
  createQuadInstance,
  type QuadInstance,
  type QuadPipeline,
} from '$lib/gpu/quad';
import { CANVAS_WIDTH, TILE_A_COLOR, TILE_B_COLOR } from './config';

const TILE_COUNT = 10;
const TILE_WIDTH = 90;
const TILE_HEIGHT = 24;
const TILE_PADDING = 60;
const TILE_SPACING = Math.floor((CANVAS_WIDTH - TILE_PADDING * 2) / TILE_COUNT);
const START_X = TILE_PADDING + TILE_SPACING / 2;
const TILE_Y = 510;

export const tileX = (index: number) => START_X + index * TILE_SPACING;

export const isValidTile = (index: number) => {
  return index >= 0 && index <= TILE_COUNT - 1;
};

export const createTileInstances = (
  gpu: GPUContext,
  pipeline: QuadPipeline,
): QuadInstance[] => {
  const quads: QuadInstance[] = [];

  for (let i = 0; i < TILE_COUNT; i++) {
    quads.push(
      createQuadInstance(
        gpu,
        pipeline,
        buildUniformData({
          x: tileX(i),
          y: TILE_Y,
          width: TILE_WIDTH,
          height: TILE_HEIGHT,
          color: i % 2 === 0 ? TILE_A_COLOR : TILE_B_COLOR,
        }),
      ),
    );
  }

  return quads;
};
