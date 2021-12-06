import { useEffect, useState } from 'react';
import { State } from '../../ecs/type';
import { eventBusOn, eventBusRemove } from '../../utils/eventBus';

export const useGameState = () => {
  const [gameState, setGameState] = useState<State | undefined>(undefined);

  useEffect(() => {
    const callback = (state?: State) => {
      setGameState(state);
    };
    eventBusOn('setUIState', callback);

    return () => {
      eventBusRemove('setUIState', callback);
    };
  }, []);

  return gameState;
};
