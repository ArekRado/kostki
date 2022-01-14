import { useEffect, useState } from 'react';
import { State } from '../../type';
import { eventBusOn, eventBusRemove } from '../../utils/eventBus';

let stateCache: State | undefined = undefined;

export const useGameState = () => {
  const [gameState, setGameState] = useState<State | undefined>(undefined);

  useEffect(() => {
    const callback = (state?: State) => {
      if (state) {
        stateCache = state;
        setGameState(state);
      }
    };
    eventBusOn('setUIState', callback);

    return () => {
      eventBusRemove('setUIState', callback);
    };
  }, []);

  return gameState || stateCache;
};
