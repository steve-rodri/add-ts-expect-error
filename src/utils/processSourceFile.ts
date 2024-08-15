import { SourceFile } from "ts-morph"
import { FileContent } from "../FileContent"
import { writeFile } from "./file-util"

export function processSourceFile(sourceFile: SourceFile) {
  const filePath = sourceFile.getFilePath()
  const newContent = new FileContent(sourceFile).generate()
  if (!newContent) return
  writeFile(filePath, newContent)
}
