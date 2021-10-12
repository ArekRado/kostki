import { Scene, Vector3, UniversalCamera, TransformNode } from 'babylonjs';
import { componentName, setComponent } from '../ecs/component';
import { Box, Entity, State } from '../ecs/type';
import { setCamera } from '../systems/cameraSystem';

export const boxSize = 1;
export const boxGap = 0.2;
export const boxWithGap = boxSize + boxGap;

export const getGridDimensions = (dataGrid: BasicBox[][]) => {
  const boxWithGap = boxSize + boxGap;
  const gridWidth = dataGrid[0] ? dataGrid[0].length * boxWithGap : 1;
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
  state: State;
}) => State;
export const gridBlueprint: GridBlueprint = ({ dataGrid, state }) => {
  const { center, cameraDistance } = getGridDimensions(dataGrid);

  setCamera({
    state,
    data: { position: [center[0], center[1]], distance: cameraDistance },
  });

  state = dataGrid.reduce(
    (acc1, row, x) =>
      row.reduce((acc2, { dots, player }, y) => {
        return setComponent<Box>({
          state: acc2,
          data: {
            name: componentName.box,
            entity: Math.random().toString(),
            isAnimating: false,
            dots,
            gridPosition: [x, y],
            player,
          },
        });
      }, acc1),
    state
  );

  return state;
};
