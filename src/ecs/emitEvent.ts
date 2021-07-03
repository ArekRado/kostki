import { Dictionary, Entity } from './type';

export type ECSEvent<Payload> = {
  type: string;
  entity: Entity;
  payload: Payload;
};

export let eventBuffer: Dictionary<ECSEvent<any>[]> = {};

export const emitEvent = <Payload>(event: ECSEvent<Payload>) => {
  if (!eventBuffer[event.entity]) {
    eventBuffer[event.entity] = [];
  }
  eventBuffer[event.entity].push(event);
};

export const resetEventBuffer = () => {
  eventBuffer = {};
};
