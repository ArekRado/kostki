import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { logoBlueprint } from '../../blueprints/logoBlueprint';
import { State } from '../../type';
import { emitEvent } from '../../eventSystem';
import { logoEntity, LogoEvent } from '../logoSystem';
import { updateLogoPosition } from './updateLogoPosition';

export const create = ({ state }: { state: State }): State => {
  const sceneRef = state.babylonjs.sceneRef;
  if (!sceneRef) {
    return state;
  }

  const logoMesh = new TransformNode('logo', sceneRef);
  logoMesh.uniqueId = parseFloat(logoEntity);
  logoMesh.position.x = 0;
  logoMesh.position.y = 0;

  logoBlueprint({ state });
  updateLogoPosition({ state });

  emitEvent<LogoEvent.All>({
    type: LogoEvent.Type.rotateBox,
    payload: {},
  });

  return state;
};
