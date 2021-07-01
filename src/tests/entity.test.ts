import 'regenerator-runtime/runtime';
import { initialStateWithDisabledBabylon } from '../ecs/state';

import { setEntity, removeEntity, createEntity } from '../ecs/entity';
import { setComponent } from '../ecs/component';
import { Dictionary } from '../ecs/type';

describe('entity', () => {
  it('remove - should remove components by entity', () => {
    const entity = createEntity('test');
    let state = setEntity({ state: initialStateWithDisabledBabylon, entity });

    state = setComponent<Dictionary<{}>>({
      state,
      data: {
        name: 'componentName',
        entity,
        test: '123',
      },
    });

    expect(state.entity[entity]).toEqual(entity);
    expect(state.component['componentName'][entity]).toBeDefined();

    const stateWithoutEntity = removeEntity({
      state,
      entity,
    });

    expect(stateWithoutEntity.entity[entity]).not.toBeDefined();
    expect(
      stateWithoutEntity.component['componentName'][entity]
    ).not.toBeDefined();
  });

  // it('set - should set and update entity', () => {
  //   const entity = createEntity('test', { rotation: 1 });
  //   const v1 = setEntity({ state: initialStateWithDisabledBabylon, entity });

  //   expect(v1.entity[entity]).toEqual(entity);

  //   const v2 = setEntity({
  //     state: v1,
  //     entity: { ...entity, rotation: 2 },
  //   });

  //   expect(v2.entity[entity].rotation).toBe(2);
  // });
});
