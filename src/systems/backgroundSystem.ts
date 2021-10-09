import { createSystem } from '../ecs/createSystem';
import { componentName, createGetSetForUniqComponent } from '../ecs/component';
import { State, Background } from '../ecs/type';
import {
  Effect,
  Vector3,
  ShaderMaterial,
  MeshBuilder,
  Vector2,
  Color3,
} from 'babylonjs';
import { scene } from '..';
import { getCamera, getCameraSize } from './cameraSystem';
import {
  grayGradient,
  greenGradient,
  tealGradient,
  orangeGradient,
  yellowGradient,
  redGradient,
  pinkGradient,
  purpleGradient,
} from '../utils/colors';
import { playersList } from './gameSystem/handleChangeSettings';

export const backgroundEntity = '17818552155683748';

const backgroundGetSet = createGetSetForUniqComponent<Background>({
  entity: backgroundEntity,
  name: componentName.background,
});

export const getBackground = backgroundGetSet.getComponent;
export const setBackground = backgroundGetSet.setComponent;

const resizeBackground = (state: State): State => {
  const background = scene.getMeshByUniqueId(parseFloat(backgroundEntity));
  const camera = getCamera({ state });

  if (background && camera) {
    const size = getCameraSize(camera.distance, scene);

    background.position.x = camera.position[0];
    background.position.y = camera.position[1];

    background.scaling = new Vector3(
      Math.abs(size.left) + Math.abs(size.right),
      Math.abs(size.bottom) + Math.abs(size.top),
      1
    );
  }

  return state;
};

