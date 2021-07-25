import {
  Effect,
  Vector3,
  ShaderMaterial,
  Scene,
  Texture,
  MeshBuilder,
} from 'babylonjs';

type BackgroundBlueprint = (params: { scene: Scene }) => void;
export const backgroundBlueprint: BackgroundBlueprint = ({ scene }) => {
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
        gl_Position = worldViewProjection * vec4(position, 1.0);
        vUV = uv;
    }
  `;

  Effect.ShadersStore['customFragmentShader'] = `
    precision highp float;
    varying vec2 vUV;
    uniform sampler2D textureSampler;

    void main(void) {
        gl_FragColor = vec4(1.0,0.0,1.0,1.0);
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
        'world',
        'worldView',
        'worldViewProjection',
        'view',
        'projection',
      ],
    }
  );

  const mainTexture = new Texture('textures/amiga.jpg', scene);

  shaderMaterial.setTexture('textureSampler', mainTexture);

  shaderMaterial.backFaceCulling = false;

  const background = MeshBuilder.CreatePlane('background', { size: 1 }, scene);
  background.material = shaderMaterial;
  background.position = new Vector3(0, 0, -5);
  background.scaling = new Vector3(20, 20, 1);

  return scene;
};
