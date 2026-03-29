const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const patchesDir = path.join(projectRoot, 'patches');
const nodeModulesDir = path.join(projectRoot, 'node_modules');
const skippedSuffix = '.skipped-by-postinstall';

function getInstalledVersion(packageName) {
  const packageJsonPath = path.join(nodeModulesDir, ...packageName.split('/'), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8')).version || null;
}

function parsePatchFilename(filename) {
  if (!filename.endsWith('.patch')) return null;
  const base = filename.slice(0, -'.patch'.length);
  const splitIndex = base.lastIndexOf('+');
  if (splitIndex === -1) return null;
  return {
    packageName: base.slice(0, splitIndex).replace(/\+/g, '/'),
    targetVersion: base.slice(splitIndex + 1),
  };
}

const renamedFiles = [];

try {
  if (fs.existsSync(patchesDir)) {
    for (const entry of fs.readdirSync(patchesDir)) {
      const parsed = parsePatchFilename(entry);
      if (!parsed) continue;
      const installedVersion = getInstalledVersion(parsed.packageName);
      if (!installedVersion || installedVersion !== parsed.targetVersion) {
        const from = path.join(patchesDir, entry);
        const to = `${from}${skippedSuffix}`;
        fs.renameSync(from, to);
        renamedFiles.push({ from, to, targetVersion: parsed.targetVersion, installedVersion });
      }
    }
  }

  if (renamedFiles.length > 0) {
    console.log('Skipping stale patch-package patches:');
    for (const file of renamedFiles) {
      console.log(`- ${path.basename(file.from)} (installed: ${file.installedVersion ?? 'missing'})`);
    }
  }

  const patchPackageBin = path.join(projectRoot, 'node_modules', '.bin', process.platform === 'win32' ? 'patch-package.cmd' : 'patch-package');
  const result = spawnSync(patchPackageBin, {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: false,
    env: process.env,
  });

  if (result.error) {
    throw result.error;
  }

  if (typeof result.status === 'number' && result.status !== 0) {
    process.exit(result.status);
  }
} finally {
  for (const file of renamedFiles.reverse()) {
    if (fs.existsSync(file.to)) {
      fs.renameSync(file.to, file.from);
    }
  }
}
