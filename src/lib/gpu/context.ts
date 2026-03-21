export interface GPUContext {
  device: GPUDevice;
  context: GPUCanvasContext;
  format: GPUTextureFormat;
}

export const initGPU = async (
  element: HTMLCanvasElement,
): Promise<GPUContext | null> => {
  const context = element.getContext('webgpu');

  if (!context) return null;
  if (!navigator.gpu) return null;

  const gpu = navigator.gpu;
  const format = gpu.getPreferredCanvasFormat();
  const adapter = await gpu.requestAdapter();

  if (!adapter) {
    console.log("couldn't get gpu");
    return null;
  }

  const device = await adapter.requestDevice();
  context.configure({ device, format, alphaMode: 'premultiplied' });
  return { device, context, format };
};
