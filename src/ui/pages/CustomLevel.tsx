import React, { FC, useState } from 'react';
import { AI, Box, Game, name, Page, State } from '../../type';
import { emitEvent } from '../../eventSystem';
import { GameEvent, getGame } from '../../systems/gameSystem';
import { Button } from '../components/Button';
import { Flex } from '../components/Flex';
import { Burger } from '../components/icons/Burger';
import { Modal } from '../components/Modal';
import { PageContainer } from '../components/PageContainer';
import { TurnIndicator, TurnIndicatorItem } from '../components/TurnIndicator';
import { Typography } from '../components/Typography';
import { useGameState } from '../hooks/useGameState';
import { Component, getComponent } from '@arekrado/canvas-engine';

const getAiList = (state: State): TurnIndicatorItem[] => {
  const game = getGame({ state });

  const aiList = game?.playersQueue
    .map((entity) =>
      getComponent<AI>({
        state,
        name: name.ai,
        entity,
      })
    )
    .filter((ai) => !!ai) as Component<AI>[];

  return aiList.map((ai) => ({
    entity: ai.entity,
    color: ai.color,
    active: ai.active,
    human: ai.human,
    hasCurrentTurn: game?.currentPlayer === ai.entity,
    name: ai.human ? 'Player' : 'Computer',
  }));
};

const BackToMainMenuModal: FC<{ onClose: (flag: boolean) => void }> = ({
  onClose,
}) => (
  <Modal
    css={{
      width: '70%',
      height: '40%',

      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
    }}
  >
    <Typography css={{ textAlign: 'center' }}>
      Are you sure you want to finish the game?
    </Typography>

    <Flex css={{ justifyContent: 'space-evenly' }}>
      <Button
        onClick={() => {
          onClose(false);
        }}
      >
        No
      </Button>
      <Button
        onClick={() => {
          emitEvent<GameEvent.CleanSceneEvent>({
            type: GameEvent.Type.cleanScene,
            payload: { newPage: Page.mainMenu },
          });
        }}
      >
        Yes
      </Button>
    </Flex>
  </Modal>
);

const PlayerLostModal: FC = () => (
  <Modal
    css={{
      width: '70%',
      height: '40%',

      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
    }}
  >
    <Typography css={{ textAlign: 'center' }}>You lost</Typography>

    <Flex css={{ justifyContent: 'space-evenly' }}>
      <Button
        onClick={() => {
          emitEvent<GameEvent.CleanSceneEvent>({
            type: GameEvent.Type.cleanScene,
            payload: { newPage: Page.mainMenu },
          });
        }}
      >
        Back to main menu
      </Button>
      <Button
        onClick={() => {
          emitEvent<GameEvent.PlayAgainCustomLevelEvent>({
            type: GameEvent.Type.playAgainCustomLevel,
            payload: {},
          });
        }}
      >
        Play again
      </Button>
    </Flex>
  </Modal>
);

const PlayerWonModal: FC = () => (
  <Modal
    css={{
      width: '70%',
      height: '40%',

      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
    }}
  >
    <Typography css={{ textAlign: 'center' }}>You won</Typography>

    <Flex css={{ justifyContent: 'space-evenly' }}>
      <Button
        onClick={() => {
          emitEvent<GameEvent.CleanSceneEvent>({
            type: GameEvent.Type.cleanScene,
            payload: { newPage: Page.mainMenu },
          });
        }}
      >
        Back to main menu
      </Button>
      <Button
        onClick={() => {
          emitEvent<GameEvent.PlayAgainCustomLevelEvent>({
            type: GameEvent.Type.playAgainCustomLevel,
            payload: {},
          });
        }}
      >
        Play again
      </Button>
    </Flex>
  </Modal>
);

enum GameStatus {
  playerWon = 'playerWon',
  playerLost = 'playerLost',
  gameInProgress = 'gameInProgress',
}

const getGameStatus = ({
  aiList,
  game,
  state,
}: {
  state: State;
  game: Game;
  aiList: TurnIndicatorItem[];
}): GameStatus => {
  if (game.gameStarted === true) {
    return GameStatus.gameInProgress;
  }

  const humanAi = aiList.find((ai) => ai.human);
  const amountOfCapturedBoxes = game.grid.reduce((acc, boxEntity) => {
    const box = getComponent<Box>({
      state,
      name: name.box,
      entity: boxEntity,
    });

    return box?.player === humanAi?.entity ? acc + 1 : acc;
  }, 0);

  if (amountOfCapturedBoxes === 0) return GameStatus.playerLost;
  if (amountOfCapturedBoxes === game.grid.length) return GameStatus.playerLost;

  return GameStatus.gameInProgress;
};

export const CustomLevel: React.FC = () => {
  const state = useGameState();
  const game = state && getGame({ state });
  const aiList = state ? getAiList(state) : [];

  const [showModal, setShowModal] = useState(false);

  const gameStatus: GameStatus =
    game && state
      ? getGameStatus({ game, aiList, state })
      : GameStatus.gameInProgress;

  return (
    <PageContainer
      css={{
        gridTemplateRows: '4rem 1fr',
        gridTemplateColumns: '1fr 4rem',
        flex: 1,
      }}
    >
      {showModal && <BackToMainMenuModal onClose={() => setShowModal(false)} />}
      {gameStatus === GameStatus.playerWon && <PlayerWonModal />}
      {gameStatus === GameStatus.playerLost && <PlayerLostModal />}

      <Flex
        css={{
          gridRow: '1 / 3',
          gridColumn: '1 / 1',
        }}
      >
        <TurnIndicator ai={aiList} />
      </Flex>
      <Button
        css={{
          gridRow: '1 / 1',
          gridColumn: '2 / 2',
          display: 'flex',
          alignContent: 'center',
          alignItems: 'center',
          padding: '0.75rem',
        }}
        onClick={() => {
          setShowModal(true);
        }}
      >
        <Burger />
      </Button>
    </PageContainer>
  );
};
