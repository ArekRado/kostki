import { Scene } from 'babylonjs';

export const getAspectRatio = (scene: Scene) => {
  const renderingCanvasClientRect = scene
    .getEngine()
    .getRenderingCanvasClientRect();

  return renderingCanvasClientRect !== null
    ? renderingCanvasClientRect.height / renderingCanvasClientRect.width
    : 1;
};
