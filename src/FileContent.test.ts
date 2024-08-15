import { SourceFile } from "ts-morph"
import { FileContent } from "./FileContent"

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

afterEach(() => {
  vi.restoreAllMocks()
})

it("should initialize correctly", () => {
  const fileContent = new FileContent(mockSourceFile as SourceFile)
  expect(fileContent).toBeDefined()
  expect(mockSourceFile.getFilePath).toHaveBeenCalled()
  // expect(readFile).toHaveBeenCalledWith("test.ts")
})
