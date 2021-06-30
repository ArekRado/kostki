import { ECSEvent } from './emitEvent';
import { State, Dictionary, Entity, Component } from './type';

export enum systemPriority {
  last = 3,
  time = 3,
  io = 2,
  transform = 1,
  zero = 0,
  sprite = -1,
  draw = -2,
}

const doNothing = (params: { state: State }) => params.state;

type EventHandler = (params: {
  payload: any;
  state: State;
  entity: Entity;
}) => State;

type TriggerSystemEvents = (params: {
  state: State;
  eventBuffer: Dictionary<ECSEvent[]>;
  entity: Entity;
  systemEventHandlers: System<any>['event'];
}) => State;
export const triggerSystemEvents: TriggerSystemEvents = ({
  entity,
  eventBuffer,
  state,
  systemEventHandlers,
}) =>
  eventBuffer[entity]
    ? eventBuffer[entity].reduce((acc, event: ECSEvent) => {
        const eventHandler = systemEventHandlers[event.type];
        return eventHandler
          ? eventHandler({ state: acc, payload: event.payload, entity })
          : acc;
      }, state)
    : state;

type SystemMethodParams<ComponentData> = {
  state: State;
  component: Component<ComponentData>;
};

export type CreateSystemParams<Component> = {
  state: State;
  name: string;
  initialize?: (params: { state: State }) => State;
  create?: (params: SystemMethodParams<Component>) => State;
  tick?: (params: SystemMethodParams<Component>) => State;
  remove?: (params: SystemMethodParams<Component>) => State;
  priority?: number;
  event?: Dictionary<EventHandler>;
};

export type System<Component> = {
  name: string;
  /**
   * Called only once when engine is initializing
   */
  initialize: (params: { state: State }) => State;
  /**
   * Called on each component create if state.component[name] and system name are the same
   */
  create: (params: SystemMethodParams<Component>) => State;
  tick: (params: {
    state: State;
    eventBuffer: Dictionary<ECSEvent[]>;
  }) => State;
  remove: (params: SystemMethodParams<Component>) => State;
  priority: number;
  event: Dictionary<EventHandler>;
};

export const createSystem = <ComponentData>({
  state,
  tick,
  ...params
}: CreateSystemParams<ComponentData>): State => {
  const system: System<ComponentData> = {
    name: params.name,
    priority: params.priority || systemPriority.zero,
    initialize: params.initialize || doNothing,
    create: params.create || doNothing,
    tick: ({ state, eventBuffer }) => {
      const component = state.component[params.name] as Dictionary<
        Component<ComponentData>
      >;
      if (component) {
        return Object.values(component).reduce(
          (acc, component: Component<any>) => {
            let stateAfterEvents = triggerSystemEvents({
              systemEventHandlers: params.event || {},
              state: acc,
              eventBuffer,
              entity: component.entity,
            });

            return tick ? tick({ state: stateAfterEvents, component }) : stateAfterEvents;
          },
          state
        );
      }

      return state;
    },
    remove: params.remove || doNothing,
    event: params.event || {},
  };

  return {
    ...state,
    system: [...state.system, system],
  };
};

export type CreateGlobalSystemParams = {
  state: State;
  name: string;
  initialize?: (params: { state: State }) => State;
  create?: (params: { state: State }) => State;
  tick?: (params: { state: State }) => State;
  priority?: number;
  event?: Dictionary<EventHandler>;
};

export type GlobalSystem = {
  name: string;
  tick: (params: { state: State }) => State;
  /**
   * Called only once when engine is initializing
   */
  initialize: (params: { state: State }) => State;
  create: (params: { state: State }) => State;
  remove: (params: { state: State }) => State;
  priority: number;
  // event: Dictionary<EventHandler>;
};

export const createGlobalSystem = ({
  state,
  initialize,
  tick,
  ...params
}: CreateGlobalSystemParams): State => {
  const system: GlobalSystem = {
    name: params.name,
    priority: params.priority || systemPriority.zero,
    tick: tick || doNothing,
    initialize: initialize || doNothing,
    create: doNothing,
    remove: ({ state }) => state,
    // event: params.event || {},
  };

  return {
    ...state,
    system: [...state.system, system],
  };
};
