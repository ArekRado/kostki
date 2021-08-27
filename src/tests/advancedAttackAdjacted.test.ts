import 'regenerator-runtime/runtime';
import { scene, camera } from '../.';
import { BasicBox, gridBlueprint } from '../blueprints/gridBlueprint';
import { componentName, setComponent } from '../ecs/component';
import { AI } from '../ecs/type';
import { AIDifficulty, getAiMove } from '../systems/aiSystem';
import { getGameInitialState } from '../utils/getGameInitialState';
import { expectOneOf } from './aiSystem.test';

const basicAi: AI = {
  entity: 'basicAi',
  name: componentName.ai,
  human: false,
  level: AIDifficulty.experimental,
  color: [0, 0, 1],
  textureSet: ['', '', '', '', '', '', ''],
  active: true,
};

const basicAi2: AI = {
  entity: 'basicAi2',
  name: componentName.ai,
  human: false,
  level: AIDifficulty.hard,
  color: [0, 1, 1],
  textureSet: ['', '', '', '', '', '', ''],
  active: true,
};

const prepareGrid = (dataGrid: BasicBox[][]) => {
  let state = gridBlueprint({
    dataGrid,
    scene,
    camera,
    state: getGameInitialState(),
  });

  state = setComponent<AI>({
    state,
    data: basicAi,
  });

  state = setComponent<AI>({
    state,
    data: basicAi2,
  });

  const box = getAiMove({
    state,
    ai: basicAi,
  });

  return box?.gridPosition || [];
};

