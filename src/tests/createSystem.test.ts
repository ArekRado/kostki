import 'regenerator-runtime/runtime';
import { initialStateWithDisabledBabylon } from '../ecs/state';
import { createGlobalSystem, createSystem } from '../ecs/createSystem';
import { State } from '../ecs/type';
import { ECSEvent, emitEvent } from '../ecs/emitEvent';
import { runOneFrame } from '../ecs/runOneFrame';
import { setComponent } from '../ecs/component';

describe('createGlobalSystem', () => {
  it('should not call create method when system is creating', () => {
    const initialize = jest.fn<State, [{ state: State }]>(({ state }) => state);
    const create = jest.fn<State, [{ state: State }]>(({ state }) => state);
    const remove = jest.fn<State, [{ state: State }]>(({ state }) => state);
    const tick = jest.fn<State, [{ state: State }]>(({ state }) => state);

    createGlobalSystem({
      state: initialStateWithDisabledBabylon,
      name: 'test',
      initialize,
      create,
      tick,
    });

    expect(initialize).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
    expect(tick).not.toHaveBeenCalled();
  });

  it('should handle events', () => {
    const componentName = 'componentName';
    const entity = 'entity';

    let state = setComponent(componentName, {
      state: initialStateWithDisabledBabylon,
      data: { entity, name: componentName },
    });

    const testEvent: ECSEvent = {
      type: 'testEventType',
      payload: 'testEventPayload',
      entity,
    };

    const testEventHandler = jest.fn<State, [{ state: State }]>(
      ({ state }) => state
    );

    state = createSystem({
      state,
      name: componentName,
      event: {
        [testEvent.type]: testEventHandler,
      },
    });

    state = runOneFrame({ state });

    expect(testEventHandler).not.toHaveBeenCalled();

    emitEvent(testEvent);

    state = runOneFrame({ state });

    expect(testEventHandler).toHaveBeenCalledTimes(1);
    expect((testEventHandler.mock.calls[0][0] as any).payload).toEqual(
      testEvent.payload
    );
    expect((testEventHandler.mock.calls[0][0] as any).entity).toEqual(
      testEvent.entity
    );

    // eventBuffer should be reseted on each frame
    state = runOneFrame({ state });

    expect(testEventHandler).toHaveBeenCalledTimes(1);
    expect(testEventHandler.mock.calls[1]).not.toBeDefined();
  });
});
