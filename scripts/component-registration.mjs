import ts from 'typescript';

/**
 * Find literal arrays containing a named string without evaluating the configuration.
 **/
function namedArrays(node, name, result = []) {
  if (
    ts.isArrayLiteralExpression(node) &&
    node.elements.some((element) => ts.isStringLiteral(element) && element.text === name)
  ) {
    result.push(node);
  }
  ts.forEachChild(node, (child) => {
    namedArrays(child, name, result);
  });
  return result;
}

/**
 * Locate a supported literal child list or fail before modifying configuration.
 **/
function childArray(array, name) {
  const index = array.elements.findIndex(
    (element) => ts.isStringLiteral(element) && element.text === name,
  );
  const child = array.elements[index + 1];
  if (index < 0 || !child || !ts.isArrayLiteralExpression(child)) {
    throw new Error(`Unsupported preview layout for ${name}; register it manually.`);
  }
  return child;
}

/**
 * Preserve the preview source and insert only an import and explicit sidebar placement.
 **/
export function registerPreview(source, { name, slug, category }) {
  const parsed = ts.createSourceFile(
    'preview.tsx',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const roots = namedArrays(parsed, 'Components');
  if (parsed.parseDiagnostics.length || roots.length !== 1) {
    throw new Error('Unsupported preview layout; expected one literal Components order.');
  }
  const groups = childArray(roots[0], 'Components');
  const known = groups.elements.some(
    (element) => ts.isStringLiteral(element) && element.text === category,
  );
  const target = known ? childArray(groups, category) : groups;
  const prefix = target.elements.length && !target.elements.hasTrailingComma ? ',' : '';
  const insertion = known
    ? `${prefix} '${name}', ['Docs', 'Playground', 'Composition']`
    : `${prefix} '${category}', ['${name}', ['Docs', 'Playground', 'Composition']]`;
  const position = target.end - 1;
  return `import '../src/components/${slug}/${slug}.css';\n${source.slice(0, position)}${insertion}${source.slice(position)}`;
}

/**
 * Parse supported explicit named exports, retaining runtime/type identity and target.
 **/
export function namedExports(source) {
  const parsed = ts.createSourceFile('index.ts', source, ts.ScriptTarget.Latest, true);
  return parsed.statements.flatMap((statement) => {
    if (
      !ts.isExportDeclaration(statement) ||
      !statement.exportClause ||
      !ts.isNamedExports(statement.exportClause) ||
      !statement.moduleSpecifier ||
      !ts.isStringLiteral(statement.moduleSpecifier)
    ) {
      throw new Error('Unsupported public export layout; use explicit named exports.');
    }
    return statement.exportClause.elements.map((element) => ({
      name: element.name.text,
      type: statement.isTypeOnly || element.isTypeOnly,
      target: statement.moduleSpecifier.text,
    }));
  });
}

/**
 * Derive the single-family inventory entry and planned ownership for a new component.
 **/
export function newFamily({ name, slug, category }) {
  return {
    slug,
    entry: `src/components/${slug}/index.ts`,
    exports: { runtime: [name], types: [`${name}Props`, `${name}Style`] },
    modules: [`src/components/${slug}/${name}.tsx`],
    style: `src/components/${slug}/${slug}.css`,
    category,
    examples: `src/components/${slug}/stories/${slug}-examples.tsx`,
  };
}

/**
 * Read the actual exported scenario object's keys, ignoring comments and unrelated identifiers.
 **/
export function scenarioNames(source) {
  const parsed = ts.createSourceFile(
    'scenario.tsx',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const statements = parsed.statements.filter(
    (statement) =>
      ts.isVariableStatement(statement) &&
      statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword),
  );
  const declaration = statements
    .flatMap((statement) => [...statement.declarationList.declarations])
    .find((item) => item.name.getText(parsed) === 'scenarios');
  if (!declaration?.initializer || !ts.isObjectLiteralExpression(declaration.initializer)) {
    return [];
  }
  return declaration.initializer.properties
    .filter(
      (property) => ts.isShorthandPropertyAssignment(property) || ts.isPropertyAssignment(property),
    )
    .map((property) => property.name.getText(parsed).replace(/['"]/g, ''));
}

/**
 * Add isolated scenarios and their explicit future test owner without importing a global registry.
 **/
export function registerCatalog(catalog, { name, slug, id }) {
  for (const entry of ['Playground', 'Composition']) {
    const key = `${id}--${entry.toLowerCase()}`;
    if (Object.hasOwn(catalog.scenarios, key)) {
      throw new Error(`Scenario already registered: ${key}`);
    }
    catalog.scenarios[key] = {
      module: `tests/browser-harness/scenarios/${name}.tsx`,
      export: entry,
    };
  }
  const file = `tests/browser-harness/specs/${slug}/${name}.spec.ts`;
  if (catalog.suites.some((suite) => suite.file === file)) {
    throw new Error(`Suite already registered: ${file}`);
  }
  catalog.suites.push({
    project: 'components',
    file,
    scenarios: [`${id}--playground`, `${id}--composition`],
  });
  return catalog;
}
