import React from 'react';
import { Color } from '../../ecs/type';
import { Typography } from '../components/Typography';
import { Flex } from './Flex';

export type TurnIndicatorItem = {
  entity: string;
  color: Color;
  human: boolean;
  hasCurrentTurn: boolean;
  name: string;
  active: boolean;
};

export const TurnIndicator: React.FC<{ ai: TurnIndicatorItem[] }> = ({
  ai,
}) => {
  return (
    <Flex
      css={{
        flexDirection: 'column',
      }}
    >
      {ai.map(({ entity, name, color, hasCurrentTurn, active }) => (
        <Flex
          key={entity}
          css={{
            alignItems: 'center',
            padding: '0.125rem',
            paddingRight: '1rem',
            backgroundColor: hasCurrentTurn ? 'rgba(255,255,255,0.6)' : '',
          }}
        >
          <Flex
            css={{
              position: 'relative',
              width: '0.5rem',
              height: '0.5rem',
              border: '0.125rem solid black',
              '@bp1': {
                width: '2rem',
                height: '2rem',
                border: '0.25rem solid black',
              },
              marginRight: '0.5rem',

              backgroundColor: `rgb(${color[0] * 255}, ${color[1] * 255}, ${
                color[2] * 255
              })`,
            }}
          />
          <Typography
            css={{
              fontSize: '0.75rem',
              textDecoration: active ? '' : 'line-through',
              '@bp1': { fontSize: '1.5rem' },
            }}
          >
            {name}
          </Typography>
        </Flex>
      ))}
    </Flex>
  );
};
