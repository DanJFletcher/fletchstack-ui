import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
import ts from 'typescript';

/**
 * Resolve local code and CSS resources without executing or transforming modules.
 **/
function resolveResource(specifier, importer) {
  const module = ts.resolveModuleName(specifier, importer, { moduleResolution: ts.ModuleResolutionKind.Bundler }, ts.sys).resolvedModule;
  if (module) { return module.resolvedFileName; }
  const target = resolve(dirname(importer), specifier.split(/[?#]/)[0]);
  const candidates = [target, ...['.ts', '.tsx', '.js', '.mjs', '/index.ts', '/index.tsx'].map(suffix => target + suffix)];
  return candidates.find(path => existsSync(path) && statSync(path).isFile());
}

/**
 * Extract supported source imports and flag dynamic/runtime resource expressions.
 **/
function codeImports(source, file) {
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const imports = [];
  const unknown = [];
  const visit = node => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && !node.isTypeOnly && !node.importClause?.isTypeOnly) { imports.push(node.moduleSpecifier.text); }
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      if (node.arguments.length === 1 && ts.isStringLiteral(node.arguments[0])) { imports.push(node.arguments[0].text); }
      else { unknown.push('Nonliteral dynamic import'); }
    }
    if (ts.isNewExpression(node) && node.expression.getText(ast) === 'URL') {
      inspectUrl(node, ast, { imports, unknown });
    }
    inspectJsxResource(node, ast, { imports, unknown });
    ts.forEachChild(node, visit);
  };
  visit(ast);
  if (ast.parseDiagnostics.length) { unknown.push('Source parse error'); }
  if (/\b(?:fetch|readFile|readFileSync|require|glob|eval|Function)\s*\(/.test(source)) { unknown.push('Runtime resource discovery'); }
  return { imports, unknown };
}

/**
 * Record explicit media resources and reject computed browser asset paths.
 **/
function inspectJsxResource(node, ast, { unknown }) {
  if (!ts.isJsxAttribute(node) || !['src', 'srcSet', 'poster', 'href'].includes(node.name.getText(ast))) { return; }
  if (node.initializer && ts.isStringLiteral(node.initializer) && /^(?:#|data:)/.test(node.initializer.text)) { return; }
  unknown.push('Document-relative or dynamic JSX resource');
}

/**
 * Only import.meta.url establishes a literal asset's module-relative location.
 **/
function inspectUrl(node, ast, { imports, unknown }) {
  const [path, base] = node.arguments ?? [];
  if (node.arguments?.length === 2 && path && ts.isStringLiteral(path) && base?.getText(ast) === 'import.meta.url') { imports.push(path.text); }
  else { unknown.push('Dynamic or non-module URL resource'); }
}

/**
 * Include CSS imports and URL assets; custom-property URLs need broad fallback.
 **/
function cssImports(source) {
  const quoted = [...source.matchAll(/@import\s+["']([^"']+)["']/g)].map(match => match[1]);
  const urls = [...source.matchAll(/url\(([^)]*)\)/g)].map(match => match[1].trim().replace(/^["']|["']$/g, ''));
  const imports = [...quoted, ...urls];
  return { imports: imports.filter(path => !path.startsWith('#') && !path.startsWith('data:')), unknown: /url\(\s*var\(|image-set\(/.test(source) ? ['Dynamic CSS resource'] : [] };
}

/**
 * Inspect one authored file, retaining assets as leaf dependencies.
 **/
function importsFor(file) {
  if (/\.css$/.test(file)) { return cssImports(readFileSync(file, 'utf8')); }
  if (/\.[cm]?[jt]sx?$/.test(file)) { return codeImports(readFileSync(file, 'utf8'), file); }
  return { imports: [], unknown: [] };
}

/**
 * Collect a scenario's transitive dependencies and explain unsupported edges.
 **/
export function dependencyGraph(entries, root) {
  const files = new Set();
  const unknown = [];
  const paths = Object.fromEntries(entries.map(entry => [entry, [entry]]));
  const queue = entries.map(entry => resolve(root, entry));
  while (queue.length) {
    const file = queue.shift();
    if (files.has(file)) { continue; }
    files.add(file);
    if (!existsSync(file)) { unknown.push(`Missing dependency: ${relative(root, file)}`); continue; }
    const found = importsFor(file);
    unknown.push(...found.unknown.map(reason => `${relative(root, file)}: ${reason}`));
    for (const specifier of found.imports) { followImport({ specifier, file, root, queue, unknown, paths }); }
  }
  return { files: [...files].map(file => relative(root, file).replaceAll('\\', '/')).sort(), unknown, paths };
}

/**
 * Follow local imports; installed packages are governed by the lockfile fallback.
 **/
function followImport({ specifier, file, root, queue, unknown, paths }) {
  if (file.endsWith('.css') && !specifier.startsWith('.') && !specifier.startsWith('/') && !specifier.includes(':')) { specifier = `./${specifier}`; }
  if (!specifier.startsWith('.')) {
    if (specifier.startsWith('/') || specifier.startsWith('node:') || !isInstalled(specifier, root)) { unknown.push(`Unresolved or external resource: ${specifier}`); }
    return;
  }
  const resolved = resolveResource(specifier, file);
  if (!resolved || relative(root, resolved).startsWith('..')) { unknown.push(`Unresolved local resource: ${specifier} from ${relative(root, file)}`); }
  else {
    queue.push(resolved);
    const target = relative(root, resolved).replaceAll('\\', '/');
    paths[target] ??= [...paths[relative(root, file).replaceAll('\\', '/')], target];
  }
}

/**
 * Recognize package roots without loading package code or expanding its graph.
 **/
function isInstalled(specifier, root) {
  const parts = specifier.split('/');
  const name = specifier.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0];
  return existsSync(resolve(root, 'node_modules', name, 'package.json'));
}
