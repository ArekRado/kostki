import { componentName } from '../../ecs/component';
import { AI, Color, Entity, EventHandler, Game } from '../../ecs/type';
import { AIDifficulty } from '../aiSystem';
import {
  gray,
  green,
  orange,
  pink,
  purple,
  red,
  teal,
  yellow,
} from '../../utils/colors';
import {
  set1,
  set2,
  set3,
  set4,
  set5,
  set6,
  set7,
  set8,
} from '../../utils/textureSets';
import { GameEvent, getGame, setGame } from '../gameSystem';
import { humanPlayerEntity } from '../..';
import { eventBusDispatch } from '../../utils/eventBus';
import { saveStateToData } from '../../utils/localDb';

export const basicAI = (
  entity: Entity,
  color: Color,
  textureSet: AI['textureSet'],
  human = false,
  level = AIDifficulty.easy
): AI => ({
  entity,
  name: componentName.ai,
  human,
  level,
  color,
  textureSet,
  active: true,
});

export const playersList = () => [
  basicAI(humanPlayerEntity, teal, set1, true, AIDifficulty.easy),
  basicAI('2', red, set2, false, AIDifficulty.easy),
  basicAI('3', green, set3, false, AIDifficulty.easy),
  basicAI('4', yellow, set4, false, AIDifficulty.easy),
  basicAI('5', orange, set5, false, AIDifficulty.easy),
  basicAI('6', pink, set6, false, AIDifficulty.easy),
  basicAI('7', gray, set7, false, AIDifficulty.easy),
  basicAI('8', purple, set8, false, AIDifficulty.easy),
];

export const handleChangePlayers: EventHandler<GameEvent.ChangePlayersEvent> =
  ({ state }) => {
    const game = getGame({ state });
    if (!game) {
      return state;
    }

    const playersAmount =
      game.customLevelSettings.players?.length === 8
        ? 2
        : game.customLevelSettings.players?.length + 1;

    state = setGame({
      state,
      data: {
        customLevelSettings: {
          ...game.customLevelSettings,
          players: playersList().slice(0, playersAmount),
        },
      },
    });

    eventBusDispatch('setUIState', state);
    saveStateToData(state);

    return state;
  };

export const handleChangeDifficulty: EventHandler<GameEvent.ChangeDifficultyEvent> =
  ({ state }) => {
    const game = getGame({ state });
    if (!game) {
      return state;
    }

    const difficultyList = [
      AIDifficulty.easy,
      AIDifficulty.medium,
      AIDifficulty.hard,
    ];

    const index = difficultyList.findIndex(
      (difficulty) => difficulty === game.customLevelSettings.difficulty
    );

    const nextDifficulty =
      index === -1
        ? difficultyList[0]
        : difficultyList[index + 1] ?? difficultyList[0];

    state = setGame({
      state,
      data: {
        customLevelSettings: {
          ...game.customLevelSettings,
          difficulty: nextDifficulty,
        },
      },
    });

    eventBusDispatch('setUIState', state);
    saveStateToData(state);

    return state;
  };

export const handleChangeQuickStart: EventHandler<GameEvent.ChangeQuickStartEvent> =
  ({ state }) => {
    const game = getGame({ state });
    if (!game) {
      return state;
    }

    state = setGame({
      state,
      data: {
        customLevelSettings: {
          ...game.customLevelSettings,
          quickStart: !game.customLevelSettings.quickStart,
        },
      },
    });

    eventBusDispatch('setUIState', state);
    saveStateToData(state);

    return state;
  };

export const handleChangeColorBlindMode: EventHandler<GameEvent.ChangeColorBlindModeEvent> =
  ({ state }) => {
    const game = getGame({ state });
    if (!game) {
      return state;
    }

    state = setGame({
      state,
      data: {
        colorBlindMode: !game.colorBlindMode,
      },
    });

    eventBusDispatch('setUIState', state);
    saveStateToData(state);

    return state;
  };

export const handleChangeMapType: EventHandler<GameEvent.ChangeMapTypeEvent> =
  ({ state }) => {
    eventBusDispatch('setUIState', state);
    saveStateToData(state);

    return state;
  };

export const handleShowNewVersion: EventHandler<GameEvent.ShowNewVersionEvent> =
  ({ state }) => {
    state = setGame({
      state,
      data: { newVersionAvailable: true },
    });
    return state;
  };

export const handleReload: EventHandler<GameEvent.ReloadEvent> = ({
  state,
}) => {
  window.location.reload();
  return state;
};
