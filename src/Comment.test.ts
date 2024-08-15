import { Project, Diagnostic, SourceFile } from "ts-morph"
import { Comment } from "./Comment"
import { jsxCode } from "./__mocks__/jsx"

vi.mock("./utils", () => ({
  stringifyDiagnosticMessage: (msg: any) =>
    typeof msg === "string" ? msg : msg.getMessageText(),
}))

const createDiagnostic = (
  sourceFile: SourceFile,
  start: number,
  messageText: string,
): Diagnostic => {
  return {
    getStart: () => start,
    getMessageText: () => messageText,
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
})

it("should generate a comment for a non-JSX error", () => {
  const errorMessage = "This is an error message"

  const diagnostic = createDiagnostic(
    sourceFile,
    jsxCode.indexOf("console.log"),
    errorMessage,
  )
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
  const diagnostic1 = createDiagnostic(
    sourceFile,
    jsxCode.indexOf("console.log"),
    "First error message",
  )
  const diagnostic2 = createDiagnostic(
    sourceFile,
    jsxCode.indexOf("console.log") + 5,
    "Second error message",
  )
  const comment = new Comment({
    lineNum: 4,
    lineDiagnostics: [diagnostic1, diagnostic2],
    sourceFile,
  })

  expect(comment.getText()).toBe(
    createCommentText("Multiple errors, uncomment to see."),
  )
})

describe("JSX Errors", () => {
  it("should generate a comment in an attribute correctly", () => {
    const errorMessage = "This is a JSX error message in an attribute"

    const diagnostic = createDiagnostic(
      sourceFile,
      jsxCode.indexOf("some-class"),
      errorMessage,
    )
    const comment = new Comment({
      lineNum: 1,
      lineDiagnostics: [diagnostic],
      sourceFile,
    })
    const text = comment.getText()
    const result = createCommentText(errorMessage)

    expect(text).toBe(result)
  })

  it("should generate a comment in an attribute block correctly", () => {
    const errorMessage = "This is a JSX error message in an attribute block"

    const diagnostic = createDiagnostic(
      sourceFile,
      jsxCode.indexOf("Error"),
      errorMessage,
    )
    const comment = new Comment({
      lineNum: 2,
      lineDiagnostics: [diagnostic],
      sourceFile,
    })
    const text = comment.getText()
    const result = createCommentText(errorMessage)

    expect(text).toBe(result)
  })

  it("should generate a comment in an expression correctly", () => {
    const errorMessage = "expression"

    const diagnostic = createDiagnostic(
      sourceFile,
      jsxCode.indexOf("example"),
      errorMessage,
    )
    const comment = new Comment({
      lineNum: 9,
      lineDiagnostics: [diagnostic],
      sourceFile,
    })
    const text = comment.getText()
    const result = createCommentText(errorMessage)

    expect(text).toBe(result)
  })

  it("should generate a comment in an expression within an element correctly", () => {
    const errorMessage = "expression within an element"

    const diagnostic = createDiagnostic(
      sourceFile,
      jsxCode.indexOf("true"),
      errorMessage,
    )
    const comment = new Comment({
      lineNum: 7,
      lineDiagnostics: [diagnostic],
      sourceFile,
    })
    const text = comment.getText()
    const result = createJSXCommentText(errorMessage)

    expect(text).toBe(result)
  })
})
