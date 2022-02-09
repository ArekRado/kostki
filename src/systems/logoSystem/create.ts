import { Box, name, State } from '../../type';
import { emitEvent } from '../../eventSystem';
import { LogoEvent } from '../logoSystem';
import { updateLogoPosition } from './updateLogoPosition';
import { logoGrid } from './logoGrid';
import { setComponent } from '@arekrado/canvas-engine';

export const create = ({ state }: { state: State }): State => {
  const sceneRef = state.babylonjs.sceneRef;
  if (!sceneRef) {
    return state;
  }

  state = logoGrid.reduce(
    (acc1, row, y) =>
      row.reduce((acc2, boxEntity, x) => {
        if (boxEntity === '') {
          return acc2;
        }

        return setComponent<Box, State>({
          state: acc2,
          data: {
            name: name.box,
            entity: boxEntity,
            isAnimating: false,
            dots: 0,
            gridPosition: [x, y],
            player: '',
          },
        });
      }, acc1),
    state
  );

  state = updateLogoPosition({ state });

  emitEvent<LogoEvent.All>({
    type: LogoEvent.Type.rotateRandomLogoBox,
    payload: {},
  });

  return state;
};
