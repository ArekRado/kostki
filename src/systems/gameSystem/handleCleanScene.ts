import {
  componentName,
  removeComponentsByName,
  setComponent,
} from '../../ecs/component';
import { EventHandler, Game, Logo, Page, State } from '../../ecs/type';
import { eventBusDispatch } from '../../utils/eventBus';
import { GameEvent, setGame } from '../gameSystem';
import { logoEntity } from '../logoSystem';

export const handleCleanScene: EventHandler<Game, GameEvent.CleanSceneEvent> =
  ({ state, event }) => {
    state = setGame({
      state,
      data: {
        page: event.payload.newPage,
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
    state = removeComponentsByName({ name: componentName.logo, state });

    state = setScene({ state, page: event.payload.newPage });
    
    eventBusDispatch('setUIState', state);

    return state;
  };

export const setScene = ({ state, page }: { state: State; page: Page }) => {
  if (page === Page.mainMenu) {
    state = setComponent<Logo>({
      state,
      data: {
        entity: logoEntity,
        name: componentName.logo,
      },
    });
  }

  return state;
};
