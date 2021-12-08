import React from 'react';
import { Page, State } from '../../ecs/type';
import { emitEvent } from '../../eventSystem';
import { GameEvent } from '../../systems/gameSystem';
import { Button } from '../components/Button';
import { Flex } from '../components/Flex';
import { PageContainer } from '../components/PageContainer';
import { Text } from '../components/Text';

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
        gridTemplateRows: '200px 1fr 100px',
        gridTemplateColumns: '1fr 300px 1fr',
        flex: 1,
      }}
    >
      {/* <Flex
        css={{
          flexDirection: 'column',
          justifyContent: 'center',
          gridRow: '2 / 2',
          gridColumn: '2 / 3',
        }}
      >
        <Button
          onClick={() => {
            emitEvent<GameEvent.CleanSceneEvent>({
              type: GameEvent.Type.cleanScene,
              payload: {
                newPage: Page.customLevelSettings,
              },
            });
          }}
        >
          Start
        </Button>
        <Button
          css={{ marginTop: '100px' }}
          onClick={() => {
            emitEvent<GameEvent.CleanSceneEvent>({
              type: GameEvent.Type.cleanScene,
              payload: {
                newPage: Page.customLevelSettings,
              },
            });
          }}
        >
          Custom Level
        </Button>
      </Flex>

      <Text
        css={{
          flexDirection: 'column',
          justifyContent: 'center',
          gridRow: '3 / 4',
          gridColumn: '3 / 3',
        }}
      >
        0.0.2
      </Text> */}
    </PageContainer>
  );
};
