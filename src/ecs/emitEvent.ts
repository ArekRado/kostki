import { Dictionary, Entity } from './type';

export type ECSEvent = {
  type: string;
  entity: Entity;
  payload: any;
};

export let eventBuffer: Dictionary<ECSEvent[]> = {};

export const emitEvent = (event: ECSEvent) => {
  if (!eventBuffer[event.entity]) {
    eventBuffer[event.entity] = [];
  }
  eventBuffer[event.entity].push(event);
};

export const resetEventBuffer = () => {
  eventBuffer = {};
};
