import sharp from 'sharp';
import { mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SOURCE = resolve(ROOT, 'scripts', 'icon-source.png');
const OUT_DIR = resolve(ROOT, 'public', 'icons');

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

mkdirSync(OUT_DIR, { recursive: true });

for (const size of SIZES) {
    await sharp(SOURCE)
        .resize(size, size, { fit: 'cover' })
        .png()
        .toFile(resolve(OUT_DIR, `icon-${size}.png`));
    console.log(`✅ icon-${size}.png`);
}

console.log('\nAll icons generated in public/icons/');
