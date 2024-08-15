import { Mock } from "vitest"
import { SourceFile, Diagnostic } from "ts-morph"
import { FileContent } from "./FileContent"
import { readFile } from "./utils"
import { Comment } from "./Comment"

vi.mock("./utils", () => ({
  readFile: vi.fn().mockReturnValue("line1\nline2\nline3"),
  writeFile: vi.fn(),
}))
vi.mock("./Comment", () => ({
  Comment: vi.fn(),
}))

let mockSourceFile: Partial<SourceFile>

beforeEach(() => {
  mockSourceFile = {
    getFilePath: vi.fn().mockReturnValue("test.ts"),
    getPreEmitDiagnostics: vi.fn().mockReturnValue([]),
    getLineAndColumnAtPos: vi.fn().mockReturnValue({ line: 2 }),
  }
})

it("should initialize correctly", () => {
  const fileContent = new FileContent(mockSourceFile as SourceFile)
  expect(fileContent).toBeDefined()
  expect(mockSourceFile.getFilePath).toHaveBeenCalled()
  expect(readFile).toHaveBeenCalledWith("test.ts")
})

it("should group diagnostics by line", () => {
  const diagnostics: Partial<Diagnostic>[] = [
    { getStart: vi.fn().mockReturnValue(1) },
    { getStart: vi.fn().mockReturnValue(2) },
  ]
  mockSourceFile.getPreEmitDiagnostics = vi.fn().mockReturnValue(diagnostics)

  const fileContent = new FileContent(mockSourceFile as SourceFile)
  const groupedDiagnostics = fileContent["diagnosticsByLine"]

  expect(groupedDiagnostics.get(1)!.length).toBe(1)
  expect(groupedDiagnostics.get(2)!.length).toBe(1)
})

it("should generate new content with comments", () => {
  const diagnostics: Partial<Diagnostic>[] = [
    { getStart: vi.fn().mockReturnValue(2) },
  ]
  mockSourceFile.getPreEmitDiagnostics = vi.fn().mockReturnValue(diagnostics)
  ;(Comment as Mock).mockImplementation(() => ({
    getLineNum: vi.fn().mockReturnValue(1),
    getText: vi.fn().mockReturnValue("// @ts-expect-error"),
    hasTextAndAlreadyExists: vi.fn().mockReturnValue(false),
  }))

  const fileContent = new FileContent(mockSourceFile as SourceFile)
  const result = fileContent.generate()

  expect(result).toContain("// @ts-expect-error")
})

it("should not insert duplicate comments", () => {
  const diagnostics: Partial<Diagnostic>[] = [
    { getStart: vi.fn().mockReturnValue(1) },
  ]
  mockSourceFile.getPreEmitDiagnostics = vi.fn().mockReturnValue(diagnostics)
  ;(Comment as Mock).mockImplementation(() => ({
    getLineNum: vi.fn().mockReturnValue(1),
    getText: vi.fn().mockReturnValue("// @ts-expect-error"),
    hasTextAndAlreadyExists: vi.fn().mockReturnValue(true),
  }))

  const fileContent = new FileContent(mockSourceFile as SourceFile)
  const result = fileContent.generate()

  expect(result).not.toContain("// @ts-expect-error")
})

it("should write comments on the correct lines", () => {
  const diagnostics: Partial<Diagnostic>[] = [
    { getStart: vi.fn().mockReturnValue(1) }, // Diagnostic on line 2 (0-based index)
    { getStart: vi.fn().mockReturnValue(2) }, // Diagnostic on line 3 (0-based index)
  ]
  mockSourceFile.getPreEmitDiagnostics = vi.fn().mockReturnValue(diagnostics)
  mockSourceFile.getLineAndColumnAtPos = vi
    .fn()
    .mockImplementation((pos: number) => {
      if (pos === 1) return { line: 2 }
      if (pos === 2) return { line: 3 }
      return { line: 0 }
    })

  const mockComment = {
    getLineNum: vi.fn().mockReturnValue(1), // Diagnostic on line 2 (0-based index)
    getText: vi.fn().mockReturnValue("// @ts-expect-error at line 2"),
    hasTextAndAlreadyExists: vi.fn().mockReturnValue(false),
  }
  ;(Comment as Mock).mockImplementationOnce(() => mockComment)

  const fileContent = new FileContent(mockSourceFile as SourceFile)
  const result = fileContent.generate()

  expect(result).not.toBe(undefined)
  const lines = result?.split("\n") ?? []
  expect(lines[1]).toBe("// @ts-expect-error at line 2")
  expect(lines[2]).toBe("line2")
})
