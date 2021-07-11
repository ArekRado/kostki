import 'regenerator-runtime/runtime';
import { initialState } from '../ecs/state';
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
      state: initialState,
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

    let state = setComponent({
      state: initialState,
      data: { entity, name: componentName },
    });

    const testEvent: ECSEvent<string> = {
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

  it('events emited in a event should be called on next frame', () => {
    const componentName = 'componentName';
    const entity = 'entity';

    let state = setComponent({
      state: initialState,
      data: { entity, name: componentName },
    });

    const testEvent1: ECSEvent<string> = {
      type: 'testEventType1',
      payload: 'testEventPayload1',
      entity,
    };

    const testEvent2: ECSEvent<string> = {
      type: 'testEventType2',
      payload: 'testEventPayload2',
      entity,
    };

    const testEventHandler1 = jest.fn();
    const testEventHandler2 = jest.fn();

    state = createSystem({
      state,
      name: componentName,
      event: {
        [testEvent1.type]: ({ state }) => {
          testEventHandler1(testEvent1);
          emitEvent(testEvent2);
          return state;
        },
        [testEvent2.type]: ({ state }) => {
          testEventHandler2(testEvent2);
          emitEvent(testEvent1);
          return state;
        },
      },
    });

    state = runOneFrame({ state });

    expect(testEventHandler1).not.toHaveBeenCalled();

    emitEvent(testEvent1);

    state = runOneFrame({ state });

    expect(testEventHandler1).toHaveBeenCalledTimes(1);
    expect((testEventHandler1.mock.calls[0][0] as any).payload).toEqual(
      testEvent1.payload
    );
    expect((testEventHandler1.mock.calls[0][0] as any).entity).toEqual(
      testEvent1.entity
    );

    // eventBuffer should be reseted on each frame
    // should also use second buffer
    state = runOneFrame({ state });

    expect(testEventHandler1).toHaveBeenCalledTimes(1);
    expect(testEventHandler1.mock.calls[1]).not.toBeDefined();

    expect(testEventHandler2).toHaveBeenCalledTimes(1);
    expect((testEventHandler2.mock.calls[0][0] as any).payload).toEqual(
      testEvent2.payload
    );
    expect((testEventHandler2.mock.calls[0][0] as any).entity).toEqual(
      testEvent2.entity
    );

  });
});
