import fs from 'node:fs';
import path from 'node:path';

const dir = 'E:/Downloads/wedding assets';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

function extractPngText(buf) {
  let offset = 8; // skip PNG signature
  const texts = [];
  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    if (type === 'tEXt' || type === 'iTXt') {
      const data = buf.subarray(offset + 8, offset + 8 + length);
      texts.push({ type, text: data.toString('utf8').replace(/\0/g, ' : ') });
    }
    offset += 12 + length;
  }
  return texts;
}

for (const file of files) {
  const buf = fs.readFileSync(path.join(dir, file));
  const texts = extractPngText(buf);
  console.log(`\nFile: ${file}`);
  if (texts.length > 0) {
    texts.forEach(t => console.log(`  [${t.type}] ${t.text.slice(0, 200)}`));
  } else {
    console.log('  No embedded text chunks.');
  }
}
