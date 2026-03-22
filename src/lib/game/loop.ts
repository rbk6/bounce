import type { GPUContext } from '$lib/gpu/context';
import {
  buildUniformData,
  createQuadInstance,
  renderQuad,
  type QuadPipeline,
} from '$lib/gpu/quad';

export interface CanvasDimensions {
  readonly width: number;
  readonly height: number;
}

let frameId: number;

export const startLoop = (
  gpu: GPUContext,
  pipeline: QuadPipeline,
  dimensions: CanvasDimensions,
): void => {
  const quadParams = [
    { x: 50, y: 200, width: 100, height: 50 },
    { x: 200, y: 500, width: 100, height: 50 },
    { x: 500, y: 350, width: 100, height: 50 },
  ];
  const quads = quadParams.map((params) =>
    createQuadInstance(
      gpu,
      pipeline,
      buildUniformData(params, dimensions.width, dimensions.height),
    ),
  );

  const tick = () => {
    const { width, height } = dimensions;

    quads.forEach((quad, i) => {
      gpu.device.queue.writeBuffer(
        quad.uniformBuffer,
        0,
        buildUniformData(quadParams[i], width, height),
      );
    });
    renderQuad(gpu, pipeline, quads);
    quadParams.forEach((p) => {
      p.x++;
      if (p.x > width + 20) {
        p.x = -100;
      }
    });
    frameId = requestAnimationFrame(tick);
  };

  frameId = requestAnimationFrame(tick);
};

export const stopLoop = () => {
  cancelAnimationFrame(frameId);
};
