import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const RES = 'android/app/src/main/res';
const SRC = 'www/assets/lasu-crest.jpg';
const BG = '#f4f9ff';
const SPLASH_BG = '#287bb8';

/* Normalise the crest to a transparent PNG first: JPEG padding from
   sharp defaults to black, which produced black bars on the icons. */
const crestPng = await sharp(SRC).png().toBuffer();
const crest = async (size) =>
  sharp(crestPng)
    .resize(size, size, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

const W = (w, h, bg, r = 0) =>
  Buffer.from(
    `<svg width="${w}" height="${h}"><rect width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${bg}"/></svg>`
  );

const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };

for (const [d, scale] of Object.entries(densities)) {
  const size = Math.round(48 * scale);
  const logo = await crest(Math.round(size * 0.78));

  const plate = await sharp(W(size, size, BG, Math.round(size * 0.22))).png().toBuffer();
  const square = await sharp(plate)
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toBuffer();
  await sharp(square).toFile(path.join(RES, `mipmap-${d}`, 'ic_launcher.png'));

  const roundMask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`
  );
  /* Composite the logo and the mask in one pass: chained .composite() calls
     replace each other, which produced blank icons. */
  const base = await sharp(W(size, size, BG))
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toBuffer();
  await sharp(base)
    .composite([{ input: roundMask, blend: 'dest-in' }])
    .png()
    .toFile(path.join(RES, `mipmap-${d}`, 'ic_launcher_round.png'));

  const fgSize = Math.round(108 * scale);
  const fgLogo = await crest(Math.round(fgSize * 0.54));
  await sharp({ create: { width: fgSize, height: fgSize, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: fgLogo, gravity: 'center' }])
    .png()
    .toFile(path.join(RES, `mipmap-${d}`, 'ic_launcher_foreground.png'));
}

fs.writeFileSync(
  path.join(RES, 'values', 'ic_launcher_background.xml'),
  `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${BG}</color>\n</resources>\n`
);

const sizes = {
  'drawable-port-mdpi': [320, 480, 1],
  'drawable-port-hdpi': [480, 800, 1.5],
  'drawable-port-xhdpi': [720, 1280, 2],
  'drawable-port-xxhdpi': [960, 1600, 3],
  'drawable-port-xxxhdpi': [1280, 1920, 4],
  'drawable-land-mdpi': [480, 320, 1],
  'drawable-land-hdpi': [800, 480, 1.5],
  'drawable-land-xhdpi': [1280, 720, 2],
  'drawable-land-xxhdpi': [1600, 960, 3],
  'drawable-land-xxxhdpi': [1920, 1280, 4],
};

for (const [dir, [w, h, scale]] of Object.entries(sizes)) {
  const logoSize = Math.round(120 * scale);
  const logo = await crest(Math.round(logoSize * 0.86));
  const pad = Math.round(18 * scale);
  const plateW = logoSize + pad * 2;
  const plate = await sharp(W(plateW, plateW, '#ffffff', Math.round(20 * scale))).png().toBuffer();
  await sharp({ create: { width: w, height: h, channels: 4, background: SPLASH_BG } })
    .composite([
      { input: plate, gravity: 'center' },
      { input: logo, gravity: 'center' },
    ])
    .png()
    .toFile(path.join(RES, dir, 'splash.png'));
}

const defLogo = await crest(150);
await sharp({ create: { width: 480, height: 320, channels: 4, background: SPLASH_BG } })
  .composite([{ input: defLogo, gravity: 'center' }])
  .png()
  .toFile(path.join(RES, 'drawable', 'splash.png'));

console.log('icons + splashes regenerated');
