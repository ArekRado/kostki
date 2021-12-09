import React from 'react';
import { Page, State } from '../../ecs/type';
import { emitEvent } from '../../eventSystem';
import { GameEvent } from '../../systems/gameSystem';
import { Button } from '../components/Button';
import { Flex } from '../components/Flex';
import { PageContainer } from '../components/PageContainer';
import { Typography } from '../components/Typography';

export const Main: React.FC = () => {
  return (
    <PageContainer
      css={{
        gridTemplateRows: '20% 70% 10%',
        gridTemplateColumns: '20% 60% 20%',
        flex: 1,
      }}
    >
      <Flex
        css={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems:'center',
          gridRow: '2 / 2',
          gridColumn: '2 / 3',
        }}
      >
        <Button
          css={{ maxWidth: '500px', width:'100%' }}
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
          css={{ marginTop: '100px', maxWidth: '500px', width:'100%' }}
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

      <Typography
        css={{
          flexDirection: 'column',
          justifyContent: 'center',
          gridRow: '3 / 4',
          gridColumn: '3 / 3',
        }}
      >
        0.0.2
      </Typography>
    </PageContainer>
  );
};
