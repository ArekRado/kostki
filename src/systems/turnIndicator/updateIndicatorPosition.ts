import { scene } from "../..";
import { Breakpoints } from "../../blueprints/ui/responsive";
import { componentName, getComponent, setComponent } from "../../ecs/component";
import { State, TurnIndicator, UIText } from "../../ecs/type";
import { logWrongPath } from "../../utils/logWrongPath";
import { getIndicatorSizes } from "./getIndicatorSizes";

export const updateIndicatorPosition = ({
  state,
  component,
}: {
  state: State;
  component: TurnIndicator;
}): State => {
  console.log('updateIndicatorPosition');

  const { leftEdge, topEdge, boxSize, screenSize } = getIndicatorSizes({ state });

  component.boxes.forEach((boxEntity, i) => {
    const boxPosition: [number, number] = [
      leftEdge + boxSize,
      topEdge - i * boxSize - boxSize,
    ];
    const percentagePosition = [
      (boxPosition[0] - leftEdge + boxSize) / screenSize[0],
      (topEdge - boxPosition[1]) / screenSize[1],
    ];

    const textSize: Breakpoints<[number, number]> = [
      [0.1, 0.1],
      [0.1, 0.1],
      [0.1, 0.1],
    ];

    const mesh = scene.getTransformNodeByUniqueId(parseFloat(boxEntity));

    if (mesh) {
      mesh.position.x = boxPosition[0];
      mesh.position.y = boxPosition[1];
    } else {
      logWrongPath(state);
    }

    const text = getComponent<UIText>({
      state,
      name: componentName.uiText,
      entity: component.texts[i],
    });

    if (text) {
      state = setComponent<UIText>({
        state,
        data: {
          ...text,
          position: [
            [percentagePosition[0] + textSize[0][0] / 2, percentagePosition[1]],
            [percentagePosition[0] + textSize[0][0] / 2, percentagePosition[1]],
            [percentagePosition[0] + textSize[0][0] / 2, percentagePosition[1]],
          ],
        },
      });
    } else {
      logWrongPath(state);
    }
  });

  const highlighter = scene.getMeshByUniqueId(
    parseFloat(component.highlighter)
  );

  if (highlighter) {
    // highlighter.position.x = leftEdge + 1;
    // highlighter.position.y = topEdge /2;
  }

  return state;
};
