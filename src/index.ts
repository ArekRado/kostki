import { getState } from './getState'
import { register } from './serviceWorkerRegistration'
import { mountGameUI } from './ui/App'

import { Engine } from '@babylonjs/core/Engines/engine'
import { NullEngine } from '@babylonjs/core/Engines/nullEngine'
import { Scene } from '@babylonjs/core/scene'
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Camera } from '@babylonjs/core/Cameras/camera'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color'
import { emitEvent, runOneFrame } from '@arekrado/canvas-engine'
import { CameraEvent } from '@arekrado/canvas-engine/system/camera/camera'
import { doNothing } from './utils/js/doNothing'

const canvas = document.getElementById('game') as HTMLCanvasElement
export const humanPlayerEntity = 'humanPlayer'

// Engine
const engine =
  process.env.NODE_ENV !== 'test'
    ? new Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        disableWebGL2Support: false,
      })
    : new NullEngine({
        renderWidth: 1,
        renderHeight: 1,
        textureSize: 1,
        deterministicLockstep: true,
        lockstepMaxSteps: 1,
      })

// Scene
const scene = new Scene(engine)
// scene.debugLayer.show();

engine.runRenderLoop(() => {
  if (scene && scene.activeCamera) {
    scene.render()
  }
})

// Camera
const camera = new UniversalCamera(
  'UniversalCamera',
  new Vector3(0, 0, -1),
  scene,
)
camera.mode = Camera.ORTHOGRAPHIC_CAMERA

// camera.attachControl(canvas, true);

// Light
export const light = new HemisphericLight('light', new Vector3(0, 0, 1), scene)
light.intensity = 1

light.diffuse = new Color3(1, 1, 1)
light.specular = new Color3(1, 1, 1)
light.groundColor = new Color3(1, 1, 1)

// Because mutations breaks everything
if (process.env.NODE_ENV !== 'test') {
  if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    register({
      onUpdate: doNothing,
      onSuccess: doNothing,
    })

    // navigator.serviceWorker.addEventListener(
    //   'message',
    //   // eslint-disable-next-line @typescript-eslint/no-misused-promises
    //   async (
    //     event: MessageEvent<{
    //       meta: string
    //       payload: { cacheName: string; updatedURL: string }
    //     }>,
    //   ) => {
    //     // Optional: ensure the message came from workbox-broadcast-update
    //     if (event.data.meta === 'workbox-broadcast-update') {
    //       const { cacheName, updatedURL } = event.data.payload

    //       // Do something with cacheName and updatedURL.
    //       // For example, get the cached content and update
    //       // the content on the page.
    //       const cache = await caches.open(cacheName)
    //       const updatedResponse = await cache.match(updatedURL)
    //       const updatedText = await updatedResponse?.text()

    //       emitEvent<GameEvent.ShowNewVersionEvent>({
    //         type: GameEvent.Type.showNewVersion,
    //         payload: {},
    //       })
    //     }
    //   },
    // )
  }
  scene.clearColor = new Color4(0, 0, 0, 0)
  document.querySelector('#loader')?.remove()

  let state = getState({
    scene,
    camera,
    Vector3: Vector3,
  })

  mountGameUI({ state })

  if (state.babylonjs.sceneRef) {
    const beforeRenderCallback = () => {
      state = runOneFrame({ state })
    }

    state.babylonjs.sceneRef.registerBeforeRender(beforeRenderCallback)
  }

  // Resize
  window.addEventListener('resize', () => {
    emitEvent<CameraEvent.ResizeEvent>({
      type: CameraEvent.Type.resize,
      payload: {},
    })

    engine.resize()
  })

  window.addEventListener('contextmenu', (e) => e.preventDefault(), false);
}
