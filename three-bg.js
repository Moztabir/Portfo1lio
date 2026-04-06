import * as THREE from 'https://unpkg.com/three@0.163.0/build/three.module.js';

const mount = document.getElementById('three-bg');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.z = 12;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
mount.appendChild(renderer.domElement);

/* -----------------------------
   MAIN GROUP
----------------------------- */
const universe = new THREE.Group();
scene.add(universe);

/* -----------------------------
   LIGHTS
----------------------------- */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.1, 100);
pointLight.position.set(8, 10, 14);
scene.add(pointLight);

/* -----------------------------
   CENTER ORIGINAL WIREFRAME PLANET
----------------------------- */
const centerGroup = new THREE.Group();
universe.add(centerGroup);

const sphereGeo = new THREE.IcosahedronGeometry(1.2, 8);
const sphereMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
  transparent: true,
  opacity: 0.16
});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
centerGroup.add(sphere);

const ringGeo = new THREE.TorusGeometry(2.6, 0.03, 20, 180);
const ringMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.12
});
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = Math.PI * 0.4;
centerGroup.add(ring);

/* -----------------------------
   LEFT PLANET (JUPITER-LIKE)
----------------------------- */
const leftPlanetGroup = new THREE.Group();
leftPlanetGroup.position.set(-6.4, 1.8, -3);
universe.add(leftPlanetGroup);

const leftPlanetGeo = new THREE.SphereGeometry(1.55, 48, 48);
const leftPlanetMat = new THREE.MeshStandardMaterial({
  color: 0xd59a63,
  roughness: 0.95,
  metalness: 0.02
});
const leftPlanet = new THREE.Mesh(leftPlanetGeo, leftPlanetMat);
leftPlanetGroup.add(leftPlanet);

const leftGlowGeo = new THREE.SphereGeometry(1.75, 48, 48);
const leftGlowMat = new THREE.MeshBasicMaterial({
  color: 0xf0b27a,
  transparent: true,
  opacity: 0.08
});
const leftGlow = new THREE.Mesh(leftGlowGeo, leftGlowMat);
leftPlanetGroup.add(leftGlow);

/* -----------------------------
   RIGHT PLANET (SATURN-LIKE)
----------------------------- */
const rightPlanetGroup = new THREE.Group();
rightPlanetGroup.position.set(6.2, -1.9, -4.2);
universe.add(rightPlanetGroup);

const rightPlanetGeo = new THREE.SphereGeometry(1.2, 48, 48);
const rightPlanetMat = new THREE.MeshStandardMaterial({
  color: 0xd8c28d,
  roughness: 0.95,
  metalness: 0.02
});
const rightPlanet = new THREE.Mesh(rightPlanetGeo, rightPlanetMat);
rightPlanetGroup.add(rightPlanet);

const saturnRingGeo = new THREE.RingGeometry(1.7, 2.5, 100);
const saturnRingMat = new THREE.MeshBasicMaterial({
  color: 0xe5d3a8,
  transparent: true,
  opacity: 0.28,
  side: THREE.DoubleSide
});
const saturnRing = new THREE.Mesh(saturnRingGeo, saturnRingMat);
saturnRing.rotation.x = Math.PI * 0.42;
saturnRing.rotation.y = Math.PI * 0.18;
rightPlanetGroup.add(saturnRing);

const rightGlowGeo = new THREE.SphereGeometry(1.38, 48, 48);
const rightGlowMat = new THREE.MeshBasicMaterial({
  color: 0xf3e3b9,
  transparent: true,
  opacity: 0.06
});
const rightGlow = new THREE.Mesh(rightGlowGeo, rightGlowMat);
rightPlanetGroup.add(rightGlow);

/* -----------------------------
   STAR FIELD
----------------------------- */
const particlesCount = 1600;
const positions = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 42;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 28;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
}

const particlesGeo = new THREE.BufferGeometry();
particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particlesMat = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.03,
  transparent: true,
  opacity: 0.62
});

const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

/* -----------------------------
   SHOOTING STARS
----------------------------- */
const shootingStars = [];
const shootingStarCount = 3;

function createShootingStar() {
  const starGroup = new THREE.Group();

  const headGeo = new THREE.SphereGeometry(0.05, 10, 10);
  const headMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.95
  });
  const head = new THREE.Mesh(headGeo, headMat);
  starGroup.add(head);

  // tail trails behind the motion
  const tailGeo = new THREE.BufferGeometry();
  const tailPositions = new Float32Array([
    0, 0, 0,
    1.0, 0.45, 0
  ]);
  tailGeo.setAttribute('position', new THREE.BufferAttribute(tailPositions, 3));

  const tailMat = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.32
  });

  const tail = new THREE.Line(tailGeo, tailMat);
  starGroup.add(tail);

  scene.add(starGroup);

  const starObj = {
    group: starGroup,
    speedX: 0.18 + Math.random() * 0.06,
    speedY: 0.08 + Math.random() * 0.035,
    delay: Math.random() * 180,
    active: false
  };

  shootingStars.push(starObj);
  resetShootingStar(starObj, true);
}

function resetShootingStar(starObj, initial = false) {
  starObj.group.position.set(
    12 + Math.random() * 10,
    7 + Math.random() * 7,
    -6 - Math.random() * 6
  );

  // angle matches motion: down-left
  starObj.group.rotation.z = 0;

  if (!initial) {
    starObj.delay = 80 + Math.random() * 180;
    starObj.active = false;
  }
}

for (let i = 0; i < shootingStarCount; i++) {
  createShootingStar();
}

/* -----------------------------
   MOUSE PARALLAX
----------------------------- */
const mouse = { x: 0, y: 0 };

window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

const clock = new THREE.Clock();

/* -----------------------------
   ANIMATE
----------------------------- */
function animate() {
  const elapsed = clock.getElapsedTime();

  // center wireframe
  sphere.rotation.x = elapsed * 0.18;
  sphere.rotation.y = elapsed * 0.28;

  ring.rotation.z = elapsed * 0.14;
  ring.rotation.y = elapsed * 0.1;

  // side planets
  leftPlanet.rotation.y = elapsed * 0.08;
  leftPlanet.rotation.x = elapsed * 0.025;

  rightPlanet.rotation.y = elapsed * 0.12;
  saturnRing.rotation.z = elapsed * 0.04;

  leftPlanetGroup.rotation.z = Math.sin(elapsed * 0.3) * 0.04;
  rightPlanetGroup.rotation.z = Math.sin(elapsed * 0.25) * 0.05;

  // stars
  particles.rotation.y = elapsed * 0.02;
  particles.rotation.x = elapsed * 0.01;

  // parallax
  universe.position.x += ((mouse.x * 1.1) - universe.position.x) * 0.025;
  universe.position.y += ((mouse.y * 0.8) - universe.position.y) * 0.025;

  camera.position.x += (mouse.x * 0.35 - camera.position.x) * 0.02;
  camera.position.y += (mouse.y * 0.2 - camera.position.y) * 0.02;
  camera.lookAt(scene.position);

  // shooting stars move down-left, tail stays behind
  for (const star of shootingStars) {
    if (!star.active) {
      star.delay -= 1;
      if (star.delay <= 0) star.active = true;
    } else {
      star.group.position.x -= star.speedX;
      star.group.position.y -= star.speedY;

      if (star.group.position.x < -16 || star.group.position.y < -10) {
        resetShootingStar(star);
      }
    }
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

/* -----------------------------
   RESIZE
----------------------------- */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});