// import { v4 } from 'uuid';
import { Entity, Guid, State } from './type';
import { removeComponent } from './component';

type CreateEntity = (
  name: string,
  options?: Partial<{
    //   persistOnSceneChange: boolean
    //   rotation: number
    //   fromParentRotation: number
    //   scale: Vector2D
    //   fromParentScale: Vector2D
    //   position: Vector2D
    //   fromParentPosition: Vector2D
    //   parentId?: Guid
  }>
) => Entity;
export const createEntity: CreateEntity = (
  name: string,
  options = {}
): Entity => Math.random().toString();

type SetEntity = (params: { entity: Entity; state: State }) => State;

export const setEntity: SetEntity = ({ entity, state }) => ({
  ...state,
  entity: {
    ...state.entity,
    [entity]: entity,
  },
});

type GetEntity = (params: { entity: Guid; state: State }) => Entity | undefined;

export const getEntity: GetEntity = ({ entity, state }) => state.entity[entity];

type RemoveEntity = (params: { entity: Guid; state: State }) => State;
export const removeEntity: RemoveEntity = ({ entity, state }) => {
  const { [entity]: _, ...stateWithoutEntity } = state.entity;

  const newState = {
    ...state,
    entity: stateWithoutEntity,
  };

  const v1 = Object.keys(newState.component).reduce(
    (state, name) =>
      removeComponent({
        name,
        state,
        entity,
      }),
    newState
  );

  return v1;
};
