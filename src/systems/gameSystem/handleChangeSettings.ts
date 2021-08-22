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
import { GameEvent, setGame } from '../gameSystem';
import { humanPlayerEntity } from '../..';

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

export const handleChangePlayers: EventHandler<
  Game,
  GameEvent.ChangePlayersEvent
> = ({ state, component }) => {
  const playersAmount =
    component.customLevelSettings.players.length === 8
      ? 2
      : component.customLevelSettings.players.length + 1;

  return setGame({
    state,
    data: {
      customLevelSettings: {
        ...component.customLevelSettings,
        players: playersList().slice(0, playersAmount),
      },
    },
  });
};

export const handleChangeDifficulty: EventHandler<
  Game,
  GameEvent.ChangeDifficultyEvent
> = ({ state, component }) => {
  const difficultyList = [
    AIDifficulty.easy,
    AIDifficulty.medium,
    AIDifficulty.hard,
  ];

  const index = difficultyList.findIndex(
    (difficulty) => difficulty === component.customLevelSettings.difficulty
  );

  const nextDifficulty =
    index === -1
      ? difficultyList[0]
      : difficultyList[index + 1] ?? difficultyList[0];

  return setGame({
    state,
    data: {
      customLevelSettings: {
        ...component.customLevelSettings,
        difficulty: nextDifficulty,
      },
    },
  });
};

export const handleChangeQuickStart: EventHandler<
  Game,
  GameEvent.ChangeQuickStartEvent
> = ({ state, component }) => {
  return setGame({
    state,
    data: {
      customLevelSettings: {
        ...component.customLevelSettings,
        quickStart: !component.customLevelSettings.quickStart,
      },
    },
  });
};

export const handleChangeColorBlindMode: EventHandler<
  Game,
  GameEvent.ChangeColorBlindModeEvent
> = ({ state, component }) => {
  return setGame({
    state,
    data: {
      colorBlindMode: !component.colorBlindMode,
    },
  });
};

export const handleChangeMapType: EventHandler<
  Game,
  GameEvent.ChangeMapTypeEvent
> = ({ state, component }) => {
  return state;
};

export const handleChangeNextMap: EventHandler<
  Game,
  GameEvent.ChangeNextMapEvent
> = ({ state, component }) => {
  return state;
};

export const handleChangePrevMap: EventHandler<
  Game,
  GameEvent.ChangePrevMapEvent
> = ({ state, component }) => {
  return state;
};
