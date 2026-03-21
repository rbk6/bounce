import type { GPUContext } from './context';
import shaderCode from './shaders/quad.wsgl?raw';

export interface QuadResources {
  pipeline: GPURenderPipeline;
  vertexBuffer: GPUBuffer;
  indexBuffer: GPUBuffer;
}

export const setupBuffer = (
  device: GPUDevice,
  values: Float32Array | Uint16Array,
  usage: number,
): GPUBuffer => {
  const buffer = device.createBuffer({
    size: values.byteLength,
    usage,
    mappedAtCreation: true,
  });
  values.constructor === Float32Array
    ? new Float32Array(buffer.getMappedRange()).set(values)
    : new Uint16Array(buffer.getMappedRange()).set(values);
  buffer.unmap();
  return buffer;
};

export const createQuadPipeline = (gpu: GPUContext): QuadResources => {
  const { device, format } = gpu;

  const vertices = new Float32Array([
    -0.5, 0.5, 0.5, 0.5, -0.5, -0.5, 0.5, -0.5,
  ]);
  const indices = new Uint16Array([0, 1, 2, 2, 1, 3]);

  const vertexBuffer = setupBuffer(
    device,
    vertices,
    GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  );
  const indexBuffer = setupBuffer(
    device,
    indices,
    GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
  );

  const module = device.createShaderModule({
    code: shaderCode,
  });

  const pipeline = device.createRenderPipeline({
    layout: 'auto',
    vertex: {
      module,
      entryPoint: 'vs_main',
      buffers: [
        {
          arrayStride: 8, // 2 floats × 4 bytes each
          attributes: [
            {
              shaderLocation: 0, // matches @location(0) in shader
              offset: 0,
              format: 'float32x2', // two 32-bit floats (x, y)
            },
          ],
        },
      ],
    },
    fragment: {
      module,
      entryPoint: 'fs_main',
      targets: [{ format }],
    },
    primitive: { topology: 'triangle-list' },
  });

  return { pipeline, vertexBuffer, indexBuffer };
};

export const renderQuad = (gpu: GPUContext, resources: QuadResources) => {
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

  pass.setPipeline(resources.pipeline);
  pass.setVertexBuffer(0, resources.vertexBuffer);
  pass.setIndexBuffer(resources.indexBuffer, 'uint16');
  pass.drawIndexed(6);
  pass.end();
  device.queue.submit([encoder.finish()]);
};
