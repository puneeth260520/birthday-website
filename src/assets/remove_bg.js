import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, 'shih_tzu_puppy.jpg');
const outputPath = path.join(__dirname, 'shih_tzu_puppy_nobg.png');

sharp(inputPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
  .then(({ data, info }) => {
    const { width, height, channels } = info;
    
    // Sample true background color from corner pixel (0,0)
    const bgR = data[0];
    const bgG = data[1];
    const bgB = data[2];
    
    const isBg = new Uint8Array(width * height);
    function getIdx(x, y) { return y * width + x; }
    
    // Check if pixel is part of the checkerboard grid background (grey/white tiles)
    function isCheckerboardTile(x, y) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      
      const diff = Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b));
      // Checkerboard tiles in the JPEG are neutral grey/white (#cccccc - #ffffff) with low color saturation (diff < 8)
      return diff < 8 && r > 185;
    }
    
    const queue = [];
    for (let x = 0; x < width; x++) {
      queue.push([x, 0]);
      queue.push([x, height - 1]);
    }
    for (let y = 0; y < height; y++) {
      queue.push([0, y]);
      queue.push([width - 1, y]);
    }
    
    while (queue.length > 0) {
      const [x, y] = queue.pop();
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      
      const pIdx = getIdx(x, y);
      if (isBg[pIdx]) continue;
      
      if (isCheckerboardTile(x, y)) {
        isBg[pIdx] = 1;
        queue.push([x + 1, y]);
        queue.push([x - 1, y]);
        queue.push([x, y + 1]);
        queue.push([x, y - 1]);
      }
    }
    
    // Alpha transparency ONLY for background
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pIdx = getIdx(x, y);
        if (isBg[pIdx]) {
          const idx = pIdx * channels;
          data[idx + 3] = 0;
        }
      }
    }
    
    return sharp(data, { raw: { width, height, channels } })
      .png()
      .toFile(outputPath);
  })
  .then(() => {
    console.log('Tight flood fill complete!');
  })
  .catch(err => {
    console.error('Error:', err);
  });
