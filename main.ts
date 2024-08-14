import {
  Diagnostic,
  DiagnosticMessageChain,
  Node,
  Project,
  SourceFile,
  SyntaxKind,
} from "ts-morph"
import fs from "fs"
import path from "path"

const currentWorkingDir = process.cwd()
const tsConfigFilePath = path.resolve(currentWorkingDir, "tsconfig.json")

interface CommentForDiagnostic {
  comment: string
  line: number
}

type DiagnosticsByLine = Record<number, Diagnostic[]>

function getProject(tsConfigFilePath: string) {
  return new Project({ tsConfigFilePath })
}

function readFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, "utf-8")
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    throw error
  }
}

function writeFile(filePath: string, content: string): void {
  try {
    fs.writeFileSync(filePath, content, "utf-8")
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error)
    throw error
  }
}

function isObject(message: string | DiagnosticMessageChain): boolean {
  return (
    message !== null && typeof message === "object" && !Array.isArray(message)
  )
}

function isJSXNode(node?: Node) {
  if (!node) return false
  const kind = node.getKind()
  const isJSXElement = kind === SyntaxKind.JsxElement
  const isJSXSelfClosingElement = kind === SyntaxKind.JsxSelfClosingElement
  return isJSXElement || isJSXSelfClosingElement
}

function extractMessageText(text: string | DiagnosticMessageChain): string {
  if (typeof text === "object" && "getMessageText" in text) {
    return text.getMessageText()
  }
  return text.toString()
}

function shortenDiagnosticMessage(
  diagnosticMessage: string | DiagnosticMessageChain,
): string {
  if (
    typeof diagnosticMessage === "object" &&
    "getMessageText" in diagnosticMessage
  ) {
    let messages = [extractMessageText(diagnosticMessage)]
    let next = diagnosticMessage.getNext()

    while (next && next.length > 0) {
      messages.push(extractMessageText(next[0]))
      next = next[0].getNext()
    }

    return messages.join(" ")
  }
  return diagnosticMessage.toString()
}

function stringifyDiagnosticMessage(
  diagnosticMessage: string | DiagnosticMessageChain,
) {
  if (isObject(diagnosticMessage))
    return shortenDiagnosticMessage(diagnosticMessage)
  return diagnosticMessage.toString()
}

function generateComment(diagnosticMessages: string[], node?: Node) {
  const isJSX = isJSXNode(node)

  const commentText =
    diagnosticMessages.length > 1
      ? "Multiple errors, uncomment to see."
      : diagnosticMessages[0]

  return isJSX
    ? `{/* @ts-expect-error: FIX: ${commentText} */}` // @ts-ignore
    : `// @ts-expect-error: FIX: ${commentText}` // @ts-ignore
}

function getCommentForDiagnostics(
  diagnostics: Diagnostic[],
  sourceFile: SourceFile,
): CommentForDiagnostic | null {
  if (diagnostics.length === 0) return null

  const start = diagnostics[0].getStart()
  if (!start) return null

  const diagnosticMessages = diagnostics.map((diagnostic) => {
    const messageText = diagnostic.getMessageText()
    return stringifyDiagnosticMessage(messageText)
  })

  const node = sourceFile.getDescendantAtPos(start)
  const { line } = sourceFile.getLineAndColumnAtPos(start)

  const comment = generateComment(diagnosticMessages, node)

  return { comment, line }
}

function groupDiagnosticsByLine(
  diagnostics: Diagnostic[],
  sourceFile: SourceFile,
): DiagnosticsByLine {
  const lineDiagnostics: DiagnosticsByLine = {}

  diagnostics.forEach((diagnostic) => {
    const start = diagnostic.getStart()
    if (!start) return
    const { line } = sourceFile.getLineAndColumnAtPos(start)
    if (!lineDiagnostics[line]) lineDiagnostics[line] = []
    lineDiagnostics[line].push(diagnostic)
  })

  return lineDiagnostics
}

function processDiagnostics(
  diagnosticsByLine: DiagnosticsByLine,
  sourceFile: SourceFile,
  fileLines: string[],
) {
  let newLineAddedOffset = 0
  Object.keys(diagnosticsByLine)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .forEach((line) => {
      const commentForDiagnostics = getCommentForDiagnostics(
        diagnosticsByLine[line],
        sourceFile,
      )
      if (!commentForDiagnostics) return
      const { comment, line: lineNum } = commentForDiagnostics

      // Adjust the line number with the current offset
      const adjustedLine = lineNum + newLineAddedOffset
      // Check if the comment already exists on the previous line
      const commentExists = fileLines[adjustedLine - 1]
        ?.trim()
        .startsWith(comment.slice(0, 3))

      if (!commentExists) {
        fileLines.splice(adjustedLine - 1, 0, comment)
        newLineAddedOffset += 1 // Increase the offset as we've added a new line
      }
    })
}

function processSourceFile(sourceFile: SourceFile) {
  const diagnostics = sourceFile.getPreEmitDiagnostics()
  if (!diagnostics.length) return

  const filePath = sourceFile.getFilePath()
  const fileContent = readFile(filePath)
  const fileLines = fileContent.split("\n")

  const diagnosticsByLine = groupDiagnosticsByLine(diagnostics, sourceFile)
  processDiagnostics(diagnosticsByLine, sourceFile, fileLines)

  const newContent = fileLines.join("\n")
  writeFile(filePath, newContent)
}

function main() {
  const project = getProject(tsConfigFilePath)
  const sourceFiles = project.getSourceFiles()

  sourceFiles.forEach(processSourceFile)

  console.log("Added @ts-expect-error comments to all TypeScript errors.")
}

main()
