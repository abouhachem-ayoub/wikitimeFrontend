// codepen from 'isladjan' https://codepen.io/Pierre-Dumas/pen/abgrPKW
import { useRef, useState, useEffect } from 'react';
import { ContextApp } from '../../contexts/ContextApp';
import { useUser } from 'contexts/UserContext';
  //in the codepen from isladjan :
  //https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.min.js
  //https://cdn.jsdelivr.net/npm/three@0.121.1/examples/js/controls/OrbitControls.js
  //https://cdnjs.cloudflare.com/ajax/libs/simplex-noise/2.4.0/simplex-noise.min.js

  // Import Three.js and OrbitControls from the local 'three' package
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

  // Import SimplexNoise from the local 'simplex-noise' package
  import { createNoise2D, createNoise3D, createNoise4D } from 'simplex-noise';
  
  import imageSphereBg from '../../assets/cosmos/textureSphereBg.jpg';
  import imageStar  from '../../assets/cosmos/textureStar.png';
  import image1 from '../../assets/cosmos/texture1.png'; 
  import image2 from '../../assets/cosmos/texture2.png';
  import image4 from '../../assets/cosmos/texture4.png';

  //AEFF don't forget to credit isladjan and foretoo for their codepen contributions

interface BgdCosmosProps {
  workspaceRef: React.RefObject<HTMLDivElement>;
}

