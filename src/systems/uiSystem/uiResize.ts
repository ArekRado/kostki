import { Breakpoints, State } from '../../ecs/type';

import { Scene } from 'babylonjs';
import {
  UIElement,
  UIButton,
  UIText,
  UIImage,
  Dictionary,
} from '../../ecs/type';
import { clamp } from '../../utils/clamp';
import { getAspectRatio } from '../../utils/getAspectRatio';
import { componentName, getComponentsByName } from '../../ecs/component';
import { getUiControl } from './getUiControl';

export const breakpoints: Breakpoints = [
  768, // Small
  1200, // Medium
  1400, // Large
];

type GetBreakpoint = (containerSize: number) => <X>(sizes: Breakpoints<X>) => X;
export const getResonsiveValue: GetBreakpoint = (containerSize) => (sizes) =>
  sizes.find((_, index) => containerSize < breakpoints[index]) ||
  sizes[sizes.length - 1];

export const normalizePosition = (position: [number, number]) => [
  `${(position[0] - 0.5) * 100}%`,
  `${(position[1] - 0.5) * 100}%`,
];

type GetResponsivePositionAndSize = (params: {
  element: UIElement;
  screenRatio: number;
  canvasWidth: number;
}) => { width: number; height: number; left: string; top: string };
const getResponsivePositionAndSize: GetResponsivePositionAndSize = ({
  element,
  screenRatio,
  canvasWidth,
}) => {
  const getResponsive = getResonsiveValue(canvasWidth);
  const newPosition = getResponsive(element.position);
  const [left, top] = normalizePosition(newPosition);

  const newSize = getResponsive(element.size);

  const newSizeWithAspectRatio =
    element.aspectRatio && getResponsive(element.aspectRatio)
      ? [newSize[0], newSize[1] / screenRatio]
      : [newSize[0], newSize[1]];

  const newMinSize = element.minSize ? getResponsive(element.minSize) : [0, 0];
  const newMaxSize = element.maxSize ? getResponsive(element.maxSize) : [1, 1];

  const width = clamp({
    value: newSizeWithAspectRatio[0],
    min: newMinSize[0],
    max: newMaxSize[0],
  });

  const height = clamp({
    value: newSizeWithAspectRatio[1],
    min: newMinSize[1],
    max: newMaxSize[1],
  });

  return {
    width,
    height,
    left,
    top,
  };
};

const updateSizeAndPosition = ({
  state,
  elements,
  screenRatio,
  canvasWidth,
}: {
  state: State;
  elements: undefined | Dictionary<UIElement>;
  screenRatio: number;
  canvasWidth: number;
}): State => {
  if (elements) {
    state = Object.entries(elements).reduce(
      (acc, [entity, component]): State => {
        const { width, height, top, left } = getResponsivePositionAndSize({
          element: component,
          screenRatio,
          canvasWidth,
        });

        const control = getUiControl({ entity });

        if (control) {
          control.width = width;
          control.height = height;
          control.top = top;
          control.left = left;
        }

        return acc;
      },
      state
    );
  }

  return state;
};

const updateResponsiveProperty = <ElementType>({
  state,
  elements,
  callback,
}: {
  state: State;
  elements: undefined | Dictionary<ElementType>;
  callback: (
    previousValue: State,
    currentValue: [string, ElementType],
    control: BABYLON.GUI.Control
  ) => State;
}): State => {
  if (elements) {
    state = Object.entries(elements).reduce((acc, val) => {
      const control = getUiControl({ entity: val[0] }) as BABYLON.GUI.Control;

      return control ? callback(acc, val, control) : acc;
    }, state);
  }

  return state;
};

export const uiResize = ({
  state,
  scene,
}: {
  state: State;
  scene: Scene;
}): State => {
  const engine = scene.getEngine();
  const canvas = engine.getRenderingCanvasClientRect();
  const canvasWidth = canvas ? canvas.width : 1;
  const screenRatio = getAspectRatio(scene);

  const buttons = getComponentsByName<UIButton>({
    state,
    name: componentName.uiButton,
  });

  const texts = getComponentsByName<UIText>({
    state,
    name: componentName.uiText,
  });

  const images = getComponentsByName<UIImage>({
    state,
    name: componentName.uiImage,
  });

  state = updateSizeAndPosition({
    elements: buttons,
    state,
    screenRatio,
    canvasWidth,
  });

  state = updateSizeAndPosition({
    elements: texts,
    state,
    screenRatio,
    canvasWidth,
  });

  state = updateSizeAndPosition({
    elements: images,
    state,
    screenRatio,
    canvasWidth,
  });

  const defaultFontSize: Breakpoints<number> = [24, 24, 24];
  state = updateResponsiveProperty<UIText>({
    state,
    elements: texts,
    callback: (acc, [entity, component], control) => {
      if (component) {
        const newFontSize = getResonsiveValue(canvasWidth)(
          component.fontSize || defaultFontSize
        );
        control.fontSize = newFontSize;
      }

      return acc;
    },
  });

  return state;
};
