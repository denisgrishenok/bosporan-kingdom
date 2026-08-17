import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const originalsImages = './originals/images';
const originalsMaps = './originals/maps';
const publicImages = './public/images';
const publicMaps = './public/maps';

const PREVIEW_WIDTH = 2000;
const AVIF_QUALITY_IMAGES = 50;
const AVIF_QUALITY_MAPS = 70;
const PNG_PREVIEW_QUALITY_MAPS = 70;


const imageFiles = fs.readdirSync(originalsImages).filter((name) => name.toLowerCase().endsWith('.png'));
const mapFiles = fs.readdirSync(originalsMaps).filter((name) => name.toLowerCase().endsWith('.png'));

for (const name of imageFiles) {
    const inputPath = path.join(originalsImages, name);
    const baseName = path.parse(name).name;
    const avifOutputPath = path.join(publicImages, baseName + '.avif');
    const pngOutputPath = path.join(publicImages, baseName + '.png');
    
}
