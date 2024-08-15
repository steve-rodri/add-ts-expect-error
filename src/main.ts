import path from "path"
import { Project } from "ts-morph"
import { processSourceFile } from "./utils"

export function main() {
  const currentWorkingDir = process.cwd()
  const tsConfigFilePath = path.resolve(currentWorkingDir, "tsconfig.json")

  const project = new Project({ tsConfigFilePath })
  const sourceFiles = project.getSourceFiles()

  sourceFiles.forEach(processSourceFile)

  console.log("Added @ts-expect-error comments to all TypeScript errors.")
}
