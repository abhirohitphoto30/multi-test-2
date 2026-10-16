const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '../public/tests');
const out = path.resolve(__dirname, '../public/tests.json');
const ignored = new Set(['.gitkeep', 'README.md', 'readme.md']);
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).sort((a,b)=>a.name.localeCompare(b.name, undefined, {numeric:true,sensitivity:'base'})).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    if (!entry.isFile() || ignored.has(entry.name) || !entry.name.toLowerCase().endsWith('.html')) return [];
    const rel = path.relative(root, full).split(path.sep);
    if (rel.length < 2) return []; // Put each test in a coaching folder.
    const coaching = rel[0];
    const testName = path.basename(entry.name, path.extname(entry.name));
    return [{ coaching, name: testName, url: '/tests/' + rel.map(encodeURIComponent).join('/') }];
  });
}
const byCoaching = new Map();
for (const test of walk(root)) {
  if (!byCoaching.has(test.coaching)) byCoaching.set(test.coaching, []);
  byCoaching.get(test.coaching).push({ name: test.name, url: test.url });
}
const coachings = [...byCoaching.entries()].sort(([a],[b])=>a.localeCompare(b, undefined, {numeric:true,sensitivity:'base'})).map(([name,tests])=>({name,tests}));
const manifest = { generatedAt: new Date().toISOString(), coachingCount: coachings.length, testCount: coachings.reduce((n,c)=>n+c.tests.length,0), coachings };
fs.writeFileSync(out, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Generated ${out}: ${manifest.coachingCount} coaching folder(s), ${manifest.testCount} HTML test(s).`);
