import { AI } from '../../type'
import { AIGridPoints } from './../aiSystem/aiGridPoints'
import { DataGrid, dotStats, EnhancedBox } from '../aiSystem'

export const safeGet = (array: any[][], i: number, j: number) =>
  array ? (array[j] ? array[j][i] : undefined) : undefined

export const getAdjactedBoxes = (
  grid3x3: EnhancedBox[][],
): (EnhancedBox | undefined)[] => [
  grid3x3[1][0],
  grid3x3[0][1],
  grid3x3[1][2],
  grid3x3[2][1],
]

export const getDiagonallBoxes = (
  grid3x3: EnhancedBox[][],
): (EnhancedBox | undefined)[] => [
  grid3x3[0][0],
  grid3x3[0][2],
  grid3x3[2][0],
  grid3x3[2][2],
]

export const getGrid3x3 = (
  dataGrid: EnhancedBox[][],
  [i, j]: [number, number],
): EnhancedBox[][] => [
  [
    safeGet(dataGrid, j - 1, i - 1),
    safeGet(dataGrid, j, i - 1),
    safeGet(dataGrid, j + 1, i - 1),
  ],

  [
    safeGet(dataGrid, j - 1, i),
    safeGet(dataGrid, j, i), // playerBox
    safeGet(dataGrid, j + 1, i),
  ],

  [
    safeGet(dataGrid, j - 1, i + 1),
    safeGet(dataGrid, j, i + 1),
    safeGet(dataGrid, j + 1, i + 1),
  ],
]

// b - player box
// a - adjacent
// d - diagonally
// d a d
// a b a
// d a d
type LocalStrategyAdjacted = (params: {
  grid3x3: EnhancedBox[][]
  preferEmptyBoxes: boolean
  currentPlayer: AI
  aIGridPoints: AIGridPoints
}) => number
export const localStrategyAdjacted: LocalStrategyAdjacted = ({
  grid3x3,
  preferEmptyBoxes,
  currentPlayer,
  aIGridPoints,
}) => {
  const currentBox = grid3x3[1][1]
  const adjactedBoxes = getAdjactedBoxes(grid3x3)

  return adjactedBoxes.reduce((acc, adjactedBox) => {
    if (!adjactedBox) {
      return acc + aIGridPoints.adjacted.toBorder
    }

    const boxStats =
      currentBox.dots === adjactedBox.dots
        ? dotStats.equal
        : currentBox.dots > adjactedBox.dots
        ? dotStats.more
        : dotStats.less

    if (
      adjactedBox.player !== currentBox.player &&
      adjactedBox.player !== undefined
    ) {
      if (
        preferEmptyBoxes &&
        currentBox.player === undefined &&
        adjactedBox.player === currentPlayer.entity
      ) {
        // preferEmptyBoxes creates "islands" of boxes with the same color
        // Math.random produces more noise
        return Math.random() > 0.5 ? acc + aIGridPoints.preferEmptyBoxes : acc
      }
      // Adjacted is oponent

      // Player box has more dots, box is safe
      if (boxStats === dotStats.more) {
        const diff = currentBox.dots - adjactedBox.dots
        // AI really don't want to click on this box
        // if (currentBox.dots === 6 && diff > 2) {
        //   return acc - 10;
        // }
        return acc + aIGridPoints.adjacted.playerMoreThanOponent - diff
      }
      // Oponent box has equal dots, last chance to safetly incerase dots
      // Importance of this box depends on how many dots have box
      if (boxStats === dotStats.equal) {
        return (
          acc + aIGridPoints.adjacted.playerEqualToOponent * currentBox.dots
        )
      }
      // Oponent box has more dots, it's not worth to click on this box
      if (boxStats === dotStats.less) {
        const diff = currentBox.dots - adjactedBox.dots - adjactedBox.dots
        return (
          acc + aIGridPoints.adjacted.playerLessThanOponent * Math.abs(diff)
        )
      }
    } else {
      // Adjacted is player

      // Do nothing if near is another player box and current has 6 dots
      if (currentBox.dots === 6) {
        return acc
      }

      // Current box has more dots, do nothing
      if (boxStats === dotStats.more) {
        return acc + aIGridPoints.adjacted.playerMoreThanPlayer
      }

      // Do nothing, just let other checks to decide if it's worth to click, probably it's not worth so add minus points
      if (boxStats === dotStats.equal) {
        if (adjactedBox.dots === 6 && currentBox.dots === 6) {
          return acc + aIGridPoints.adjacted.sixToSix
        }
        return acc + aIGridPoints.adjacted.playerEqualToPlayer
      }
      // Current box has less dots, maybe is protected by adjacted - TODO check it
      if (boxStats === dotStats.less) {
        if (adjactedBox.dots === 6) {
          return acc + aIGridPoints.adjacted.playerLessThanPlayer * 2
        }
        return acc + aIGridPoints.adjacted.playerLessThanPlayer
      }
    }

    return acc
  }, 0)
}

