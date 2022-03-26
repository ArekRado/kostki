import { Scene } from '@babylonjs/core/scene'
import { Game, State } from '../../type'
import { setTextureCache } from '../../utils/textureCache'
import { set1 } from '../../utils/textureSets'

const preloadDefaultBoxTextures = (scene: Scene) => {
  setTimeout(() => {
    set1.forEach((src) => {
      const image = new Image()
      image.src = src

      image.onload = () => {
        setTextureCache({ textureUrl: src, scene })
      }
    })
  }, Math.random() * 2000 + 1000)
}

export const create = ({ state }: { component: Game; state: State }): State => {
  const sceneRef = state.babylonjs.sceneRef
  if (!sceneRef) {
    return state
  }

  preloadDefaultBoxTextures(sceneRef)

  return state
}
