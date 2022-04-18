import { Component, getComponent } from '@arekrado/canvas-engine'
import { AIDifficulty } from '../../systems/aiSystem'
import { getGame } from '../../systems/gameSystem'
import { AI, gameComponent, State } from '../../type'
import { TurnIndicatorItem } from '../components/TurnIndicator'

export const getAiList = (state: State): TurnIndicatorItem[] => {
  const game = getGame({ state })

  const aiList = game?.playersQueue
    .map((entity) =>
      getComponent<AI>({
        state,
        name: gameComponent.ai,
        entity,
      }),
    )
    .filter((ai) => !!ai) as Component<AI>[]

  return aiList.map((ai) => {
    let name = ''

    if (ai.human) {
      name = 'You'
    } else {
      switch (ai.level) {
        case AIDifficulty.disabled:
          name = 'Enemy'
          break
        case AIDifficulty.easy:
          name = 'Enemy easy'
          break
        case AIDifficulty.medium:
          name = 'Enemy medium'
          break
        case AIDifficulty.hard:
          name = 'Enemy hard'
          break
        case AIDifficulty.random:
          name = 'Enemy random'
          break
      }
    }

    return {
      entity: ai.entity,
      color: ai.color,
      active: ai.active,
      human: ai.human,
      hasCurrentTurn: game?.currentPlayer === ai.entity,
      name,
    }
  })
}
