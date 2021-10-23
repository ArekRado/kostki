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
import { setUi } from '../uiSystem';

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
    component.customLevelSettings.players?.length === 8
      ? 2
      : component.customLevelSettings.players?.length + 1;

  state = setGame({
    state,
    data: {
      customLevelSettings: {
        ...component.customLevelSettings,
        players: playersList().slice(0, playersAmount),
      },
    },
  });

  return setUi({ state, data: {}, cleanControls: false });
};

export const handleChangeDifficulty: EventHandler<
  Game,
  GameEvent.ChangeDifficultyEvent
> = ({ state, component }) => {
  const difficultyList = [
    AIDifficulty.easy,
    AIDifficulty.medium,
    AIDifficulty.hard,
    AIDifficulty.experimental,
  ];

  const index = difficultyList.findIndex(
    (difficulty) => difficulty === component.customLevelSettings.difficulty
  );

  const nextDifficulty =
    index === -1
      ? difficultyList[0]
      : difficultyList[index + 1] ?? difficultyList[0];

  state = setGame({
    state,
    data: {
      customLevelSettings: {
        ...component.customLevelSettings,
        difficulty: nextDifficulty,
      },
    },
  });

  return setUi({ state, data: {}, cleanControls: false });
};

export const handleChangeQuickStart: EventHandler<
  Game,
  GameEvent.ChangeQuickStartEvent
> = ({ state, component }) => {
  state = setGame({
    state,
    data: {
      customLevelSettings: {
        ...component.customLevelSettings,
        quickStart: !component.customLevelSettings.quickStart,
      },
    },
  });

  return setUi({ state, data: {}, cleanControls: false });
};

export const handleChangeColorBlindMode: EventHandler<
  Game,
  GameEvent.ChangeColorBlindModeEvent
> = ({ state, component }) => {
  state = setGame({
    state,
    data: {
      colorBlindMode: !component.colorBlindMode,
    },
  });

  return setUi({ state, data: {}, cleanControls: false });
};

export const handleChangeMapType: EventHandler<
  Game,
  GameEvent.ChangeMapTypeEvent
> = ({ state, component }) => {
  return setUi({ state, data: {}, cleanControls: false });
};

export const handleChangeNextMap: EventHandler<
  Game,
  GameEvent.ChangeNextMapEvent
> = ({ state, component }) => {
  return setUi({ state, data: {}, cleanControls: false });
};

export const handleChangePrevMap: EventHandler<
  Game,
  GameEvent.ChangePrevMapEvent
> = ({ state, component }) => {
  return setUi({ state, data: {}, cleanControls: false });
};

export const handleShowNewVersion: EventHandler<
  Game,
  GameEvent.ShowNewVersionEvent
> = ({ state }) => {
  state = setGame({
    state,
    data: { newVersionAvailable: true },
  });
  return setUi({ state, data: {}, cleanControls: false });
};

export const handleReload: EventHandler<Game, GameEvent.ReloadEvent> = ({
  state,
}) => {
  window.location.reload();
  return state;
};
