import { createSystem } from '../ecs/createSystem';
import { componentName, createGetSetForUniqComponent } from '../ecs/component';
import { State, Background } from '../ecs/type';
import {
  Effect,
  Vector3,
  ShaderMaterial,
  Scene,
  Texture,
  MeshBuilder,
  Vector2,
  Color3,
} from 'babylonjs';
import { scene } from '..';
import set16 from '../assets/6/1.png';
import { setCamera } from './cameraSystem';
import {
  gray,
  green,
  teal,
  orange,
  yellow,
  red,
  pink,
  purple,
} from '../utils/colors';
import { playersList } from './gameSystem/handleChangeSettings';

export const backgroundEntity = '17818552155683748';

const backgroundGetSet = createGetSetForUniqComponent<Background>({
  entity: backgroundEntity,
  name: componentName.background,
});

export const getBackground = backgroundGetSet.getComponent;
export const setBackground = backgroundGetSet.setComponent;

// x = 5
// y = 2
// i = 22

// x = 2
// y = 3
// i = 29

// (5 + 9) * 2
// (3 * 9) + 2

const gridSize = [9, 9];
const gridColors = [
  // [8, 7, 6, 5, 4, 3, 2, 1, 0],
  // [0, 1, 2, 3, 4, 5, 6, 7, 8],
  // [8, 7, 6, 5, 4, 3, 2, 1, 0],
  // [0, 1, 2, 3, 4, 5, 6, 7, 8],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 0, 0, 0, 1],
  [1, 1, 0, 1, 1, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 1, 1, 1, 1],
].flat();
// .map((i) => Math.floor(Math.random() * 9));

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
        varying vec2 vUV;
        // uniform sampler2D textureSampler;

        uniform vec3      resolution;           // viewport resolution (in pixels)
        uniform float     time;                 // shader playback time (in seconds)
        uniform vec2      gridSize;
        uniform vec3[8]   colors;
        uniform float[81]   gridColors;

        int gridColorsLength = 81;
        int gridSideLength = 9; // 9*9===81

        vec2 floatPositionToIntPosition(vec2 position) {
          return vec2(int(position.x), int(position.y));
        }

        vec3 positionToColor(vec2 position, vec3 mainColor) {
          int x = int(position.x);
          int y = int(position.y);

          int gridColorsIndex = (y * int(gridSize.x)) + x;
          vec3 color = vec3(1.0,1.0,1.0);

          // checks if color is inside grid
          if(x >= 0 && y >= 0 && x < gridSideLength && y < gridSideLength) {
            int colorIndex = int(gridColors[gridColorsIndex]);
            return colors[colorIndex];
          }

          return mainColor;
        }

        float getValueBetween(
          float valueA,
          float valueB,
          float percentage
        ) {
          // returns value between A and B basing on a percentage where
          // 0.0 is A and 1.0 is B

          // if(valueA > valueB) {
          //   return valueB + ((valueA - valueB) * percentage);
          // } else {
          return valueA + ((valueB - valueA) * percentage);
          // }
        }

        vec3 blendColors(
          vec3 mainColor, 
          vec3 color, 
          float colorDistance
          ) {
          // float normalizedDistance = clamp(sqrt(colorDistance), 0.0, 1.0);
          // float normalizedDistance = clamp(colorDistance, 0.0, 1.0);
          float normalizedDistance = colorDistance;

          // vec3 colorBetween = vec3(
          //   getValueBetween(mainColor.x, color.x, normalizedDistance),
          //   getValueBetween(mainColor.y, color.y, normalizedDistance),
          //   getValueBetween(mainColor.z, color.z, normalizedDistance)
          // );

          vec3 colorBetween = mix(mainColor, color, normalizedDistance);

          return colorBetween;
        }

        void main(void) {
            float seconds = time / 1000.0;
            // vec3 tileSize = resolution / float(gridSideLength);
            // float tileDiagonal = sqrt(tileSize.x*tileSize.x + tileSize.y*tileSize.y);
            
            // Normalized pixel coordinates (from 0 to 1)
            vec2 uv = gl_FragCoord.xy / resolution.xy;

            vec2 center = vec2(0.5, 0.5);

            vec2 mainPosition = vec2(uv.x * gridSize.x, uv.y * gridSize.y);
            vec2 centerPosition = floatPositionToIntPosition(mainPosition) + center;
            float mainColorDistance = distance(mainPosition, centerPosition);

            vec3 mainColor = positionToColor(mainPosition, vec3(0,0,0));

            // int[18] colorsAround = [
            //    -1,1,   0,1,   1,1,
            //    -1,0,   0,0,   1,0,
            //   -1,-1,  0,-1,  1,-1,
            // ];

            int amount = 4;

            vec2[8] positions;
            vec2[8] positionsCenters;


             positions[0] = vec2(0.0,  1.0); // up
             positions[1] = vec2(0.0, -1.0); // down

             positions[2] = vec2(-1.0, 0.0); // left
             positions[3] = vec2(1.0,  0.0); // right
          
            //  positions[4] = vec2(-1.0, 1.0); // up-left
            //  positions[5] = vec2(1.0,  1.0); // up-right
            //  positions[6] = vec2(-1.0,-1.0); // down-left
            //  positions[7] = vec2(1.0, -1.0); // up-right


             positionsCenters[0] = vec2(0.5, 0.0); // up
             positionsCenters[1] = vec2(0.5, 1.0); // down

             positionsCenters[2] = vec2(1.0, 0.5); // left
             positionsCenters[3] = vec2(0.0, 0.5); // right

            //  positionsCenters[4] = vec2(0.0, 1.0); // up-left
            //  positionsCenters[5] = vec2(1.0, 1.0); // up-right
            //  positionsCenters[6] = vec2(0.0, 0.0); // down-left
            //  positionsCenters[7] = vec2(1.0, 0.0); // up-right

           vec3 blendedColors = vec3(0,0,0);

           for(int i = 0; i < amount; i++) {
              vec2 position = mainPosition + positions[i];
              vec2 colorCenter = floatPositionToIntPosition(position);
              vec3 color = positionToColor(colorCenter, mainColor);
              float colorDistance = distance(position, colorCenter + positionsCenters[i]);

              // float xD = abs(sin(seconds)) * 2.0;

              // if(colorDistance > xD && colorDistance < xD + 0.05) {
              //   vec3 xd = vec3(0.0, 0.0, 0.0);

              //   blendedColors += 
              //     blendColors(
              //       mainColor, 
              //       xd, 
              //       colorDistance
              //       );
              // } 

              float normalizedDistance = clamp(colorDistance * 4.0, 0.0, 1.0);
              // float normalizedDistance = colorDistance;
    
              blendedColors += mix(mainColor, color, normalizedDistance);
           }

            // gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            // Time varying pixel color
            // vec3 col = 0.5 + 0.5 * sin(seconds + uv.xyx + vec3(0, 2, 4));
        
            // if(x > 2.0) {
            // gl_FragColor = vec4(0.0,0.0,0.0, 1.0);
            // } else {
              // gl_FragColor = vec4(blendedColors.xyz * sin(seconds) / 9.0, 1.0);
              gl_FragColor = vec4(blendedColors.xyz / float(amount), 1.0);
            // }
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
      background.position = new Vector3(0, 0, 5);
      background.scaling = new Vector3(20, 20, 1);

      const colors = playersList();

      (background.material as ShaderMaterial).setColor3Array(
        'colors',
        colors.map(({ color: [r, g, b] }) => new Color3(r, g, b))
      );

      state = setCamera({
        state,
        data: {
          position: [4.2, 4.2],
          distance: 5,
        },
      });

      return state;
    },
    update: ({ state, component }) => {
      return state;
    },
    tick: ({ state }) => {
      const background = scene.getMeshByUniqueId(parseFloat(backgroundEntity));

      if (background && background.material) {
        (background.material as ShaderMaterial).setFloat(
          'time',
          performance.now()
        );
        (background.material as ShaderMaterial).setVector3(
          'resolution',
          new Vector3(window.innerWidth, window.innerHeight, 0)
        );
        (background.material as ShaderMaterial).setVector2(
          'gridSize',
          new Vector2(gridSize[0], gridSize[1])
        );
        (background.material as ShaderMaterial).setFloats(
          'gridColors',
          gridColors
        );
      }

      return state;
    },
  });
