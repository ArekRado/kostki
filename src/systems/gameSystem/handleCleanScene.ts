import {
  Camera,
  componentName,
  createComponent,
  EventHandler,
  getComponentsByName,
  removeEntity,
  updateComponent,
} from '@arekrado/canvas-engine'
import { createEntity } from '@arekrado/canvas-engine/entity/createEntity'
import { cameraEntity } from '@arekrado/canvas-engine/system/camera'
import { Logo, gameComponent, Page, State } from '../../type'
import { eventBusDispatch } from '../../utils/eventBus'
import { GameEvent, setGame } from '../gameSystem'
import { logoEntity } from '../logoSystem'

export const removeEntitiesByComponentName = ({
  state,
  name,
}: {
  state: State
  name: string
}) => {
  const components = getComponentsByName({ state, name })

  return components
    ? Object.keys(components).reduce(
        (acc, entity) => removeEntity({ state: acc, entity }),
        state,
      )
    : state
}

export const handleCleanScene: EventHandler<
  GameEvent.CleanSceneEvent,
  State
> = ({ state, event }) => {
  state = setGame({
    state,
    data: {
      page: event.payload.newPage,
      turn: 0,
      grid: [],
      currentPlayer: '',
      playersQueue: [],
      boxRotationQueue: [],
      gameStarted: false,
    },
  })
  state = removeEntitiesByComponentName({ name: gameComponent.box, state })
  state = removeEntitiesByComponentName({ name: gameComponent.ai, state })
  state = removeEntitiesByComponentName({ name: gameComponent.marker, state })
  state = removeEntitiesByComponentName({ name: gameComponent.background, state })
  state = removeEntitiesByComponentName({ name: gameComponent.logo, state })
  state = removeEntitiesByComponentName({ name: gameComponent.tutorial, state })

  state = setScene({ state, page: event.payload.newPage })

  eventBusDispatch('setUIState', state)

  return state
}

export const setScene = ({ state, page }: { state: State; page: Page }) => {
  if (page === Page.mainMenu) {
    state = updateComponent<Camera, State>({
      state,
      entity: cameraEntity,
      name: componentName.camera,
      update: () => ({
        position: [0, 0],
        distance: 5,
      }),
    })

    state = createEntity({ state, entity: logoEntity })
    state = createComponent<Logo, State>({
      state,
      data: {
        entity: logoEntity,
        name: gameComponent.logo,
      },
    })
  }

  return state
}
