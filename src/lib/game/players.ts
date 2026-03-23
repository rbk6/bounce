import type { GPUContext } from '$lib/gpu/context';
import {
  buildUniformData,
  createQuadInstance,
  type QuadInstance,
  type QuadPipeline,
} from '$lib/gpu/quad';
import { getKeyPress } from './binds';
import { BUFFER_THRESHOLD, PLAYER_A_COLOR, PLAYER_B_COLOR } from './config';
import { state, type Player } from './state';
import { isValidTile, tileX } from './tiles';

export const PLAYER_WIDTH = 90;
export const PLAYER_HEIGHT = 200;
export const PLAYER_Y = 440;

export type PlayerInstance = {
  player: Player;
  quad: QuadInstance;
};

export const createPlayerInstances = (
  gpu: GPUContext,
  pipeline: QuadPipeline,
): PlayerInstance[] => {
  const playerInstances: PlayerInstance[] = [];

  for (const player of state.players) {
    playerInstances.push({
      player,
      quad: createQuadInstance(
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
    });
  }

  return playerInstances;
};

const resolveArrival = (player: Player): void => {
  if (!player.motion) return;

  player.currentTile = player.motion.destinationTile;

  if (player.motion.bufferedDirection) {
    const nextTile =
      player.motion.bufferedDirection === 'Left'
        ? player.currentTile - 2
        : player.currentTile + 2;

    if (isValidTile(nextTile)) {
      player.motion.destinationTile = nextTile;
      player.motion.bufferedDirection = undefined;
      player.motion.progress = 0;
    } else {
      player.motion = undefined;
    }
  } else {
    player.motion = undefined;
  }
};

const startMove = (player: Player, direction: 'Left' | 'Right'): void => {
  const nextTile =
    direction === 'Left' ? player.currentTile - 2 : player.currentTile + 2;

  if (isValidTile(nextTile)) {
    player.motion = {
      destinationTile: nextTile,
      progress: 0,
    };
  }
};

export const getPosition = (player: Player): number => {
  // linear interpolation between current and destination based on progress
  if (player.motion) {
    return (
      tileX(player.currentTile) +
      (tileX(player.motion.destinationTile) - tileX(player.currentTile)) *
        player.motion.progress
    );
  }
  return tileX(player.currentTile);
};

export const updatePosition = (player: Player, deltaTime: number): void => {
  const isLeft = getKeyPress('Left');
  const isRight = getKeyPress('Right');

  if (player.motion) {
    player.motion.progress += player.speed * deltaTime;

    if (player.motion.progress >= 1) {
      resolveArrival(player);
    } else if (isLeft || isRight) {
      if (player.motion.progress >= BUFFER_THRESHOLD) {
        if (isLeft) player.motion.bufferedDirection = 'Left';
        if (isRight) player.motion.bufferedDirection = 'Right';
      }
    }
  } else {
    if (isLeft) startMove(player, 'Left');
    if (isRight) startMove(player, 'Right');
  }
};
