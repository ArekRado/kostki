import { Guid, State } from './type';
import { Component, Dictionary } from './type';

const getSystemByName = (name: string, system: State['system']) =>
  system.find((x) => x.name === name);

export enum componentName {
  box = 'box',
  ai = 'ai',
  game = 'game',
}

type SetComponentParams<Data> = {
  state: State;
  data: Component<Data>;
};
export const setComponent = <Data>({
  state,
  data,
}: SetComponentParams<Data>): State => {
  const newState = {
    ...state,
    component: {
      ...state.component,
      [data.name]: {
        ...state.component[data.name],
        [data.entity]: data,
      },
    },
  };

  const system = getSystemByName(data.name, state.system);

  if (
    system !== undefined &&
    (state.component[data.name] === undefined ||
      state.component[data.name][data.entity] === undefined)
  ) {
    return system.create({ state: newState, component: data });
  }

  return newState;
};

type RemoveComponent = (params: {
  name: string;
  entity: Guid;
  state: State;
}) => State;
export const removeComponent: RemoveComponent = ({ name, entity, state }) => {
  const { [entity]: _, ...dictionaryWithoutComponent } = state.component[
    name
  ] as Dictionary<Component<any>>;

  const newState = {
    ...state,
    component: {
      ...state.component,
      [name]: dictionaryWithoutComponent,
    },
  };

  const component = getComponent({ name, state, entity });
  const system = getSystemByName(name, newState.system);

  if (system && component) {
    return system.remove({ state: newState, component });
  }

  return newState;
};

export const getComponent = <Data>({
  name,
  entity,
  state,
}: {
  name: string;

  entity: Guid;
  state: State;
}): Component<Data> | undefined => {
  const c: Dictionary<Component<Data>> = state.component[name];
  return c ? (c[entity] as Component<Data> | undefined) : undefined;
};

export const getAllComponents = <Data>({
  name,
  state,
}: {
  name: string;
  state: State;
}): Dictionary<Component<Data>> | undefined => {
  return state.component[name];
};
