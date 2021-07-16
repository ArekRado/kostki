import {
  TransformNode,
  Animation,
  AnimationEvent,
  Color3,
  StandardMaterial,
  Texture,
  Vector3,
  Tools,
} from 'babylonjs';
import { createSystem } from '../ecs/createSystem';
import { componentName, getComponent, setComponent } from '../ecs/component';
import { AI, Box, Entity, EventHandler, Game, State } from '../ecs/type';
import { scene } from '..';
import { ECSEvent, emitEvent } from '../ecs/emitEvent';

import { gameEntity, GameEvent, getCurrentAi, getGame } from './gameSystem';

export namespace BoxEvent {
  export enum Type {
    onClick = 'onClick',
    rotationEnd = 'rotationEnd',
  }

  export type All = OnClickEvent | RotationEndEvent;

  export type OnClickEvent = ECSEvent<Type.onClick, { ai: AI | undefined }>;
  export type RotationEndEvent = ECSEvent<Type.rotationEnd, { ai: AI }>;
}

const clampRotation = (rotation: number) => {
  if (rotation > Math.PI * 2 || rotation < Math.PI * -2) {
    return Math.PI * -2;
  }

  return rotation;
};

type PushBoxToRotationQueue = (params: {
  entity: Entity;
  state: State;
}) => State;
export const pushBoxToRotationQueue: PushBoxToRotationQueue = ({
  entity,
  state,
}) => {
  const game = getGame({ state });

  if (game) {
    return setComponent<Game>({
      state,
      data: {
        ...game,
        boxRotationQueue: [...game.boxRotationQueue, entity],
      },
    });
  }

  return state;
};

type RemoveBoxFromRotationQueue = (params: {
  entity: Entity;
  state: State;
}) => State;
const removeBoxFromRotationQueue: RemoveBoxFromRotationQueue = ({
  entity,
  state,
}) => {
  const game = getGame({ state });

  if (game) {
    return setComponent<Game>({
      state,
      data: {
        ...game,
        boxRotationQueue: game.boxRotationQueue.filter(
          (boxEntity) => boxEntity !== entity
        ),
      },
    });
  }

  return state;
};

export const createRotationBoxAnimation = (params: {
  entity: Entity;
  direction?: 'up' | 'down' | 'left' | 'right';
  animationEndCallback: () => void;
  ai: AI;
  dots: number;
}) => {
  const frameRate = 30;
  const frameEnd = 0.03 * frameRate;

  const box = scene.getTransformNodeByUniqueId(parseInt(params.entity));

  if (box) {
    const rightAngle = Tools.ToRadians(90);

    const rotationDirection = rightAngle * (Math.random() > 0.5 ? 1 : -1);
    const rotationProperty = Math.random() > 0.5 ? 'x' : 'y';

    const currentRotation = box.rotation;
    const rotationVector = new Vector3(
      rotationProperty === 'x' ? rotationDirection : 0,
      rotationProperty === 'y' ? rotationDirection : 0,
      0
    );

    const nnextRotation = rotationVector.add(currentRotation);

    const nextRotation = new Vector3(
      clampRotation(nnextRotation.x),
      clampRotation(nnextRotation.y),
      clampRotation(nnextRotation.z)
    );

    const xSlideAnimation = new Animation(
      'xSlide',
      'rotation',
      frameRate,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_RELATIVE
    );

    const endEvent = new AnimationEvent(
      frameEnd,
      () => {
        params.animationEndCallback();
      },
      true
    );

    xSlideAnimation.addEvent(endEvent);

    const keyFrames = [];

    keyFrames.push({
      frame: 0,
      value: currentRotation,
    });

    keyFrames.push({
      frame: frameEnd,
      value: nextRotation,
    });

    xSlideAnimation.setKeys(keyFrames);

    box.animations[0] = xSlideAnimation;

    scene.beginAnimation(box, 0, 2 * frameRate, false);

    const children = box.getChildren();
    const color = params.ai.color;

    children.slice(0, -1).forEach((plane) => {
      const mesh = scene.getMeshByUniqueId(plane.uniqueId);
      if (mesh) {
        (mesh.material as StandardMaterial).diffuseColor = new Color3(
          color[0],
          color[1],
          color[2]
        );

        (mesh.material as StandardMaterial).diffuseTexture = new Texture(
          params.ai.textureSet[params.dots],
          scene
        );
      }
    });
  }
};

const onClickHandler: EventHandler<Box, BoxEvent.OnClickEvent> = ({
  state,
  component,
  event,
}) => {
  const { payload } = event;
  const { entity } = component;
  const ai = payload.ai || getCurrentAi({ state });

  let dots = component.dots;
  if (!component.isAnimating && ai) {
    dots = component.dots === 6 ? 1 : component.dots + 1;

    if (component.dots === 6) {
      emitEvent<GameEvent.BoxExplosionEvent>({
        type: GameEvent.Type.boxExplosion,
        entity: gameEntity,
        payload: { ai, box: component },
      });
    }

    const animationEndCallback = () => {
      emitEvent<BoxEvent.RotationEndEvent>({
        type: BoxEvent.Type.rotationEnd,
        entity: entity,
        payload: { ai },
      });
    };

    if (process.env.NODE_ENV !== 'test') {
      createRotationBoxAnimation({
        entity,
        animationEndCallback,
        dots,
        ai,
      });
    } else {
      animationEndCallback();
    }

    state = pushBoxToRotationQueue({ entity, state });
  }

  return setComponent<Box>({
    state,
    data: {
      ...component,
      isAnimating: true,
      player: ai?.entity || '',
      dots,
    },
  });
};

const rotationEndHandler: EventHandler<Box, BoxEvent.RotationEndEvent> = ({
  state,
  component,
  event,
}) => {
  const box = scene.getTransformNodeByUniqueId(parseInt(component.entity));

  if (box) {
    box.rotation.x = 0;
    box.rotation.y = 0;
    const color = event.payload.ai.color;
    const dots = component.dots;

    box.getChildren().forEach((plane) => {
      const mesh = scene.getMeshByUniqueId(plane.uniqueId);
      if (mesh) {
        (mesh.material as StandardMaterial).diffuseColor = new Color3(
          color[0],
          color[1],
          color[2]
        );
        (mesh.material as StandardMaterial).diffuseTexture = new Texture(
          event.payload.ai.textureSet[dots],
          scene
        );
      }
    });
  }

  emitEvent<GameEvent.NextTurnEvent>({
    type: GameEvent.Type.nextTurn,
    entity: gameEntity,
    payload: { ai: event.payload.ai },
  });

  state = removeBoxFromRotationQueue({ entity: component.entity, state });

  return setComponent<Box>({
    state,
    data: {
      ...component,
      isAnimating: false,
    },
  });
};

export const boxSystem = (state: State) =>
  createSystem<Box, BoxEvent.All>({
    state,
    name: componentName.box,
    event: ({ state, component, event }) => {
      switch (event.type) {
        case BoxEvent.Type.onClick:
          return onClickHandler({ state, component, event });
        case BoxEvent.Type.rotationEnd:
          return rotationEndHandler({ state, component, event });
      }
    },
  });
