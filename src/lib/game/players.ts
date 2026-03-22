import type { GPUContext } from '$lib/gpu/context';
import {
  buildUniformData,
  createQuadInstance,
  type QuadInstance,
  type QuadPipeline,
} from '$lib/gpu/quad';
import { PLAYER_A_COLOR, PLAYER_B_COLOR } from './config';
import { state } from './state';
import { tileX } from './tiles';

export const PLAYER_WIDTH = 90;
export const PLAYER_HEIGHT = 200;
export const PLAYER_Y = 440;

export const createPlayerInstances = (
  gpu: GPUContext,
  pipeline: QuadPipeline,
): QuadInstance[] => {
  const quads: QuadInstance[] = [];

  for (const player of state.players) {
    quads.push(
      createQuadInstance(
        gpu,
        pipeline,
        buildUniformData({
          x: tileX(player.currentTile),
          y: PLAYER_Y,
          width: PLAYER_WIDTH,
          height: PLAYER_HEIGHT,
          color: player.tileGroup === 0 ? PLAYER_A_COLOR : PLAYER_B_COLOR,
        }),
      ),
    );
  }

  return quads;
};
