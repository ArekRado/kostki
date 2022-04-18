import { getComponent } from '@arekrado/canvas-engine'
import { Box, Game, gameComponent, State } from '../../type'
import { TurnIndicatorItem } from '../components/TurnIndicator'

export enum GameStatus {
  playerWon = 'playerWon',
  playerLost = 'playerLost',
  gameInProgress = 'gameInProgress',
}

export const getGameStatus = ({
  aiList,
  game,
  state,
}: {
  state: State
  game: Game
  aiList: TurnIndicatorItem[]
}): GameStatus => {
  if (game.gameStarted === true) {
    return GameStatus.gameInProgress
  }

  const humanAi = aiList.find((ai) => ai.human)
  const amountOfCapturedBoxes = game.grid.reduce((acc, boxEntity) => {
    const box = getComponent<Box>({
      state,
      name: gameComponent.box,
      entity: boxEntity,
    })

    return box?.player === humanAi?.entity ? acc + 1 : acc
  }, 0)

  if (amountOfCapturedBoxes === 0) return GameStatus.playerLost
  if (amountOfCapturedBoxes === game.grid.length) return GameStatus.playerWon

  return GameStatus.gameInProgress
}