type LocalStrategyDiagonall = (params: {
  grid3x3: EnhancedBox[][]
  preferEmptyBoxes: boolean
  currentPlayer: AI
  aIGridPoints: AIGridPoints
}) => number
export const localStrategyDiagonall: LocalStrategyDiagonall = ({
  grid3x3,
  preferEmptyBoxes,
  currentPlayer,
  aIGridPoints,
}) => {
  const currentBox = grid3x3[1][1]
  const diagonallBoxes = getDiagonallBoxes(grid3x3)

  return diagonallBoxes.reduce((acc, diagonallBox) => {
    if (!diagonallBox) {
      return acc + aIGridPoints.diagonall.toBorder
    }

    const boxStats =
      currentBox.dots === diagonallBox.dots
        ? dotStats.equal
        : currentBox.dots > diagonallBox.dots
        ? dotStats.more
        : dotStats.less

    if (
      diagonallBox.player !== currentBox.player &&
      diagonallBox.player !== undefined
    ) {
      // Adjacted is oponent

      // Player box has more dots, box is safe
      if (boxStats === dotStats.more) {
        // const dotsDiff = currentBox.dots - diagonallBox.dots;
        // if (dotsDiff === 1) {
        //   // diff is low, box will be unsafe soon
        //   return acc + aIGridPoints.diagonall.playerLessThanOponent * 0.5;
        // }
        return acc + aIGridPoints.diagonall.playerMoreThanOponent
      }
      // Oponent box has equal dots, no rush but player should start thinking to incerase dots
      if (boxStats === dotStats.equal) {
        if (diagonallBox.dots === 6) {
          return acc + aIGridPoints.diagonall.playerEqualToOponent * -10
        }
        return acc + aIGridPoints.diagonall.playerEqualToOponent
      }

      // Oponent box has more dots, player box is safe but boxes around are not
      if (boxStats === dotStats.less) {
        if (diagonallBox.dots === 6) {
          return acc + aIGridPoints.diagonall.playerLessThanOponent * 2
        }
        return acc + aIGridPoints.diagonall.playerLessThanOponent
      }
    } else {
      // Adjacted is player

      // Do nothing if near is another player box and current has 6 dots
      if (currentBox.dots === 6) {
        return acc
      }

      // Current box has more dots,
      if (boxStats === dotStats.more) {
        return acc + aIGridPoints.diagonall.playerMoreThanPlayer
      }
      if (boxStats === dotStats.equal) {
        return acc + aIGridPoints.diagonall.playerEqualToPlayer
      }
      // Player box is diagonall to another it might be a good place to set 6 dots
      if (boxStats === dotStats.less) {
        const diff = diagonallBox.dots - currentBox.dots
        return acc + aIGridPoints.diagonall.playerLessThanPlayer + diff ** 2
      }
    }

    return acc
  }, 0)
}

type CalculateLocalStrategy = (params: {
  currentPlayer: AI
  dataGrid: DataGrid
  preferEmptyBoxes: boolean
  aIGridPoints: AIGridPoints
}) => DataGrid
/**
 * Local strategy checks only boxes around player box
 */
export const calculateLocalStrategy: CalculateLocalStrategy = ({
  dataGrid,
  currentPlayer,
  preferEmptyBoxes,
  aIGridPoints,
}) => {
  return dataGrid.reduce((acc1, row, i) => {
    acc1[i] = row.reduce((acc2, box, j) => {
      if (box.player !== currentPlayer.entity && box.player !== undefined) {
        return acc2
      }

      const grid3x3 = getGrid3x3(dataGrid, [i, j])

      const points =
        localStrategyAdjacted({
          grid3x3,
          preferEmptyBoxes,
          currentPlayer,
          aIGridPoints,
        }) +
        localStrategyDiagonall({
          grid3x3,
          preferEmptyBoxes,
          currentPlayer,
          aIGridPoints,
        })

      acc2[j] = { ...box, points: box.points + points }
      return acc2
    }, row)
    return acc1
  }, dataGrid)
}
