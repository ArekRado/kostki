import 'regenerator-runtime/runtime';
import { scene, camera } from '..';
import { BasicBox, createGrid } from '../blueprints/createGrid';
import { createPlayers } from '../blueprints/createPlayers';
import { componentName, setComponent } from '../ecs/component';
import { emitEvent } from '../ecs/emitEvent';
import { runOneFrame } from '../ecs/runOneFrame';
import { AI, Entity, Game } from '../ecs/type';
import {
  calculateLocalStrategy,
  getBestRandomBox,
  getDataGrid,
  getMovesForEmptyBoxes,
  localStrategyAdjacted,
  localStrategyDiagonall,
  pointsFor,
} from '../systems/aiSystem';
import { boxEvents } from '../systems/boxSystem';
import { gameEvents, getGame } from '../systems/gameSystem';
import {
  getGameInitialState,
  humanPlayerEntity,
} from '../utils/getGameInitialState';

const player2 = 'player2';

const basicAI = (entity: Entity): AI => ({
  entity,
  name: componentName.ai,
  human: false,
  level: 1,
  color: [0, 0, 1],
  textureSet: ['', '', '', '', '', '', ''],
});

const basicBox: BasicBox = {
  player: undefined,
  dots: 0,
};

const basicGrid2x2 = [
  [basicBox, basicBox, basicBox],
  [basicBox, basicBox, basicBox],
  [basicBox, basicBox, basicBox],
];

describe('game', () => {
  it('clicking on 6 dots box should expand player color', () => {
    let state = createGrid({
      dataGrid: basicGrid2x2,
      scene,
      camera,
      state: getGameInitialState(),
    });

    const game = getGame({ state });
    if (!game) {
      return;
    }

    const ai = basicAI('1');
    state = createPlayers({ state, ai: [ai] });

    const middleBoxEntity = getDataGrid({ state })[1][1].entity;

    expect(getDataGrid({ state })[1][1].dots).toBe(0);

    // click on a box until has less than 6 dots
    [1, 2, 3, 4, 5, 6].forEach((x) => {
      emitEvent({
        type: boxEvents.onClick,
        entity: middleBoxEntity,
        payload: { ai },
      });

      state = runOneFrame({ state });
      state = runOneFrame({ state });

      expect(getDataGrid({ state })[1][1].dots).toBe(x);
    });

    // Other boxes should be untouched
    getDataGrid({ state })
      .flat()
      .forEach((box) => {
        if (box.entity !== middleBoxEntity) {
          expect(box.dots).toBe(0);
          expect(box.player).toBeUndefined();
        }
      });
  });
});
