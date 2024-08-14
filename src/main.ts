import path from "path"
import { Project, SourceFile } from "ts-morph"

import { FileContent } from "./FileContent"
import { writeFile } from "./utils"

export function processSourceFile(sourceFile: SourceFile) {
  const filePath = sourceFile.getFilePath()
  const newContent = new FileContent(sourceFile).generate()
  if (!newContent) return
  writeFile(filePath, newContent)
}

export function main() {
  const currentWorkingDir = process.cwd()
  const tsConfigFilePath = path.resolve(currentWorkingDir, "tsconfig.json")

  const project = new Project({ tsConfigFilePath })
  const sourceFiles = project.getSourceFiles()

  sourceFiles.forEach(processSourceFile)

  console.log("Added @ts-expect-error comments to all TypeScript errors.")
}

main()
