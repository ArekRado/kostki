import React from 'react';
import { AI } from '../../ecs/type';
import { Typography } from '../components/Typography';
import { Flex } from './Flex';

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

export const TurnIndicator: React.FC<{ ai: AI[] }> = ({ ai }) => {
  //     removeState();
  //     emitEvent<GameEvent.CleanSceneEvent>({
  //       type: GameEvent.Type.cleanScene,
  //       payload: { newScene: GameScene.mainMenu },
  //     });

  return (
    <Flex
      css={{
        gridTemplateRows: '100px 1fr',
        gridTemplateColumns: '1fr 100px',
        flex: 1,
      }}
    >
      {ai.map(({ entity }) => (
        <Typography key={entity}>{entity}</Typography>
      ))}
    </Flex>
  );
};
