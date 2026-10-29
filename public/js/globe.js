import * as THREE from '../vendor/three/three.module.js';
const container = document.querySelector('#hero-visual');
const canvas = document.querySelector('#security-globe');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.z = 7.5;
  const globe = new THREE.Group();
  scene.add(globe);
  globe.rotation.z = 0.12;
  globe.rotation.x = 0.18;
  const gold = new THREE.Color('#d9b477');
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(1.78, 48, 32),
    new THREE.MeshBasicMaterial({
      color: 0x20303b,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    }),
  );
  globe.add(shell);
  const grid = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.SphereGeometry(1.8, 36, 20)),
    new THREE.LineBasicMaterial({ color: gold, transparent: true, opacity: 0.08 }),
  );
  globe.add(grid);
  const points = [];
  let seed = 12;
  function random() {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  }
  for (let i = 0; i < 1500; i++) {
    const y = 1 - 2 * random();
    const phi = random() * Math.PI * 2;
    const r = Math.sqrt(1 - y * y);
    const lat = Math.asin(y),
      lon = phi;
    const noise =
      Math.sin(lon * 3 + lat * 4) +
      Math.cos(lon * 6 - lat * 3) +
      Math.sin(lon * 8 + lat * 9) * 0.45;
    if (noise > -0.05) points.push(r * Math.cos(phi) * 1.82, y * 1.82, r * Math.sin(phi) * 1.82);
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
  globe.add(
    new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: gold,
        size: 0.018,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true,
      }),
    ),
  );
  const orbital = new THREE.Group();
  orbital.rotation.z = -0.47;
  orbital.rotation.x = 0.8;
  scene.add(orbital);
  [2.12, 2.3].forEach((radius, i) => {
    const arr = [];
    for (let j = 0; j <= 180; j++) {
      const a = (j / 180) * Math.PI * 2;
      arr.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
    }
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(arr),
      new THREE.LineBasicMaterial({ color: gold, transparent: true, opacity: i ? 0.09 : 0.3 }),
    );
    orbital.add(line);
  });
  const nodes = [];
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const point = new THREE.Mesh(
      new THREE.SphereGeometry(0.026, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffd69a }),
    );
    point.position.set(Math.cos(a) * 2.12, Math.sin(a) * 2.12, 0);
    orbital.add(point);
    nodes.push(point);
  }
  const arcs = new THREE.Group();
  globe.add(arcs);
  for (let i = 0; i < 7; i++) {
    const start = new THREE.Vector3(
      Math.cos(i * 1.7) * 1.2,
      Math.sin(i * 0.9),
      Math.sin(i * 1.7) * 1.2,
    )
      .normalize()
      .multiplyScalar(1.83);
    const end = new THREE.Vector3(
      Math.cos(i * 1.7 + 1.7) * 1.2,
      Math.sin(i * 0.9 + 0.5),
      Math.sin(i * 1.7 + 1.7) * 1.2,
    )
      .normalize()
      .multiplyScalar(1.83);
    const middle = start.clone().add(end).normalize().multiplyScalar(2.25);
    const curve = new THREE.QuadraticBezierCurve3(start, middle, end);
    arcs.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)),
        new THREE.LineBasicMaterial({ color: 0xe4b66f, transparent: true, opacity: 0.26 }),
      ),
    );
  }
  const stars = [];
  for (let i = 0; i < 120; i++)
    stars.push((random() - 0.5) * 12, (random() - 0.5) * 9, (random() - 0.5) * 4 - 2);
  const starsGeo = new THREE.BufferGeometry();
  starsGeo.setAttribute('position', new THREE.Float32BufferAttribute(stars, 3));
  scene.add(
    new THREE.Points(
      starsGeo,
      new THREE.PointsMaterial({ color: 0x90a1aa, size: 0.012, transparent: true, opacity: 0.4 }),
    ),
  );
  let pointerX = 0,
    pointerY = 0,
    visible = true,
    frame = 0,
    last = 0,
    elapsed = 0;
  function size() {
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    camera.position.z = width < 500 ? 8 : 7.5;
    renderer.render(scene, camera);
  }
  new ResizeObserver(size).observe(container);
  size();
  container.classList.add('ready');
  container.addEventListener('pointermove', (e) => {
    const r = container.getBoundingClientRect();
    pointerX = ((e.clientX - r.left) / r.width - 0.5) * 0.35;
    pointerY = ((e.clientY - r.top) / r.height - 0.5) * 0.15;
  });
  container.addEventListener('pointerleave', () => {
    pointerX = pointerY = 0;
  });
  function render(time) {
    frame = 0;
    if (!visible || document.hidden || reduced.matches) return;
    const delta = last ? Math.min((time - last) / 1000, 0.06) : 0;
    last = time;
    elapsed += delta;
    globe.rotation.y = elapsed * 0.035 + pointerX;
    globe.rotation.x += (0.18 + pointerY - globe.rotation.x) * 0.03;
    orbital.rotation.z = -0.47 + Math.sin(elapsed * 0.1) * 0.08;
    nodes.forEach((n, i) => n.scale.setScalar(1 + Math.sin(elapsed * 1.7 + i) * 0.2));
    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  }
  function update() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    if (visible && !document.hidden && !reduced.matches) frame = requestAnimationFrame(render);
    else renderer.render(scene, camera);
  }
  new IntersectionObserver(
    (entries) => {
      visible = entries[0].isIntersecting;
      update();
    },
    { threshold: 0 },
  ).observe(container);
  document.addEventListener('visibilitychange', update);
  reduced.addEventListener('change', update);
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    if (frame) cancelAnimationFrame(frame);
    container.classList.remove('ready');
  });
  update();
} catch (error) {
  container.classList.remove('ready');
  console.info('Static security visualization active.');
}
