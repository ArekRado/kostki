import {
  componentName,
  getComponent,
  getComponentsByName,
  Transform,
} from '@arekrado/canvas-engine'
import { updateComponent } from '@arekrado/canvas-engine'
import { equals } from '@arekrado/vector-2d'
import { Box, gameComponent, State, Tutorial } from '../../type'
import { getGame } from '../gameSystem'
import { tutorialEntity } from '../tutorialSystem'

import { campaign0 } from '../../blueprints/maps/campaign0'
import { campaign1 } from '../../blueprints/maps/campaign1'
import { campaign2 } from '../../blueprints/maps/campaign2'
import { campaign3 } from '../../blueprints/maps/campaign3'
import { eventBusDispatch } from '../../utils/eventBus'
import { boxSize } from '../boxSystem/boxSizes'

const blockClickingOnBoxes = ({
  state,
  gridPosition,
  isPickable = false,
}: {
  state: State
  gridPosition: Box['gridPosition']
  isPickable?: boolean
}): State => {
  const sceneRef = state.babylonjs.sceneRef
  if (!sceneRef) {
    return state
  }

  const boxes = Object.values(
    getComponentsByName<Box>({ state, name: gameComponent.box }) ?? {},
  )
  const clickableBox = boxes.find((box) =>
    equals(box.gridPosition, gridPosition),
  )

  boxes.forEach((box) => {
    const boxMesh = sceneRef.getTransformNodeByUniqueId(parseInt(box.entity))

    if (clickableBox?.entity === box.entity) {
      return
    }

    if (boxMesh) {
      boxMesh.getChildren().forEach((plane) => {
        const mesh = sceneRef.getMeshByUniqueId(plane.uniqueId)
        if (mesh) {
          mesh.isPickable = isPickable
        }
      })
    }
  })

  return state
}

const cleanUpTutorial = ({ state }: { state: State }): State => {
  state = updateComponent<Transform, State>({
    state,
    entity: tutorialEntity,
    name: componentName.transform,
    update: () => ({
      position: [9999, 9999, 9999],
    }),
  })

  state = blockClickingOnBoxes({
    state,
    gridPosition: [-1, -1],
    isPickable: true,
  })

  return showTip({ state, tipText: null })
}

const showTip = ({
  state,
  tipText,
}: {
  state: State
  tipText: Tutorial['tipText']
}): State => {
  state = updateComponent<Tutorial, State>({
    state,
    entity: tutorialEntity,
    name: gameComponent.tutorial,
    update: () => ({
      tipText,
    }),
  })
  eventBusDispatch('setUIState', state)

  return state
}

const forceUserToClickOnBox = ({
  state,
  gridPosition,
}: {
  state: State
  gridPosition: Box['gridPosition']
}): State => {
  const boxes = getComponentsByName<Box>({ state, name: gameComponent.box })
  const box = Object.values(boxes ?? {}).find((box) =>
    equals(box.gridPosition, gridPosition),
  )
  const boxTransform = getComponent<Transform>({
    state,
    name: componentName.transform,
    entity: box?.entity || '',
  })

  state = updateComponent<Transform, State>({
    state,
    entity: tutorialEntity,
    name: componentName.transform,
    update: () => ({
      position: boxTransform?.position
        ? [
            boxTransform.position[0] + boxSize / 4,
            boxTransform.position[1] - boxSize / 1.5,
            (boxTransform.position[2] ?? 0) - 1,
          ]
        : undefined,
    }),
  })
  eventBusDispatch('setUIState', state)

  blockClickingOnBoxes({ state, gridPosition, isPickable: false })

  return state
}

export const updateTutorial = ({ state }: { state: State }) => {
  const tutorial = getComponent<Tutorial>({
    state,
    entity: tutorialEntity,
    name: gameComponent.tutorial,
  })

  const game = getGame({ state })

  if (!tutorial || !game) {
    return state
  }

  const { turn, currentCampaignLevelEntity } = game

  if (currentCampaignLevelEntity === campaign0.entity) {
    if (turn === 0) {
      state = forceUserToClickOnBox({ state, gridPosition: [1, 2] })
      state = showTip({
        state,
        tipText: 'Tap on dice to increase number of dots and end your turn.',
      })
    } else if (turn === 2) {
      state = cleanUpTutorial({ state })
      state = forceUserToClickOnBox({ state, gridPosition: [1, 2] })
      state = showTip({
        state,
        tipText: 'Tap one more time',
      })
    } else if (turn === 4) {
      state = cleanUpTutorial({ state })
      state = forceUserToClickOnBox({ state, gridPosition: [1, 2] })
      state = showTip({
        state,
        tipText:
          'Six dot dices have a special ability. They can capture adjacent dices and increase their dots by one. Notice that a six dot dice resets its dots count to one. Tap on your dice to capture red dice',
      })
    } else if (turn === 6) {
      state = cleanUpTutorial({ state })
      state = forceUserToClickOnBox({ state, gridPosition: [2, 2] })
      state = showTip({
        state,
        tipText: 'Great! Now this dice has blue color and you can tap on it',
      })
    } else if (turn === 8) {
      state = cleanUpTutorial({ state })
      state = forceUserToClickOnBox({ state, gridPosition: [2, 2] })
      state = showTip({
        state,
        tipText: 'Tap to capture more dices',
      })
    } else if (turn === 10) {
      state = cleanUpTutorial({ state })
      state = forceUserToClickOnBox({ state, gridPosition: [2, 3] })
      state = showTip({
        state,
        tipText: 'You will win when you capture all dices',
      })
    } else if (turn === 12) {
      state = cleanUpTutorial({ state })
      state = forceUserToClickOnBox({ state, gridPosition: [2, 3] })
      state = showTip({
        state,
        tipText: 'Tap last time to capture last dice and finish this level',
      })
    } else {
      state = cleanUpTutorial({ state })
    }
  } else if (currentCampaignLevelEntity === campaign1.entity) {
    if (turn === 0) {
      state = cleanUpTutorial({ state })
      state = forceUserToClickOnBox({ state, gridPosition: [1, 2] })
      state = showTip({
        state,
        tipText:
          'Six dot dices can trigger another six dot dices. This is the best way to quickly capture a lot of dices',
      })
    } else {
      state = cleanUpTutorial({ state })
    }
  } else if (currentCampaignLevelEntity === campaign2.entity) {
    if (turn === 0) {
      state = cleanUpTutorial({ state })
      state = forceUserToClickOnBox({ state, gridPosition: [1, 1] })
      state = showTip({
        state,
        tipText:
          'Some combinations of five and six dots dices may lead to surprising results',
      })
    } else if (turn === 2) {
      state = cleanUpTutorial({ state })
      state = showTip({
        state,
        tipText:
          "Now you know the basics. Try to capture last dice by yourself. You don't have to hurry, there is no move limit",
      })
    } else {
      state = cleanUpTutorial({ state })
    }
  } else if (currentCampaignLevelEntity === campaign3.entity) {
    if (turn === 0) {
      state = cleanUpTutorial({ state })
      state = forceUserToClickOnBox({ state, gridPosition: [1, 2] })
      state = showTip({
        state,
        tipText: 'White dices can be captured by tapping on them',
      })
    } else if (turn === 2) {
      state = cleanUpTutorial({ state })
      state = showTip({
        state,
        tipText:
          'This time the opponent will try to defend himself. Try not to lose, good luck!',
      })
    } else {
      state = cleanUpTutorial({ state })
    }
  } else {
    state = cleanUpTutorial({ state })
  }

  return state
}
