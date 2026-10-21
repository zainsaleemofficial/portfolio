// Deterministic crop of the owner's existing photograph; no face generation or retouching.
import sharp from 'sharp'
import { readFile, writeFile } from 'node:fs/promises'

// Reviewed at 16/32/48/96px. Preserve the full hairline and chin while prioritizing the face.
const source = 'public/images/zain-hero-studio-2026.webp'
const crop = { left: 380, top: 270, width: 520, height: 520 }
const frames = []
for (const size of [16, 32, 48, 96, 180]) {
  const photo = await sharp(source)
    .extract(crop)
    .resize(size, size)
    .png()
    .toBuffer()
  const radius = size * 0.18
  const rounded = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="white"/></svg>`,
  )
  const outline = Buffer.from(
    `<svg width="${size}" height="${size}"><rect x="0.5" y="0.5" width="${size - 1}" height="${size - 1}" rx="${radius}" fill="none" stroke="#b8e9cc" stroke-opacity="0.6" stroke-width="1"/></svg>`,
  )
  const png = await sharp(photo)
    .composite([{ input: rounded, blend: 'dest-in' }, { input: outline }])
    .png({
      compressionLevel: 9,
      palette: true,
      colours: 256,
      dither: 0.3,
      effort: 10,
    })
    .toBuffer()
  if (size === 180) {
    // Apple applies its own corner mask; keep the touch icon opaque.
    await sharp(photo)
      .png({
        compressionLevel: 9,
        palette: true,
        colours: 256,
        dither: 0.3,
        effort: 10,
      })
      .toFile('public/apple-touch-icon.png')
  } else {
    frames.push({ size, png })
    if (size !== 16) await writeFile(`public/favicon-${size}.png`, png)
  }
}

// Multi-resolution ICO: real PNG frames, not a renamed PNG or a single-size fallback.
const directory = Buffer.alloc(6 + frames.length * 16)
directory.writeUInt16LE(1, 2)
directory.writeUInt16LE(frames.length, 4)
let offset = directory.length
for (const [i, { size, png }] of frames.entries()) {
  const entry = 6 + i * 16
  directory[entry] = size
  directory[entry + 1] = size
  directory.writeUInt16LE(1, entry + 4)
  directory.writeUInt16LE(32, entry + 6)
  directory.writeUInt32LE(png.length, entry + 8)
  directory.writeUInt32LE(offset, entry + 12)
  offset += png.length
}
await writeFile(
  'public/favicon.ico',
  Buffer.concat([directory, ...frames.map(({ png }) => png)]),
)

// Keep the former URL useful for older cached pages, but never declare it in new HTML.
const primary = await readFile('public/favicon-96.png')
await writeFile(
  'public/favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><image width="96" height="96" href="data:image/png;base64,${primary.toString('base64')}"/></svg>\n`,
)

// Social artwork is independent. Ordinary favicon regeneration must not alter it.
if (process.argv.includes('--social-preview'))
  await sharp(await readFile('public/social-preview.svg'))
    .png()
    .toFile('public/social-preview.png')
