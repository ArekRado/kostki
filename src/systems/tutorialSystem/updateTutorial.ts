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

const cleanUpTutorial = ({ state }: { state: State }): State => {
  state = updateComponent<Transform, State>({
    state,
    entity: tutorialEntity,
    name: componentName.transform,
    update: () => ({
      position: [9999, 9999, 9999],
    }),
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

  console.log('boxTransform.position', boxTransform?.position)

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
        tipText: 'Click on dice to increase number of dots and end your turn.',
      })
    } else if (turn === 2) {
      state = cleanUpTutorial({ state })
      state = forceUserToClickOnBox({ state, gridPosition: [1, 2] })
      state = showTip({
        state,
        tipText: 'Click one more time',
      })
    } else if (turn === 4) {
      state = cleanUpTutorial({ state })
      state = forceUserToClickOnBox({ state, gridPosition: [1, 2] })
      state = showTip({
        state,
        tipText:
          'Six dots dices have a special ability. They can capture adjacent dices and increase their dots by one. Notice that a six dots dice resets its dots count to one. Click on your dice to capture red dice',
      })
    } else if (turn === 6) {
      state = cleanUpTutorial({ state })
      state = forceUserToClickOnBox({ state, gridPosition: [2, 2] })
      state = showTip({
        state,
        tipText:
          'Great! Now this dice has blue color and you can click on it',
      })
    } else if (turn === 8) {
      state = cleanUpTutorial({ state })
      state = forceUserToClickOnBox({ state, gridPosition: [2, 2] })
      state = showTip({
        state,
        tipText:
          'Click to capture more dices',
      })
    } else if (turn === 10) {
      state = cleanUpTutorial({ state })
      state = forceUserToClickOnBox({ state, gridPosition: [2, 3] })
      state = showTip({
        state,
        tipText:
          'You will win when you capture all dices',
      })
    } else {
      state = cleanUpTutorial({ state })
    }
  } else if (currentCampaignLevelEntity === campaign1.entity) {
  } else if (currentCampaignLevelEntity === campaign2.entity) {
  } else if (currentCampaignLevelEntity === campaign3.entity) {
  } else {
    state = cleanUpTutorial({ state })
  }

  return state
}
