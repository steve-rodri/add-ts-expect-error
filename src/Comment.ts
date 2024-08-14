import { Diagnostic, SourceFile, SyntaxKind } from "ts-morph"

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
    const inJSX = this.checkIfInJSX(lineDiagnostics[0].getStart())
    if (inJSX === undefined) return
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

  private checkIfInJSX(startPosition?: number) {
    if (!startPosition) return
    const node = this.sourceFile.getDescendantAtPos(startPosition)
    if (!node) return false
    const kind = node.getKind()
    return (
      kind === SyntaxKind.JsxElement ||
      kind === SyntaxKind.JsxSelfClosingElement
    )
  }

  public hasTextAndAlreadyExists(lines: string[]): boolean {
    if (!this.text) return false
    const line = lines[this.lineNum]
    const beginningOfText = this.text.trim().slice(0, 3)
    return line.trim().startsWith(beginningOfText) || false
  }

  public getLineNum(): number {
    return this.lineNum
  }

  public getText(): string {
    if (!this.text) throw new Error("Comment text not found.")
    return this.text
  }
}
