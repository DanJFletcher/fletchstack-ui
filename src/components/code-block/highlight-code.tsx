import type { ReactNode } from 'react';
import type { Element, Text } from 'hast';
import { refractor } from 'refractor/core';
import tsx from 'refractor/tsx';
import css from 'refractor/css';
import json from 'refractor/json';
import bash from 'refractor/bash';
import markdown from 'refractor/markdown';
import yaml from 'refractor/yaml';

/**
 * Register only the supported web grammars and their dependencies, once per module.
 **/
function createHighlighter() {
  [tsx, css, json, bash, markdown, yaml].forEach(grammar => refractor.register(grammar));

  return refractor;
}
const highlighter = /* @__PURE__ */ createHighlighter();
const languages = ['markup', 'html', 'xml', 'svg', 'css', 'javascript', 'js', 'jsx', 'typescript', 'ts', 'tsx', 'json', 'bash', 'sh', 'shell', 'markdown', 'md', 'yaml', 'yml'];

/**
 * Render only escaped text and token spans; never forward parser HTML or attributes.
 **/
function renderToken(node: Element | Text, index: number): ReactNode {
  if (node.type === 'text') { return node.value; }

  return <span key={index} className={(node.properties.className as string[]).join(' ')}>{(node.children as (Element | Text)[]).map(renderToken)}</span>;
}

/**
 * Highlight explicit supported languages synchronously; unknown or absent labels stay literal.
 **/
export function highlightCode(code: string, language: string | undefined, enabled: boolean): ReactNode {
  const syntax = language?.trim().toLowerCase();
  if (!enabled || !syntax || !languages.includes(syntax)) { return code; }

  return (highlighter.highlight(code, syntax).children as (Element | Text)[]).map(renderToken);
}
