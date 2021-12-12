import { createSystem } from '../ecs/createSystem';
import { componentName, createGetSetForUniqComponent } from '../ecs/component';
import { Marker, State } from '../ecs/type';
import { scene } from '..';
import { setMeshTexture } from '../utils/setMeshTexture';
import markerTexture from '../assets/marker.png';
import { boxGap, boxSize } from '../blueprints/gridBlueprint';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Animation } from '@babylonjs/core/Animations';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { Color3 } from '@babylonjs/core/Maths/math.color';

export const markerEntity = '38127445920450264';

const markerGetSet = createGetSetForUniqComponent<Marker>({
  entity: markerEntity,
  name: componentName.marker,
});

export const getMarker = markerGetSet.getComponent;
export const setMarker = markerGetSet.setComponent;

export const getScaleAnimation = () => {
  const scaleAnimation = new Animation(
    'getScaleAnimation',
    'scaling',
    1,
    Animation.ANIMATIONTYPE_VECTOR3,
    Animation.ANIMATIONLOOPMODE_RELATIVE
  );

  const keyFrames = [];

  keyFrames.push({
    frame: 0,
    value: new Vector3(2, 2, 1),
  });

  keyFrames.push({
    frame: 0.5,
    value: new Vector3(0.9, 0.9, 1),
  });

  scaleAnimation.setKeys(keyFrames);

  return scaleAnimation;
};

export const getAlphaAnimation = () => {
  const alphaAnimation = new Animation(
    'getAlphaAnimation',
    'material.alpha',
    1,
    Animation.ANIMATIONTYPE_FLOAT,
    Animation.ANIMATIONLOOPMODE_RELATIVE
  );

  const keyFrames = [];

  keyFrames.push({
    frame: 0,
    value: 1,
  });

  keyFrames.push({
    frame: 0.5,
    value: 0,
  });

  alphaAnimation.setKeys(keyFrames);

  return alphaAnimation;
};

export const markerSystem = (state: State) =>
  createSystem<Marker>({
    state,
    name: componentName.marker,
    create: ({ state, component }) => {
      const marker = Mesh.CreatePlane(
        markerEntity,
        boxGap + boxSize + boxGap,
        scene,
        true
      );

      marker.uniqueId = parseInt(component.entity);

      marker.position = new Vector3(9999, 9999, 9999);

      marker.material = new StandardMaterial('material', scene);
      (marker.material as StandardMaterial).useAlphaFromDiffuseTexture = true;

      setMeshTexture({
        mesh: marker,
        color: [1, 1, 1],
        texture: markerTexture,
        scene,
      });

      (marker.material as any).diffuseTexture.hasAlpha = true;

      marker.animations[0] = getScaleAnimation();
      marker.animations[1] = getAlphaAnimation();

      return state;
    },
    update: ({ state, component }) => {
      const markerMesh = scene.getMeshByUniqueId(parseInt(markerEntity));

      if (markerMesh) {
        (markerMesh.material as StandardMaterial).diffuseColor = new Color3(
          component.color[0],
          component.color[1],
          component.color[2]
        );

        scene.beginAnimation(markerMesh, 0, 1, false);

        markerMesh.position.x = component.position[0];
        markerMesh.position.y = component.position[1];
        markerMesh.position.z = -1;

        // markerMesh.position = new Vector3(
        //   boxMesh.position.x,
        //   boxMesh.position.y,
        //   boxMesh.position.z - 1
        // );
      }

      return state;
    },
  });
