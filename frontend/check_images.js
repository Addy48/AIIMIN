const fs = require('fs');

const files = [
  '/Users/aaditya/.gemini/antigravity/brain/c1c75120-4a7e-4153-917d-2e89d28d8e5e/media__1772650798892.jpg',
  '/Users/aaditya/.gemini/antigravity/brain/c1c75120-4a7e-4153-917d-2e89d28d8e5e/media__1772650554392.png',
  '/Users/aaditya/.gemini/antigravity/brain/c1c75120-4a7e-4153-917d-2e89d28d8e5e/media__1772650251863.png'
];

for(const f of files) {
  const stats = fs.statSync(f);
  console.log(f.split('/').pop(), stats.size, 'bytes');
}
