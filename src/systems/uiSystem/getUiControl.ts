import { Entity } from '../../ecs/type';
import { uiRoot } from '../uiSystem';
import { advancedTexture } from './advancedTexture';

type GetUiControl = (params: {
  entity: Entity;
}) => BABYLON.Nullable<BABYLON.GUI.Control> | undefined;
export const getUiControl: GetUiControl = ({ entity }) => {
  const control = advancedTexture
    ?.getChildren()
    .find((x) => x.name === uiRoot)
    ?.getChildByName(entity);

  return control;
};
