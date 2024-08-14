import { type Diagnostic, type SourceFile, SyntaxKind } from "ts-morph"
import { Comment } from "./Comment"

const createMockDiagnostic = () => {
  return {
    getMessageText: vi.fn(),
    getStart: vi.fn(() => 42),
  } as unknown as Diagnostic
}

const createMockSourceFile = (kind: SyntaxKind) => {
  return {
    getDescendantAtPos: vi.fn(() => ({
      getKind: vi.fn(() => kind),
    })),
  } as unknown as SourceFile
}

describe("Comment", () => {
  const lineNum = 0
  const lineDiagnostics = [createMockDiagnostic()]

  it("should instantiate correctly", () => {
    const sourceFile = createMockSourceFile(SyntaxKind.JsxElement)
    const comment = new Comment({ lineNum, lineDiagnostics, sourceFile })
    expect(comment).toBeInstanceOf(Comment)
  })

  it("should generate the correct text for JSX elements", () => {
    const sourceFile = createMockSourceFile(SyntaxKind.JsxElement)
    const comment = new Comment({ lineNum, lineDiagnostics, sourceFile })
    expect(comment.getText()).toBe(
      "{/* @ts-expect-error: FIX: Mock error message */}",
    )
  })

  it("should generate the correct text for non-JSX elements", () => {
    const sourceFile = createMockSourceFile(SyntaxKind.FunctionDeclaration)
    const comment = new Comment({ lineNum, lineDiagnostics, sourceFile })
    expect(comment.getText()).toBe(
      "// @ts-expect-error: FIX: Mock error message",
    )
  })

  it("should return the correct line number", () => {
    const sourceFile = createMockSourceFile(SyntaxKind.JsxElement)
    const comment = new Comment({ lineNum, lineDiagnostics, sourceFile })
    expect(comment.getLineNum()).toBe(lineNum)
  })

  it("should check if text already exists in lines", () => {
    const sourceFile = createMockSourceFile(SyntaxKind.JsxElement)
    const comment = new Comment({ lineNum, lineDiagnostics, sourceFile })
    const lines = ["{/* @ts-expect-error: FIX: Mock error message */}"]
    expect(comment.hasTextAndAlreadyExists(lines)).toBe(true)
  })

  it("should throw an error if text is not generated", () => {
    const sourceFile = createMockSourceFile(SyntaxKind.JsxElement)
    const emptyDiagnosticsComment = new Comment({
      lineNum,
      lineDiagnostics: [],
      sourceFile,
    })
    expect(() => emptyDiagnosticsComment.getText()).toThrow(
      "Comment text not found.",
    )
  })
})
