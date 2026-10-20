// Raster fallbacks use the checked-in vector identity; no photo regeneration.
import sharp from 'sharp'
import { readFile, writeFile } from 'node:fs/promises'
const icon = await readFile('public/favicon.svg')
for (const size of [32, 48, 96])
  await sharp(icon)
    .resize(size, size)
    .png()
    .toFile(`public/favicon-${size}.png`)
await sharp(icon).resize(180, 180).png().toFile('public/apple-touch-icon.png')
const png = await readFile('public/favicon-48.png')
const header = Buffer.alloc(22)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(1, 4)
header[6] = 48
header[7] = 48
header.writeUInt16LE(1, 10)
header.writeUInt16LE(32, 12)
header.writeUInt32LE(png.length, 14)
header.writeUInt32LE(22, 18)
await writeFile('public/favicon.ico', Buffer.concat([header, png]))
await sharp(await readFile('public/social-preview.svg'))
  .png()
  .toFile('public/social-preview.png')
