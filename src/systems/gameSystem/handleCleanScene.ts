import { EventHandler, removeComponentsByName, setComponent } from '@arekrado/canvas-engine';
import {  Logo, name, Page, State } from '../../type';
import { eventBusDispatch } from '../../utils/eventBus';
import { GameEvent, setGame } from '../gameSystem';
import { logoEntity } from '../logoSystem';

export const handleCleanScene: EventHandler<GameEvent.CleanSceneEvent, State> = ({
  state,
  event,
}) => {
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
  }) as State;
  state = removeComponentsByName({ name: name.box, state });
  state = removeComponentsByName({ name: name.ai, state });
  state = removeComponentsByName({ name: name.marker, state });
  state = removeComponentsByName({ name: name.background, state });
  state = removeComponentsByName({ name: name.logo, state });

  state = setScene({ state, page: event.payload.newPage });

  eventBusDispatch('setUIState', state);

  return state;
};

export const setScene = ({ state, page }: { state: State; page: Page }) => {
  if (page === Page.mainMenu) {
    state = setComponent<Logo, State>({
      state,
      data: {
        entity: logoEntity,
        name: name.logo,
      },
    });
  }

  return state;
};
