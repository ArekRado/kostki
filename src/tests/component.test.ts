import 'regenerator-runtime/runtime';
import { initialStateWithDisabledBabylon } from '../ecs/state';
import { setEntity, createEntity } from '../ecs/entity';
import { runOneFrame } from '../ecs/runOneFrame';
import { removeComponent, setComponent } from '../ecs/component';
import { createSystem } from '../ecs/createSystem';
import { Dictionary, State } from '../ecs/type';

describe('component', () => {
  it('should call system create and remove methods', () => {
    const entity1 = createEntity('e1');
    const entity2 = createEntity('e2');

    const create = jest.fn<State, [{ state: State }]>(({ state }) => state);
    const remove = jest.fn<State, [{ state: State }]>(({ state }) => state);
    const tick = jest.fn<State, [{ state: State }]>(({ state }) => state);

    const v1 = setEntity({
      entity: entity1,
      state: initialStateWithDisabledBabylon,
    });

    const v2 = createSystem({
      state: v1,
      name: 'test',
      create,
      remove,
      tick,
    });

    const v3 = setComponent<Dictionary<{}>>({
      state: v2,
      data: {
        entity: entity1,
        name: 'test',
      },
    });
    const v4 = setComponent<Dictionary<{}>>({
      state: v3,
      data: {
        entity: entity2,
        name: 'test',
      },
    });

    const v5 = runOneFrame({ state: v4 });
    const v6 = removeComponent({ name: 'test', entity: entity1, state: v5 });

    expect(create).toHaveBeenCalledTimes(2);
    expect(remove).toHaveBeenCalled();
    expect(tick).toHaveBeenCalled();

    // create new component after remove
    const v7 = setComponent<Partial<{}>>({
      state: v6,
      data: {
        entity: entity1,
        name: 'test',
      },
    });

    expect(create).toHaveBeenCalledTimes(3);

    // updating existing component
    const v8 = setComponent<Partial<{}>>({
      state: v7,
      data: {
        entity: entity1,
        name: 'test',
      },
    });

    // Update should not trigger create
    expect(create).toHaveBeenCalledTimes(3);
  });
});
