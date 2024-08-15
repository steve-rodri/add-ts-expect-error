import { Project, Diagnostic, SourceFile } from "ts-morph"
import { Comment } from "./Comment"
import { jsxCode } from "./__mocks__/jsx"

// FIX: Not working correctly between JSX attributes

//   664 |                 disabled={true}
// > 665 | {/* @ts-expect-error: Type 'null' is not assignable to type 'ChangeEventHandler<HTMLSelectElement> | undefined'. */}
//       |  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//   666 |                 onChange={null}

// FIX: Not working correctly between JSX elements

// TS2339: Property 'coach' does not exist on type 'never'.
//      97 |                   <dt className="text-3xl truncate font-medium text-blue-900 underline">
//      98 | // @ts-expect-error: Property 'coach' does not exist on type 'never'.
//   >  99 |                     <a href={coach.coach.meetingsUrl} target="_blank">
//                                               ^^^

// FIX: Issues with type declarations

// TS2578: Unused '@ts-expect-error' directive.
//     1 | import React from "react"
//     2 | import "./profile.module.scss"
//   > 3 | // @ts-expect-error: Cannot find module '../../../assets/img/team-2-800x800.jpg' or its corresponding type declarations.
//       | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

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
