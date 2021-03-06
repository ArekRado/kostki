import { humanPlayerEntity } from '.'
import { AIDifficulty, aiSystem } from './systems/aiSystem'
import { boxSystem } from './systems/boxSystem'
import { gameEntity, gameSystem } from './systems/gameSystem'
import { markerSystem } from './systems/markerSystem'
import { logoSystem } from './systems/logoSystem'
import { setScene } from './systems/gameSystem/handleCleanScene'
import { tutorialSystem } from './systems/tutorialSystem'
import { getSavedData } from './utils/localDb'
import { AI, Game, GameMap, gameComponent, Page, State } from './type'
import {
  addEventHandler,
  Camera,
  componentName,
  createComponent,
  getComponentsByName,
  getState as getCanvaasEngineState,
  createEntity,
} from '@arekrado/canvas-engine'
import { cameraEntity } from '@arekrado/canvas-engine/system/camera/camera'
import { getCameraSize } from './systems/cameraSystem/getCameraSize'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Texture } from '@babylonjs/core/Materials/Textures/texture'
import { Color3 } from '@babylonjs/core/Maths/math.color'
import { eventHandler } from './eventSystem'
import { loadAndMountDevtools } from './utils/handleEnableDevtools'
import { gameMapsBlueprint } from './blueprints/mapsBlueprint'

type GetCanvaasEngineStateParams = Parameters<typeof getCanvaasEngineState>['0']

export const getState = ({
  scene,
  camera,
  Vector3,
}: {
  scene?: GetCanvaasEngineStateParams['scene']
  camera?: GetCanvaasEngineStateParams['camera']
  Vector3?: GetCanvaasEngineStateParams['Vector3']
}): State => {
  let state = getCanvaasEngineState<State>({
    scene,
    camera,
    Vector3,
    StandardMaterial,
    MeshBuilder,
    Texture,
    Color3,
  }) as State

  const version = '0.0.26'

  addEventHandler(eventHandler)

  // Systems
  state = boxSystem(state)
  state = aiSystem(state)
  state = gameSystem(state)
  state = markerSystem(state)
  state = logoSystem(state)
  state = tutorialSystem(state)

  state = createEntity({ state, entity: humanPlayerEntity })
  state = createComponent<AI, State>({
    state,
    data: {
      entity: humanPlayerEntity,
      name: gameComponent.ai,
      human: true,
      level: AIDifficulty.hard,
      color: [0, 0, 1],
      textureSet: ['', '', '', '', '', '', ''],
      active: true,
    },
  })

  const savedData = getSavedData()

  state = gameMapsBlueprint({ state, savedData })

  const maps = Object.values(
    getComponentsByName<GameMap>({ state, name: gameComponent.gameMap }) ?? {},
  )
  const firstMapEntity = maps.find(
    ({ campaignNumber }) => campaignNumber === -1,
  )?.entity

  state = createEntity({ state, entity: gameEntity })
  state = createComponent<Game, State>({
    state,
    data: {
      version,
      page: Page.mainMenu,
      lastBoxClickTimestamp: 0,
      entity: gameEntity,
      name: gameComponent.game,
      moves: 0,
      grid: [],
      turn: 0,
      currentCampaignLevelEntity: '',
      currentPlayer: humanPlayerEntity,
      gameStarted: false,
      playersQueue: [],
      boxRotationQueue: [],
      colorBlindMode: savedData.colorBlindMode,
      statistics: [],
      customLevelSettings: {
        players: savedData.players,
        difficulty: savedData.difficulty,
        quickStart: savedData.quickStart,
        mapEntity: savedData.mapEntity || firstMapEntity || '',
      },
    },
  })

  if (scene) {
    state = createComponent<Camera, State>({
      state,
      data: {
        entity: cameraEntity,
        name: componentName.camera,
        position: [0, 0],
        distance: 5,
        ...getCameraSize(5, scene),
      },
    })
  }

  state = setScene({ state, page: Page.mainMenu })

  if (process.env.NODE_ENV === 'development') {
    loadAndMountDevtools()
  }

  return state
}
