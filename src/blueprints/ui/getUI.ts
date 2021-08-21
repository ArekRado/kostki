import { Entity } from '../../ecs/type';
import { advancedTexture, uiRoot } from '../../systems/uiSystem';

type GetUI = (params: {
  entity: Entity;
}) => BABYLON.Nullable<BABYLON.GUI.Control> | undefined;
export const getUI: GetUI = ({ entity }) => {
  const control = advancedTexture
    ?.getChildren()
    .find((x) => x.name === uiRoot)
    ?.getChildByName(entity);

  return control;
};
