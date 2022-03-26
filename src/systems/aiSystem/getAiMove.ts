import { AI, Box, State } from '../../type'
import { AIDifficulty } from '../aiSystem'
import { advancedAttackAdjacted } from './advancedAttackAdjacted'
import {
  easyAIGridPoints,
  hardAIGridPoints,
  mediumAIGridPoints,
} from './aiGridPoints'
import { calculateLocalStrategy } from './calculateLocalStrategy'
import { disabledAIMove } from './disabledAIMove'
import { getBestRandomBox } from './getBestRandomBox'
import { getDataGrid } from './getDataGrid'
import { getMovesForEmptyBoxes } from './getMovesForEmptyBoxes'
import { randomizeGrid } from './randomizeGrid'

type GetAiMove = (params: {
  state: State
  ai: AI
  preferEmptyBoxes?: boolean
}) => Box | undefined
export const getAiMove: GetAiMove = ({ state, ai, preferEmptyBoxes }) => {
  const currentPlayer = ai.entity
  const aIGridPoints = {
    [AIDifficulty.disabled]: easyAIGridPoints,
    [AIDifficulty.random]: easyAIGridPoints,

    [AIDifficulty.easy]: easyAIGridPoints,
    [AIDifficulty.medium]: mediumAIGridPoints,
    [AIDifficulty.hard]: hardAIGridPoints,
  }[ai.level]

  let dataGrid = getDataGrid({ state })

  dataGrid = getMovesForEmptyBoxes({
    dataGrid,
    aIGridPoints,
  })
  dataGrid = calculateLocalStrategy({
    currentPlayer: ai,
    dataGrid,
    preferEmptyBoxes: !!preferEmptyBoxes,
    aIGridPoints,
  })

  if (!preferEmptyBoxes) {
    switch (ai.level) {
      case AIDifficulty.disabled:
        dataGrid = disabledAIMove({ dataGrid })
        break
      case AIDifficulty.random:
        // Every box is clicked by random
        dataGrid = randomizeGrid({ dataGrid, currentPlayer })
        break
      case AIDifficulty.hard:
        dataGrid = advancedAttackAdjacted({ dataGrid, currentPlayer })
        // Todo
        // If has no good moves then tries to waste moves
        // Detect patterns:
        // wip - should prefer to attack when 6 dots can safetly capture 3,4,5 dots
        // - should be able to do combo strikes so can double click on 5 dots box
        // dataGrid = randomizeGrid({ dataGrid, currentPlayer });
        break

      default:
        break
    }
  }

  const bestRandomBox = getBestRandomBox({ currentPlayer, dataGrid })
  // console.log(
  //   JSON.stringify(
  //     dataGrid.map((x) =>
  //       x.map(({ points, player, dots }) => ({ dots, points, player }))
  //     )
  //   )
  // );

  // console.log(dataGrid);
  // console.log(JSON.stringify(dataGrid));

  return bestRandomBox
}
