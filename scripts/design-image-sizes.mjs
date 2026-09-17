#!/usr/bin/env node
/*
 * Records the pixel size of every image the designer mode can show, so <img>
 * tags can reserve their space before the file arrives (no layout shift while
 * lazy images load). Run it after adding or replacing files in
 * public/images/design or public/images/projects:
 *
 *   node scripts/design-image-sizes.mjs
 *
 * Output: src/design/data/imageSizes.json, keyed by the path below public/images.
 * No dependencies: WebP, PNG, JPEG and SVG headers are read directly.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const imagesDir = join(root, 'public', 'images');
const folders = ['design', 'projects'];
const outFile = join(root, 'src', 'design', 'data', 'imageSizes.json');

function walk(dir) {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function webpSize(buffer) {
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') return null;
  const chunk = buffer.toString('ascii', 12, 16);
  if (chunk === 'VP8X') return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
  if (chunk === 'VP8 ') return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
  if (chunk === 'VP8L') {
    const bits = buffer.readUInt32LE(21);
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >>> 14) & 0x3fff) };
  }
  return null;
}

function pngSize(buffer) {
  if (buffer.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

function jpegSize(buffer) {
  if (buffer.readUInt16BE(0) !== 0xffd8) return null;
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
    const marker = buffer[offset + 1];
    const isFrame = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isFrame) return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { offset += 2; continue; }
    offset += 2 + buffer.readUInt16BE(offset + 2);
  }
  return null;
}

function svgSize(buffer) {
  const head = buffer.toString('utf8', 0, 2048);
  const viewBox = head.match(/viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/);
  if (viewBox) return { width: Math.round(Number(viewBox[1])), height: Math.round(Number(viewBox[2])) };
  const width = head.match(/\swidth\s*=\s*["']([\d.]+)/);
  const height = head.match(/\sheight\s*=\s*["']([\d.]+)/);
  return width && height ? { width: Math.round(Number(width[1])), height: Math.round(Number(height[1])) } : null;
}

const readers = { '.webp': webpSize, '.png': pngSize, '.jpg': jpegSize, '.jpeg': jpegSize, '.svg': svgSize };

const sizes = {};
const skipped = [];
for (const folder of folders) {
  for (const file of walk(join(imagesDir, folder)).sort()) {
    const reader = readers[extname(file).toLowerCase()];
    if (!reader) continue;
    const key = relative(imagesDir, file).split(sep).join('/');
    let size = null;
    try { size = reader(readFileSync(file)); } catch { /* unreadable header: leave it out */ }
    if (size && size.width > 0 && size.height > 0) sizes[key] = [size.width, size.height];
    else skipped.push(key);
  }
}

const lines = Object.entries(sizes).map(([key, [width, height]]) => `  ${JSON.stringify(key)}: [${width}, ${height}]`);
writeFileSync(outFile, `{\n${lines.join(',\n')}\n}\n`);
console.log(`design-image-sizes: ${Object.keys(sizes).length} images → ${relative(root, outFile)}`);
if (skipped.length) console.warn(`design-image-sizes: could not read ${skipped.join(', ')}`);
