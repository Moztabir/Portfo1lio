import * as THREE from 'https://unpkg.com/three@0.163.0/build/three.module.js';

const mount = document.getElementById('three-bg');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 12;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
mount.appendChild(renderer.domElement);

const group = new THREE.Group();
scene.add(group);

const sphereGeo = new THREE.IcosahedronGeometry(1.2, 8);
const sphereMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
  transparent: true,
  opacity: 0.16
});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
group.add(sphere);

const ringGeo = new THREE.TorusGeometry(2.6, 0.03, 20, 180);
const ringMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.12
});
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.rotation.x = Math.PI * 0.4;
group.add(ring);

const particlesCount = 1400;
const positions = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 36;
}

const particlesGeo = new THREE.BufferGeometry();
particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMat = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.028,
  transparent: true,
  opacity: 0.65
});
const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

const mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();

  sphere.rotation.x = elapsed * 0.18;
  sphere.rotation.y = elapsed * 0.28;

  ring.rotation.z = elapsed * 0.14;
  ring.rotation.y = elapsed * 0.1;

  particles.rotation.y = elapsed * 0.025;
  particles.rotation.x = elapsed * 0.015;

  group.position.x += ((mouse.x * 1.4) - group.position.x) * 0.03;
  group.position.y += ((mouse.y * 1.1) - group.position.y) * 0.03;

  camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.02;
  camera.position.y += (mouse.y * 0.25 - camera.position.y) * 0.02;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
