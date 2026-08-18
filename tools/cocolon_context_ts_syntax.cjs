#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const ts = require('typescript');

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith('--') || i + 1 >= argv.length) {
      throw new Error(`invalid argument sequence near ${key}`);
    }
    out[key.slice(2)] = argv[++i];
  }
  if (!out.input || !out.output) {
    throw new Error('--input and --output are required');
  }
  return out;
}

function scriptKind(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.tsx') return ts.ScriptKind.TSX;
  if (ext === '.ts') return ts.ScriptKind.TS;
  if (ext === '.jsx') return ts.ScriptKind.JSX;
  return ts.ScriptKind.JS;
}

function position(sourceFile, node) {
  const start = node.getStart(sourceFile, false);
  const loc = sourceFile.getLineAndCharacterOfPosition(start);
  return { line: loc.line + 1, column: loc.character + 1 };
}

function nodeName(node, sourceFile) {
  if (!node) return null;
  if (ts.isIdentifier(node) || ts.isPrivateIdentifier(node)) return node.text;
  if (ts.isStringLiteralLike(node) || ts.isNumericLiteral(node)) return node.text;
  try {
    return node.getText(sourceFile);
  } catch (_error) {
    return null;
  }
}

function declarationKind(node) {
  if (ts.isFunctionDeclaration(node)) return 'FUNCTION';
  if (ts.isClassDeclaration(node)) return 'CLASS';
  if (ts.isInterfaceDeclaration(node)) return 'INTERFACE';
  if (ts.isTypeAliasDeclaration(node)) return 'TYPE_ALIAS';
  if (ts.isEnumDeclaration(node)) return 'ENUM';
  if (ts.isVariableDeclaration(node)) return 'VARIABLE';
  if (ts.isMethodDeclaration(node)) return 'METHOD';
  if (ts.isPropertyDeclaration(node)) return 'PROPERTY';
  if (ts.isGetAccessorDeclaration(node)) return 'GET_ACCESSOR';
  if (ts.isSetAccessorDeclaration(node)) return 'SET_ACCESSOR';
  if (ts.isModuleDeclaration(node)) return 'MODULE';
  return null;
}

function declaredName(node, sourceFile) {
  if (ts.isVariableDeclaration(node)) return nodeName(node.name, sourceFile);
  if ('name' in node) return nodeName(node.name, sourceFile);
  return null;
}

function moduleReference(sourceFile, node, kind, literal) {
  const pos = position(sourceFile, node);
  return {
    kind,
    target: literal.text,
    line: pos.line,
    column: pos.column,
  };
}

function parseFile(spec) {
  const text = fs.readFileSync(spec.filesystem_path, 'utf8');
  const sf = ts.createSourceFile(
    spec.path,
    text,
    ts.ScriptTarget.Latest,
    true,
    scriptKind(spec.path),
  );
  const symbols = [];
  const references = [];

  function visit(node) {
    const kind = declarationKind(node);
    if (kind) {
      const name = declaredName(node, sf);
      if (name) {
        const pos = position(sf, node);
        symbols.push({ name, kind, line: pos.line, column: pos.column });
      }
    }

    if (ts.isImportDeclaration(node) && ts.isStringLiteralLike(node.moduleSpecifier)) {
      references.push(moduleReference(sf, node.moduleSpecifier, 'IMPORT', node.moduleSpecifier));
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteralLike(node.moduleSpecifier)) {
      references.push(moduleReference(sf, node.moduleSpecifier, 'EXPORT_FROM', node.moduleSpecifier));
    } else if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) {
      const expression = node.moduleReference.expression;
      if (expression && ts.isStringLiteralLike(expression)) {
        references.push(moduleReference(sf, expression, 'IMPORT_EQUALS', expression));
      }
    } else if (ts.isCallExpression(node)) {
      const expression = node.expression;
      const first = node.arguments[0];
      if (first && ts.isStringLiteralLike(first)) {
        if (ts.isIdentifier(expression) && expression.text === 'require') {
          references.push(moduleReference(sf, first, 'REQUIRE', first));
        } else if (expression.kind === ts.SyntaxKind.ImportKeyword) {
          references.push(moduleReference(sf, first, 'DYNAMIC_IMPORT', first));
        }
      }
    }

    ts.forEachChild(node, visit);
  }
  visit(sf);

  const diagnostics = (sf.parseDiagnostics || []).map((diag) => {
    const start = typeof diag.start === 'number' ? diag.start : 0;
    const loc = sf.getLineAndCharacterOfPosition(Math.min(start, sf.getFullText().length));
    return {
      code: diag.code,
      message: ts.flattenDiagnosticMessageText(diag.messageText, '\n'),
      line: loc.line + 1,
      column: loc.character + 1,
    };
  });

  symbols.sort((a, b) => a.line - b.line || a.column - b.column || a.name.localeCompare(b.name));
  references.sort((a, b) => a.line - b.line || a.column - b.column || a.target.localeCompare(b.target));
  diagnostics.sort((a, b) => a.line - b.line || a.column - b.column || a.code - b.code);

  return {
    repository_key: spec.repository_key,
    path: spec.path,
    parser: `typescript-${ts.version}`,
    parser_status: diagnostics.length ? 'PARSED_WITH_DIAGNOSTICS' : 'PARSED',
    symbols,
    references,
    diagnostics,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const request = JSON.parse(fs.readFileSync(args.input, 'utf8'));
  if (!request || !Array.isArray(request.files)) {
    throw new Error('input JSON must contain a files array');
  }
  const files = [];
  for (const spec of request.files) {
    try {
      files.push(parseFile(spec));
    } catch (error) {
      files.push({
        repository_key: spec.repository_key,
        path: spec.path,
        parser: `typescript-${ts.version}`,
        parser_status: 'ERROR',
        symbols: [],
        references: [],
        diagnostics: [{
          code: 'NODE_PARSER_ERROR',
          message: error instanceof Error ? error.message : String(error),
          line: 0,
          column: 0,
        }],
      });
    }
  }
  files.sort((a, b) => a.repository_key.localeCompare(b.repository_key) || a.path.localeCompare(b.path));
  const output = {
    schema_version: 'cocolon.system_context.typescript_syntax.v1',
    typescript_version: ts.version,
    files,
  };
  fs.writeFileSync(args.output, `${JSON.stringify(output)}\n`, 'utf8');
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
}
