import React, { FC, useState } from 'react';
import { componentName, getComponent } from '../../ecs/component';
import { AI, Component, Page, State } from '../../ecs/type';
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

const getAiList = (state: State): TurnIndicatorItem[] => {
  const game = getGame({ state });

  const aiList = game?.playersQueue
    .map((entity) =>
      getComponent<AI>({
        state,
        name: componentName.ai,
        entity,
      })
    )
    .filter((ai) => !!ai) as Component<AI>[];

  return aiList.map((ai) => ({
    entity: ai.entity,
    color: ai.color,
    lose: !ai.active,
    isActive: game?.currentPlayer === ai.entity,
    name: ai.human ? 'Player' : 'Computer',
  }));
};

const BackToMainMenuModal: FC<{ setShowModal: (flag: boolean) => void }> = ({
  setShowModal,
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
          setShowModal(false);
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

export const CustomLevel: React.FC = () => {
  const state = useGameState();
  const aiList = state ? getAiList(state) : [];

  const [showModal, setShowModal] = useState(false);

  return (
    <PageContainer
      css={{
        gridTemplateRows: '4rem 1fr',
        gridTemplateColumns: '1fr 4rem',
        flex: 1,
      }}
    >
      {showModal && <BackToMainMenuModal setShowModal={setShowModal} />}

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
