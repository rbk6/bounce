import type { GPUContext } from './context';
import shaderCode from './shaders/quad.wgsl?raw';

export interface QuadPipeline {
  readonly pipeline: GPURenderPipeline;
  readonly vertexBuffer: GPUBuffer;
  readonly indexBuffer: GPUBuffer;
}

export interface QuadInstance {
  readonly uniformBuffer: GPUBuffer;
  readonly bindGroup: GPUBindGroup;
}

export interface QuadParams {
  x: number;
  y: number;
  width: number;
  height: number;
  color?: [number, number, number, number];
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

export const buildUniformData = (
  params: QuadParams,
  canvasWidth: number,
  canvasHeight: number,
): Float32Array<ArrayBuffer> => {
  const { x, y, width, height, color = [0.0, 0.9, 1.0, 1.0] } = params;

  const sx = width / canvasWidth;
  const sy = height / canvasHeight;
  const tx = (x / canvasWidth) * 2 - 1;
  const ty = -((y / canvasHeight) * 2 - 1);

  const data = new Float32Array(new ArrayBuffer(80));
  data.set([sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1]);
  data.set(color, 16);
  return data;
};

export const createQuadPipeline = (gpu: GPUContext): QuadPipeline => {
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

export const createQuadInstance = (
  gpu: GPUContext,
  quadPipeline: QuadPipeline,
  uniformData: Float32Array<ArrayBuffer>,
): QuadInstance => {
  const { device } = gpu;

  const uniformBuffer = device.createBuffer({
    size: 80,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(uniformBuffer, 0, uniformData);

  const bindGroup = device.createBindGroup({
    layout: quadPipeline.pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: { buffer: uniformBuffer },
      },
    ],
  });

  return { uniformBuffer, bindGroup };
};

export const renderQuad = (
  gpu: GPUContext,
  quadPipeline: QuadPipeline,
  quads: QuadInstance[],
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

  pass.setPipeline(quadPipeline.pipeline);
  pass.setVertexBuffer(0, quadPipeline.vertexBuffer);
  pass.setIndexBuffer(quadPipeline.indexBuffer, 'uint16');

  quads.forEach((quad) => {
    pass.setBindGroup(0, quad.bindGroup);
    pass.drawIndexed(6);
  });

  pass.end();
  device.queue.submit([encoder.finish()]);
};