describe('advancedAttackAdjacted', () => {
  it('ai1 should click on a proper box', () => {
    /*
      [1,1] is great because ai will capture four 5 dot boxes

      * - basicAi1
    
      0 - 5 - 0
      5 -*6 - 5
      0 - 5 - 0
    */

    const box = prepareGrid([
      [
        { dots: 0, player: undefined },
        { dots: 5, player: basicAi2.entity },
        { dots: 0, player: undefined },
      ],
      [
        { dots: 5, player: basicAi2.entity },
        { dots: 6, player: basicAi.entity },
        { dots: 5, player: basicAi2.entity },
      ],
      [
        { dots: 0, player: undefined },
        { dots: 5, player: basicAi2.entity },
        { dots: 0, player: undefined },
      ],
    ]);

    expectOneOf([[1, 1]], box);
  });

  it('ai1 should click on a proper box', () => {
    /*
      [1,1] is great because ai will capture four boxes. 
      2 dot boxes have advantage over 0 dot boxes so they are safe

      * - basicAi1
    
      0 - 1 - 0
      1 -*6 - 1
      0 - 1 - 0
    */

    const box = prepareGrid([
      [
        { dots: 0, player: undefined },
        { dots: 1, player: basicAi2.entity },
        { dots: 0, player: undefined },
      ],
      [
        { dots: 1, player: basicAi2.entity },
        { dots: 6, player: basicAi.entity },
        { dots: 1, player: basicAi2.entity },
      ],
      [
        { dots: 0, player: undefined },
        { dots: 1, player: basicAi2.entity },
        { dots: 0, player: undefined },
      ],
    ]);

    expectOneOf([[1, 1]], box);
  });

  it('ai1 should click on a proper box', () => {
    /*
      [0,2] is good because is not protected by high number as [2,2]

      * - basicAi1

        1 - 0 - 6
        4 - 0 - 4
       *6 - 0 -*6
    */

    const box = prepareGrid([
      [
        { dots: 1, player: basicAi2.entity },
        { dots: 4, player: basicAi2.entity },
        { dots: 6, player: basicAi.entity },
      ],
      [
        { dots: 0, player: undefined },
        { dots: 0, player: undefined },
        { dots: 0, player: undefined },
      ],
      [
        { dots: 6, player: basicAi2.entity },
        { dots: 4, player: undefined },
        { dots: 6, player: basicAi.entity },
      ],
    ]);

    expectOneOf([[0, 2]], box);
  });

  it('ai1 should click on a proper box', () => {
    /*
      [0,2] is good because is not protected by high number as [2,2]

      * - basicAi1

        1 - 0 - 6
        1 - 0 - 5
       *6 - 0 -*6
    */

    const box = prepareGrid([
      [
        { dots: 1, player: basicAi2.entity },
        { dots: 1, player: basicAi2.entity },
        { dots: 6, player: basicAi.entity },
      ],
      [
        { dots: 0, player: undefined },
        { dots: 0, player: undefined },
        { dots: 0, player: undefined },
      ],
      [
        { dots: 6, player: basicAi2.entity },
        { dots: 5, player: basicAi2.entity },
        { dots: 6, player: basicAi.entity },
      ],
    ]);

    expectOneOf([[0, 2]], box);
  });

  it('ai1 should click on a proper box', () => {
    /*
      [2,2] because ai will capture more dots than if clicks [0,2] both are not protected because after capturing boxes will have more dots than adjacted enemy box

      * - basicAi1

        1 - 0 - 5
        1 - 0 - 5
       *6 - 0 -*6
    */

    const box = prepareGrid([
      [
        { dots: 1, player: basicAi2.entity },
        { dots: 1, player: basicAi2.entity },
        { dots: 6, player: basicAi.entity },
      ],
      [
        { dots: 0, player: undefined },
        { dots: 0, player: undefined },
        { dots: 0, player: undefined },
      ],
      [
        { dots: 5, player: basicAi2.entity },
        { dots: 5, player: basicAi2.entity },
        { dots: 6, player: basicAi.entity },
      ],
    ]);

    expectOneOf([[2, 2]], box);
  });

  it('ai1 should click on a proper box', () => {
    /*
      [2,2] because ai will controll more enemy boxes than [0,2]

      * - basicAi1

        4 - 0 - 4 - 0
        4 - 0 - 4 - 4
       *6 - 0 -*6 - 0
        0 - 0 - 0 - 0
    */

    const box = prepareGrid([
      [
        { dots: 4, player: basicAi2.entity },
        { dots: 4, player: basicAi2.entity },
        { dots: 6, player: basicAi.entity },
        { dots: 0, player: undefined },
      ],
      [
        { dots: 0, player: undefined },
        { dots: 0, player: undefined },
        { dots: 0, player: undefined },
        { dots: 0, player: undefined },
      ],
      [
        { dots: 4, player: basicAi.entity },
        { dots: 4, player: basicAi2.entity },
        { dots: 6, player: basicAi.entity },
        { dots: 0, player: undefined },
      ],
      [
        { dots: 0, player: undefined },
        { dots: 4, player: basicAi2.entity },
        { dots: 0, player: undefined },
        { dots: 0, player: undefined },
      ],
    ]);

    expectOneOf([[2, 2]], box);
  });

  it('ai1 should click on a proper box', () => {
    /*
      [2,2] because [0,2] has another 6, we don't want to trigger combo - questionable

      * - basicAi1

        4 - 0 - 0 - 4
        4 - 0 - 0 - 4
       *6 - 0 - 0 -*6
       *6 - 0 - 0 - 0
    */

    const box = prepareGrid([
      [
        { dots: 4, player: basicAi2.entity },
        { dots: 4, player: basicAi2.entity },
        { dots: 6, player: basicAi.entity },
        { dots: 6, player: basicAi.entity },
      ],
      [
        { dots: 0, player: undefined },
        { dots: 0, player: undefined },
        { dots: 0, player: undefined },
        { dots: 0, player: undefined },
      ],
      [
        { dots: 0, player: undefined },
        { dots: 0, player: undefined },
        { dots: 0, player: undefined },
        { dots: 0, player: undefined },
      ],
      [
        { dots: 4, player: basicAi2.entity },
        { dots: 4, player: basicAi2.entity },
        { dots: 6, player: basicAi.entity },
        { dots: 0, player: undefined },
      ],
    ]);

    expectOneOf([[3, 2]], box);
  });
});
