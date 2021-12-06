import { StateCondition } from 'babylonjs/Actions/condition';
import {
  componentName,
  removeComponentsByName,
  setComponent,
} from '../../ecs/component';
import { EventHandler, Game, Logo, Page, Scene, State } from '../../ecs/type';
import { GameEvent, setGame } from '../gameSystem';
import { logoEntity } from '../logoSystem';

export const handleCleanScene: EventHandler<Game, GameEvent.CleanSceneEvent> =
  ({ state, event }) => {
    // state = setUi({
    //   state,
    //   data: {
    //     type: event.payload.newPage,
    //   },
    //   cleanControls: true,
    // });
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
    state = removeComponentsByName({
      name: componentName.turnIndicator,
      state,
    });
    state = removeComponentsByName({ name: componentName.logo, state });

    setScene({ state, page: event.payload.newPage });

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
