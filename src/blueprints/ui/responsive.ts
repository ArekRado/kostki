import { Scene } from 'babylonjs';
import { UIElement } from '../../ecs/type';
import { clamp } from '../../utils/clamp';
import { getAspectRatio } from '../../utils/getAspectRatio';

export type Breakpoints<Value = number> = [Value, Value, Value];

export const breakpoints: Breakpoints = [
  768, // Small
  1200, // Medium
  1400, // Large
];

type GetBreakpoint = <X>(containerSize: number, sizes: Breakpoints<X>) => X;
export const getResonsiveSize: GetBreakpoint = (containerSize, sizes) =>
  sizes.find((_, index) => containerSize < breakpoints[index]) ||
  sizes[sizes.length - 1];

export const normalizePosition = (position: [number, number]) => [
  `${(position[0] - 0.5) * 100}%`,
  `${(position[1] - 0.5) * 100}%`,
];

type Responsive = (params: {
  element: UIElement;
  babylonElement: BABYLON.GUI.Control & {
    onDisposeObservable: BABYLON.Observable<BABYLON.GUI.Control>;
  };
  scene: Scene;
}) => UIElement;
export const responsive: Responsive = ({ element, babylonElement, scene }) => {
  const engine = scene.getEngine();

  const resize = () => {
    const canvas = engine.getRenderingCanvasClientRect();
    const canvasWidth = canvas ? canvas.width : 1;
    const ratio = element.aspectRation ? getAspectRatio(scene) : 1;

    const newPosition = getResonsiveSize(canvasWidth, element.position);
    const [left, top] = normalizePosition(newPosition);

    const newSize = getResonsiveSize(canvasWidth, element.size);
    const newSizeWithAspectRatio = [newSize[0], newSize[1] / ratio];
    const newMinSize = element.minSize
      ? getResonsiveSize(canvasWidth, element.minSize)
      : [0, 0];
    const newMaxSize = element.maxSize
      ? getResonsiveSize(canvasWidth, element.maxSize)
      : [1, 1];

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

    babylonElement.width = width;
    babylonElement.height = height;
    babylonElement.top = top;
    babylonElement.left = left;
  };
  resize();

  engine.onResizeObservable.add(resize);
  babylonElement.onDisposeObservable.add(() =>
    engine.onResizeObservable.removeCallback(resize)
  );

  return element;
};
