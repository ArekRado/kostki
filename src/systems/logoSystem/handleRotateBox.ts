import { emitEvent } from '../../ecs/emitEvent';
import { EventHandler, Logo } from '../../ecs/type';
import { white } from '../../utils/colors';
import { set1 } from '../../utils/textureSets';
import { createRotationBoxAnimation } from '../boxSystem/createRotationBoxAnimation';
import { resetBoxRotation } from '../boxSystem/resetBoxRotation';
import { playersList } from '../gameSystem/handleChangeSettings';
import { getLogo, logoEntity, LogoEvent } from '../logoSystem';
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

export const handleRotateBox: EventHandler<Logo, LogoEvent.RotateBoxEvent> = ({
  state,
}) => {
  const isLogoDefined = getLogo({ state });
  if (!isLogoDefined) {
    return state;
  }

  const boxUniqueId = getRandomBoxUniqueId();

  const texture = getRandomTexture();
  const color = getRandomColor();

  createRotationBoxAnimation({
    boxUniqueId,
    animationEndCallback: () => {
      resetBoxRotation({
        boxUniqueId,
        texture,
        color,
      });
    },
    texture,
    color,
  });

  setTimeout(() => {
    emitEvent<LogoEvent.All>({
      type: LogoEvent.Type.rotateBox,
      entity: logoEntity,
      payload: {},
    });
  }, Math.random() * 500 + 500);

  return state;
};
