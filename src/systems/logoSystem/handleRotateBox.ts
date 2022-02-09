import { EventHandler } from '@arekrado/canvas-engine';
import { emitEvent } from '../../eventSystem';
import { State } from '../../type';
import { white } from '../../utils/colors';
import { set1 } from '../../utils/textureSets';
import { BoxEvent } from '../boxSystem';
import {
  createRotationBoxAnimation,
  boxRotationAnimationTime,
} from '../boxSystem/createRotationBoxAnimation';
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

export const handleRotateRandomLogoBox: EventHandler<LogoEvent.RotateRandomLogoBoxEvent, State> = ({
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
    texture,
    color,
    nextTurn: false,
  });

  setTimeout(() => {
    emitEvent<LogoEvent.All>({
      type: LogoEvent.Type.rotateRandomLogoBox,
      payload: {},
    });
  }, Math.random() * boxRotationAnimationTime + boxRotationAnimationTime);

  return state;
};
