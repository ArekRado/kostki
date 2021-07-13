import 'regenerator-runtime/runtime';
import { scene, camera } from '..';
import { BasicBox, createGrid } from '../blueprints/createGrid';
import { createPlayers } from '../blueprints/createPlayers';
import { componentName, setComponent } from '../ecs/component';
import { emitEvent } from '../ecs/emitEvent';
import { runOneFrame } from '../ecs/runOneFrame';
import { AI, Entity, Game } from '../ecs/type';
import { getDataGrid } from '../systems/aiSystem';
import { BoxEvent } from '../systems/boxSystem';
import { getGame } from '../systems/gameSystem';
import { getGameInitialState } from '../utils/getGameInitialState';

const player2 = 'player2';

const basicAI = (entity: Entity): AI => ({
  entity,
  name: componentName.ai,
  human: false,
  level: 1,
  color: [0, 0, 1],
  textureSet: ['', '', '', '', '', '', ''],
  active: true,
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
      emitEvent<BoxEvent.OnClickEvent>({
        type: BoxEvent.Type.onClick,
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

    // "explode"
    emitEvent<BoxEvent.OnClickEvent>({
      type: BoxEvent.Type.onClick,
      entity: middleBoxEntity,
      payload: { ai },
    });
    state = runOneFrame({ state });
    state = runOneFrame({ state });
    state = runOneFrame({ state });
    state = runOneFrame({ state });

    // now grid should contains cubes with 1 and 0
    const gridAfterExplosion = getDataGrid({ state });
    // console.log(gridAfterExplosion)
    expect(gridAfterExplosion[0][0].dots).toBe(0);
    expect(gridAfterExplosion[0][1].dots).toBe(1);
    expect(gridAfterExplosion[0][2].dots).toBe(0);
    expect(gridAfterExplosion[1][0].dots).toBe(1);
    expect(gridAfterExplosion[1][1].dots).toBe(1);
    expect(gridAfterExplosion[1][2].dots).toBe(1);
    expect(gridAfterExplosion[2][0].dots).toBe(0);
    expect(gridAfterExplosion[2][1].dots).toBe(1);
    expect(gridAfterExplosion[2][2].dots).toBe(0);
  });

  it('game 1 vs 1', () => {
    const emptyGrid = Array.from({ length: 5 }).map(() =>
      Array.from({ length: 5 }).map(() => ({
        player: undefined,
        dots: 0,
      }))
    );

    let state = createGrid({
      dataGrid: emptyGrid,
      scene,
      camera,
      state: getGameInitialState(),
    });

    const game = getGame({ state });
    if (!game) {
      return;
    }

    const ai1 = basicAI('1');
    const ai2 = basicAI('2');
    state = createPlayers({ state, ai: [ai1, ai2] });
    state = setComponent<Game>({
      state,
      data: {
        ...game,
        gameStarted: true,
      },
    });

    Array.from({ length: 1000 }).forEach(() => {
      state = runOneFrame({ state });
    });

    const game2 = getGame({ state });

    console.log(getDataGrid({ state }))

    expect(game2?.gameStarted).toBe(false);
  });
});
