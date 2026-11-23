import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const dir = 'E:/Downloads/wedding assets';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

console.log('Total files found:', files.length);

const results = [];
for (const file of files) {
  const filePath = path.join(dir, file);
  const buf = fs.readFileSync(filePath);
  const size = buf.length;
  // PNG width and height are at offset 16 and 20 (4 bytes big endian)
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const hash = crypto.createHash('md5').update(buf).digest('hex');
  results.push({ file, width, height, size, hash });
}

// Group by hash to find duplicates
const hashGroups = {};
for (const r of results) {
  if (!hashGroups[r.hash]) hashGroups[r.hash] = [];
  hashGroups[r.hash].push(r.file);
}

results.forEach((r, idx) => {
  const ar = (r.width / r.height).toFixed(2);
  console.log(`${idx+1}. ${r.file} | ${r.width}x${r.height} (AR: ${ar}) | ${(r.size/1024/1024).toFixed(2)} MB | md5:${r.hash.slice(0,8)}`);
});

console.log('\n--- Duplicate Check ---');
let hasDupes = false;
for (const [hash, group] of Object.entries(hashGroups)) {
  if (group.length > 1) {
    hasDupes = true;
    console.log(`Duplicate hash ${hash.slice(0,8)}:`, group);
  }
}
if (!hasDupes) console.log('No exact duplicates found.');
