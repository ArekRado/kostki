import { componentName, removeComponentsByName } from '../../ecs/component';
import { EventHandler, Game } from '../../ecs/type';
import { GameEvent, setGame } from '../gameSystem';
import { setUi } from '../uiSystem';

export const handleCleanScene: EventHandler<Game, GameEvent.CleanSceneEvent> =
  ({ state, event }) => {
    state = setUi({
      state,
      data: {
        type: event.payload.newScene,
      },
      cleanControls: true,
    });
    state = setGame({
      state,
      data: {
        round: 0,
        grid: [],
        currentPlayer: '',
        playersQueue: [],
        boxRotationQueue: [],
        gameStarted: false,
      },
    });
    state = removeComponentsByName({ state, name: componentName.box });
    state = removeComponentsByName({ state, name: componentName.ai });
    state = removeComponentsByName({ state, name: componentName.turnIndicator });

    return state;
  };
