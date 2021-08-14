import { Entity } from '../../ecs/type';
import { uiRoot } from '../../systems/uiSystem';

type AttachEvent = (params: {
  entity: Entity;
  advancedTexture: BABYLON.GUI.AdvancedDynamicTexture;
  onPointerUpObservable: () => void;
}) => void;
export const attachEvent: AttachEvent = ({
  entity,
  advancedTexture,
  onPointerUpObservable,
}) => {
  const control = advancedTexture
    .getChildren()
    .find((x) => x.name === uiRoot)
    ?.getChildByName(entity);

  if (control) {
    control.onPointerUpObservable.add(onPointerUpObservable);
  }
};
