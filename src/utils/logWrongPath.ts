import { State } from '../type'

export const logWrongPath = (state: State): State => {
  console.trace('Wrong path', state)
  return state
}
