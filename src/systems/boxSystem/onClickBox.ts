import { AI, Box, gameComponent, State } from '../../type'
import { createRotationBoxAnimation } from './createRotationBoxAnimation'
import { getTextureSet } from './getTextureSet'
import { pushBoxToRotationQueue } from './pushBoxToRotationQueue'
import { updateComponent } from '@arekrado/canvas-engine'

export const getNextDots = (dots: number): number => (dots === 6 ? 1 : dots + 1)

type OnClickBox = (params: { state: State; ai: AI; box: Box }) => State
export const onClickBox: OnClickBox = ({ state, ai, box }) => {
  const { entity } = box

  const dots = getNextDots(box.dots)

  if (process.env.NODE_ENV !== 'test') {
    state = createRotationBoxAnimation({
      state,
      boxUniqueId: entity,
      texture: getTextureSet({ state, ai })[dots],
      color: ai.color,
      nextTurn: true,
      shouldExplode: box.dots === 6,
    })
  }

  state = pushBoxToRotationQueue({ entity, state })

  state = updateComponent<Box, State>({
    state,
    name: gameComponent.box,
    entity,
    update: () => ({
      isAnimating: true,
      player: ai?.entity || '',
      dots,
    }),
  })

  return state
}
