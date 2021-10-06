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

const gridSize = [3, 3];
const gridColors = [
  // [1, 1, 1, 1, 1, 1, 1, 1, 1],
  // [1, 1, 1, 1, 1, 0, 0, 0, 1],
  // [1, 1, 0, 1, 1, 0, 1, 0, 1],
  // [1, 1, 1, 1, 1, 0, 0, 0, 1],
  // [1, 1, 1, 1, 1, 1, 1, 1, 1],
  // [1, 1, 1, 1, 1, 1, 1, 1, 1],
  // [0, 0, 0, 0, 0, 1, 1, 1, 1],
  // [0, 0, 0, 0, 0, 1, 1, 1, 1],
  // [0, 0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
  // [1, 0, 1, 0, 1, 0, 1, 0, 1],
  // [0, 1, 0, 1, 0, 1, 0, 1, 0],
  // [1, 0, 1, 0, 1, 0, 1, 0, 1],
  // [0, 1, 0, 1, 0, 1, 0, 1, 0],
  // [1, 0, 1, 0, 1, 0, 1, 0, 1],
  // [0, 1, 0, 1, 0, 1, 0, 1, 0],
  // [1, 0, 1, 0, 1, 0, 1, 0, 1],
  // [0, 1, 0, 1, 0, 1, 0, 1, 0],
  // [1, 0, 1, 0, 1, 0, 1, 0, 1],
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

        // int gridColorsLength = 81;
        // int gridSideLength = 9; // 9*9===81
        int gridColorsLength = 9;
        int gridSideLength = 3; // 9*9===81

        vec2 floatPositionToIntPosition(vec2 position) {
          return vec2(int(position.x), int(position.y));
        }
        
        vec3 positionToColor(
            vec2 position, 
            vec3 mainColor
        ) {
          int x = int(position.x);
          int y = int(position.y);
        
          int gridColorsIndex = (y * int(gridSize.x)) + x;
        
          // checks if color is inside grid
          if(x >= 0 && y >= 0 && x < gridSideLength && y < gridSideLength) {
            int colorIndex = int(gridColors[gridColorsIndex]);
            return colors[colorIndex];
          }
        
          return mainColor;
        }
        
        vec3 getColor(
            vec2 position, 
            vec3 mainColor
        ) {
          return positionToColor(
            floatPositionToIntPosition(position), 
            mainColor
          );
        }

        void main(void) {
          // Normalized pixel coordinates (from 0 to 1)
          vec2 uv = gl_FragCoord.xy / resolution.xy;
          vec2 center = vec2(0.5, 0.5);
      
          vec2 mainPosition = vec2(uv.x * gridSize.x, uv.y * gridSize.y);
          vec2 centerPosition = floatPositionToIntPosition(mainPosition) + center;
          vec2 positionDiff = centerPosition - mainPosition;
          float mainColorDistance = distance(mainPosition, centerPosition);
          
          vec3 mainColor = positionToColor(mainPosition, vec3(0,0,0));
          

          // int[18] colorsAround = [
          //    -1,1,   0,1,   1,1,
          //    -1,0,   0,0,   1,0,
          //   -1,-1,  0,-1,  1,-1,
          // ];
      
          vec3 tl = mainColor;
          vec3 bl = mainColor;
          vec3 br = mainColor;
          vec3 tr = mainColor;
      
          if(positionDiff.x > 0.0 && positionDiff.y > 0.0) { // bottom-left
              // tl = getColor(mainPosition + vec2( 0,  0), mainColor);
              // tr = getColor(mainPosition + vec2( 0,  0), mainColor);
              // bl = (getColor(mainPosition + vec2( 0, -1), mainColor) +
              //       getColor(mainPosition + vec2(-1, -1), mainColor) +
              //       getColor(mainPosition + vec2(-1,  0), mainColor)
              //       ) / 3.0;
              // br = getColor(mainPosition + vec2( 1,  0), mainColor);

              tl = vec3(1,1,1);
              tr = vec3(1,1,1);
              bl = vec3(0,0,0);
              br = vec3(0,0,0);
          } else if(positionDiff.x < 0.0 && positionDiff.y > 0.0) { // bottom-right
              // tl = getColor(mainPosition + vec2( 0,  0), mainColor);
              // tr = getColor(mainPosition + vec2( 1,  0), mainColor);
              // bl = getColor(mainPosition + vec2( 0, -1), mainColor);
              // br = (getColor(mainPosition + vec2( 1,  0), mainColor) +
              //       getColor(mainPosition + vec2( 1, -1), mainColor) +
              //       getColor(mainPosition + vec2( 0, -1), mainColor)
              //       ) / 3.0;
              
              tl = vec3(1,1,1);
              tr = vec3(1,1,1);
              bl = vec3(0,0,0);
              br = vec3(0,0,0);
          } else if(positionDiff.x > 0.0 && positionDiff.y < 0.0) { // top-left
              // tl = (getColor(mainPosition + vec2(-1,  0), mainColor) +
              //       getColor(mainPosition + vec2(-1,  1), mainColor) +
              //       getColor(mainPosition + vec2( 0,  1), mainColor)
              //       ) / 3.0;
              // tr = getColor(mainPosition + vec2( 0,  1), mainColor);
              // bl = getColor(mainPosition + vec2(-1,  0), mainColor);
              // br = getColor(mainPosition + vec2( 0,  0), mainColor);

              tl = vec3(1,1,1);
              tr = vec3(1,1,1);
              bl = vec3(0,0,0);
              br = vec3(0,0,0);
          // } else if(positionDiff.x < 0.0 && positionDiff.y < 0.0) { // top-right
          } else { // top-right
              // tl = getColor(mainPosition + vec2(-1,  0), mainColor);
              // tr = (getColor(mainPosition + vec2( 0,  1), mainColor) +
              //       getColor(mainPosition + vec2( 1,  1), mainColor) +
              //       getColor(mainPosition + vec2( 1,  0), mainColor)
              //       ) / 3.0;
              // bl = getColor(mainPosition + vec2(-1, -1), mainColor);
              // br = getColor(mainPosition + vec2( 0, -1), mainColor);

              tl = vec3(1,1,1);
              tr = vec3(1,1,1);
              bl = vec3(0,0,0);
              br = vec3(0,0,0);
          }

          vec3 l = mix(bl, tl, mainPosition.y);
          vec3 r = mix(br, tr, mainPosition.x);
          gl_FragColor = vec4(mix(r, l, mainPosition.y), 1);
        }
      `;

      // precision highp float;
      // varying vec2 vUV;
      // // uniform sampler2D textureSampler;

      // uniform vec3      resolution;           // viewport resolution (in pixels)
      // uniform float     time;                 // shader playback time (in seconds)
      // uniform vec2      gridSize;
      // uniform vec3[8]   colors;
      // uniform float[81]   gridColors;

      // int gridColorsLength = 81;
      // int gridSideLength = 9; // 9*9===81

      // void mainImage()
      // {
      //     vec3 blendedColors = vec3(0,0,0);
      //     gl_FragColor = vec4(blendedColors.xyz / 1.0, 1.0);
      // }

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
