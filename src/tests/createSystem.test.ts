import 'regenerator-runtime/runtime';
import { initialState } from '../ecs/state';
import { createSystem } from '../ecs/createSystem';
import { setComponent } from '../ecs/component';

describe('createGlobalSystem', () => {
  // it('should not call create method when system is creating', () => {
  //   const initialize = jest.fn<State, [{ state: State }]>(({ state }) => state);
  //   const create = jest.fn<State, [{ state: State }]>(({ state }) => state);
  //   const remove = jest.fn<State, [{ state: State }]>(({ state }) => state);
  //   const tick = jest.fn<State, [{ state: State }]>(({ state }) => state);

  //   createGlobalSystem({
  //     state: initialState,
  //     name: 'test',
  //     initialize,
  //     create,
  //     tick,
  //   });

  //   expect(initialize).not.toHaveBeenCalled();
  //   expect(create).not.toHaveBeenCalled();
  //   expect(remove).not.toHaveBeenCalled();
  //   expect(tick).not.toHaveBeenCalled();
  // });

  // it('should handle events', () => {
  //   const componentName = 'componentName';
  //   const entity = 'entity';

  //   let state = setComponent({
  //     state: initialState,
  //     data: { entity, name: componentName },
  //   });

  //   const testEvent: ECSEvent<string, any> = {
  //     type: 'testEventType',
  //     payload: 'testEventPayload',
  //     entity,
  //   };

  //   const testEventHandler = jest.fn<State, [{ state: State; event: any }]>(
  //     ({ state }) => state
  //   );

  //   state = createSystem<any, any>({
  //     state,
  //     name: componentName,
  //     event: ({ state, event }) => {
  //       switch (event.type) {
  //         case testEvent.type:
  //           return testEventHandler({ state, event });
  //       }

  //       return state;
  //     },
  //   });

  //   state = runOneFrame({ state });

  //   expect(testEventHandler).not.toHaveBeenCalled();

  //   emitEvent(testEvent);

  //   state = runOneFrame({ state });

  //   expect(testEventHandler).toHaveBeenCalledTimes(1);
  //   expect((testEventHandler.mock.calls[0][0] as any).event.payload).toEqual(
  //     testEvent.payload
  //   );

  //   // eventBuffer should be reseted on each frame
  //   state = runOneFrame({ state });

  //   expect(testEventHandler).toHaveBeenCalledTimes(1);
  //   expect(testEventHandler.mock.calls[1]).not.toBeDefined();
  // });

  // it('events emited in a event should be called on next frame', () => {
  //   const componentName = 'componentName';
  //   const entity = 'entity';

  //   let state = setComponent({
  //     state: initialState,
  //     data: { entity, name: componentName },
  //   });

  //   const testEvent1: ECSEvent<string, any> = {
  //     type: 'testEventType1',
  //     payload: 'testEventPayload1',
  //     entity,
  //   };

  //   const testEvent2: ECSEvent<string, any> = {
  //     type: 'testEventType2',
  //     payload: 'testEventPayload2',
  //     entity,
  //   };

  //   const testEventHandler1 = jest.fn();
  //   const testEventHandler2 = jest.fn();

  //   state = createSystem<any, any>({
  //     state,
  //     name: componentName,
  //     event: ({ state, event }) => {
  //       switch (event.type) {
  //         case testEvent1.type:
  //           testEventHandler1(testEvent1);
  //           emitEvent(testEvent2);
  //           return state;

  //         case testEvent2.type:
  //           testEventHandler2(testEvent2);
  //           emitEvent(testEvent1);
  //           return state;
  //       }

  //       return state;
  //     },
  //   });

  //   state = runOneFrame({ state });

  //   expect(testEventHandler1).not.toHaveBeenCalled();

  //   emitEvent(testEvent1);

  //   state = runOneFrame({ state });

  //   expect(testEventHandler1).toHaveBeenCalledTimes(1);
  //   expect((testEventHandler1.mock.calls[0][0] as any).payload).toEqual(
  //     testEvent1.payload
  //   );
  //   expect((testEventHandler1.mock.calls[0][0] as any).entity).toEqual(
  //     testEvent1.entity
  //   );

  //   // eventBuffer should be reseted on each frame
  //   // should also use second buffer
  //   state = runOneFrame({ state });

  //   expect(testEventHandler1).toHaveBeenCalledTimes(1);
  //   expect(testEventHandler1.mock.calls[1]).not.toBeDefined();

  //   expect(testEventHandler2).toHaveBeenCalledTimes(1);
  //   expect((testEventHandler2.mock.calls[0][0] as any).payload).toEqual(
  //     testEvent2.payload
  //   );
  //   expect((testEventHandler2.mock.calls[0][0] as any).entity).toEqual(
  //     testEvent2.entity
  //   );
  // });

  test('should call update method on each setComponent', () => {
    const componentName = 'componentName';
    const entity = 'entity';

    let state = setComponent({
      state: initialState,
      data: { entity, name: componentName },
    });

    const updateMock = jest.fn(({ state }: any) => state);

    state = createSystem<any, any>({
      state,
      name: componentName,
      update: updateMock,
    });

    expect(updateMock).not.toHaveBeenCalled();

    setComponent({
      state,
      data: {
        name: componentName,
        entity,
      },
    });

    expect(updateMock).toHaveBeenCalled();
  });
});
