import type { GPUContext } from '$lib/gpu/context';
import { renderQuad, type QuadPipeline } from '$lib/gpu/quad';
import { createPlayerInstances } from './players';
import { createTileInstances } from './tiles';

export interface CanvasDimensions {
  readonly width: number;
  readonly height: number;
}

let frameId: number;

export const startLoop = (gpu: GPUContext, pipeline: QuadPipeline): void => {
  const tiles = createTileInstances(gpu, pipeline);
  const players = createPlayerInstances(gpu, pipeline);

  const tick = () => {
    renderQuad(gpu, pipeline, [...tiles, ...players]);
  };

  frameId = requestAnimationFrame(tick);
};

export const stopLoop = () => {
  cancelAnimationFrame(frameId);
};
