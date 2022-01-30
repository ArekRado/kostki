import { setMeshTexture } from '../utils/setMeshTexture';
import markerTexture from '../assets/marker.png';
import { boxGap, boxSize } from '../blueprints/gridBlueprint';
// import { Vector3 } from '@babylonjs/core/Maths/math.vector';
// import { Animation } from '@babylonjs/core/Animations';
// import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
// import { Mesh } from '@babylonjs/core/Meshes/mesh';
// import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Marker, name, State } from '../type';
import {
  componentName,
  createGetSetForUniqComponent,
  createSystem,
  setComponent,
  Animation,
  defaultData,
  getComponent,
  Mesh,
  MeshType,
  Transform,
  Material,
} from '@arekrado/canvas-engine';
import { transform } from '@babel/core';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { generateId } from '../utils/generateId';
import { Color3, StandardMaterial, Texture } from '@babylonjs/core';

export const markerEntity = '38127445920450264';

const markerGetSet = createGetSetForUniqComponent<Marker, State>({
  entity: markerEntity,
  name: name.marker,
});

export const getMarker = markerGetSet.getComponent;
export const setMarker = ({
  state,
  data,
}: {
  state: State;
  data: Partial<Marker>;
}) => {
  if (state.babylonjs.sceneRef && data.color && data.position) {
    const material = getComponent<Material, State>({
      state,
      name: componentName.material,
      entity: markerEntity,
    });

    if (material) {
      setComponent<Material, State>({
        state,
        data: {
          ...material,
          diffuseColor: [data.color[0], data.color[1], data.color[2], 0],
        },
      });
    }

    const transform = getComponent<Transform, State>({
      state,
      name: componentName.transform,
      entity: markerEntity,
    });

    if (transform) {
      state = setComponent<Transform, State>({
        state,
        data: {
          ...transform,
          position: [data.position[0], data.position[1], -1],
        },
      });
    }

    state = setComponent<Animation.AnimationComponent, State>({
      state,
      data: {
        name: componentName.animation,
        entity: markerEntity,
        isPlaying: true,
        isFinished: false,
        currentTime: 0,
        wrapMode: Animation.WrapMode.once,
        timingMode: Animation.TimingMode.smooth,
        properties: [
          {
            path: 'scale',
            component: componentName.transform,
            entity: markerEntity,
            keyframes: [
              {
                duration: 500,
                timingFunction: 'Linear',
                valueRange: [
                  [2, 2, 1],
                  [0.9, 0.9, 1],
                ],
              },
            ],
          },
          {
            path: 'alpha',
            component: componentName.material,
            entity: markerEntity,
            keyframes: [
              {
                duration: 500,
                timingFunction: 'Linear',
                valueRange: [0, 1],
              },
            ],
          },
        ],
      },
    });
  }

  return markerGetSet.setComponent({ state, data });
};

// export const getScaleAnimation = () => {
//   const scaleAnimation = new Animation(
//     'getScaleAnimation',
//     'scaling',
//     1,
//     Animation.ANIMATIONTYPE_VECTOR3,
//     Animation.ANIMATIONLOOPMODE_RELATIVE
//   );

//   const keyFrames = [];

//   keyFrames.push({
//     frame: 0,
//     value: new Vector3(2, 2, 1),
//   });

//   keyFrames.push({
//     frame: 0.5,
//     value: new Vector3(0.9, 0.9, 1),
//   });

//   scaleAnimation.setKeys(keyFrames);

//   return scaleAnimation;
// };

// export const getAlphaAnimation = () => {
//   const alphaAnimation = new Animation(
//     'getAlphaAnimation',
//     'material.alpha',
//     1,
//     Animation.ANIMATIONTYPE_FLOAT,
//     Animation.ANIMATIONLOOPMODE_RELATIVE
//   );

//   const keyFrames = [];

//   keyFrames.push({
//     frame: 0,
//     value: 1,
//   });

//   keyFrames.push({
//     frame: 0.5,
//     value: 0,
//   });

//   alphaAnimation.setKeys(keyFrames);

//   return alphaAnimation;
// };

export const markerSystem = (state: State) =>
  createSystem<Marker, State>({
    state,
    name: name.marker,
    componentName: name.marker,
    create: ({ state, component }) => {
      const sceneRef = state.babylonjs.sceneRef;
      if (!sceneRef) {
        return state;
      }

      const size = boxGap + boxSize + boxGap;

      state = setComponent<Transform, State>({
        state,
        data: defaultData.transform({
          entity: component.entity,
          position: [9999, 9999, 9999],
          scale: [size, size, 1],
        }),
      });

      const materialUniqueId = generateId();
      state = setComponent<Material, State>({
        state,
        data: {
          entity: component.entity,
          name: componentName.material,
          uniqueId: materialUniqueId,
          diffuseTexture: markerTexture,
          diffuseColor: [1, 0, 1, 0],
        },
      });

      state = setComponent<Mesh, State>({
        state,
        data: {
          entity: component.entity,
          name: componentName.mesh,
          type: MeshType.plane,
          uniqueId: materialUniqueId,
          width: size,
          height: size,
          updatable: false,
          sideOrientation: 0,
          materialEntity: [component.entity],
        },
      });

      // const marker = MeshBuilder.CreatePlane(markerEntity, {
      //   size,
      // });
      // marker.position.x = 5;
      // marker.position.y = 5;

      // marker.uniqueId = parseInt(component.entity);

      // marker.material = new StandardMaterial('mat', sceneRef);
      // (marker.material as StandardMaterial).useAlphaFromDiffuseTexture = true;
      // (marker.material as StandardMaterial).diffuseColor = new Color3(0, 1, 1);

      // const newTexture = new Texture(
      //   markerTexture,
      //   sceneRef,
      //   undefined,
      //   undefined,
      //   Texture.NEAREST_NEAREST_MIPLINEAR
      // );
      // (marker.material as StandardMaterial).diffuseTexture = newTexture;
      // (marker.material as any).diffuseTexture.hasAlpha = true;

      // marker.animations[0] = getScaleAnimation();
      // marker.animations[1] = getAlphaAnimation();

      return state;
    },
    // update: ({ state, component }) => {
    //   const markerMesh = scene.getMeshByUniqueId(parseInt(markerEntity));

    //   if (markerMesh) {
    //     (markerMesh.material as StandardMaterial).diffuseColor = new Color3(
    //       component.color[0],
    //       component.color[1],
    //       component.color[2]
    //     );

    //     scene.beginAnimation(markerMesh, 0, 1, false);

    //     markerMesh.position.x = component.position[0];
    //     markerMesh.position.y = component.position[1];
    //     markerMesh.position.z = -1;

    //     // markerMesh.position = new Vector3(
    //     //   boxMesh.position.x,
    //     //   boxMesh.position.y,
    //     //   boxMesh.position.z - 1
    //     // );
    //   }

    //   return state;
    // },
  });
