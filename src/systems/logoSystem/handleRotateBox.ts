import { EventHandler } from '@arekrado/canvas-engine';
import { emitEvent } from '../../eventSystem';
import { State } from '../../type';
import { white } from '../../utils/colors';
import { set1 } from '../../utils/textureSets';
import { BoxEvent } from '../boxSystem';
import { createRotationBoxAnimation } from '../boxSystem/createRotationBoxAnimation';
import { resetBoxRotation } from '../boxSystem/resetBoxRotation';
import { playersList } from '../gameSystem/handleChangeSettings';
import { getLogo, LogoEvent } from '../logoSystem';
import { logoGrid } from './logoGrid';

const getRandomColor = () => {
  const colors = [white, ...playersList().map(({ color }) => color)];
  const randomIndex = Math.floor(colors.length * Math.random());

  return colors[randomIndex];
};

const getRandomBoxUniqueId = () => {
  const grid = logoGrid.flat().filter((v) => v !== '');
  const randomIndex = Math.floor(grid.length * Math.random());

  return grid[randomIndex];
};

const getRandomTexture = () => {
  const randomIndex = Math.floor(set1.length * Math.random());

  return set1[randomIndex];
};

export const handleRotateBox: EventHandler<LogoEvent.RotateBoxEvent, State> = ({
  state,
}) => {
  const sceneRef = state.babylonjs.sceneRef;
  const isLogoDefined = getLogo({ state });
  if (!isLogoDefined || !sceneRef) {
    return state;
  }

  const boxUniqueId = getRandomBoxUniqueId();

  const texture = getRandomTexture();
  const color = getRandomColor();

  state = createRotationBoxAnimation({
    state,
    boxUniqueId,
    animationEndCallback: () => {
      resetBoxRotation({
        boxUniqueId,
        texture,
        color,
        scene: sceneRef,
      });

      emitEvent<BoxEvent.RotationEndEvent>({
        type: BoxEvent.Type.rotationEnd,
        payload: {
          ai: undefined,
          shouldExplode: false,
          boxEntity: boxUniqueId,
        },
      });
    },
    texture,
    color,
  });

  setTimeout(() => {
    emitEvent<LogoEvent.All>({
      type: LogoEvent.Type.rotateBox,
      payload: {},
    });
  }, Math.random() * 500 + 500);

  return state;
};
