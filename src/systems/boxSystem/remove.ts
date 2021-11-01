import { scene } from '../..';
import { Box, State } from '../../ecs/type';

export const remove = ({
  state,
  component,
}: {
  state: State;
  component: Box;
}) => {
  const box = scene.getTransformNodeByUniqueId(parseInt(component.entity));
  box?.dispose();

  return state;
};
