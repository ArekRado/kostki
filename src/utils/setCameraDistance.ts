import { Scene } from 'babylonjs';

export const setCameraDistance = (distance: number, scene: Scene) => {
  const renderingCanvasClientRect = scene
    .getEngine()
    .getRenderingCanvasClientRect();

  const aspect =
    renderingCanvasClientRect !== null
      ? renderingCanvasClientRect.height / renderingCanvasClientRect.width
      : 0;

  const camera = scene.activeCamera;
  
  if (camera) {
    camera.orthoLeft = -distance / 2;
    camera.orthoRight = distance / 2;
    camera.orthoBottom = camera.orthoLeft * aspect;
    camera.orthoTop = camera.orthoRight * aspect;
  }
};
