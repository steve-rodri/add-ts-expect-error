import { SourceFile } from "ts-morph"
import { processSourceFile } from "./processSourceFile"
import { FileContent } from "../FileContent"
import { writeFile } from "./file-util"
import { Mock } from "vitest"

// Mocking dependencies
vi.mock("../FileContent", () => {
  return {
    FileContent: vi.fn().mockImplementation(() => {
      return {
        generate: vi.fn(),
      }
    }),
  }
})

vi.mock("./file-util", () => {
  return {
    writeFile: vi.fn(),
  }
})

beforeEach(() => {
  vi.clearAllMocks()
})

it("should call writeFile with correct arguments when newContent is generated", () => {
  const mockFilePath = "/path/to/file.ts"
  const mockNewContent = "new content"
  const mockSourceFile = {
    getFilePath: vi.fn().mockReturnValue(mockFilePath),
  } as unknown as SourceFile

  ;(FileContent as Mock).mockImplementationOnce(() => {
    return {
      generate: vi.fn().mockReturnValue(mockNewContent),
    }
  })

  processSourceFile(mockSourceFile)

  expect(mockSourceFile.getFilePath).toHaveBeenCalled()
  expect(FileContent).toHaveBeenCalledWith(mockSourceFile)
  expect(writeFile).toHaveBeenCalledWith(mockFilePath, mockNewContent)
})

it("should not call writeFile when newContent is undefined", () => {
  const mockFilePath = "/path/to/file.ts"
  const mockSourceFile = {
    getFilePath: vi.fn().mockReturnValue(mockFilePath),
  } as unknown as SourceFile

  ;(FileContent as Mock).mockImplementationOnce(() => {
    return {
      generate: vi.fn().mockReturnValue(undefined),
    }
  })

  processSourceFile(mockSourceFile)

  expect(mockSourceFile.getFilePath).toHaveBeenCalled()
  expect(FileContent).toHaveBeenCalledWith(mockSourceFile)
  expect(writeFile).not.toHaveBeenCalled()
})
