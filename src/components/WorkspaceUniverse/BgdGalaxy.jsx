// codepen from 'foretoo' https://codepen.io/Pierre-Dumas/pen/JjQqxBw
import { useRef, useState, useEffect, useContext } from 'react';
import galaxyMaterialFragmentShader from './galaxyMaterialFragmentShader.glsl';
import galaxyMaterialVertexShader from './galaxyMaterialVertexShader.glsl';
import universeMaterialFragmentShader from './universeMaterialFragmentShader.glsl';
import universeMaterialVertexShader from './universeMaterialVertexShader.glsl';

//three installed?
  //import { AdditiveBlending, BufferAttribute, BufferGeometry, CanvasTexture, Color, PerspectiveCamera, Points, RawShaderMaterial, Scene, WebGLRenderer } from 'three';
  //import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
  //import { TWEEN } from 'three/examples/jsm/libs/tween.module.min';

//not installed three? here you go:
  import { AdditiveBlending, BufferAttribute, BufferGeometry, CanvasTexture, Color, PerspectiveCamera, Points, RawShaderMaterial, Scene, WebGLRenderer } from "https://cdn.skypack.dev/three@0.136.0"
  import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls"
  import { TWEEN } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/libs/tween.module.min.js"
 
//  import * as THREE from 'three';
//  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const BgdGalaxy = ({ workspaceRef }) => {
  const bigbanganim = false; //AEFFsettings
  const coordCamera = false; //AEFFsettings
  const [cameraPosition, setCameraPosition] = useState({ x: 1, y: 1, z: 1 }); //AEFFsettings

  useEffect(() => {
    if (!workspaceRef.current) return;

    // ------------------------ //// SETUP
    const count = 128 ** 2;

    // **Get the canvas size**
    const canvas = workspaceRef.current;
    const { clientWidth, clientHeight } = canvas;

    // **Set up the renderer with the canvas size**
    //const renderer = new WebGLRenderer({ canvas: canvas });
    const renderer = new WebGLRenderer({ canvas: workspaceRef.current });
    renderer.setSize(clientWidth, clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // **Set up the camera with the correct aspect ratio**
    const camera = new PerspectiveCamera(60,clientWidth / clientHeight,0.1,100);
    camera.position.set(-1.16, 0.06, 5.04);
    setCameraPosition({ x: camera.position.x, y: camera.position.y, z: camera.position.z });

    const scene = new Scene();
    const orbit = new OrbitControls(camera, workspaceRef.current);

    // Update camera position on change
    orbit.addEventListener('change', () => {
      setCameraPosition({ x: camera.position.x, y: camera.position.y, z: camera.position.z });
    });

    // ------------------------ //// STAR ALPHA TEXTURE
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = ctx.canvas.height = 32;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 32, 32);

    const grd = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grd.addColorStop(0.0, '#fff');
    grd.addColorStop(1.0, '#000');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.rect(15, 0, 2, 32);
    ctx.fill();
    ctx.beginPath();
    ctx.rect(0, 15, 32, 2);
    ctx.fill();

    const grd2 = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grd2.addColorStop(0.1, '#ffff');
    grd2.addColorStop(0.6, '#0000');
    ctx.fillStyle = grd2;
    ctx.fillRect(0, 0, 32, 32);

    // ------------------------ //// GALAXY
    const galaxyGeometry = new BufferGeometry()
    const galaxyPosition = new Float32Array(count * 3)
    const galaxySeed = new Float32Array(count * 3)
    const galaxySize = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      galaxyPosition[i * 3] = i / count
      galaxySeed[i * 3 + 0] = Math.random()
      galaxySeed[i * 3 + 1] = Math.random()
      galaxySeed[i * 3 + 2] = Math.random()
      galaxySize[i] = Math.random() * 2 + 0.5
    }
    
    galaxyGeometry.setAttribute("position", new BufferAttribute(galaxyPosition, 3))
    galaxyGeometry.setAttribute("size", new BufferAttribute(galaxySize, 1))
    galaxyGeometry.setAttribute("seed", new BufferAttribute(galaxySeed, 3))
    
    const alphaMap = new CanvasTexture(ctx.canvas);
    const innColor = new Color("#fef97c")
    const outColor = new Color("#5800e6")
    
    const galaxyMaterial = new RawShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: renderer.getPixelRatio() },
        uBranches: { value: 2 },
        uRadius: { value: 0 },
        uSpin: { value: Math.PI * 0.25 },
        uRandomness: { value: 0 },
        uAlphaMap: { value: alphaMap },
        uColorInn: { value: innColor },
        uColorOut: { value: outColor },
      },
      vertexShader: galaxyMaterialVertexShader,
      fragmentShader: galaxyMaterialFragmentShader,
    
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    
    const galaxy = new Points(galaxyGeometry, galaxyMaterial)
    galaxy.material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace("#include <random, scatter>", shaderUtils)
    }
    scene.add(galaxy)

    // ------------------------ //// UNIVERSE
    const universeGeometry = new BufferGeometry()
    const universePosition = new Float32Array(count * 3 / 2)
    const universeSeed = new Float32Array(count * 3 / 2)
    const universeSize = new Float32Array(count / 2)
    
    for (let i = 0; i < count / 2; i++) {
      universeSeed[i * 3 + 0] = Math.random()
      universeSeed[i * 3 + 1] = Math.random()
      universeSeed[i * 3 + 2] = Math.random()
      universeSize[i] = Math.random() * 2 + 0.5
    }
    
    universeGeometry.setAttribute("position", new BufferAttribute(universePosition, 3))
    universeGeometry.setAttribute("seed", new BufferAttribute(universeSeed, 3))
    universeGeometry.setAttribute("size", new BufferAttribute(universeSize, 1))
    
    const universeMaterial = new RawShaderMaterial({
    
      uniforms: {
        uTime: { value: 0 },
        uSize: galaxyMaterial.uniforms.uSize,
        uRadius: galaxyMaterial.uniforms.uRadius,
        uAlphaMap: galaxyMaterial.uniforms.uAlphaMap,
      },
    
      vertexShader: universeMaterialVertexShader,
      fragmentShader: universeMaterialFragmentShader,
    
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    
    const universe = new Points(universeGeometry, universeMaterial)
    universe.material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace("#include <random, scatter>", shaderUtils)
    }
    scene.add(universe)

    // ------------------------ //// GUIs
    let cRadius, cSpin, cRandomness;

    galaxyMaterial.uniforms.uSize.value = 0.75;
    galaxyMaterial.uniforms.uBranches.value = 2;
    galaxyMaterial.uniforms.uRadius.value = 1;
    galaxyMaterial.uniforms.uSpin.value = Math.PI * 12;
    galaxyMaterial.uniforms.uRandomness.value = 0.5;
    galaxyMaterial.uniforms.uColorInn.value = new Color('#fef97c');
    galaxyMaterial.uniforms.uColorOut.value = new Color('#5800e6');

    cRadius = { setValue: (value) => (galaxyMaterial.uniforms.uRadius.value = value) };
    cSpin = { setValue: (value) => (galaxyMaterial.uniforms.uSpin.value = value) };
    cRandomness = { setValue: (value) => (galaxyMaterial.uniforms.uRandomness.value = value) };

    // ------------------------ //// ANIMATION
    new TWEEN.Tween({
      radius: 0,
      spin: 0,
      randomness: 0,
      rotate: 0,
    }).to({
      radius: 1.618,
      spin: Math.PI * 2,
      randomness: 0.5,
      rotate: Math.PI * 4,
    })
    .duration(bigbanganim ? 5000 : 0)
    .easing(TWEEN.Easing.Cubic.InOut)
    // .repeat(Infinity)
    // .repeatDelay(1000)
    // .yoyo(true)
    .onUpdate(({ radius, spin, randomness, rotate }) => {
      if (cRadius && cSpin && cRandomness) {
      cRadius.setValue(radius);
      cSpin.setValue(spin);
      cRandomness.setValue(randomness);
      }

      galaxyMaterial.uniforms.uRadius.value = radius;
      galaxyMaterial.uniforms.uSpin.value = spin;
      galaxyMaterial.uniforms.uRandomness.value = randomness;

      galaxy.rotation.y = rotate;
      universe.rotation.y = rotate / 3;
    })
    .start();

    // ------------------------ //// LOOPER
    const t = 0.001;
    renderer.setAnimationLoop(() => {
      galaxyMaterial.uniforms.uTime.value += t / 2;
      universeMaterial.uniforms.uTime.value += t / 3;
      TWEEN.update();
      orbit.update();
      renderer.render(scene, camera);
    });

    const shaderUtils = `
        float random (vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
    
        vec3 scatter (vec3 seed) {
          float u = random(seed.xy);
          float v = random(seed.yz);
          float theta = u * 6.28318530718;
          float phi = acos(2.0 * v - 1.0);
    
          float sinTheta = sin(theta);
          float cosTheta = cos(theta);
          float sinPhi = sin(phi);
          float cosPhi = cos(phi);
    
          float x = sinPhi * cosTheta;
          float y = sinPhi * sinTheta;
          float z = cosPhi;
    
          return vec3(x, y, z);
        }
      `

      // ------------------------ //// HELPERS
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Clean up when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, [workspaceRef]);

  return (
    <>
      {coordCamera && (
      <div className="ThreeGalaxy">
        x: {cameraPosition.x.toFixed(2)}, y: {cameraPosition.y.toFixed(2)}, z: {cameraPosition.z.toFixed(2)}
      </div>
      )}
    </>
  );
};

export default BgdGalaxy;
