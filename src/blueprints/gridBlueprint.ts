import { Scene, Vector3, UniversalCamera, TransformNode } from 'babylonjs';
import { light } from '..';
import { componentName, setComponent } from '../ecs/component';
import { Box, Entity, Game, Guid, State } from '../ecs/type';
import { getGame } from '../systems/gameSystem';
import { setCameraDistance } from '../utils/setCameraDistance';
import { boxBlueprint } from './boxBlueprint';

export const boxSize = 1;
export const boxGap = 0.2;

export const getGridDimensions = (dataGrid: BasicBox[][]) => {
  const boxWithGap = boxSize + boxGap;
  const gridWidth = dataGrid[0].length * boxWithGap;
  const gridHeight = dataGrid.length * boxWithGap;
  const longerDimension = gridWidth > gridHeight ? gridWidth : gridHeight;

  const center = [(gridWidth - 1 - boxGap) / 2, (gridHeight - 1 - boxGap) / 2];

  return {
    center,
    cameraDistance: longerDimension / 2 + boxGap,
  };
};

export type BasicBox = { dots: number; player: Entity | undefined };

type GridBlueprint = (params: {
  dataGrid: BasicBox[][];
  scene: Scene;
  camera: UniversalCamera;
  state: State;
}) => State;

export const gridBlueprint: GridBlueprint = ({ dataGrid, scene, camera, state }) => {
  const grid = new TransformNode('grid');

  const { center, cameraDistance } = getGridDimensions(dataGrid);

  camera.position.x = center[1];
  camera.position.y = center[0];
  camera.position.z = -10;
  camera.setTarget(new Vector3(center[1], center[0]));

  setCameraDistance(cameraDistance, scene);

  let gridBoxIds: Guid[] = [];
  const boxWithGap = boxSize + boxGap;

  state = dataGrid.reduce(
    (acc1, row, x) =>
      row.reduce((acc2, { dots, player }, y) => {
        const box = boxBlueprint({ scene, name: `${x}-${y}` });

        box.position.x = x * boxWithGap;
        box.position.y = y * boxWithGap;

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
