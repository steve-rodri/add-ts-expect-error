import { SyntaxKind } from "ts-morph"

export function isJsxElementOrFragment(kind: SyntaxKind): boolean {
  return (
    kind === SyntaxKind.JsxElement ||
    kind === SyntaxKind.JsxSelfClosingElement ||
    kind === SyntaxKind.JsxFragment ||
    kind === SyntaxKind.JsxOpeningElement ||
    kind === SyntaxKind.JsxClosingElement ||
    kind === SyntaxKind.JsxOpeningFragment ||
    kind === SyntaxKind.JsxClosingFragment
  )
}

export function isJsxAttributeOrSpread(kind: SyntaxKind): boolean {
  return (
    kind === SyntaxKind.JsxAttribute || kind === SyntaxKind.JsxSpreadAttribute
  )
}

export function isJsxOpeningOrSelfClosing(kind: SyntaxKind): boolean {
  return (
    kind === SyntaxKind.JsxOpeningElement ||
    kind === SyntaxKind.JsxSelfClosingElement
  )
}
