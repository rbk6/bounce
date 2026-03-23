import type { GPUContext } from '$lib/gpu/context';
import { buildUniformData, renderQuad, type QuadPipeline } from '$lib/gpu/quad';
import { PLAYER_A_COLOR, PLAYER_B_COLOR } from './config';
import {
  createPlayerInstances,
  getPosition,
  PLAYER_HEIGHT,
  PLAYER_WIDTH,
  PLAYER_Y,
  updatePosition,
} from './players';
import { createTileInstances } from './tiles';

let frameId: number;

export const startLoop = (gpu: GPUContext, pipeline: QuadPipeline): void => {
  let lastTime = 0;
  const tiles = createTileInstances(gpu, pipeline);
  const playerInstances = createPlayerInstances(gpu, pipeline);

  const tick = (timestamp: DOMHighResTimeStamp) => {
    const deltaTime = Math.min((timestamp - lastTime) / 1000, 0.1); // seconds
    lastTime = timestamp;

    const players = playerInstances.map((instance) => {
      updatePosition(instance.player, deltaTime);
      gpu.device.queue.writeBuffer(
        instance.quad.uniformBuffer,
        0,
        buildUniformData({
          x: getPosition(instance.player),
          y: PLAYER_Y,
          width: PLAYER_WIDTH,
          height: PLAYER_HEIGHT,
          color:
            instance.player.tileGroup === 0 ? PLAYER_A_COLOR : PLAYER_B_COLOR,
        }),
      );

      return instance.quad;
    });

    renderQuad(gpu, pipeline, [...tiles, ...players]);
    frameId = requestAnimationFrame(tick);
  };

  frameId = requestAnimationFrame(tick);
};

export const stopLoop = () => {
  cancelAnimationFrame(frameId);
};
