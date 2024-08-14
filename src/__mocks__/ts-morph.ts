import { SourceFile } from "ts-morph"
import { vi } from "vitest"

const mockSourceFile = {
  getFilePath: vi.fn().mockReturnValue("test.ts"),
  getPreEmitDiagnostics: vi.fn().mockReturnValue([]),
  getLineAndColumnAtPos: vi.fn().mockReturnValue({ line: 1, column: 1 }),
}

const mockProject = {
  getSourceFiles: vi.fn().mockReturnValue([mockSourceFile]),
}

export { mockSourceFile, mockProject }

export class Project {
  constructor() {
    return mockProject
  }
}
