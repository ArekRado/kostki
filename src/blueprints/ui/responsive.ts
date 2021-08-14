import { Scene } from 'babylonjs';

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

type Responsive = <X, Size>(params: {
  element: X & { onDisposeObservable: BABYLON.Observable<BABYLON.GUI.Control> };
  scene: Scene;
  callback: (responsiveSize: Size) => void;
  sizes: Breakpoints<Size>;
}) => X;
export const responsive: Responsive = ({ element, callback, scene, sizes }) => {
  const engine = scene.getEngine();

  const resize = () => {
    const canvas = engine.getRenderingCanvasClientRect();
    const newSize = getResonsiveSize(canvas ? canvas.width : 1, sizes);
    callback(newSize);
  };
  resize();

  engine.onResizeObservable.add(resize);
  element.onDisposeObservable.add(() =>
    engine.onResizeObservable.removeCallback(resize)
  );

  return element;
};

export const normalizePosition = (position: [number, number]) => [
  `${(position[0] - 0.5) * 100}%`,
  `${(position[1] - 0.5) * 100}%`,
];
