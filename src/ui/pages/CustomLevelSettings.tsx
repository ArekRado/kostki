import React from 'react';
import { State } from '../../ecs/type';
import { emitEvent } from '../../eventSystem';
import { AIDifficulty } from '../../systems/aiSystem';
import { GameEvent, getGame } from '../../systems/gameSystem';
import { Button } from '../components/Button';
import { Flex } from '../components/Flex';
import { PageContainer } from '../components/PageContainer';

const mapDifficultyToText = (difficulty: AIDifficulty): string => {
  switch (difficulty) {
    case AIDifficulty.disabled:
      return 'Disabled';
    case AIDifficulty.random:
      return 'Random';

    case AIDifficulty.easy:
      return 'Easy';
    case AIDifficulty.medium:
      return 'Medium';
    case AIDifficulty.hard:
      return 'Hard';
  }
};

export const CustomLevelSettings: React.FC<{ state: State }> = ({ state }) => {
  const game = getGame({ state });
  if (!game) {
    return null;
  }

  const changePlayers = () =>
    emitEvent<GameEvent.ChangePlayersEvent>({
      type: GameEvent.Type.changePlayers,
      payload: {},
    });

  const changeDifficulty = () =>
    emitEvent<GameEvent.ChangeDifficultyEvent>({
      type: GameEvent.Type.changeDifficulty,
      payload: {},
    });

  const changeQuickStart = () =>
    emitEvent<GameEvent.ChangeQuickStartEvent>({
      type: GameEvent.Type.changeQuickStart,
      payload: {},
    });

  const changeColorBlindMode = () =>
    emitEvent<GameEvent.ChangeColorBlindModeEvent>({
      type: GameEvent.Type.changeColorBlindMode,
      payload: {},
    });

  const changeMapType = () =>
    emitEvent<GameEvent.ChangeMapTypeEvent>({
      type: GameEvent.Type.changeMapType,
      payload: {},
    });

  const startCustomLevel = () =>
    emitEvent<GameEvent.StartCustomLevelEvent>({
      type: GameEvent.Type.startCustomLevel,
      payload: {},
    });

  return (
    <PageContainer
      css={{
        gridTemplateRows: '2fr 1fr 1fr',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        flex: 1,
      }}
    >
      <Flex
        css={{
          flexDirection: 'column',
          justifyContent: 'center',
          gridRow: '1 / 1',
          gridColumn: '1 / 5',
        }}
      >
        Select level
      </Flex>

      <Flex
        css={{
          flexDirection: 'column',
          justifyContent: 'center',
          gridRow: '2 / 2',
          gridColumn: '2 / 4',
        }}
      >
        <Button onClick={startCustomLevel}>Start</Button>
      </Flex>

      <Flex
        css={{
          flexDirection: 'column',
          justifyContent: 'center',
          gridRow: '3 / 3',
          gridColumn: '1 / 3',
        }}
      >
        <Button
          css={{ display: 'flex', justifyContent: 'space-between' }}
          onClick={changeDifficulty}
        >
          <div>Difficulty</div>
          <div>{mapDifficultyToText(game.customLevelSettings.difficulty)}</div>
        </Button>
        <Button
          css={{ display: 'flex', justifyContent: 'space-between' }}
          onClick={changePlayers}
        >
          <div>Players</div>
          <div>{game.customLevelSettings.players?.length}</div>
        </Button>
      </Flex>
      <Flex
        css={{
          flexDirection: 'column',
          justifyContent: 'center',
          gridRow: '3 / 3',
          gridColumn: '3 / 5',
        }}
      >
        <Button
          css={{ display: 'flex', justifyContent: 'space-between' }}
          onClick={changeQuickStart}
        >
          <div>Quick Start</div>
          <div>{game.customLevelSettings.quickStart ? 'x' : ''}</div>
        </Button>
        <Button
          css={{ display: 'flex', justifyContent: 'space-between' }}
          onClick={changeColorBlindMode}
        >
          <div>Color Blind Mode</div>
          <div>{game.colorBlindMode ? 'x' : ''}</div>
        </Button>
      </Flex>
    </PageContainer>
  );
};
