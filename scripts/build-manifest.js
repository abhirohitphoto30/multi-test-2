const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../public/tests');
const out = path.resolve(__dirname, '../public/tests.json');
const ignored = new Set(['.gitkeep', 'README.md', 'readme.md']);
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

function folderNode(name, relParts = []) {
  return { name, type: 'folder', path: relParts.join('/'), children: [], testCount: 0 };
}

function buildTree(dir, relParts = []) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .filter(entry => !ignored.has(entry.name))
    .sort((a, b) => collator.compare(a.name, b.name));
  const nodes = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const parts = [...relParts, entry.name];
    if (entry.isDirectory()) {
      const children = buildTree(full, parts);
      const testCount = children.reduce((sum, child) => sum + (child.type === 'test' ? 1 : child.testCount), 0);
      nodes.push({ name: entry.name, type: 'folder', path: parts.join('/'), children, testCount });
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html') && relParts.length > 0) {
      nodes.push({
        name: path.basename(entry.name, path.extname(entry.name)),
        type: 'test',
        path: parts.join('/'),
        url: '/tests/' + parts.map(encodeURIComponent).join('/')
      });
    }
  }
  return nodes;
}

const folders = buildTree(root).filter(node => node.type === 'folder');
const testCount = folders.reduce((sum, folder) => sum + folder.testCount, 0);
const manifest = {
  generatedAt: new Date().toISOString(),
  coachingCount: folders.length,
  testCount,
  folders
};
fs.writeFileSync(out, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Generated ${out}: ${folders.length} top-level folder(s), ${testCount} HTML test(s), nested folders supported.`);
