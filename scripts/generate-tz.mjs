import * as fs from 'fs';
import * as path from 'path';

import neat from 'neat-csv';

const { access, mkdir, readFile, writeFile } = fs.promises;

const tabPath = 'node_modules/tz/zone1970.tab';
const genPath = 'src/__generated__/timezones.json';

(async () => {
  try {
    await Promise.all([access(tabPath, fs.constants.R_OK), existsAndHasAccess(genPath)]);
  } catch (error) {
    console.log(error);
    console.error(`need READ access to "${tabPath}" and WRITE access to "${genPath}"`);
    process.exit(1);
  }

  const rawContent = await readFile(tabPath, { encoding: 'utf-8' });
  const timezones = await neat(rawContent, {
    headers: ['codes', 'coordinates', 'TZ', 'comments'],
    separator: '\t',
    skipComments: true,
  });

  const json = JSON.stringify(timezones, null, 2);
  await writeFile(genPath, json, { flag: 'w' });

  console.log('\n  🌍 🌎 🌏\n');
  console.log(`  📁  ${timezones.length} timezones added to:`);
  console.log(`  ${genPath}`);
  console.log('\n  🌍 🌎 🌏\n');
})();

async function existsAndHasAccess(filepath) {
  const dirname = path.dirname(filepath);
  if (dirname !== '.') {
    await mkdir(dirname, { recursive: true });
  }
  await writeFile(filepath, '', { flag: 'a+' });
}
