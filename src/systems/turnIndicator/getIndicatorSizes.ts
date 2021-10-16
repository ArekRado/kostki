import { boxWithGap } from "../../blueprints/gridBlueprint";
import { State } from "../../ecs/type";
import { getCamera } from "../cameraSystem";

export const getIndicatorSizes = ({ state }: { state: State }) => {
  const camera = getCamera({ state });

  if (camera) {
    const leftEdge = camera.position[0] + camera.left;
    const topEdge = camera.position[1] + camera.top;
    const scaleFactor = 3;
    const boxSize = boxWithGap / scaleFactor;
    const screenSize = [camera.right * 2, camera.top * 2];

    return {
      leftEdge,
      topEdge,
      boxSize,
      screenSize,
    };
  }
  return {
    leftEdge: 0,
    topEdge: 0,
    boxSize: 0,
    screenSize: [0, 0],
  };
};
