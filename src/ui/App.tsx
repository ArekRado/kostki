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
import { CampaignLevel } from './pages/CampaignLevel'
import { createRoot } from 'react-dom/client'

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
    case Page.campaignLevel:
      return <CampaignLevel />
    case Page.customLevelSettings:
      return <CustomLevelSettings />
    case Page.customLevel:
      return <CustomLevel />

    case undefined:
      return null
  }
}

export const mountGameUI = ({ state }: { state: State }) => {
  const container = document.getElementById('gameUi')
  if (container) {
    const root = createRoot(container)
    root.render(
      <React.StrictMode>
        <App state={state} />
      </React.StrictMode>,
    )
  }
}
