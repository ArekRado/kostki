import { State } from '../../type';
import { logoGrid } from './logoGrid';

export const remove = ({ state }: { state: State }): State => {
  const sceneRef = state.babylonjs.sceneRef;
  if (!sceneRef) {
    return state;
  }

  logoGrid.flat().forEach((boxEntity) => {
    const boxMesh = sceneRef.getTransformNodeByUniqueId(parseFloat(boxEntity));
    boxMesh?.dispose();
  });

  return state;
};
