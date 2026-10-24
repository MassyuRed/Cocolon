#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const ts = require("typescript");

function lineColumn(sourceFile, node) {
  const pos = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile, false));
  return { line: pos.line + 1, column: pos.character + 1 };
}

function nameText(node, sourceFile) {
  if (!node) return null;
  if (ts.isIdentifier(node) || ts.isPrivateIdentifier(node)) return node.text;
  if (ts.isStringLiteralLike(node) || ts.isNumericLiteral(node)) return String(node.text);
  return node.getText(sourceFile);
}

function importTarget(expression, sourceFile) {
  if (!expression) return null;
  if (ts.isStringLiteralLike(expression)) return expression.text;
  if (ts.isNoSubstitutionTemplateLiteral(expression)) return expression.text;
  return expression.getText(sourceFile);
}

function parseOne(file) {
  let text;
  try {
    text = fs.readFileSync(file.absolute_path, "utf8");
  } catch (error) {
    return {
      repository_key: file.repository_key,
      path: file.path,
      symbols: [],
      references: [],
      errors: [{ parser: "typescript", code: "READ_ERROR", message: String(error), line: null, column: null }],
    };
  }
  const ext = path.extname(file.path).toLowerCase();
  const scriptKind = ext === ".tsx" ? ts.ScriptKind.TSX : ext === ".ts" ? ts.ScriptKind.TS : ext === ".jsx" ? ts.ScriptKind.JSX : ts.ScriptKind.JS;
  const sourceFile = ts.createSourceFile(file.path, text, ts.ScriptTarget.Latest, true, scriptKind);
  const symbols = [];
  const references = [];
  const errors = [];

  for (const diagnostic of sourceFile.parseDiagnostics || []) {
    const start = typeof diagnostic.start === "number" ? diagnostic.start : 0;
    const pos = sourceFile.getLineAndCharacterOfPosition(start);
    errors.push({
      parser: "typescript",
      code: `TS${diagnostic.code}`,
      message: ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
      line: pos.line + 1,
      column: pos.character + 1,
    });
  }

  function addSymbol(node, nameNode, kind) {
    const name = nameText(nameNode, sourceFile);
    if (!name) return;
    const pos = lineColumn(sourceFile, nameNode || node);
    symbols.push({ name, kind, line: pos.line, column: pos.column });
  }

  function addReference(node, target, kind = "IMPORT") {
    if (!target) return;
    const pos = lineColumn(sourceFile, node);
    references.push({ kind, target, line: pos.line, column: pos.column });
  }

  function visit(node) {
    if (ts.isFunctionDeclaration(node) && node.name) addSymbol(node, node.name, "FUNCTION");
    else if (ts.isClassDeclaration(node) && node.name) addSymbol(node, node.name, "CLASS");
    else if (ts.isInterfaceDeclaration(node)) addSymbol(node, node.name, "INTERFACE");
    else if (ts.isTypeAliasDeclaration(node)) addSymbol(node, node.name, "TYPE_ALIAS");
    else if (ts.isEnumDeclaration(node)) addSymbol(node, node.name, "ENUM");
    else if (ts.isMethodDeclaration(node) && node.name) addSymbol(node, node.name, "METHOD");
    else if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
      const initializer = node.initializer;
      if (initializer && (ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer) || ts.isClassExpression(initializer))) {
        addSymbol(node, node.name, ts.isClassExpression(initializer) ? "CLASS" : "FUNCTION_VARIABLE");
      }
    }

    if (ts.isImportDeclaration(node)) {
      addReference(node.moduleSpecifier, importTarget(node.moduleSpecifier, sourceFile));
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
      addReference(node.moduleSpecifier, importTarget(node.moduleSpecifier, sourceFile), "RE_EXPORT");
    } else if (ts.isCallExpression(node)) {
      if (node.expression.kind === ts.SyntaxKind.ImportKeyword && node.arguments.length) {
        addReference(node.arguments[0], importTarget(node.arguments[0], sourceFile), "DYNAMIC_IMPORT");
      } else if (ts.isIdentifier(node.expression) && node.expression.text === "require" && node.arguments.length) {
        addReference(node.arguments[0], importTarget(node.arguments[0], sourceFile), "REQUIRE");
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return { repository_key: file.repository_key, path: file.path, symbols, references, errors };
}

function main() {
  if (process.argv.length !== 3) {
    console.error("usage: cocolon_context_ts_syntax.cjs MANIFEST.json");
    process.exit(2);
  }
  const manifest = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
  const files = (manifest.files || []).map(parseOne);
  process.stdout.write(JSON.stringify({ files }));
}

main();
