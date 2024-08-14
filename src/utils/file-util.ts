import fs from "fs"

export function readFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, "utf-8")
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error)
    throw error
  }
}

export function writeFile(filePath: string, content: string): void {
  try {
    fs.writeFileSync(filePath, content, "utf-8")
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error)
    throw error
  }
}
