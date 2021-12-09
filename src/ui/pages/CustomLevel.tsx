import React from 'react';
import { Page } from '../../ecs/type';
import { emitEvent } from '../../eventSystem';
import { GameEvent } from '../../systems/gameSystem';
import { Button } from '../components/Button';
import { Burger } from '../components/icons/Burger';
import { PageContainer } from '../components/PageContainer';
import { TurnIndicator } from '../components/TurnIndicator';

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

export const CustomLevel: React.FC = () => {
  //     removeState();
  //     emitEvent<GameEvent.CleanSceneEvent>({
  //       type: GameEvent.Type.cleanScene,
  //       payload: { newScene: GameScene.mainMenu },
  //     });

  return (
    <PageContainer
      css={{
        gridTemplateRows: '100px 1fr',
        gridTemplateColumns: '1fr 100px',
        flex: 1,
      }}
    >
      <TurnIndicator ai={[]} />
      <Button
        css={{
          gridRow: '1 / 1',
          gridColumn: '2 / 2',
          display: 'flex',
          alignContent: 'center',
          alignItems: 'center',
          margin: '0.5rem'
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
