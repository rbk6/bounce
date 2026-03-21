import type { GPUContext } from './context';
import shaderCode from './shaders/triangle.wsgl?raw';

export const createTrianglePipeline = (gpu: GPUContext): GPURenderPipeline => {
  const { device, format } = gpu;

  const module = device.createShaderModule({
    code: shaderCode,
  });

  return device.createRenderPipeline({
    layout: 'auto',
    vertex: { module, entryPoint: 'vs_main' },
    fragment: {
      module,
      entryPoint: 'fs_main',
      targets: [{ format }],
    },
    primitive: { topology: 'triangle-list' },
  });
};

export const renderTriangle = (
  gpu: GPUContext,
  pipeline: GPURenderPipeline,
) => {
  const { device, context } = gpu;

  const encoder = device.createCommandEncoder();
  const pass = encoder.beginRenderPass({
    colorAttachments: [
      {
        view: context.getCurrentTexture().createView(),
        clearValue: { r: 0.07, g: 0.11, b: 0.2, a: 1 },
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
  });

  pass.setPipeline(pipeline);
  pass.draw(3);
  pass.end();
  device.queue.submit([encoder.finish()]);
};
