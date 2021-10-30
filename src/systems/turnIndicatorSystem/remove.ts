import { scene } from '../..';
import { componentName, removeComponent } from '../../ecs/component';
import { State, TurnIndicator } from '../../ecs/type';
import { highlighterEntity } from '../turnIndicatorSystem';

export const remove = ({
  state,
  component,
}: {
  state: State;
  component: TurnIndicator;
}) => {
  component.boxes.forEach((boxEntity, i) => {
    const mesh = scene.getTransformNodeByUniqueId(parseFloat(boxEntity));
    mesh?.dispose();
  });

  component.texts.forEach((textEntity, i) => {
    state = removeComponent({
      state,
      name: componentName.uiText,
      entity: textEntity,
    });
  });

  const mesh = scene.getMeshByUniqueId(
    parseFloat(highlighterEntity)
  );
  mesh?.dispose();

  return state;
};
