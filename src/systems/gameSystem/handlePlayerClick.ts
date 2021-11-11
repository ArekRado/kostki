import { boxWithGap } from '../../blueprints/gridBlueprint';
import { componentName, getComponent } from '../../ecs/component';
import { AI, Box, EventHandler, Game } from '../../ecs/type';
import { onClickBox } from '../boxSystem/onClickBox';
import { GameEvent, getGame } from '../gameSystem';
import { setMarker } from '../markerSystem';

export const handlePlayerClick: EventHandler<Game, GameEvent.PlayerClickEvent> =
  ({ state, event }) => {
    const game = getGame({ state });
    if (!game) {
      return state;
    }
    const { currentPlayer, gameStarted, boxRotationQueue } = game;

    const box = getComponent<Box>({
      state,
      name: componentName.box,
      entity: event.payload.boxEntity,
    });

    const canClickOnBox =
      box?.player === undefined || box?.player === currentPlayer;

    if (gameStarted && boxRotationQueue.length === 0 && canClickOnBox) {
      const ai = getComponent<AI>({
        name: componentName.ai,
        state,
        entity: currentPlayer,
      });

      if (box && ai?.human) {
        state = setMarker({
          state,
          data: {
            color: ai.color,
            position: [
              box.gridPosition[0] * boxWithGap,
              box.gridPosition[1] * boxWithGap,
            ],
          },
        });
        state = onClickBox({ box, state, ai });
      }
    }

    return state;
  };
