import ts from 'typescript';

/**
 * Resolve named imports to the declaration they reference, without executing code.
 **/
function symbolAt(node, checker) {
  const symbol = checker.getSymbolAtLocation(node);
  return symbol?.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
}

/**
 * Visit descendants in source order, including the root node.
 **/
function walk(node, visit) {
  visit(node);
  ts.forEachChild(node, child => walk(child, visit));
}

/**
 * Admit only a direct destructured href parameter in a React forwardRef callback.
 * Assignments anywhere in the callback make this deliberately bounded proof fail.
 **/
function forwardedComponent(attribute, checker) {
  const attributes = attribute.parent.properties;
  if (attributes.slice(attributes.indexOf(attribute) + 1).some(ts.isJsxSpreadAttribute)) { return; }
  const value = attribute.initializer.expression;
  const symbol = checker.getSymbolAtLocation(value);
  if (symbol?.declarations?.length !== 1) { return; }
  const binding = symbol.valueDeclaration;
  if (!binding || !ts.isBindingElement(binding) || binding.initializer || binding.dotDotDotToken) { return; }
  if ((binding.propertyName ?? binding.name).getText() !== 'href') { return; }
  const parameter = binding.parent.parent;
  const callback = parameter.parent;
  if (!ts.isParameter(parameter) || parameter.initializer || parameter.dotDotDotToken || callback.parameters?.[0] !== parameter || !ts.isFunctionExpression(callback)) { return; }
  const call = callback.parent;
  if (!ts.isCallExpression(call) || call.arguments[0] !== callback || !ts.isIdentifier(call.expression)) { return; }
  if (!isReactForwardRef(call.expression, checker)) { return; }
  return immutableComponent(call, callback, checker);
}

/**
 * Match the actual named React import, including a local import alias.
 **/
function isReactForwardRef(expression, checker) {
  const imported = checker.getSymbolAtLocation(expression)?.declarations?.[0];
  return imported && ts.isImportSpecifier(imported) && (imported.propertyName ?? imported.name).text === 'forwardRef'
    && imported.parent.parent.parent.moduleSpecifier.text === 'react';
}

/**
 * Refuse mutable callbacks, callback escapes and non-constant component bindings.
 **/
function immutableComponent(call, callback, checker) {
  const declaration = call.parent;
  if (!ts.isVariableDeclaration(declaration) || !(declaration.parent.flags & ts.NodeFlags.Const)) { return; }
  let unsafe = false;
  const callbackName = callback.name && checker.getSymbolAtLocation(callback.name);
  walk(callback, node => {
    if (ts.isBinaryExpression(node) && node.operatorToken.kind >= ts.SyntaxKind.FirstAssignment && node.operatorToken.kind <= ts.SyntaxKind.LastAssignment) { unsafe = true; }
    if (ts.isPostfixUnaryExpression(node) || ts.isPrefixUnaryExpression(node) && [ts.SyntaxKind.PlusPlusToken, ts.SyntaxKind.MinusMinusToken].includes(node.operator)) { unsafe = true; }
    if (ts.isForInStatement(node) || ts.isForOfStatement(node)) { unsafe = true; }
    if (callbackName && ts.isIdentifier(node) && node !== callback.name && checker.getSymbolAtLocation(node) === callbackName) { unsafe = true; }
  });
  return unsafe ? undefined : { declaration, symbol: checker.getSymbolAtLocation(declaration.name) };
}

/**
 * Prove the last href value at a JSX call site; a later spread can override it.
 **/
function literalDestination(element) {
  let safe = true;
  for (const attribute of element.attributes.properties) {
    if (ts.isJsxSpreadAttribute(attribute)) { safe = false; }
    else if (attribute.name.getText() === 'href') {
      const value = attribute.initializer;
      safe = Boolean(value && ts.isStringLiteral(value) && /^(?:$|#|data:|https?:\/\/)/.test(value.text));
    }
  }
  return safe;
}

/**
 * Every component value use must be a JSX call with a proven destination.
 * Aliases, reexports, createElement and passing the component as data fail closed.
 **/
function allUsesProven(component, sources, checker) {
  const references = [];
  for (const source of sources) {
    walk(source, node => {
      if (!ts.isIdentifier(node) || symbolAt(node, checker) !== component.symbol || node === component.declaration.name) { return; }
      if (!ts.isImportSpecifier(node.parent) && !ts.isJsxClosingElement(node.parent)) { references.push(node); }
    });
  }
  return references.length > 0 && references.every(node => {
    const parent = node.parent;
    return (ts.isJsxSelfClosingElement(parent) || ts.isJsxOpeningElement(parent)) && parent.tagName === node && literalDestination(parent);
  });
}

/**
 * Prove forwarded anchor hrefs across the closed scenario import graph.
 * No library code is loaded; unsupported forwarding or caller syntax stays unknown.
 **/
export function provenForwardedHrefs(files, pending) {
  if (!pending.length) { return new Set(); }
  const program = forwardingProgram(files);
  const checker = program.getTypeChecker();
  const proven = new Set();
  for (const { file, position } of pending) {
    walk(program.getSourceFile(file), node => {
      if (!ts.isJsxAttribute(node) || node.pos !== position) { return; }
      const component = forwardedComponent(node, checker);
      if (component?.symbol && allUsesProven(component, program.getSourceFiles(), checker)) { proven.add(`${file}:${position}`); }
    });
  }
  return proven;
}

/**
 * Bind only the graph's authored modules, without resolving additional runtime files.
 **/
function forwardingProgram(files) {
  const roots = files.filter(file => /\.[cm]?[jt]sx?$/.test(file));
  return ts.createProgram(roots, { noResolve: true, noLib: true, allowJs: true, jsx: ts.JsxEmit.Preserve, moduleResolution: ts.ModuleResolutionKind.Bundler });
}
