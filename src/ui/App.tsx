import ReactDOM from 'react-dom';
import React, { FC } from 'react';
import { Main } from './pages/Main';
import { useOutline } from './hooks/useOutline';
import { Page, State } from '../ecs/type';
import { getGame } from '../systems/gameSystem';
import { useGameState } from './hooks/useGameState';
import { CustomLevelSettings } from './pages/CustomLevelSettings';
import { CustomLevel } from './pages/CustomLevel';

const App: FC<{ state: State }> = ({ state }) => {
  useOutline();

  const gameState = useGameState();
  const page = getGame({ state: gameState || state })?.page;

  switch (page) {
    case Page.mainMenu:
      return <Main state={state} />;
    case Page.customLevelSettings:
      return <CustomLevelSettings state={state} />;
    case Page.customLevel:
      return <CustomLevel state={state} />;

    case undefined:
      return null;
  }
};

export const mountGameUI = ({ state }: { state: State }) =>
  ReactDOM.render(
    <React.StrictMode>
      <App state={state} />
    </React.StrictMode>,
    document.getElementById('gameUi')
  );
