// type Button = (params: {
//   btn: BABYLON.GUI.Button;
//   width?: number[];
//   height?: [];
// }) => BABYLON.GUI.Button;
export const button = (btn:BABYLON.GUI.Button):BABYLON.GUI.Button => {
  btn.width = 0.6;
  btn.height = 0.6;
  btn.color = 'white';
  btn.cornerRadius = 20;
  btn.background = 'green';
  btn.fontSize = 30;
  btn.isPointerBlocker = true;

  // const engine = scene.getEngine();

  // const resize = () => {
  //   const canvas = engine.getRenderingCanvasClientRect();
  //   btn.width = getResonsiveSize(
  //     canvas ? canvas.width : 1,
  //     [0.6, 0.5, 0.4, 0.2]
  //   );
  // };
  // resize();

  // engine.onResizeObservable.add(resize);
  // btn.onDisposeObservable.add(() =>
  //   engine.onResizeObservable.removeCallback(resize)
  // );

  return btn;
};
