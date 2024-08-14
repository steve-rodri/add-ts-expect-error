import { Diagnostic, SourceFile } from "ts-morph"

import { Comment } from "./Comment"
import { readFile } from "./utils"

type DiagnosticsByLine = Record<string, Diagnostic[]>

export class FileContent {
  private readonly sourceFile: SourceFile
  private readonly diagnosticsByLine: DiagnosticsByLine
  private lines: string[]
  private newLineAddedOffset: number

  constructor(sourceFile: SourceFile) {
    this.sourceFile = sourceFile
    this.diagnosticsByLine = this.groupDiagnosticsByLine()
    this.lines = this.getLines()
    this.newLineAddedOffset = 0
  }

  private groupDiagnosticsByLine() {
    const diagnostics = this.sourceFile.getPreEmitDiagnostics()
    return diagnostics.reduce((diagnosticsByLine, diagnostic) => {
      const start = diagnostic.getStart()
      if (!start) return diagnosticsByLine
      const { line } = this.sourceFile.getLineAndColumnAtPos(start)
      if (!diagnosticsByLine[line]) diagnosticsByLine[line] = []
      diagnosticsByLine[line].push(diagnostic)
      return diagnosticsByLine
    }, {} as DiagnosticsByLine)
  }

  private getLines(): string[] {
    const path = this.sourceFile.getFilePath()
    const content = readFile(path)
    return content.split("\n")
  }

  private getSortedDiagLineNums(): number[] {
    return Object.keys(this.diagnosticsByLine)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map(Number)
  }

  private insertComment(comment: Comment) {
    this.lines.splice(comment.getLineNum(), 0, comment.getText())
    this.newLineAddedOffset += 1
  }

  private createComment(diagnosticLineNum: number) {
    const lineNum = diagnosticLineNum + this.newLineAddedOffset - 1
    const lineDiagnostics = this.diagnosticsByLine[diagnosticLineNum]
    const sourceFile = this.sourceFile
    return new Comment({ lineNum, lineDiagnostics, sourceFile })
  }

  public generate(): string | undefined {
    const sortedDiagnosticLineNums = this.getSortedDiagLineNums()
    for (const diagnosticLineNum of sortedDiagnosticLineNums) {
      const comment = this.createComment(diagnosticLineNum)
      if (comment.hasTextAndAlreadyExists(this.lines)) continue
      if (!comment.getText()) continue
      this.insertComment(comment)
    }
    return this.lines.join("\n")
  }
}
