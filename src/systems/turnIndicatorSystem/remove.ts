import { scene } from '../..';
import {
  componentName,
  removeComponent,
  setComponent,
} from '../../ecs/component';
import { Entity, State, TurnIndicator } from '../../ecs/type';
import { getTurnIndicator, highlighterEntity } from '../turnIndicatorSystem';

export const removeTurnIndicatorElement = ({
  state,
  textEntity,
  boxEntity,
  aiEntity,
}: {
  state: State;
  textEntity: Entity;
  boxEntity: Entity;
  aiEntity: Entity;
}): State => {
  state = removeComponent({
    state,
    name: componentName.uiText,
    entity: textEntity,
  });

  const mesh = scene.getTransformNodeByUniqueId(parseFloat(boxEntity));
  mesh?.dispose();

  const turnIndicator = getTurnIndicator({ state });

  if (turnIndicator) {
    state = setComponent<TurnIndicator>({
      state,
      data: {
        ...turnIndicator,
        list: turnIndicator.list.filter((item) => item.aiEntity !== aiEntity),
      },
    });
  }

  return state;
};

export const remove = ({
  state,
  component,
}: {
  state: State;
  component: TurnIndicator;
}) => {
  component.list.forEach(({ aiEntity, textEntity, boxEntity }) => {
    state = removeTurnIndicatorElement({
      state,
      aiEntity,
      textEntity,
      boxEntity,
    });
  });

  const mesh = scene.getMeshByUniqueId(parseFloat(highlighterEntity));
  mesh?.dispose();

  return state;
};
