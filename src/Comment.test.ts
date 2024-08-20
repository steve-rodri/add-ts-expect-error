import { Project, Diagnostic, SourceFile, DiagnosticCategory } from "ts-morph"
import { Comment } from "./Comment"
import { jsxCode } from "./__mocks__/jsx"
import { getPosOfNthOccurrence } from "./__mocks__/getPosOfNthOccurence"
import { getLineNumberFromPosition } from "./__mocks__/getLineNumberFromPosition"
import * as utils from "./utils"

const createDiagnostic = ({
  sourceFile,
  start,
  messageText,
  category = DiagnosticCategory.Error,
}: {
  sourceFile: SourceFile
  start: number
  messageText: string
  category?: DiagnosticCategory
}): Diagnostic => {
  return {
    getStart: () => start,
    getMessageText: () => messageText,
    getCategory: () => category,
    getSourceFile: () => sourceFile,
  } as unknown as Diagnostic
}

const createJSXCommentText = (message: string) =>
  `{/* @ts-expect-error: FIX: ${message} */}`

const createCommentText = (message: string) =>
  `// @ts-expect-error: FIX: ${message}`

let sourceFile: SourceFile

beforeEach(() => {
  const project = new Project()
  sourceFile = project.createSourceFile("test.tsx", jsxCode)
  // Set up default mocks for each function
  vi.spyOn(utils, "stringifyDiagnosticMessage").mockImplementation(
    (msg: any) => (typeof msg === "string" ? msg : msg.getMessageText()),
  )
  vi.spyOn(utils, "isJsxAttributeOrSpread").mockImplementation(() => false)
  vi.spyOn(utils, "isJsxElementOrFragment").mockImplementation(() => false)
  vi.spyOn(utils, "isJsxOpeningOrSelfClosing").mockImplementation(() => false)
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe("JSX Errors", () => {
  it("should generate a comment in an attribute correctly", () => {
    const project = new Project()
    sourceFile = project.addSourceFileAtPath(
      "./src/__mocks__/EditYourAccount.tsx",
    )
    const errorMessage = "This is a JSX error message in an attribute"
    const sourceText = sourceFile.getFullText()
    const start = getPosOfNthOccurrence(sourceText, "null", 5)
    if (!start) return
    const diagnosticLineNum = getLineNumberFromPosition(sourceText, start)
    const diagnostic = createDiagnostic({
      sourceFile,
      start,
      messageText: errorMessage,
    })
    const comment = new Comment({
      lineNum: diagnosticLineNum - 1,
      lineDiagnostics: [diagnostic],
      sourceFile,
    })
    const text = comment.getText()
    expect(text).toBe(createCommentText(errorMessage))
  })

  it("should generate a comment in an attribute block correctly", () => {
    const errorMessage = "This is a JSX error message in an attribute block"
    const diagnostic = createDiagnostic({
      sourceFile,
      start: jsxCode.indexOf("Error"),
      messageText: errorMessage,
    })
    const comment = new Comment({
      lineNum: 2,
      lineDiagnostics: [diagnostic],
      sourceFile,
    })
    const text = comment.getText()
    expect(text).toBe(createCommentText(errorMessage))
  })

  it("should generate a comment in an expression correctly", () => {
    const errorMessage = "expression"
    const diagnostic = createDiagnostic({
      sourceFile,
      start: jsxCode.indexOf("example"),
      messageText: errorMessage,
    })
    const comment = new Comment({
      lineNum: 9,
      lineDiagnostics: [diagnostic],
      sourceFile,
    })
    const text = comment.getText()
    expect(text).toBe(createCommentText(errorMessage))
  })

  it("should generate a comment in an expression within an element correctly", () => {
    vi.spyOn(utils, "isJsxElementOrFragment").mockImplementation(() => true)

    const project = new Project()
    sourceFile = project.addSourceFileAtPath(
      "./src/__mocks__/SystemTrackingRow.tsx",
    )
    const errorMessage = "expression within an element"
    const sourceText = sourceFile.getFullText()
    const start = getPosOfNthOccurrence(sourceText, "ellipsisActions", 2)
    if (!start) return
    const diagnosticLineNum = getLineNumberFromPosition(sourceText, start)
    const diagnostic = createDiagnostic({
      sourceFile,
      start,
      messageText: errorMessage,
    })
    const comment = new Comment({
      lineNum: diagnosticLineNum - 1,
      lineDiagnostics: [diagnostic],
      sourceFile,
    })

    const text = comment.getText()
    expect(text).toBe(createJSXCommentText(errorMessage))
  })
})

it("should generate a comment for a non-JSX error", () => {
  const errorMessage = "This is an error message"
  const diagnostic = createDiagnostic({
    sourceFile,
    start: jsxCode.indexOf("console.log"),
    messageText: errorMessage,
  })
  const comment = new Comment({
    lineNum: 5,
    lineDiagnostics: [diagnostic],
    sourceFile,
  })
  expect(comment.getText()).toBe(createCommentText(errorMessage))
})

it("should correctly identify line number", () => {
  const comment = new Comment({
    lineNum: 5,
    lineDiagnostics: [],
    sourceFile,
  })
  expect(comment.getLineNum()).toBe(5)
})

it("should handle multiple diagnostics", () => {
  const diagnostic1 = createDiagnostic({
    sourceFile,
    start: jsxCode.indexOf("console.log"),
    messageText: "First error message",
  })
  const diagnostic2 = createDiagnostic({
    sourceFile,
    start: jsxCode.indexOf("console.log") + 5,
    messageText: "Second error message",
  })
  const comment = new Comment({
    lineNum: 4,
    lineDiagnostics: [diagnostic1, diagnostic2],
    sourceFile,
  })
  expect(comment.getText()).toBe(
    createCommentText("Multiple errors, uncomment to see."),
  )
})
