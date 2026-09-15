import {
  DataTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  MeshStandardMaterial,
  NoColorSpace,
  RepeatWrapping,
  RGBAFormat,
  SRGBColorSpace,
} from 'three';

export interface CeramicMaterials {
  ivory: MeshStandardMaterial;
  teal: MeshStandardMaterial;
  sage: MeshStandardMaterial;
  thread: MeshStandardMaterial;
  accent: MeshStandardMaterial;
  dispose: () => void;
}

interface Finish {
  name: string;
  seed: number;
  cloudContrast: number;
  grainContrast: number;
  poreDarkness: number;
  inclusionDarkness: number;
  relief: number;
  poreDensity: number;
  mineralWarmth: number;
}

interface SurfaceMaps {
  albedo: DataTexture;
  height: DataTexture;
  roughness: DataTexture;
}

function releaseResources(resources: Iterable<{ dispose: () => void }>) {
  for (const resource of resources) {
    try { resource.dispose(); } catch { /* Continue releasing the remaining GPU resources. */ }
  }
}

const MAP_SIZE = 512;
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const wrap = (value: number, period: number) => ((value % period) + period) % period;
const fade = (value: number) => value * value * value * (value * (value * 6 - 15) + 10);
const mix = (a: number, b: number, amount: number) => a + (b - a) * amount;

function randomSource(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/* Integer, wrapped lattices ensure continuity across both UV seams. The
   frequencies are deliberately non-multiples to avoid an apparent grid. */
function periodicNoise(columns: number, rows: number, random: () => number) {
  const values = new Float32Array(columns * rows);
  for (let i = 0; i < values.length; i++) values[i] = random() * 2 - 1;
  return (u: number, v: number) => {
    const x = wrap(u, 1) * columns;
    const y = wrap(v, 1) * rows;
    const left = Math.floor(x);
    const top = Math.floor(y);
    const right = (left + 1) % columns;
    const bottom = (top + 1) % rows;
    const sx = fade(x - left);
    const sy = fade(y - top);
    return mix(
      mix(values[top * columns + left], values[top * columns + right], sx),
      mix(values[bottom * columns + left], values[bottom * columns + right], sx),
      sy,
    );
  };
}

/* Soft, irregular elliptical pits are stamped onto a toroidal pixel grid.
   Larger pores remain visible after mipmapping; tiny inclusions add variation
   without relying on subpixel white noise. */
function mineralSpots(
  field: Float32Array,
  grain: Float32Array,
  random: () => number,
  cells: number,
  density: number,
  minimumRadius: number,
  maximumRadius: number,
) {
  const cellSize = MAP_SIZE / cells;
  for (let cellY = 0; cellY < cells; cellY++) {
    for (let cellX = 0; cellX < cells; cellX++) {
      if (random() > density) continue;
      const centerX = (cellX + random()) * cellSize;
      const centerY = (cellY + random()) * cellSize;
      const radius = minimumRadius + Math.pow(random(), 1.6) * (maximumRadius - minimumRadius);
      const stretch = .65 + random() * .75;
      const radiusX = radius * stretch;
      const radiusY = radius / Math.sqrt(stretch);
      const angle = random() * Math.PI * 2;
      const cosine = Math.cos(angle);
      const sine = Math.sin(angle);
      const strength = .55 + random() * .45;
      const reach = Math.ceil(Math.max(radiusX, radiusY) * 1.15);
      for (let y = Math.floor(centerY - reach); y <= centerY + reach; y++) {
        for (let x = Math.floor(centerX - reach); x <= centerX + reach; x++) {
          const dx = x - centerX;
          const dy = y - centerY;
          const tx = (dx * cosine + dy * sine) / radiusX;
          const ty = (-dx * sine + dy * cosine) / radiusY;
          const index = wrap(y, MAP_SIZE) * MAP_SIZE + wrap(x, MAP_SIZE);
          const distance = Math.sqrt(tx * tx + ty * ty) * (1 + grain[index] * .16);
          if (distance >= 1) continue;
          const depression = (1 - fade(clamp01((distance - .12) / .88))) * strength;
          field[index] = Math.max(field[index], depression);
        }
      }
    }
  }
}

function surfaceMaps(finish: Finish, anisotropy: number): SurfaceMaps {
  const random = randomSource(finish.seed);
  const cloudNoise = periodicNoise(5, 5, random);
  const driftNoise = periodicNoise(11, 11, random);
  const mineralNoise = periodicNoise(29, 29, random);
  const granularNoise = periodicNoise(67, 67, random);
  const fineNoise = periodicNoise(139, 139, random);
  const toolNoise = periodicNoise(9, 47, random);
  const pixels = MAP_SIZE * MAP_SIZE;
  const cloud = new Float32Array(pixels);
  const grain = new Float32Array(pixels);
  const relief = new Float32Array(pixels);
  const pores = new Float32Array(pixels);
  const inclusions = new Float32Array(pixels);

  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      const index = y * MAP_SIZE + x;
      const u = x / MAP_SIZE;
      const v = y / MAP_SIZE;
      const drift = driftNoise(u, v);
      const broad = cloudNoise(u + drift * .027, v + drift * .017);
      const medium = mineralNoise(u, v);
      const granules = granularNoise(u, v) * .68 + fineNoise(u, v) * .32;
      const tooling = toolNoise(u + broad * .018, v + drift * .009);
      cloud[index] = broad * .7 + drift * .3;
      grain[index] = medium * .43 + granules * .57;
      // Low-amplitude, warped tooling gives a hand-worked surface rather than
      // a repeated stripe. It contributes primarily to the physical relief.
      relief[index] = .54 + medium * .125 + granules * .1 + broad * .035 + tooling * .024;
    }
  }

  mineralSpots(pores, grain, random, 25, finish.poreDensity, 2.2, 5.0);
  mineralSpots(pores, grain, random, 13, .38, 4.4, 8.6);
  mineralSpots(inclusions, grain, random, 41, .3, 1.2, 3.3);

  const colorPixels = new Uint8Array(pixels * 4);
  const heightPixels = new Uint8Array(pixels * 4);
  const roughnessPixels = new Uint8Array(pixels * 4);
  for (let i = 0; i < pixels; i++) {
    const offset = i * 4;
    const color = Math.max(.48, Math.min(1,
      .975 + cloud[i] * finish.cloudContrast + grain[i] * finish.grainContrast
      - pores[i] * finish.poreDarkness - inclusions[i] * finish.inclusionDarkness,
    ));
    const warmth = inclusions[i] * finish.mineralWarmth;
    colorPixels[offset] = Math.round(color * 255);
    colorPixels[offset + 1] = Math.round(color * (1 - warmth * .45) * 255);
    colorPixels[offset + 2] = Math.round(color * (1 - warmth) * 255);
    colorPixels[offset + 3] = 255;

    const height = Math.round(clamp01(relief[i] - pores[i] * finish.relief + inclusions[i] * .032) * 255);
    heightPixels[offset] = heightPixels[offset + 1] = heightPixels[offset + 2] = height;
    heightPixels[offset + 3] = 255;

    // Standard materials read the green channel. Variation in the .78–.98
    // range brings out the mineral surface without making polished dots.
    const roughness = Math.round(Math.min(.98, Math.max(.78,
      .89 + grain[i] * .12 + pores[i] * .1 + cloud[i] * .025 - inclusions[i] * .015,
    )) * 255);
    roughnessPixels[offset] = roughnessPixels[offset + 1] = roughnessPixels[offset + 2] = roughness;
    roughnessPixels[offset + 3] = 255;
  }

  const allocated: DataTexture[] = [];
  const texture = (data: Uint8Array, role: string, color = false) => {
    const map = new DataTexture(data, MAP_SIZE, MAP_SIZE, RGBAFormat);
    allocated.push(map);
    map.name = `${finish.name}: ${role}`;
    map.colorSpace = color ? SRGBColorSpace : NoColorSpace;
    map.wrapS = map.wrapT = RepeatWrapping;
    // Integer repeats preserve continuity on closed torus and sphere UVs.
    // The 3:1 ratio also approximates the physical aspect of the hero loops.
    map.repeat.set(3, 1);
    map.magFilter = LinearFilter;
    map.minFilter = LinearMipmapLinearFilter;
    map.generateMipmaps = true;
    map.anisotropy = anisotropy;
    map.needsUpdate = true;
    return map;
  };
  try {
    return {
      albedo: texture(colorPixels, 'mineral albedo', true),
      height: texture(heightPixels, 'porous relief'),
      roughness: texture(roughnessPixels, 'matte roughness'),
    };
  } catch (error) {
    releaseResources(allocated);
    throw error;
  }
}

