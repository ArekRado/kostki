import { scene } from "../..";
import { getGridDimensions } from "../../blueprints/gridBlueprint";
import { State, TurnIndicator } from "../../ecs/type";
import { getAspectRatio } from "../../utils/getAspectRatio";
import { getIndicatorSizes } from "./getIndicatorSizes";

export const indicatorWidth = 2;

export const doesIndicatorCollidesWithGrid = ({
  state,
  component,
}: {
  state: State;
  component: TurnIndicator;
}) => {
  const { boxSize, screenSize } = getIndicatorSizes({
    state,
  });
  const aspect = getAspectRatio(scene);

  const indicatorHeight = component.boxes.length * boxSize;

  const { width, height } = getGridDimensions({ state });

  const gridSizeWithRightGap = (screenSize[0] - width) / 2 + width;
  const gridSizeWithTopGap = (screenSize[1] - height) / 2 + height;

  const collisions = [
    aspect < 1
      ? screenSize[0] - gridSizeWithRightGap - indicatorWidth <= 0
      : false,
    aspect > 1
      ? screenSize[1] - gridSizeWithTopGap - indicatorHeight <= 0
      : false,
  ];

  return collisions[0] || collisions[1];
};