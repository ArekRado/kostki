import 'regenerator-runtime/runtime';
import { createEventSystem } from '../ecs/createEventSystem';
import { runOneFrame } from '../ecs/runOneFrame';
import { getGameInitialState } from '../getGameInitialState';

describe('createEventSystem', () => {
  it('should handle events', () => {
    let state = getGameInitialState();

    const testEvent = {
      type: 'testEventType',
      payload: 'testEventPayload',
    };

    const eventHandler = jest.fn(({ state }) => state);

    const { emitEvent, eventSystem } = createEventSystem(eventHandler);

    state = eventSystem(state);
    state = runOneFrame({ state });

    expect(eventHandler).not.toHaveBeenCalled();

    emitEvent(testEvent);

    state = runOneFrame({ state });

    expect(eventHandler).toHaveBeenCalledTimes(1);
    expect((eventHandler.mock.calls[0][0]).event).toEqual(testEvent);

    // eventBuffer should be reseted on each frame
    state = runOneFrame({ state });

    expect(eventHandler).toHaveBeenCalledTimes(1);
    expect(eventHandler.mock.calls[1]).not.toBeDefined();
  });
});
