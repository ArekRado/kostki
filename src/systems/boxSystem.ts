import {
  Animation,
  AnimationEvent,
  Color3,
  StandardMaterial,
  Texture,
  Vector3,
  Tools,
} from 'babylonjs';
import { createSystem } from '../ecs/createSystem';
import { componentName, setComponent } from '../ecs/component';
import { AI, Box, Color, Entity, EventHandler, Game, State } from '../ecs/type';
import { scene } from '..';
import { ECSEvent, emitEvent } from '../ecs/emitEvent';
import { gameEntity, GameEvent, getCurrentAi, getGame } from './gameSystem';
import { getDataGrid, safeGet } from './aiSystem';

export enum Direction {
  up,
  down,
  left,
  right,
}
export namespace BoxEvent {
  export enum Type {
    onClick,
    rotationEnd,
    rotate,
  }

  export type All = OnClickEvent | RotationEndEvent | Rotate;

  export type Rotate = ECSEvent<
    Type.rotate,
    {
      color: [number, number, number];
      texture: string;
      direction: Direction;
    }
  >;
  export type OnClickEvent = ECSEvent<Type.onClick, { ai: AI | undefined }>;
  export type RotationEndEvent = ECSEvent<
    Type.rotationEnd,
    { ai: AI; shouldExplode: boolean }
  >;
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

export const createRotationBoxAnimation = ({
  entity,
  animationEndCallback,
  direction,
  color,
  texture,
}: {
  entity: Entity;
  color: Color;
  direction?: Direction;
  animationEndCallback: () => void;
  texture: string;
}) => {
  const frameRate = 30;
  const frameEnd = 0.005 * frameRate;

  const box = scene.getTransformNodeByUniqueId(parseInt(entity));

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
        animationEndCallback();
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

    children.slice(0, -1).forEach((plane) => {
      const mesh = scene.getMeshByUniqueId(plane.uniqueId);
      if (mesh) {
        (mesh.material as StandardMaterial).diffuseColor = new Color3(
          color[0],
          color[1],
          color[2]
        );

        (mesh.material as StandardMaterial).diffuseTexture = new Texture(
          texture,
          scene
        );
      }
    });
  }
};

export const getNextDots = (dots: number): number =>
  dots === 6 ? 1 : dots + 1;

const onClickHandler: EventHandler<Box, BoxEvent.OnClickEvent> = ({
  state,
  component,
  event,
}) => {
  const { payload } = event;
  const { entity } = component;
  const ai = payload.ai || getCurrentAi({ state });

  let dots = component.dots;

  if (component.gridPosition[0] === 1 && component.gridPosition[1] === 1) {
    console.log(component);
  }

  if (ai) {
    dots = getNextDots(component.dots);

    const animationEndCallback = () => {
      emitEvent<BoxEvent.RotationEndEvent>({
        type: BoxEvent.Type.rotationEnd,
        entity: entity,
        payload: { ai, shouldExplode: component.dots === 6 },
      });
    };

    if (process.env.NODE_ENV !== 'test') {
      createRotationBoxAnimation({
        entity,
        animationEndCallback,
        texture: ai.textureSet[dots],
        color: ai.color,
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

type ResetBoxRotation = (params: {
  boxEntity: Entity;
  texture: string;
  color: Color;
}) => void;
const resetBoxRotation: ResetBoxRotation = ({ boxEntity, texture, color }) => {
  const box = scene.getTransformNodeByUniqueId(parseInt(boxEntity));

  if (box) {
    box.rotation.x = 0;
    box.rotation.y = 0;

    box.getChildren().forEach((plane) => {
      const mesh = scene.getMeshByUniqueId(plane.uniqueId);
      if (mesh) {
        (mesh.material as StandardMaterial).diffuseColor = new Color3(
          color[0],
          color[1],
          color[2]
        );
        (mesh.material as StandardMaterial).diffuseTexture = new Texture(
          texture,
          scene
        );
      }
    });
  }
};

type BoxExplosion = (params: { state: State; box: Box; ai: AI }) => State;
const boxExplosion: BoxExplosion = ({ state, ai, box }) => {
  const {
    gridPosition: [x, y],
  } = box;

  const dataGrid = getDataGrid({ state });

  state = [
    safeGet(dataGrid, y, x - 1),
    safeGet(dataGrid, y, x + 1),
    safeGet(dataGrid, y - 1, x),
    safeGet(dataGrid, y + 1, x),
  ]
    .filter((box) => box !== undefined)
    .reduce((acc, box, i) => {
      acc = onClickHandler({
        event: {
          type: BoxEvent.Type.onClick,
          entity: box.entity,
          payload: {
            ai,
          },
        },
        state: acc,
        component: box,
      });

      // emitEvent({
      //   type: BoxEvent.Type.onClick,
      //   entity: box.entity,
      //   payload: {
      //     ai,
      //   },
      // });

      return pushBoxToRotationQueue({ entity: box.entity, state: acc });
    }, state);

  return state;
};

const rotationEndHandler: EventHandler<Box, BoxEvent.RotationEndEvent> = ({
  state,
  component,
  event,
}) => {
  const { ai, shouldExplode } = event.payload;

  state = removeBoxFromRotationQueue({ entity: component.entity, state });

  resetBoxRotation({
    boxEntity: component.entity,
    texture: ai.textureSet[component.dots],
    color: ai.color,
  });

  const game = getGame({ state });
  if (!game) {
    return state;
  }

  if (shouldExplode) {
    state = boxExplosion({
      state,
      box: component,
      ai,
    });
  } else {
    if (game.boxRotationQueue.length === 0) {
      emitEvent<GameEvent.NextTurnEvent>({
        type: GameEvent.Type.nextTurn,
        entity: gameEntity,
        payload: { ai },
      });
    }
  }

  return setComponent<Box>({
    state,
    data: {
      ...component,
      isAnimating: false,
    },
  });
};

const rotateHandler: EventHandler<Box, BoxEvent.Rotate> = ({
  state,
  component,
  event,
}) => {
  if (process.env.NODE_ENV !== 'test') {
    createRotationBoxAnimation({
      entity: component.entity,
      animationEndCallback: () => {
        resetBoxRotation({
          boxEntity: component.entity,
          texture: event.payload.texture,
          color: event.payload.color,
        });
      },
      texture: event.payload.texture,
      color: event.payload.color,
    });
  }

  return state;
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
        case BoxEvent.Type.rotate:
          return rotateHandler({ state, component, event });
      }
    },
  });
