import { State, Dictionary, Component, EventHandler } from './type';

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

// TODO add a way to handle any event - is it better than handling events inside systems?
// const eventHandler = ({state, event:unknown | listOfExpectedEvents }):State => {}
// type TriggerSystemEvents = <ComponentData, Events>(params: {
//   state: State;
//   eventBuffer: Dictionary<Events[]>;
//   entity: Entity;
//   eventHandler: EventHandler<ComponentData, Events> | undefined;
//   component: Component<ComponentData>;
// }) => State;
// export const triggerSystemEvents: TriggerSystemEvents = ({
//   entity,
//   eventBuffer,
//   state,
//   eventHandler,
//   component,
// }) =>
//   eventBuffer[entity]
//     ? eventBuffer[entity].reduce((acc, event) => {
//         if (eventHandler) {
//           const updatedComponent = getComponent<any>({
//             state: acc,
//             entity,
//             name: component.name,
//           });

//           if (!updatedComponent) {
//             return acc;
//           }

//           return eventHandler({
//             state: acc,
//             event,
//             component: updatedComponent,
//           });
//         }

//         return acc;
//       }, state)
//     : state;

type SystemMethodParams<ComponentData> = {
  state: State;
  component: Component<ComponentData>;
};

export type CreateSystemParams<Component, Events> = {
  state: State;
  name: string;
  initialize?: (params: { state: State }) => State;
  create?: (params: SystemMethodParams<Component>) => State;
  update?: (params: SystemMethodParams<Component>) => State;
  tick?: (params: SystemMethodParams<Component>) => State;
  remove?: (params: SystemMethodParams<Component>) => State;
  priority?: number;
  event?: EventHandler<Component, Events>;
};

export type System<Component, Events> = {
  name: string;
  /**
   * Called only once when engine is initializing
   */
  initialize: (params: { state: State }) => State;
  /**
   * Called on each component create if state.component[name] and system name are the same
   */
  create: (params: SystemMethodParams<Component>) => State;
  /**
   * Called on each setComponent
   */
  update?: (params: SystemMethodParams<Component>) => State;
  /**
   * Called on each runOneFrame
   */
  tick: (params: { state: State; eventBuffer: Dictionary<Events[]> }) => State;
  remove: (params: SystemMethodParams<Component>) => State;
  priority: number;
  event?: EventHandler<Component, Events>;
};

export const createSystem = <ComponentData, Events>({
  state,
  tick,
  ...params
}: CreateSystemParams<ComponentData, Events>): State => {
  const system: System<ComponentData, Events> = {
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
          (acc, component: Component<ComponentData>) => {
            // let stateAfterEvents = triggerSystemEvents<ComponentData, Events>({
            //   eventHandler: params.event,
            //   state: acc,
            //   eventBuffer,
            //   entity: component.entity,
            //   component,
            // });

            return tick
              ? tick({ state: acc, component })
              : acc;
          },
          state
        );
      }

      return state;
    },
    update: params.update,
    remove: params.remove || doNothing,
    event: params.event || doNothing,
  };

  return {
    ...state,
    system: [...state.system, system],
  };
};

export type CreateGlobalSystemParams<Events> = {
  state: State;
  name: string;
  initialize?: (params: { state: State }) => State;
  create?: (params: { state: State }) => State;
  tick?: (params: { state: State }) => State;
  priority?: number;
  event?: EventHandler<undefined, Events>;
};

export type GlobalSystem = {
  name: string;
  update: undefined;
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

export const createGlobalSystem = <Events>({
  state,
  initialize,
  tick,
  ...params
}: CreateGlobalSystemParams<Events>): State => {
  const system: GlobalSystem = {
    name: params.name,
    priority: params.priority || systemPriority.zero,
    update: undefined,
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
