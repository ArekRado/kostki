import ReactDOM from 'react-dom'
import React, { FC } from 'react'
import { Main } from './pages/Main'
import { useOutline } from './hooks/useOutline'
import { Page, State } from '../type'
import { getGame } from '../systems/gameSystem'
import { useGameState } from './hooks/useGameState'
import { CustomLevelSettings } from './pages/CustomLevelSettings/CustomLevelSettings'
import { CustomLevel } from './pages/CustomLevel'
import { globalCss } from '@stitches/react'
import { CampaignLevelSelect } from './pages/CampaignLevelSelect'

const globalStyles = globalCss({
  '*': {
    fontFamily: 'Sans-serif',
    userSelect: 'none',
  },

  '.enable-outline *:focus': {
    outlineWidth: '10px',
    outlineStyle: 'solid',
    outlineColor: '$outline',
  },
})

const App: FC<{ state: State }> = ({ state }) => {
  useOutline()
  globalStyles()

  const gameState = useGameState()
  const page = getGame({ state: gameState || state })?.page

  switch (page) {
    case Page.mainMenu:
      return <Main />
    case Page.campaignLevelSelect:
      return <CampaignLevelSelect />
    case Page.customLevelSettings:
      return <CustomLevelSettings />
    case Page.customLevel:
      return <CustomLevel />

    case undefined:
      return null
  }
}

export const mountGameUI = ({ state }: { state: State }) => {
  ReactDOM.render(
    <React.StrictMode>
      <App state={state} />
    </React.StrictMode>,
    document.getElementById('gameUi'),
  )
}
