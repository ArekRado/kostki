import { scene } from '../..';
import { State } from '../../ecs/type';
import { logoEntity } from '../logoSystem';
import { logoGrid } from './logoGrid';

export const remove = ({ state }: { state: State }): State => {
  const logoMesh = scene.getTransformNodeByUniqueId(parseFloat(logoEntity));
  logoMesh?.dispose();

  logoGrid.flat().forEach((boxEntity) => {
    const boxMesh = scene.getTransformNodeByUniqueId(parseFloat(boxEntity));
    boxMesh?.dispose();
  });

  return state;
};
