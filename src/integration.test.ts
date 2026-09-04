import fs from "fs"
import os from "os"
import path from "path"
import { main } from "./main"

const TSCONFIG = {
  compilerOptions: {
    strict: true,
    jsx: "preserve",
    target: "ESNext",
    module: "ESNext",
    moduleResolution: "Bundler",
    noEmit: true,
    skipLibCheck: true,
  },
  include: ["src"],
}

// A minimal JSX namespace keeps the fixture free of React so the only
// diagnostics are the ones each case is about.
const GLOBALS = `
declare namespace JSX {
  interface IntrinsicElements {
    div: any
  }
}
export {}
`

let projectDir: string
let originalCwd: string

function writeProject(fileName: string, source: string) {
  fs.mkdirSync(path.join(projectDir, "src"), { recursive: true })
  fs.writeFileSync(
    path.join(projectDir, "tsconfig.json"),
    JSON.stringify(TSCONFIG),
  )
  fs.writeFileSync(path.join(projectDir, "src", "globals.d.ts"), GLOBALS)
  fs.writeFileSync(path.join(projectDir, "src", fileName), source)
  return () => fs.readFileSync(path.join(projectDir, "src", fileName), "utf-8")
}

beforeEach(() => {
  originalCwd = process.cwd()
  projectDir = fs.mkdtempSync(path.join(os.tmpdir(), "add-ts-expect-error-"))
})

afterEach(() => {
  process.chdir(originalCwd)
  fs.rmSync(projectDir, { recursive: true, force: true })
})

it("comments a plain type error with a line comment", () => {
  const read = writeProject("plain.ts", `const total: number = "nope"\n`)
  process.chdir(projectDir)
  main()
  expect(read()).toContain("// @ts-expect-error")
})

it("comments an unindented jsx child with a jsx comment", () => {
  const read = writeProject(
    "Unindented.tsx",
    `const Widget = (props: { count: number }) => null\nexport const A = () => (\n<div>\n<Widget count="nope" />\n</div>\n)\n`,
  )
  process.chdir(projectDir)
  main()
  expect(read()).toContain("{/* @ts-expect-error")
})

it("indents the comment to match the line it annotates", () => {
  const read = writeProject(
    "Indented.tsx",
    `const Widget = (props: { count: number }) => null\nexport const A = () => (\n  <div>\n    <Widget count="nope" />\n  </div>\n)\n`,
  )
  process.chdir(projectDir)
  main()
  const lines = read().split("\n")
  const widgetLine = lines.findIndex((line) => line.includes("<Widget"))
  expect(lines[widgetLine - 1]).toMatch(/^ {4}\{\/\* @ts-expect-error/)
})
