import {
  Diagnostic,
  DiagnosticCategory,
  Node,
  SourceFile,
  SyntaxKind,
} from "ts-morph"

import {
  isJsxAttributeOrSpread,
  isJsxElementOrFragment,
  isJsxOpeningOrSelfClosing,
  stringifyDiagnosticMessage,
} from "./utils"

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
    const errorDiagnostics = this.getErrorDiagnostics(lineDiagnostics)
    this.text = this.generateTextFrom(errorDiagnostics)
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

  private getErrorDiagnostics(lineDiagnostics: Diagnostic[]) {
    return lineDiagnostics.filter(
      (diagnostic) => diagnostic?.getCategory() === DiagnosticCategory.Error,
    )
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
    const startLineNum = this.getLineNumFor(startPosition)
    let currentNode = this.sourceFile.getDescendantAtPos(startPosition)
    let inAttribute = false
    while (currentNode) {
      const { kind, currentLineNum } = this.getNodeInfo(currentNode)
      if (currentLineNum === startLineNum) {
        inAttribute ||= isJsxAttributeOrSpread(kind)
      }
      if (currentLineNum !== startLineNum) {
        if (kind === SyntaxKind.JsxExpression) return false
        if (inAttribute && isJsxOpeningOrSelfClosing(kind)) return false
        if (isJsxElementOrFragment(kind)) return true
      }
      currentNode = currentNode.getParent()
    }
    return false
  }

  private getNodeInfo(node: Node) {
    const kind = node.getKind()
    const currentPos = node.getStart()
    const currentLineNum = this.getLineNumFor(currentPos)
    return { kind, currentLineNum }
  }

  private getLineNumFor(position: number): number {
    return this.sourceFile.getLineAndColumnAtPos(position).line
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
