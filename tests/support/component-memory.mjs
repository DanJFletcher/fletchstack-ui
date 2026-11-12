import { dirname } from 'node:path';

/**
 * Model authored files and directories in memory for unit tests of the filesystem boundary.
 **/
export function memoryFilesystem() {
  const files = new Map();
  const directories = new Set(['/project']);
  const links = new Set();
  const existsSync = path => files.has(path) || directories.has(path) || links.has(path);
  const missing = path => Object.assign(new Error(`ENOENT: ${path}`), { code: 'ENOENT' });
  return {
    existsSync,
    realpathSync: path => path,
    mkdirSync: path => { while (path !== '/' && !directories.has(path)) { directories.add(path); path = dirname(path); } },
    readFileSync: path => { if (!files.has(path)) { throw missing(path); } return files.get(path); },
    writeFileSync: (path, content, options) => { if (options?.flag === 'wx' && existsSync(path)) { throw new Error('EEXIST'); } files.set(path, content); },
    lstatSync: path => { if (!existsSync(path)) { throw missing(path); } return { isSymbolicLink: () => links.has(path) }; },
    readdirSync: path => [...new Set([...files.keys(), ...directories, ...links].filter(item => dirname(item) === path))].map(item => ({ name: item.slice(path.length + 1), isDirectory: () => directories.has(item), isFile: () => files.has(item) })),
    symlinkSync: (_, path) => { links.add(path); },
    unlinkSync: path => { files.delete(path); links.delete(path); },
  };
}
