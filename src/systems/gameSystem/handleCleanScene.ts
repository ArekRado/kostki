import { StateCondition } from 'babylonjs/Actions/condition';
import {
  componentName,
  removeComponentsByName,
  setComponent,
} from '../../ecs/component';
import { EventHandler, Game, Logo, Scene, State } from '../../ecs/type';
import { GameEvent, setGame } from '../gameSystem';
import { logoEntity } from '../logoSystem';
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
    state = removeComponentsByName({
      name: componentName.turnIndicator,
      state,
    });
    state = removeComponentsByName({ name: componentName.logo, state });

    setScene({ state, scene: event.payload.newScene });

    return state;
  };

export const setScene = ({ state, scene }: { state: State; scene: Scene }) => {
  if (scene === Scene.mainMenu) {
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
