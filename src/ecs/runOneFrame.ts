import { State } from './type';
// import {
//   eventBuffer,
//   lockFirstBuffer,
//   resetEventBuffer,
//   unlockFirstBuffer,
// } from './emitEvent';

type RunOneFrame = (params: { state: State }) => State;
export const runOneFrame: RunOneFrame = ({ state }): State => {
  const newState = state.system
    .concat()
    .sort((a, b) => (a > b ? -1 : 1))
    .reduce((acc, system) => system.tick({ state: acc }), state);

  return newState;
};
