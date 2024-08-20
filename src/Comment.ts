import { Diagnostic, Node, SourceFile, SyntaxKind } from "ts-morph"

import { stringifyDiagnosticMessage } from "./utils"

interface ConstructorParams {
  lineNum: number
  lineDiagnostics: Diagnostic[]
  sourceFile: SourceFile
}

export class Comment {
  private sourceFile: SourceFile
  private text?: string
  private lineNum: number

  constructor({ lineNum, lineDiagnostics, sourceFile }: ConstructorParams) {
    this.sourceFile = sourceFile
    this.lineNum = lineNum
    this.text = this.generateTextFrom(lineDiagnostics)
  }

  private generateTextFrom(lineDiagnostics: Diagnostic[]) {
    if (lineDiagnostics.length === 0) return
    const errorMessage = this.getErrorMessage(lineDiagnostics)
    const startPosition = lineDiagnostics[0].getStart()
    if (!startPosition) return
    const inJSX = this.checkIfInJSX(startPosition)
    return inJSX
      ? `{/* @ts-expect-error: FIX: ${errorMessage} */}`
      : `// @ts-expect-error: FIX: ${errorMessage}`
  }

  private getDiagnosticMessagesFrom(lineDiagnostics: Diagnostic[]): string[] {
    return lineDiagnostics.map((diagnostic) => {
      const messageText = diagnostic.getMessageText()
      return stringifyDiagnosticMessage(messageText)
    })
  }

  private getErrorMessage(lineDiagnostics: Diagnostic[]): string {
    const diagnosticMessages = this.getDiagnosticMessagesFrom(lineDiagnostics)
    return diagnosticMessages.length > 1
      ? "Multiple errors, uncomment to see."
      : diagnosticMessages[0]
  }

  private checkIfInJSX(startPosition: number): boolean {
    const node = this.sourceFile.getDescendantAtPos(startPosition)
    if (!node) return false

    let current: Node | undefined = node
    let inAttribute = false
    const { line: startLine } =
      this.sourceFile.getLineAndColumnAtPos(startPosition)

    // Traverse up the AST to check if the node is within a JSX context
    while (current) {
      const kind = current.getKind()
      const { line: currentLine } = this.sourceFile.getLineAndColumnAtPos(
        current.getStart(),
      )

      // Continue traversing if within a JSX expression but not on the same line
      if (kind === SyntaxKind.JsxExpression) {
        if (currentLine === startLine) {
          current = current.getParent()
          continue
        } else {
          return false
        }
      }

      // Check if the position is within the props of a JSX element and not on the same line
      if (
        kind === SyntaxKind.JsxAttribute ||
        kind === SyntaxKind.JsxSpreadAttribute
      ) {
        if (currentLine === startLine) {
          inAttribute = true
          current = current.getParent()
          continue
        } else {
          return false
        }
      }

      if (
        inAttribute &&
        (kind === SyntaxKind.JsxOpeningElement ||
          kind === SyntaxKind.JsxSelfClosingElement)
      ) {
        return false
      }

      // Check if the position is within a JSX element
      if (
        kind === SyntaxKind.JsxElement ||
        kind === SyntaxKind.JsxSelfClosingElement ||
        kind === SyntaxKind.JsxFragment ||
        kind === SyntaxKind.JsxOpeningElement ||
        kind === SyntaxKind.JsxClosingElement ||
        kind === SyntaxKind.JsxOpeningFragment ||
        kind === SyntaxKind.JsxClosingFragment
      ) {
        if (currentLine === startLine) {
          current = current.getParent()
          continue
        } else {
          return true
        }
      }

      current = current.getParent()
    }

    return false
  }

  public hasTextAndAlreadyExists(lines: string[]): boolean {
    if (!this.text) return false
    const line = lines[this.lineNum]
    const beginningOfText = this.text.trim().slice(0, 3)
    return line?.trim().startsWith(beginningOfText) || false
  }

  public getLineNum(): number {
    return this.lineNum
  }

  public getText(): string {
    if (!this.text) throw new Error("Comment text not found.")
    return this.text
  }
}
