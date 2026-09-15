import * as THREE from 'three';
import { createCeramicMaterials } from './ceramicMaterials';
import { computeSculptureFrame, smoothSeamNormals } from './sculptureGeometry';

export interface SculptureScene {
  setScroll: (progress: number) => void;
  setReducedMotion: (reduce: boolean) => void;
  setAutoRotate: (enabled: boolean) => void;
  rotate: (horizontal: number, vertical?: number) => void;
  reset: () => void;
  dispose: () => void;
}

interface SceneOptions {
  reduceMotion: boolean;
  onReady: () => void;
  onUnavailable: () => void;
}

/* A closed, asymmetric ceramic loop. Every point belongs to a real volumetric
   surface; its depth, highlights, and occlusion change as the object is turned. */
function ceramicLoop(width: number, height: number, thickness: number, depth: number, seed: number) {
  const segments = 192;
  const sides = 40;
  const positions: number[] = [];
  const uv: number[] = [];
  const indices: number[] = [];
  const center = (t: number) => {
    const taper = 1 + 0.095 * Math.sin(t + seed) + 0.045 * Math.cos(3 * t - seed);
    return new THREE.Vector3(
      width * Math.cos(t) * taper + 0.09 * Math.sin(t),
      height * Math.sin(t) * (1 + 0.05 * Math.cos(t - seed)),
      0.055 * Math.sin(2 * t + seed),
    );
  };
  for (let i = 0; i <= segments; i++) {
    const t = i / segments * Math.PI * 2;
    const point = center(t);
    const tangent = center(t + 0.001).sub(center(t - 0.001)).normalize();
    const normal = new THREE.Vector3(tangent.y, -tangent.x, 0).normalize();
    const binormal = new THREE.Vector3().crossVectors(normal, tangent).normalize();
    const radius = thickness * (1 + 0.19 * Math.sin(t + seed) + 0.07 * Math.cos(3 * t + 0.4));
    for (let j = 0; j <= sides; j++) {
      const a = j / sides * Math.PI * 2;
      const roundness = 1 + 0.025 * Math.sin(3 * a + 2 * t);
      const surface = point.clone()
        .addScaledVector(normal, Math.cos(a) * radius * roundness)
        .addScaledVector(binormal, Math.sin(a) * depth * roundness);
      positions.push(surface.x, surface.y, surface.z);
      uv.push(i / segments, j / sides);
      if (i < segments && j < sides) {
        const n = i * (sides + 1) + j;
        indices.push(n, n + sides + 1, n + 1, n + 1, n + sides + 1, n + sides + 2);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  smoothSeamNormals(geometry);
  geometry.computeBoundingBox();
  return geometry;
}

function contactTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const context = canvas.getContext('2d');
  if (!context) return null;
  const gradient = context.createRadialGradient(64, 64, 4, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(45,57,45,0.23)');
  gradient.addColorStop(0.3, 'rgba(45,57,45,0.15)');
  gradient.addColorStop(0.62, 'rgba(45,57,45,0.055)');
  gradient.addColorStop(1, 'rgba(45,57,45,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

export function createSculptureScene(host: HTMLDivElement, options: SceneOptions): SculptureScene {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'low-power' });
  const canvas = renderer.domElement;
  let destroyed = false;
  const cleanup: Array<() => void> = [];
  const own = <T extends { dispose: () => void }>(resource: T): T => {
    cleanup.push(() => resource.dispose());
    return resource;
  };
  // Driver failures can also affect disposal. One failed cleanup must not leave
  // the other GPU resources, observers, or DOM listeners attached.
  const release = (callback: () => void) => { try { callback(); } catch { /* Continue releasing the remaining resources. */ } };
  const dispose = () => {
    if (destroyed) return;
    destroyed = true;
    release(() => renderer.setAnimationLoop(null));
    for (const callback of cleanup.reverse()) release(callback);
    cleanup.length = 0;
    release(() => renderer.dispose());
    release(() => renderer.forceContextLoss());
    release(() => canvas.remove());
    release(() => host.classList.remove('is-dragging'));
  };

  try {
    renderer.setClearColor(0xffffff, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    canvas.setAttribute('aria-hidden', 'true');
    canvas.className = 'sculpture-canvas';
    host.appendChild(canvas);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    const camera = new THREE.OrthographicCamera(-2.48, 2.48, 2.48, -2.48, 0.1, 40);
    const sculpture = new THREE.Group();
    scene.add(sculpture);
    const ceramics = own(createCeramicMaterials(renderer.capabilities.getMaxAnisotropy()));
    const { ivory, teal, sage, thread: threadMaterial } = ceramics;
    const shadowTexture = contactTexture();
    if (shadowTexture) own(shadowTexture);

    const large = new THREE.Mesh(own(ceramicLoop(0.9, 1.17, 0.37, 0.37, 0.65)), ivory);
    large.rotation.z = -0.22;
    large.rotation.y = -0.28;
    large.position.set(-0.66, 1.43, -0.05);
    large.castShadow = large.receiveShadow = true;
    sculpture.add(large);
    // Rest each irregular loop on the ground after its local tilt is applied.
    large.updateMatrixWorld(true);
    large.position.y -= new THREE.Box3().setFromObject(large, true).min.y;

    const small = new THREE.Mesh(own(ceramicLoop(0.43, 0.65, 0.255, 0.3, 2.8)), teal);
    small.rotation.z = 0.19;
    small.rotation.y = 0.12;
    small.position.set(0.97, 0.86, 0.12);
    small.castShadow = small.receiveShadow = true;
    sculpture.add(small);
    small.updateMatrixWorld(true);
    small.position.y -= new THREE.Box3().setFromObject(small, true).min.y;

    const pebbleGeometry = own(new THREE.SphereGeometry(1, 64, 40));
    const vertices = pebbleGeometry.getAttribute('position');
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i);
      const y = vertices.getY(i);
      const z = vertices.getZ(i);
      const organic = 1 + 0.055 * Math.sin(2.2 * x + 1.7 * y) * Math.cos(2 * z);
      vertices.setXYZ(i, x * 0.51 * organic, y * 0.32 * organic, z * 0.39 * organic);
    }
    pebbleGeometry.computeVertexNormals();
    smoothSeamNormals(pebbleGeometry);
    const pebble = new THREE.Mesh(pebbleGeometry, sage);
    pebble.position.set(0.17, 0.32, 0.82);
    pebble.rotation.set(0.12, -0.3, -0.2);
    pebble.castShadow = pebble.receiveShadow = true;
    sculpture.add(pebble);
    pebble.updateMatrixWorld(true);
    pebble.position.y -= new THREE.Box3().setFromObject(pebble, true).min.y;

    // A quiet fourth form rests inside the smaller loop. The open spaces
    // between the two arches are left clear so their silhouettes carry the composition.
    const pearl = new THREE.Mesh(own(new THREE.SphereGeometry(0.17, 48, 32)), ivory);
    pearl.position.set(1.06, 0.66, 0.23);
    pearl.castShadow = pearl.receiveShadow = true;
    sculpture.add(pearl);

    const threadPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.4, 0.032, 1.21),
      new THREE.Vector3(0.91, 0.032, 1.04),
      new THREE.Vector3(1.36, 0.26, -0.30),
      new THREE.Vector3(0.93, 1.03, -0.36),
      new THREE.Vector3(0.19, 1.35, 0.02),
      new THREE.Vector3(-0.61, 1.66, 0.20),
      new THREE.Vector3(-1.28, 1.23, -0.24),
      new THREE.Vector3(-1.56, 0.033, 0.48),
    ], true, 'centripetal');
    const thread = new THREE.Mesh(own(new THREE.TubeGeometry(threadPath, 240, 0.013, 10, true)), threadMaterial);
    thread.castShadow = thread.receiveShadow = true;
    sculpture.add(thread);

    // Fit the full range of drag angles once, so added depth never clips and
    // the camera does not breathe in and out during an interaction.
    const framing = computeSculptureFrame(sculpture);

    // Broad radial contact shadows create a seamless white studio surface.
    // Keeping cast shadows on the objects alone avoids a hard floor silhouette.
    if (shadowTexture) {
      for (const [x, z, width, depth] of [[-0.66, 0, 2.0, 1.2], [0.97, 0.12, 1.4, 1.0], [0.17, 0.82, 1.2, 0.75]]) {
        const contact = new THREE.Mesh(own(new THREE.PlaneGeometry(width, depth)), own(new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, toneMapped: false })));
        contact.rotation.x = -Math.PI / 2;
        contact.position.set(x, -0.018, z);
        sculpture.add(contact);
      }
    }

    scene.add(new THREE.HemisphereLight(0xfffdf7, 0xcdd4ca, 1.9));
    const key = new THREE.DirectionalLight(0xfffaf1, 3.35);
    cleanup.push(() => key.shadow.dispose());
    key.position.set(-4.5, 5.5, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -4;
    key.shadow.camera.right = 4;
    key.shadow.camera.top = 5;
    key.shadow.camera.bottom = -3;
    key.shadow.camera.near = 0.1;
    key.shadow.camera.far = 20;
    key.shadow.normalBias = 0.026;
    key.shadow.bias = -0.00015;
    key.shadow.radius = 5;
    key.target.position.set(0, 1, 0);
    scene.add(key, key.target);
    const fill = new THREE.DirectionalLight(0xeaf4ef, 1.2);
    fill.position.set(5, 3, -3);
    scene.add(fill);

    let lostContext = false;
    let visible = true;
    let running = false;
    let needsFrame = true;
    let firstRender = true;
    let reducedMotion = options.reduceMotion;
    let scroll = 0;
    let userYaw = 0;
    let autoYaw = 0;
    let autoRotate = true;
    let pauseUntil = 0;
    let yaw = -0.14;
    let targetPitch = 0.18;
    let pitch = targetPitch;
    let lastTime = 0;
    let pointer: { id: number; x: number; y: number; startX: number; startY: number; touch: boolean; dragging: boolean } | null = null;
    cleanup.push(() => {
      if (pointer && host.hasPointerCapture(pointer.id)) host.releasePointerCapture(pointer.id);
      pointer = null;
    });
    const lookAt = new THREE.Vector3(0, framing.centerY, 0);

    const stop = () => { renderer.setAnimationLoop(null); running = false; lastTime = 0; };
    const frame = (time: number) => {
      if (destroyed || lostContext || !visible || document.hidden) { stop(); return; }
      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      // One complete turn in four minutes. Interaction suspends the idle
      // motion so a dragged or keyboard-selected view can be inspected.
      const automatic = autoRotate && !reducedMotion;
      if (automatic && !pointer && time >= pauseUntil) autoYaw += delta * Math.PI / 120;
      const targetYaw = -0.14 + userYaw + autoYaw + (reducedMotion ? 0 : Math.min(1, Math.max(0, scroll)) * 0.65);
      const smoothing = reducedMotion ? 1 : 1 - Math.exp(-11 * delta);
      yaw += (targetYaw - yaw) * smoothing;
      pitch += (targetPitch - pitch) * smoothing;
      sculpture.rotation.y = yaw;
      camera.position.set(0, lookAt.y + 8 * Math.sin(pitch), 8 * Math.cos(pitch));
      camera.lookAt(lookAt);
      try {
        renderer.render(scene, camera);
      } catch {
        // A driver failure should leave the readable page and static artwork intact.
        lostContext = true;
        stop();
        options.onUnavailable();
        return;
      }
      if (firstRender) { firstRender = false; options.onReady(); }
      const settling = Math.abs(targetYaw - yaw) > 0.0003 || Math.abs(targetPitch - pitch) > 0.0003;
      if (!settling && !needsFrame && !automatic) stop();
      needsFrame = false;
    };
    const invalidate = () => {
      needsFrame = true;
      if (!running && visible && !document.hidden && !destroyed && !lostContext) {
        running = true;
        renderer.setAnimationLoop(frame);
      }
    };
    const resize = () => {
      if (destroyed) return;
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      const aspect = width / height;
      const half = Math.max(framing.halfHeight, framing.radius / aspect) * 1.055;
      camera.left = -half * aspect;
      camera.right = half * aspect;
      camera.top = half;
      camera.bottom = -half;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      invalidate();
    };
    const rotate = (horizontal: number, vertical = 0) => {
      userYaw += horizontal;
      pauseUntil = performance.now() + 4000;
      targetPitch = THREE.MathUtils.clamp(targetPitch + vertical, 0.06, 0.6);
      invalidate();
    };
    const endPointer = (event: PointerEvent) => {
      if (pointer?.id !== event.pointerId) return;
      if (host.hasPointerCapture(event.pointerId)) host.releasePointerCapture(event.pointerId);
      pointer = null;
      pauseUntil = performance.now() + 4000;
      host.classList.remove('is-dragging');
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || pointer) return;
      pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, touch: event.pointerType === 'touch', dragging: event.pointerType !== 'touch' };
      if (!pointer.touch) { host.setPointerCapture(event.pointerId); host.classList.add('is-dragging'); }
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!pointer || pointer.id !== event.pointerId) return;
      const dx = event.clientX - pointer.x;
      const dy = event.clientY - pointer.y;
      if (pointer.touch && !pointer.dragging) {
        const totalX = Math.abs(event.clientX - pointer.startX);
        const totalY = Math.abs(event.clientY - pointer.startY);
        if (totalY > totalX && totalY > 7) { pointer = null; return; }
        if (totalX < 7 || totalX < totalY * 1.2) return;
        pointer.dragging = true;
        host.setPointerCapture(event.pointerId);
        host.classList.add('is-dragging');
      }
      if (pointer.dragging) {
        rotate(dx * 0.008, pointer.touch ? 0 : dy * 0.003);
        pointer.x = event.clientX;
        pointer.y = event.clientY;
      }
    };
    const onContextLost = (event: Event) => { event.preventDefault(); lostContext = true; stop(); options.onUnavailable(); };
    const onContextRestored = () => { lostContext = false; firstRender = true; resize(); invalidate(); };
    const onVisibility = () => { if (document.hidden) stop(); else invalidate(); };
    canvas.addEventListener('webglcontextlost', onContextLost);
    cleanup.push(() => canvas.removeEventListener('webglcontextlost', onContextLost));
    canvas.addEventListener('webglcontextrestored', onContextRestored);
    cleanup.push(() => canvas.removeEventListener('webglcontextrestored', onContextRestored));
    host.addEventListener('pointerdown', onPointerDown);
    cleanup.push(() => host.removeEventListener('pointerdown', onPointerDown));
    host.addEventListener('pointermove', onPointerMove);
    cleanup.push(() => host.removeEventListener('pointermove', onPointerMove));
    host.addEventListener('pointerup', endPointer);
    cleanup.push(() => host.removeEventListener('pointerup', endPointer));
    host.addEventListener('pointercancel', endPointer);
    cleanup.push(() => host.removeEventListener('pointercancel', endPointer));
    host.addEventListener('lostpointercapture', endPointer);
    cleanup.push(() => host.removeEventListener('lostpointercapture', endPointer));
    document.addEventListener('visibilitychange', onVisibility);
    cleanup.push(() => document.removeEventListener('visibilitychange', onVisibility));
    const observer = new ResizeObserver(resize);
    cleanup.push(() => observer.disconnect());
    observer.observe(host);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) invalidate(); else stop(); }, { rootMargin: '100px' });
    cleanup.push(() => intersection.disconnect());
    intersection.observe(host);
    resize();

    return {
      rotate,
      setScroll(progress) { scroll = progress; if (!reducedMotion) invalidate(); },
      setReducedMotion(reduce) { reducedMotion = reduce; invalidate(); },
      setAutoRotate(enabled) { autoRotate = enabled; invalidate(); },
      reset() { userYaw = 0; autoYaw = 0; targetPitch = 0.18; pauseUntil = performance.now() + 4000; invalidate(); },
      dispose,
    };
  } catch (error) {
    // Initialization may fail after the canvas or some resources already exist.
    dispose();
    throw error;
  }
}

