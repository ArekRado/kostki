import { Scene, Vector3, UniversalCamera, TransformNode } from 'babylonjs';
import { light } from '..';
import { componentName, setComponent } from '../ecs/component';
import { Box, Entity, Game, Guid, State } from '../ecs/type';
import { getGame } from '../systems/gameSystem';
import { setCameraDistance } from '../utils/setCameraDistance';
import { boxBlueprint } from './boxBlueprint';

export type BasicBox = { dots: number; player: Entity | undefined };

type CreateGrid = (params: {
  dataGrid: BasicBox[][];
  scene: Scene;
  camera: UniversalCamera;
  state: State;
}) => State;

export const createGrid: CreateGrid = ({ dataGrid, scene, camera, state }) => {
  const gap = 1.2;
  const grid = new TransformNode('grid');

  const gridWidth = dataGrid[0].length;
  const gridHeight = dataGrid.length;
  const longerDimension = gridWidth > gridHeight ? gridWidth : gridHeight;

  const center = [((gridWidth - 1) * gap) / 2, ((gridHeight - 1) * gap) / 2];

  camera.position.x = center[1];
  camera.position.y = center[0];
  camera.position.z = -10;
  camera.setTarget(new Vector3(center[1], center[0]));

  setCameraDistance(longerDimension * 2, scene);

  let gridBoxIds: Guid[] = [];

  state = dataGrid.reduce(
    (acc1, row, x) =>
      row.reduce((acc2, { dots, player }, y) => {
        const box = boxBlueprint({ scene, state: acc2, name: `${x}-${y}` });

        // const xx = Math.floor(i / x);
        // const yy = i % y;

        box.position.x = x * gap;
        box.position.y = y * gap;

        box.setParent(grid);

        const boxId = box.uniqueId.toString();

        gridBoxIds.push(boxId);

        return setComponent<Box>({
          state: acc2,
          data: {
            name: componentName.box,
            entity: boxId,
            isAnimating: false,
            dots,
            gridPosition: [x, y],
            player,
          },
        });
      }, acc1),
    state
  );

  // state = Array.from<number>({ length: x * y }).reduce((acc, _, i) => {
  //   const box = boxBlueprint({ scene, state: acc });

  //   const xx = Math.floor(i / x);
  //   const yy = i % y;

  //   box.position.x = xx * gap;
  //   box.position.y = yy * gap;

  //   box.setParent(grid);

  //   const boxId = box.uniqueId.toString();

  //   gridBoxIds.push(boxId);

  //   return setComponent<Box>({
  //     state: acc,
  //     data: {
  //       name: componentName.box,
  //       entity: boxId,
  //       isAnimating: false,
  //       dots: 0,
  //       gridPosition: [xx, yy],
  //       player: '',
  //     },
  //   });
  // }, state);

  const game = getGame({ state });

  if (!game) {
    return state;
  }

  state = setComponent<Game>({
    state,
    data: {
      ...game,
      grid: gridBoxIds,
    },
  });

  return state;
};