export const backgroundSystem = (state: State) =>
  createSystem<Background, {}>({
    state,
    name: componentName.background,
    create: ({ state, component }) => {
      Effect.ShadersStore['customVertexShader'] = ` 
        precision highp float;

        // Attributes
        attribute vec3 position;
        attribute vec2 uv;

        // Uniforms
        uniform mat4 worldViewProjection;

        // Varying
        varying vec2 vUV;

        void main(void) {
            gl_Position = worldViewProjection * vec4(position, 1);
            vUV = uv;
        }
      `;

      Effect.ShadersStore['customFragmentShader'] = `
        precision highp float;
  
        // out vec4 fragColor;
        
        uniform float iTime;
        uniform vec2 iResolution;
        uniform float[30] iColors;

        // const vec2 iResolution = vec2(512, 512);
        
        struct RadialGradient {
            float radius;
            vec4 color;
            vec2 point;
        };
      
        void main(void) {
            float w = iResolution.x / 2.;
            float h = iResolution.y / 2.;
      
            float fill = max(iResolution.x, iResolution.y);
            // float contain = min(iResolution.x, iResolution.y);
      
            // colors
            // vec4 colors[] = vec4[](
            //     vec4(.604,.816,1.00,.7),
            //     vec4(.125,.310,.725,.7),
            //     vec4(.482,.357,.784,.7),
            //     vec4(.580,.702,.988,.7),
            //     vec4(.161,.302,.827,.7),
            //     vec4(.137,.467,.729,.7),
            //     vec4(.114,.686,.925,.7),
            //     vec4(.216,.412,.745,.7),
            //     vec4(.616,.792,.992,.7),
            //     vec4(.353,.906,.992,.7)
            // );

            vec4 colors[] = vec4[](
                vec4(iColors[0],iColors[1],iColors[2], .7),
                vec4(iColors[3],iColors[4],iColors[5], .7),
                vec4(iColors[6],iColors[7],iColors[8], .7),
                vec4(iColors[9],iColors[10],iColors[11], .7),
                vec4(iColors[12],iColors[13],iColors[14], .7),
                vec4(iColors[15],iColors[16],iColors[17], .7),
                vec4(iColors[18],iColors[19],iColors[20], .7),
                vec4(iColors[21],iColors[22],iColors[23], .7),
                vec4(iColors[24],iColors[25],iColors[26], .7),
                vec4(iColors[27],iColors[28],iColors[29], .7)
            );
      
            // gradients
            RadialGradient gradients[] = RadialGradient[](
                RadialGradient(1.0, colors[0], vec2(0.5 * w * sin(.13 * iTime - 0.44) + w, 0.5 * h * sin(.34 * iTime - 2.41) + h)),
                RadialGradient(1.0, colors[1], vec2(0.5 * w * sin(.93 * iTime - 5.58) + w, 1.0 * h * sin(.82 * iTime - 3.04) + h)),
                RadialGradient(1.0, colors[2], vec2(1.0 * w * sin(.45 * iTime - 2.70) + w, 0.5 * h * sin(.94 * iTime - 5.24) + h)),
                RadialGradient(1.0, colors[3], vec2(1.0 * w * sin(.15 * iTime - 3.59) + w, 1.0 * h * sin(.96 * iTime - 5.11) + h)),
                RadialGradient(1.0, colors[4], vec2(0.5 * w * sin(.35 * iTime - 4.73) + w, 0.5 * h * sin(.42 * iTime - 3.87) + h)),
                RadialGradient(1.0, colors[5], vec2(0.5 * w * sin(.62 * iTime - 4.81) + w, 1.0 * h * sin(.19 * iTime - 1.17) + h)),
                RadialGradient(1.0, colors[6], vec2(1.0 * w * sin(.58 * iTime - 5.13) + w, 0.5 * h * sin(.10 * iTime - 2.08) + h)),
                RadialGradient(0.5, colors[7], vec2(1.5 * w * sin(.12 * iTime - 4.36) + w * 2., 0.5 * h * sin(.08 * iTime - 1.48) + h * 2.)),
                RadialGradient(0.6, colors[8], vec2(1.5 * w * sin(.07 * iTime - 3.94) + w * 2., 0.6 * h * sin(.03 * iTime - 2.03) + h * 2.)),
                RadialGradient(0.5, colors[9], vec2(1.5 * w * sin(.01 * iTime - 3.74) + w * 2., 0.5 * h * sin(.12 * iTime - 0.62) + h * 2.))
            );
      
            vec3 color = vec3(0.);
      
            for(int i = 0; i < gradients.length(); ++i) {
                color = mix(
                    gradients[i].color.rgb,
                    color,
                    gradients[i].color.a * distance(gradients[i].point, gl_FragCoord.xy) / ( fill * gradients[i].radius)
                );
            }
      
            gl_FragColor = vec4(color,1.0);
        }
      `;

      const shaderMaterial = new ShaderMaterial(
        'shader',
        scene,
        {
          vertex: 'custom',
          fragment: 'custom',
        },
        {
          attributes: ['position', 'normal', 'uv'],
          uniforms: [
            'worldViewProjection',
            'time',
            'resolution',
            'gridSize',
            'colors',
            'gridColors',
          ],
        }
      );

      shaderMaterial.setFloat('time', performance.now());
      shaderMaterial.setVector3(
        'resolution',
        new Vector3(window.innerWidth, window.innerHeight, 0)
      );

      shaderMaterial.backFaceCulling = false;

      const background = MeshBuilder.CreatePlane(
        backgroundEntity,
        { size: 1 },
        scene
      );
      background.uniqueId = parseFloat(backgroundEntity);
      background.material = shaderMaterial;

      const colors = playersList();

      (background.material as ShaderMaterial).setColor3Array(
        'colors',
        colors.map(({ color: [r, g, b] }) => new Color3(r, g, b))
      );

      return resizeBackground(state);
    },
    update: ({ state, component }) => {
      return resizeBackground(state);
    },
    tick: ({ state }) => {
      const background = scene.getMeshByUniqueId(parseFloat(backgroundEntity));

      if (background && background.material) {
        (background.material as ShaderMaterial).setFloat(
          'iTime',
          performance.now() / 1000
        );

        (background.material as ShaderMaterial).setVector2(
          'iResolution',
          new Vector2(window.innerWidth, window.innerHeight)
        );

        (background.material as ShaderMaterial).setFloats(
          'iColors',
          tealGradient.flat()
        );
      }

      return state;
    },
  });
