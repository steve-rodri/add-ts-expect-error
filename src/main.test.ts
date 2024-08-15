import { Mock } from "vitest"
import path from "path"
import { Project, SourceFile } from "ts-morph"
import { main } from "./main"
import { processSourceFile } from "./utils"

vi.mock("path")
vi.mock("ts-morph")
vi.mock("./utils")

const mockSourceFile = {
  getFilePath: vi.fn(() => "mockFilePath"),
} as unknown as SourceFile

const mockProject = {
  getSourceFiles: vi.fn(),
}

beforeEach(() => {
  vi.spyOn(process, "cwd").mockReturnValue("/mock/current/working/dir")
  vi.spyOn(path, "resolve").mockReturnValue(
    "/mock/current/working/dir/tsconfig.json",
  )
  ;(Project as unknown as Mock).mockImplementation(() => mockProject)

  mockProject.getSourceFiles.mockReturnValue([mockSourceFile])
})

afterEach(() => {
  vi.restoreAllMocks()
})

it("should process all source files", () => {
  main()

  expect(process.cwd).toHaveBeenCalled()
  expect(path.resolve).toHaveBeenCalledWith(
    "/mock/current/working/dir",
    "tsconfig.json",
  )
  expect(Project).toHaveBeenCalledWith({
    tsConfigFilePath: "/mock/current/working/dir/tsconfig.json",
  })
  expect(mockProject.getSourceFiles).toHaveBeenCalled()

  const firstCallArgs = (processSourceFile as Mock).mock.calls[0]
  expect(firstCallArgs[0]).toEqual(mockSourceFile)
})

it("should log the correct message", () => {
  const consoleSpy = vi.spyOn(console, "log")

  main()

  expect(consoleSpy).toHaveBeenCalledWith(
    "Added @ts-expect-error comments to all TypeScript errors.",
  )
  consoleSpy.mockRestore()
})
