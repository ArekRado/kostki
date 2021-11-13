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
    state = removeComponentsByName({ name: componentName.box, state });
    state = removeComponentsByName({ name: componentName.ai, state });
    state = removeComponentsByName({ name: componentName.marker, state });
    state = removeComponentsByName({ name: componentName.background, state });
    state = removeComponentsByName({ name: componentName.turnIndicator, state });
    state = removeComponentsByName({ name: componentName.logo, state });

    return state;
  };
