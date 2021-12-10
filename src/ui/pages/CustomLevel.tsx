import React from 'react';
import {
  componentName,
  getComponent,
} from '../../ecs/component';
import { AI, Component, Page, State } from '../../ecs/type';
import { emitEvent } from '../../eventSystem';
import { GameEvent, getGame } from '../../systems/gameSystem';
import { Button } from '../components/Button';
import { Flex } from '../components/Flex';
import { Burger } from '../components/icons/Burger';
import { PageContainer } from '../components/PageContainer';
import { TurnIndicator, TurnIndicatorItem } from '../components/TurnIndicator';
import { useGameState } from '../hooks/useGameState';

// const isAiActive = ({
//   state,
//   aiEntity,
// }: {
//   state: State;
//   aiEntity: Entity;
// }): boolean =>
//   getComponent<AI>({
//     state,
//     name: componentName.ai,
//     entity: aiEntity,
//   })?.active || false;

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
    isActive: game?.currentPlayer === ai.entity,
    name: ai.human ? 'Player' : 'Computer',
  }));
};

export const CustomLevel: React.FC = () => {
  const state = useGameState();
  const aiList = state ? getAiList(state) : [];

  return (
    <PageContainer
      css={{
        gridTemplateRows: '100px 1fr',
        gridTemplateColumns: '1fr 100px',
        flex: 1,
      }}
    >
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
          margin: '0.5rem',
        }}
        onClick={() => {
          emitEvent<GameEvent.CleanSceneEvent>({
            type: GameEvent.Type.cleanScene,
            payload: { newPage: Page.mainMenu },
          });
        }}
      >
        <Burger />
      </Button>
    </PageContainer>
  );
};
