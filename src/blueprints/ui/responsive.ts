import { Scene } from 'babylonjs';

export type Breakpoints = [number, number, number];

export const breakpoints: Breakpoints = [
  768, // Small
  1200, // Medium
  1400, // Large
];

type GetBreakpoint = (containerSize: number, sizes: Breakpoints) => number;
export const getResonsiveSize: GetBreakpoint = (containerSize, sizes) =>
  sizes.find((_, index) => containerSize < breakpoints[index]) ||
  sizes[sizes.length - 1];

type Responsive = <X>(params: {
  element: X & { onDisposeObservable: BABYLON.Observable<BABYLON.GUI.Control> };
  scene: Scene;
  callback: (responsiveSize: number) => void;
  sizes: Breakpoints;
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
