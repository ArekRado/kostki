import { componentName, getComponent, setComponent } from '../../ecs/component';
import { emitEvent } from '../../ecs/emitEvent';
import {
  AI,
  Box,
  Color,
  Entity,
  EventHandler,
  Game,
  State,
  Scene as GameScene,
} from '../../ecs/type';
import { getAiMove, getDataGrid } from '../aiSystem';
import {
  BoxEvent,
  Direction,
  getNextDots,
  getTextureSet,
  onClickBox,
} from '../boxSystem';
import { GameEvent, getGame, getNextPlayer, setGame } from '../gameSystem';
import { camera, humanPlayerEntity, scene } from '../../index';
import { Scene, UniversalCamera } from 'babylonjs';
import { generateId } from '../../utils/generateId';
import { aiBlueprint } from '../../blueprints/aiBlueprint';
import { green, orange, pink, red, teal, yellow } from '../../utils/colors';
import { set1, set2, set3, set4, set5, set6 } from '../../utils/textureSets';
import { getGridDimensions } from '../../blueprints/gridBlueprint';
import { setCamera } from '../cameraSystem';
import { setUi } from '../uiSystem';

type setLevelFromSettings = (params: {
  state: State;
  scene: Scene;
  camera: UniversalCamera;
}) => State;
export const setLevelFromSettings: setLevelFromSettings = ({
  state,
  scene,
  camera,
}) => {
  state = Array.from({ length: 8 }).reduce(
    (acc: State, _, x) =>
      Array.from({ length: 8 }).reduce(
        (acc2: State, _, y) =>
          setComponent<Box>({
            state: acc2,
            data: {
              name: componentName.box,
              entity: generateId().toString(),
              isAnimating: false,
              dots: 0,
              gridPosition: [y, x],
              player: undefined,
            },
          }),
        acc
      ),
    state
  );

  const basicAI = (
    entity: Entity,
    color: Color,
    textureSet: AI['textureSet'],
    human = false
  ): AI => ({
    entity,
    name: componentName.ai,
    human,
    level: 1,
    color,
    textureSet,
    active: true,
  });

  // state = gridBlueprint({ dataGrid: emptyGrid, scene, camera, state });
  state = aiBlueprint({
    state,
    ai: [
      basicAI(humanPlayerEntity, teal, set1, true),
      basicAI('2', red, set2),
      basicAI('3', green, set3),
      basicAI('4', yellow, set4),
      basicAI('5', orange, set5),
      basicAI('6', pink, set6),
      // basicAI('7', darkBlue, set7),
      // basicAI('8', purple, set8),
    ],
  });

  const { center, cameraDistance } = getGridDimensions(getDataGrid({ state }));

  state = setCamera({
    state,
    data: {
      position: [center[0], center[1]],
      distance: cameraDistance,
    },
  });

  state = setUi({
    state,
    data: {
      type: GameScene.customLevel,
    },
  });

  return state;
};

type UpdateAllBoxes = (params: { state: State }) => void;
const updateAllBoxes: UpdateAllBoxes = ({ state }) => {
  const game = getGame({ state });
  if (!game) {
    return undefined;
  }
  game.grid.forEach((boxEntity) => {
    const box = getComponent<Box>({
      state,
      entity: boxEntity,
      name: componentName.box,
    });

    const ai = getComponent<AI>({
      state,
      entity: box?.player || '',
      name: componentName.ai,
    });

    if (box && ai) {
      emitEvent<BoxEvent.Rotate>({
        type: BoxEvent.Type.rotate,
        entity: boxEntity,
        payload: {
          color: ai.color,
          texture: getTextureSet({ state, ai })[box.dots],
          direction: Direction.up,
        },
      });
    }
  });

  return state;
};

type RunQuickStart = (params: { state: State }) => State;
const runQuickStart: RunQuickStart = ({ state }) => {
  // Run same amount of moves as boxes in a grid
  const newState = getGame({ state })?.grid.reduce((acc) => {
    const game = getGame({ state: acc });

    const currentAi = getComponent<AI>({
      state: acc,
      name: componentName.ai,
      entity: game?.currentPlayer || '',
    });

    if (!game || !currentAi) {
      return acc;
    }

    const box = getAiMove({
      state: acc,
      ai: currentAi,
      preferEmptyBoxes: true,
    });

    if (!box) {
      return acc;
    }

    acc = setComponent<Box>({
      state: acc,
      data: {
        ...box,
        player: currentAi.entity,
        dots: getNextDots(box.dots),
      },
    });

    const nextPlayer = getNextPlayer({ state: acc });

    if (!nextPlayer) {
      return acc;
    }

    acc = setComponent<Game>({
      state: acc,
      data: {
        ...game,
        currentPlayer: nextPlayer.entity,
      },
    });

    return acc;
  }, state);

  return newState || state;
};

export const handleStartCustomLevel: EventHandler<
  Game,
  GameEvent.StartCustomLevelEvent
> = ({ state }) => {
  state = setLevelFromSettings({ state, scene, camera });

  const game = getGame({ state });

  const currentAi = getNextPlayer({ state });

  if (!currentAi || !game) {
    return state;
  }

  state = setGame({
    state,
    data: {
      gameStarted: true,
      currentPlayer: currentAi.entity,
    },
  });

  if (game.quickStart) {
    state = runQuickStart({ state });
    setTimeout(() => {
      updateAllBoxes({ state });
    }, 500);
  }

  // TODO do not repeat same code as above
  state = setGame({
    state,
    data: {
      gameStarted: true,
      currentPlayer: currentAi.entity,
    },
  });

  if (!currentAi.human) {
    const box = getAiMove({ state, ai: currentAi });

    if (box) {
      state = onClickBox({ box, state, ai: currentAi });
    }
  }

  return state;
};
