import { Dictionary, Entity } from './type';

export type ECSEvent<Payload> = {
  type: string;
  entity: Entity;
  payload: Payload;
};

type AcitveBuffer = 'first' | 'second';
export let activeBuffer: AcitveBuffer = 'first';

export let eventBuffer: Dictionary<ECSEvent<any>[]> = {};
/**
 * events emited inside events are located in secondEventBuffer
 */
export let secondEventBuffer: Dictionary<ECSEvent<any>[]> = {};

export const emitEvent = <Payload>(event: ECSEvent<Payload>) => {
  if (activeBuffer === 'first') {
    if (!eventBuffer[event.entity]) {
      eventBuffer[event.entity] = [];
    }
    eventBuffer[event.entity].push(event);
  } else {
    if (!secondEventBuffer[event.entity]) {
      secondEventBuffer[event.entity] = [];
    }
    secondEventBuffer[event.entity].push(event);
  }
};

export const resetEventBuffer = () => {
  eventBuffer = {};
};

export const lockFirstBuffer = () => {
  activeBuffer = 'second';
  secondEventBuffer = {};
};
export const unlockFirstBuffer = () => {
  activeBuffer = 'first';
  eventBuffer = { ...secondEventBuffer };
};
