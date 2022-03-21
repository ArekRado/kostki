import {
  createComponent,
  EventHandler,
  getComponentsByName,
  removeEntity,
  setEntity,
} from '@arekrado/canvas-engine';
import { Logo, name, Page, State } from '../../type';
import { eventBusDispatch } from '../../utils/eventBus';
import { GameEvent, setGame } from '../gameSystem';
import { logoEntity } from '../logoSystem';

export const removeEntitiesByComponentName = ({
  state,
  name,
}: {
  state: State;
  name: string;
}) => {
  const components = getComponentsByName({ state, name });

  return components
    ? Object.keys(components).reduce(
        (acc, entity) => removeEntity({ state: acc, entity }),
        state
      )
    : state;
};

export const handleCleanScene: EventHandler<GameEvent.CleanSceneEvent, State> =
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
    }) as State;
    state = removeEntitiesByComponentName({ name: name.box, state });
    state = removeEntitiesByComponentName({ name: name.ai, state });
    state = removeEntitiesByComponentName({ name: name.marker, state });
    state = removeEntitiesByComponentName({ name: name.background, state });
    state = removeEntitiesByComponentName({ name: name.logo, state });

    state = setScene({ state, page: event.payload.newPage });

    eventBusDispatch('setUIState', state);

    return state;
  };

export const setScene = ({ state, page }: { state: State; page: Page }) => {
  if (page === Page.mainMenu) {
    state = setEntity({ state, entity: logoEntity });
    state = createComponent<Logo, State>({
      state,
      data: {
        entity: logoEntity,
        name: name.logo,
      },
    });
  }

  return state;
};
