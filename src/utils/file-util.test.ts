import fs from "fs"
import { readFile, writeFile } from "./file-util"

vi.mock("fs")

describe("File Utils", () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  describe("readFile", () => {
    it("should read file content successfully", () => {
      const filePath = "test.txt"
      const fileContent = "Hello, World!"
      vi.spyOn(fs, "readFileSync").mockReturnValue(fileContent)

      const result = readFile(filePath)
      expect(result).toBe(fileContent)
      expect(fs.readFileSync).toHaveBeenCalledWith(filePath, "utf-8")
    })

    it("should throw an error when reading file fails", () => {
      const filePath = "test.txt"
      const error = new Error("File not found")
      vi.spyOn(fs, "readFileSync").mockImplementation(() => {
        throw error
      })

      expect(() => readFile(filePath)).toThrow(error)
      expect(fs.readFileSync).toHaveBeenCalledWith(filePath, "utf-8")
    })
  })

  describe("writeFile", () => {
    it("should write file content successfully", () => {
      const filePath = "test.txt"
      const fileContent = "Hello, World!"
      const writeFileSyncSpy = vi
        .spyOn(fs, "writeFileSync")
        .mockImplementation(() => {})

      writeFile(filePath, fileContent)
      expect(writeFileSyncSpy).toHaveBeenCalledWith(
        filePath,
        fileContent,
        "utf-8",
      )
    })

    it("should throw an error when writing file fails", () => {
      const filePath = "test.txt"
      const fileContent = "Hello, World!"
      const error = new Error("Permission denied")
      vi.spyOn(fs, "writeFileSync").mockImplementation(() => {
        throw error
      })

      expect(() => writeFile(filePath, fileContent)).toThrow(error)
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        filePath,
        fileContent,
        "utf-8",
      )
    })
  })
})
