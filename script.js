document.getElementById('year').textContent = new Date().getFullYear();

const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

// Resume is now a permanent PDF asset linked directly from the page.

// Interactive Three.js centerpiece with a glowing, slowly rotating icosahedron.
const canvas = document.getElementById('scene');
if (window.THREE && canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.z = 5.5;
  const group = new THREE.Group();
  scene.add(group);

  const geometry = new THREE.IcosahedronGeometry(1.45, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x9b5de5, metalness: 0.72, roughness: 0.22,
    flatShading: true, emissive: 0x351052, emissiveIntensity: 0.55
  });
  const core = new THREE.Mesh(geometry, material);
  group.add(core);

  const wire = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.49, 1),
    new THREE.MeshBasicMaterial({ color: 0xe0aaff, wireframe: true, transparent: true, opacity: 0.38 })
  );
  group.add(wire);

  const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xc77dff, transparent: true, opacity: 0.72 });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.0, 0.009, 8, 120), ringMaterial);
  ring1.rotation.x = 1.08; ring1.rotation.y = 0.32; group.add(ring1);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.006, 8, 120),
    new THREE.MeshBasicMaterial({ color: 0xf0abfc, transparent: true, opacity: 0.45 }));
  ring2.rotation.x = 0.25; ring2.rotation.y = 1.18; group.add(ring2);

  scene.add(new THREE.AmbientLight(0xffffff, 1.15));
  const light1 = new THREE.PointLight(0xd58aff, 4, 12); light1.position.set(3, 3, 4); scene.add(light1);
  const light2 = new THREE.PointLight(0x7541c8, 3, 10); light2.position.set(-3, -2, 2); scene.add(light2);

  const particles = new THREE.BufferGeometry();
  const particleCount = 260;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const radius = 2.3 + Math.random() * 2.1;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i*3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i*3+1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i*3+2] = radius * Math.cos(phi);
  }
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const stars = new THREE.Points(particles, new THREE.PointsMaterial({ color: 0xd9a5ff, size: 0.018, transparent: true, opacity: 0.75 }));
  scene.add(stars);

  let pointerX = 0, pointerY = 0;
  canvas.addEventListener('pointermove', e => {
    const rect = canvas.getBoundingClientRect();
    pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.45;
    pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 0.35;
  });
  function resize() {
    const rect = canvas.getBoundingClientRect();
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / Math.max(rect.height, 1);
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();
  function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.0035;
    group.rotation.x += (pointerY - group.rotation.x) * 0.018;
    group.rotation.z += (pointerX - group.rotation.z) * 0.018;
    ring1.rotation.z += 0.0018;
    ring2.rotation.x += 0.0012;
    stars.rotation.y -= 0.00035;
    renderer.render(scene, camera);
  }
  animate();
} else {
  canvas.style.display = 'none';
}
