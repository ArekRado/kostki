import { Scene, TransformNode, Vector3 } from 'babylonjs';
import { createSystem } from '../ecs/createSystem';
import {
  componentName,
  createGetSetForUniqComponent,
  setComponent,
} from '../ecs/component';
import { Box, Logo, State } from '../ecs/type';
import { getAspectRatio } from '../utils/getAspectRatio';
import { setBackground } from './backgroundSystem';
import { ECSEvent } from '../ecs/emitEvent';
import { setTurnIndicator } from './turnIndicatorSystem';
import { scene } from '..';

export const logoEntity = '8523773494048061';

const logoGetSet = createGetSetForUniqComponent<Logo>({
  entity: logoEntity,
  name: componentName.logo,
});

export const getLogo = logoGetSet.getComponent;
export const setLogo = logoGetSet.setComponent;

// const logoGrid: string[][] = [
//   [1, 0, 0, 1],
//   [1, 0, 1, 0],
//   [1, 1, 0, 0],
//   [1, 0, 1, 0],
//   [1, 0, 0, 1],
// ].reduce((acc1, list, i) => {
//   acc1[i] = list.reduce((acc2, shouldCreateBox, j) => {
//     if (shouldCreateBox === 0) {
//       return acc2;
//     }

//     const boxEntity = Math.random().toString();
//     acc2.push(boxEntity);

//     return acc2;
//   }, [] as string[]);

//   return acc1;
// }, [] as string[][]);

export const logoSystem = (state: State) =>
  createSystem<Logo, {}>({
    state,
    name: componentName.logo,
    create: ({ state, component }) => {
      const logoMesh = new TransformNode('logo', scene);
      logoMesh.uniqueId = parseFloat(logoEntity);
      logoMesh.position.x = 0;
      logoMesh.position.y = 0;

      [
        [1, 0, 0, 1],
        [1, 0, 1, 0],
        [1, 1, 0, 0],
        [1, 0, 1, 0],
        [1, 0, 0, 1],
      ].reduce(
        (acc1, list, i) =>
          list.reduce((acc2, shouldCreateBox, j) => {
            if (shouldCreateBox === 0) {
              return acc2;
            }

            const boxEntity = Math.random().toString();
            acc2 = setComponent<Box>({
              state: acc2,
              data: {
                name: componentName.box,
                entity: boxEntity,
                isAnimating: false,
                dots: 0,
                gridPosition: [j, i],
                player: '',
              },
            });

            const boxNode = scene.getTransformNodeByUniqueId(
              parseInt(boxEntity)
            );
            boxNode?.setParent(logoMesh);

            return acc2;
          }, acc1),
        state
      );

      logoMesh.scaling.x = 0.1;
      logoMesh.scaling.y = 0.1;

      return state;
    },
    remove: ({ state, component }) => {
      const box = scene.getTransformNodeByUniqueId(parseInt(logoEntity));
      box?.dispose();

      return state;
    },
  });
