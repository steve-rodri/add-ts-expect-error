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

describe("FileContent", () => {
  let mockSourceFile: Partial<SourceFile>

  beforeEach(() => {
    mockSourceFile = {
      getFilePath: vi.fn().mockReturnValue("test.ts"),
      getPreEmitDiagnostics: vi.fn().mockReturnValue([]),
      getLineAndColumnAtPos: vi.fn().mockReturnValue({ line: 1, column: 1 }),
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
      { getStart: vi.fn().mockReturnValue(5) },
      { getStart: vi.fn().mockReturnValue(15) },
    ]
    mockSourceFile.getPreEmitDiagnostics = vi.fn().mockReturnValue(diagnostics)

    const fileContent = new FileContent(mockSourceFile as SourceFile)
    const groupedDiagnostics = fileContent["diagnosticsByLine"]

    expect(groupedDiagnostics[1].length).toBe(1)
    expect(groupedDiagnostics[2].length).toBe(1)
  })

  it("should generate new content with comments", () => {
    const diagnostics: Partial<Diagnostic>[] = [
      { getStart: vi.fn().mockReturnValue(5) },
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
      { getStart: vi.fn().mockReturnValue(5) },
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
})
