import { Box, State } from '../../type';

export const remove = ({
  state,
  component,
}: {
  state: State;
  component: Box;
}) => {
  if (state.babylonjs.sceneRef) {
    const box = state.babylonjs.sceneRef.getTransformNodeByUniqueId(
      parseInt(component.entity)
    );
    box?.dispose();
  }

  return state;
};