const BgdCosmos = ({ workspaceRef }: BgdCosmosProps) => {
    const { userId } = useUser(); // Access the user from the context
    const [SimplexNoise, setSimplexNoise] = useState<any>(null);

    useEffect(() => {
      if (!workspaceRef.current) return;
      // Dynamically import the simplex-noise module
      import('simplex-noise').then((module: any) => {
        setSimplexNoise(() => module.default || module.SimplexNoise || module);
      });
    }, [workspaceRef]);
  
    useEffect(() => {
      if (!workspaceRef.current || !SimplexNoise) return;

//-----------------------------------------------------------
//container = document.getElementById("ThreeCosmos"), // to check
    const container = workspaceRef.current;

    let renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    sphereBg: THREE.Mesh,
    stars: THREE.Points,
    controls: OrbitControls,
    timeout_Debounce: NodeJS.Timeout,
    noise = createNoise3D(),
    cameraSpeed = 0,
    blobScale = 3;

    init();
    animate();

    function init() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 1000);
        camera.position.set(0,0,230);

        const directionalLight = new THREE.DirectionalLight("#fff", 2);
        directionalLight.position.set(0, 50, -20);
        scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight("#ffffff", 1);
        ambientLight.position.set(0, 20, 20);
        scene.add(ambientLight);

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        //OrbitControl
        controls = new OrbitControls(camera, renderer.domElement);
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.3;
        controls.maxDistance = 200;
        controls.minDistance = 200;
        controls.enablePan = true; // corrected 'enablePanx' to 'enablePan'

        const loader = new THREE.TextureLoader();
        //const textureSphereBg = loader.load('https://i.ibb.co/4gHcRZD/bg3-je3ddz.jpg');
        //const textureStar = loader.load("https://i.ibb.co/ZKsdYSz/p1-g3zb2a.png");
        //const texture1 = loader.load("https://i.ibb.co/F8by6wW/p2-b3gnym.png");  
        //const texture2 = loader.load("https://i.ibb.co/yYS2yx5/p3-ttfn70.png");
        //const texture4 = loader.load("https://i.ibb.co/yWfKkHh/p4-avirap.png");
        const textureSphereBg = loader.load(imageSphereBg);
        const textureStar = loader.load(imageStar);
        const texture1 = loader.load(image1);  
        const texture2 = loader.load(image2);
        const texture4 = loader.load(image4);

        /*    Sphere  Background   */
        textureSphereBg.anisotropy = 16;
        const geometrySphereBg = new THREE.SphereGeometry(150, 40, 40); // changed deprecated SphereBufferGeometry -> SphereGeometry
        const materialSphereBg = new THREE.MeshBasicMaterial({
            side: THREE.BackSide,
            map: textureSphereBg,
        });
        sphereBg = new THREE.Mesh(geometrySphereBg, materialSphereBg);
        scene.add(sphereBg);

        /*    Moving Stars   */
        const starsGeometry = new THREE.BufferGeometry();
        const starVertices: number[] = [];

        for (let i = 0; i < 150; i++) {
            const particleStar = randomPointSphere(150);

            // @ts-ignore Adding custom properties for velocity and start position
            particleStar.velocity = THREE.MathUtils.randInt(500, 2000);
            // @ts-ignore
            particleStar.startX = particleStar.x;
            // @ts-ignore
            particleStar.startY = particleStar.y;
            // @ts-ignore
            particleStar.startZ = particleStar.z;

            starVertices.push(particleStar.x, particleStar.y, particleStar.z);
        }

        starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

        const starsMaterial = new THREE.PointsMaterial({
            size: 1,
            color: "#ffffff",
            transparent: true,
            opacity: 0.8,
            map: textureStar,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);

        /*    Fixed Stars   */
        function createStars(texture: THREE.Texture, size: number, total: number) {
            const pointGeometry = new THREE.BufferGeometry();
            const vertices: number[] = [];
            for (let i = 0; i < total; i++) {
                const particles = randomPointSphere(THREE.MathUtils.randInt(149, 70));
                vertices.push(particles.x, particles.y, particles.z);
            }
            pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

            const pointMaterial = new THREE.PointsMaterial({
                size: size,
                map: texture,
                blending: THREE.AdditiveBlending,
            });

            return new THREE.Points(pointGeometry, pointMaterial);
        }

        scene.add(createStars(texture1, 15, 20));   
        scene.add(createStars(texture2, 5, 5));
        scene.add(createStars(texture4, 7, 5));

        function randomPointSphere (radius: number) {
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);
            const dx = radius * Math.sin(phi) * Math.cos(theta);
            const dy = radius * Math.sin(phi) * Math.sin(theta);
            const dz = radius * Math.cos(phi);
            return new THREE.Vector3(dx, dy, dz);
        }
    }

    function animate() {
        const positions = (stars.geometry as THREE.BufferGeometry).getAttribute('position') as THREE.BufferAttribute;

        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);

            const vx = (0 - x) / 500; // simplified velocity usage
            const vy = (0 - y) / 500;
            const vz = (0 - z) / 500;

            positions.setXYZ(i, x + vx, y + vy, z + vz);
        }

        positions.needsUpdate = true;

        sphereBg.rotation.x += 0.0000002;
        sphereBg.rotation.y += 0.0000002;
        sphereBg.rotation.z += 0.0000002;

        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    /*     Resize     */
    window.addEventListener("resize", handleResize);

    function handleResize() {
        clearTimeout(timeout_Debounce);
        timeout_Debounce = setTimeout(onWindowResize, 80);
    }

    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    /*     Fullscreen btn     */
    // let fullscreen;
    // let fsEnter = document.getElementById('fullscr');
    // fsEnter.addEventListener('click', function (e) {
    //     e.preventDefault();
    //     if (!fullscreen) {
    //         fullscreen = true;
    //         document.documentElement.requestFullscreen();
    //         fsEnter.innerHTML = "Exit Fullscreen";
    //     }
    //     else {
    //         fullscreen = false;
    //         document.exitFullscreen();
    //         fsEnter.innerHTML = "Go Fullscreen";
    //     }
    // });

//-----------------------------------------------------------

    // Clean up when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };

  }, [workspaceRef]);
  if (!userId) {
    return (
      <div className="login-message">
        <p>Please log in to view the cosmos.</p>
      </div>
    );
  }

  return <div id="ThreeCosmos" ref={workspaceRef}></div>;
};
export default BgdCosmos;