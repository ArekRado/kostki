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
import { componentName, getComponent, setComponent } from '../ecs/component';
import { AI, Box, Color, Entity, EventHandler, Game, State } from '../ecs/type';
import { scene } from '..';
import { ECSEvent, emitEvent } from '../ecs/emitEvent';
import { gameEntity, GameEvent, getCurrentAi, getGame } from './gameSystem';
import { getDataGrid, safeGet } from './aiSystem';
import { set1 } from '../utils/textureSets';
import { setMeshTexture } from '../utils/setMeshTexture';
import { boxBlueprint } from '../blueprints/boxBlueprint';
import { boxWithGap, gridName } from '../blueprints/gridBlueprint';
import empty from '../assets/0.png';
import { Mesh } from 'babylonjs/Meshes/mesh';
import { TransformNode } from 'babylonjs/Meshes/transformNode';

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

  export type All = RotationEndEvent | Rotate;

  export type Rotate = ECSEvent<
    Type.rotate,
    {
      color: [number, number, number];
      texture: string;
      direction: Direction;
    }
  >;
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

export const getTextureSet = ({
  state,
  ai,
}: {
  state: State;
  ai: AI | undefined;
}): AI['textureSet'] => {
  const game = getGame({ state });

  if (!ai) {
    return set1;
  }

  return game?.colorBlindMode ? ai.textureSet : set1;
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
  const frameEnd = 0.5;

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

    const rotateAnimation = new Animation(
      'rotateAnimation',
      'rotation',
      1,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_RELATIVE
    );

    const endEvent = new AnimationEvent(frameEnd, animationEndCallback, true);

    rotateAnimation.addEvent(endEvent);

    const keyFrames = [];

    keyFrames.push({
      frame: 0,
      value: currentRotation,
    });

    keyFrames.push({
      frame: frameEnd,
      value: nextRotation,
    });

    rotateAnimation.setKeys(keyFrames);

    box.animations[box.animations.length] = rotateAnimation;

    scene.beginAnimation(box, 0, 1, false);

    const children = box.getChildren();

    children.slice(1, children.length).forEach((plane) => {
      const mesh = scene.getMeshByUniqueId(plane.uniqueId);
      if (mesh) {
        setMeshTexture({
          mesh,
          color,
          texture,
          scene,
        });
      }
    });
  }
};

export const getNextDots = (dots: number): number =>
  dots === 6 ? 1 : dots + 1;

type OnClickBox = (params: { state: State; ai: AI; box: Box }) => State;
export const onClickBox: OnClickBox = ({ state, ai, box }) => {
  const { entity } = box;

  let dots = box.dots;

  if (ai) {
    dots = getNextDots(box.dots);

    const animationEndCallback = () => {
      emitEvent<BoxEvent.RotationEndEvent>({
        type: BoxEvent.Type.rotationEnd,
        entity: entity,
        payload: { ai, shouldExplode: box.dots === 6 },
      });
    };

    if (process.env.NODE_ENV !== 'test') {
      createRotationBoxAnimation({
        entity,
        animationEndCallback,
        texture: getTextureSet({ state, ai })[dots],
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
      ...box,
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
        setMeshTexture({
          mesh,
          color,
          texture,
          scene,
        });
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
      acc = onClickBox({
        ai,
        box,
        state: acc,
      });

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
    texture: getTextureSet({ state, ai })[component.dots],
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

  const box = scene.getTransformNodeByUniqueId(parseInt(component.entity));
  if (box) {
    box.animations = [];
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
    create: ({ state, component }) => {
      const { gridPosition } = component;
      const ai = getComponent<AI>({
        state,
        name: componentName.ai,
        entity: component.player || '',
      });

      boxBlueprint({
        scene,
        name: `${gridPosition[0]}-${gridPosition[1]}`,
        position: [gridPosition[0] * boxWithGap, gridPosition[1] * boxWithGap],
        uniqueId: parseFloat(component.entity),
        texture: ai?.textureSet[component.dots] || empty,
        color: ai?.color || [1, 1, 1],
        ai,
        box: component,
        state,
      });

      const game = getGame({ state });

      if (!game) {
        return state;
      }

      state = setComponent<Game>({
        state,
        data: {
          ...game,
          grid: [...game.grid, component.entity],
        },
      });

      return state;
    },
    remove: ({ state, component }) => {
      const box = scene.getTransformNodeByUniqueId(parseInt(component.entity));
      box?.dispose();

      return state;
    },
    event: ({ state, component, event }) => {
      switch (event.type) {
        case BoxEvent.Type.rotationEnd:
          return rotationEndHandler({ state, component, event });
        case BoxEvent.Type.rotate:
          return rotateHandler({ state, component, event });
      }
    },
  });
