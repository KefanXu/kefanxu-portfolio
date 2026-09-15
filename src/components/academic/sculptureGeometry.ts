import * as THREE from 'three';

/**
 * Smooth duplicated UV-seam/pole vertices without welding positions or UVs.
 * Use on continuously smooth surfaces, not geometry with intentional hard edges.
 */
export function smoothSeamNormals(geometry: THREE.BufferGeometry): void {
  const positions = geometry.getAttribute('position');
  if (!positions || positions.count === 0) return;
  if (!geometry.getAttribute('normal')) geometry.computeVertexNormals();
  const normals = geometry.getAttribute('normal');
  if (!normals || normals.count !== positions.count) return;

  geometry.computeBoundingBox();
  const bounds = geometry.boundingBox;
  if (!bounds || bounds.isEmpty()) return;
  const extent = bounds.getSize(new THREE.Vector3());
  const tolerance = Math.max(Math.max(extent.x, extent.y, extent.z) * 1e-7, 1e-9);
  if (!Number.isFinite(tolerance)) return;

  // Relative coordinates keep quantized keys precise even for offset geometry.
  const groups = new Map<string, number[]>();
  for (let index = 0; index < positions.count; index++) {
    const x = positions.getX(index);
    const y = positions.getY(index);
    const z = positions.getZ(index);
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) continue;
    const key = `${Math.round((x - bounds.min.x) / tolerance)},${Math.round((y - bounds.min.y) / tolerance)},${Math.round((z - bounds.min.z) / tolerance)}`;
    const group = groups.get(key);
    if (group) group.push(index);
    else groups.set(key, [index]);
  }

  const average = new THREE.Vector3();
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    average.set(0, 0, 0);
    for (const index of group) {
      average.x += normals.getX(index);
      average.y += normals.getY(index);
      average.z += normals.getZ(index);
    }
    // Opposite/degenerate faces must not produce NaN normals.
    if (!Number.isFinite(average.lengthSq()) || average.lengthSq() < 1e-16) continue;
    average.normalize();
    for (const index of group) normals.setXYZ(index, average.x, average.y, average.z);
  }
  normals.needsUpdate = true;
}

export interface SculptureFrame {
  centerY: number;
  /** Vertical half-extent covering every yaw and the supported camera pitches. */
  halfHeight: number;
  /** Horizontal radial extent around the scene's world-Y rotation axis. */
  radius: number;
}

/**
 * Fit a sculpture that rotates around the world Y axis, before adding shadows.
 * Excludes meshes marked userData.excludeFromSculptureFrame. Returns unpadded
 * extents: use max(halfHeight, radius / aspect) * margin for an orthographic view.
 */
export function computeSculptureFrame(root: THREE.Object3D): SculptureFrame {
  root.updateWorldMatrix(true, true);
  let minimumY = Infinity;
  let maximumY = -Infinity;
  let radius = 0;
  const point = new THREE.Vector3();

  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh) || object.userData.excludeFromSculptureFrame) return;
    const positions = object.geometry.getAttribute('position');
    if (!positions) return;
    for (let index = 0; index < positions.count; index++) {
      point.fromBufferAttribute(positions, index).applyMatrix4(object.matrixWorld);
      if (!Number.isFinite(point.x) || !Number.isFinite(point.y) || !Number.isFinite(point.z)) continue;
      minimumY = Math.min(minimumY, point.y);
      maximumY = Math.max(maximumY, point.y);
      radius = Math.max(radius, Math.hypot(point.x, point.z));
    }
  });

  if (minimumY === Infinity) return { centerY: 0, halfHeight: 1, radius: 1 };
  const centerY = (minimumY + maximumY) / 2;
  const verticalHalf = (maximumY - minimumY) / 2;
  const pitchMinimum = 0.06;
  const pitchMaximum = 0.6;
  const extremum = THREE.MathUtils.clamp(Math.atan2(radius, verticalHalf), pitchMinimum, pitchMaximum);
  const projectedHalf = (pitch: number) => verticalHalf * Math.cos(pitch) + radius * Math.sin(pitch);
  const halfHeight = Math.max(projectedHalf(pitchMinimum), projectedHalf(pitchMaximum), projectedHalf(extremum));
  return { centerY, halfHeight: Math.max(halfHeight, 1e-3), radius: Math.max(radius, 1e-3) };
}
