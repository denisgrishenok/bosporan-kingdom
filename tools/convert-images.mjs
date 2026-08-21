import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(toolsDir, '..');
const originalsImages = path.join(repoRoot, 'originals', 'images');
const originalsMaps = path.join(repoRoot, 'originals', 'maps');
const publicImages = path.join(repoRoot, 'public', 'images');
const publicMaps = path.join(repoRoot, 'public', 'maps');

const PREVIEW_WIDTH = 2000;
const AVIF_QUALITY_IMAGES = 50;
const AVIF_QUALITY_MAPS = 70;
const AVIF_PREVIEW_QUALITY_MAPS = 70;
const PNG_PREVIEW_QUALITY_MAPS = 70;

const imageFiles = fs.readdirSync(originalsImages).filter((name) => name.toLowerCase().endsWith('.png') || name.toLowerCase().endsWith('.jpg') || name.toLowerCase().endsWith('.jpeg'));
const mapFiles = fs.readdirSync(originalsMaps).filter((name) => name.toLowerCase().endsWith('.png'));

fs.mkdirSync(publicImages, { recursive: true });

for (const name of imageFiles) {
    try {
        const inputPath = path.join(originalsImages, name);
        const baseName = path.parse(name).name;
        const avifOutputPath = path.join(publicImages, baseName + '.avif');
        const pngOutputPath = path.join(publicImages, baseName + '.png');
        const jpgOutputPath = path.join(publicImages, baseName + '.jpg');
        const reserveCopyPath = inputPath.toLowerCase().endsWith('.png') ? pngOutputPath : jpgOutputPath;

        if (fs.existsSync(avifOutputPath) && fs.existsSync(reserveCopyPath)) {
            if (fs.statSync(inputPath).mtimeMs <= fs.statSync(avifOutputPath).mtimeMs && fs.statSync(inputPath).mtimeMs <= fs.statSync(reserveCopyPath).mtimeMs) {
                console.log('pass', name);
                continue;
            }
        }

        await sharp(inputPath).avif({ quality: AVIF_QUALITY_IMAGES }).toFile(avifOutputPath);
        
        fs.copyFileSync(inputPath, reserveCopyPath);

        console.log('ready', name);

    } catch (error) {
        console.error('error', name, error.message);
    }
}

fs.mkdirSync(publicMaps, { recursive: true });

for (const name of mapFiles) {
    try {
        const inputPath = path.join(originalsMaps, name);
        const baseName = path.parse(name).name;
        const avifOutputPath = path.join(publicMaps, baseName + '-full.avif');
        const previewAvifOutputPath = path.join(publicMaps, baseName + '.avif');
        const previewPngOutputPath = path.join(publicMaps, baseName + '.png');

        if (fs.existsSync(avifOutputPath) && fs.existsSync(previewAvifOutputPath) && fs.existsSync(previewPngOutputPath)) {
            if (fs.statSync(inputPath).mtimeMs <= fs.statSync(avifOutputPath).mtimeMs && fs.statSync(inputPath).mtimeMs <= fs.statSync(previewAvifOutputPath).mtimeMs && fs.statSync(inputPath).mtimeMs <= fs.statSync(previewPngOutputPath).mtimeMs) {
                console.log('pass', name);
                continue;
            }
        }

        await sharp(inputPath).avif({ quality: AVIF_QUALITY_MAPS }).toFile(avifOutputPath);
        await sharp(inputPath).resize({ width: PREVIEW_WIDTH, withoutEnlargement: true }).avif({ quality: AVIF_PREVIEW_QUALITY_MAPS }).toFile(previewAvifOutputPath);
        await sharp(inputPath).resize({ width: PREVIEW_WIDTH, withoutEnlargement: true }).png({ quality: PNG_PREVIEW_QUALITY_MAPS }).toFile(previewPngOutputPath);
        console.log('ready', name);
    } catch (error) {
        console.error('error', name, error.message);
    }
}
