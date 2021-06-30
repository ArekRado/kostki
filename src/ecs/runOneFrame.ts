import { State } from './type';
import { eventBuffer, resetEventBuffer } from './emitEvent';

type RunOneFrame = (params: { state: State }) => State;
export const runOneFrame: RunOneFrame = ({ state }): State => {
  // const v1: State = {
  //   ...state,
  //   time: {
  //     ...state.time,
  //     timeNow: timeNow !== undefined ? timeNow : performance.now(),
  //   },
  // }

  const newState = state.system
    .concat()
    .sort((a, b) => (a > b ? -1 : 1))
    .reduce((acc, system) => system.tick({ state: acc, eventBuffer }), state);

  resetEventBuffer();

  return newState;
};
