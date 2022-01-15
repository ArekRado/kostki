import { Entity } from '@arekrado/canvas-engine';
import { Scene } from '@babylonjs/core/scene';
import { Color } from '../../type';
import { setMeshTexture } from '../../utils/setMeshTexture';

type ResetBoxRotation = (params: {
  boxUniqueId: Entity;
  texture: string;
  color: Color;
  scene: Scene | undefined;
}) => void;
export const resetBoxRotation: ResetBoxRotation = ({
  boxUniqueId,
  texture,
  color,
  scene,
}) => {
  if (!scene) {
    return;
  }

  const box = scene.getTransformNodeByUniqueId(parseInt(boxUniqueId));

  if (box) {
    box.rotation.x = 0;
    box.rotation.y = 0;

    box.getChildren().forEach((plane) => {
      const mesh = scene.getMeshByUniqueId(plane.uniqueId);
      if (mesh) {
        setMeshTexture({
          mesh,
          color,
          texture,
          scene,
        });
      }
    });
  }
};