/** Three distinct, deterministic finishes without downloaded texture assets.
 * The returned materials and all nine shared maps are owned by this object.
 * Call dispose() once when the scene is released. Accent shares ivory maps;
 * thread shares teal maps, so leave those maps alive while either is in use.
 */
export function createCeramicMaterials(rendererMaxAnisotropy = 1): CeramicMaterials {
  const anisotropy = Number.isFinite(rendererMaxAnisotropy)
    ? Math.max(1, Math.min(8, Math.floor(rendererMaxAnisotropy))) : 1;
  const allocatedMaps: DataTexture[] = [];
  const allocatedMaterials: MeshStandardMaterial[] = [];
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    releaseResources(allocatedMaterials);
    releaseResources(allocatedMaps);
    allocatedMaterials.length = allocatedMaps.length = 0;
  };
  const mapsFor = (finish: Finish) => {
    const maps = surfaceMaps(finish, anisotropy);
    allocatedMaps.push(maps.albedo, maps.height, maps.roughness);
    return maps;
  };
  try {
    const ivoryMaps = mapsFor({
      name: 'Ivory ceramic', seed: 71693, cloudContrast: .035, grainContrast: .042,
      poreDarkness: .065, inclusionDarkness: .11, relief: .22, poreDensity: .60, mineralWarmth: .025,
    });
    const tealMaps = mapsFor({
      name: 'Teal stoneware', seed: 36211, cloudContrast: .070, grainContrast: .040,
      poreDarkness: .07, inclusionDarkness: .12, relief: .20, poreDensity: .66, mineralWarmth: .014,
    });
    const sageMaps = mapsFor({
      name: 'Sage mineral', seed: 98173, cloudContrast: .05, grainContrast: .04,
      poreDarkness: .065, inclusionDarkness: .13, relief: .22, poreDensity: .55, mineralWarmth: .02,
    });
    const make = (name: string, color: string, maps: SurfaceMaps, bumpScale: number) => {
      const material = new MeshStandardMaterial({
        name, color, map: maps.albedo, bumpMap: maps.height, bumpScale,
        roughness: 1, roughnessMap: maps.roughness, metalness: 0,
      });
      allocatedMaterials.push(material);
      return material;
    };
    const ivory = make('Ivory matte ceramic', '#e8e5dc', ivoryMaps, .045);
    const teal = make('Matte teal stoneware', '#245e57', tealMaps, .040);
    const sage = make('Sage mineral ceramic', '#a8b3a0', sageMaps, .043);
    const thread = make('Muted teal thread', '#3a6961', tealMaps, .010);
    const accent = make('Warm clay accent', '#c6baa5', ivoryMaps, .105);
    return {
      ivory, teal, sage, thread, accent, dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
