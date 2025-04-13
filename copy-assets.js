import { copyFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';

// Ensure target directory exists
function ensureDirectoryExists(directory) {
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
  }
}

// Copy directory recursively
function copyDirectory(source, target) {
  ensureDirectoryExists(target);
  
  const files = readdirSync(source, { withFileTypes: true });
  
  for (const file of files) {
    const sourcePath = join(source, file.name);
    const targetPath = join(target, file.name);
    
    if (file.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      ensureDirectoryExists(dirname(targetPath));
      copyFileSync(sourcePath, targetPath);
      console.log(`Copied: ${sourcePath} -> ${targetPath}`);
    }
  }
}

// Copy assets to dist
const sourceDir = './src/assets';
const targetDir = './dist/assets';

console.log('Copying assets to dist folder...');
copyDirectory(sourceDir, targetDir);
console.log('Assets copied successfully!');