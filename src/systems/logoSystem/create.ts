import { TransformNode } from 'babylonjs';
import { scene } from '../..';
import { logoBlueprint } from '../../blueprints/logoBlueprint';
import { State } from '../../ecs/type';
import { emitEvent } from '../../eventSystem';
import { logoEntity, LogoEvent } from '../logoSystem';
import { updateLogoPosition } from './updateLogoPosition';

export const create = ({ state }: { state: State }): State => {
  const logoMesh = new TransformNode('logo', scene);
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
