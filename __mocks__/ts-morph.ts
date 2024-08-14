const mockSourceFile = {
  getFilePath: jest.fn(),
  generate: jest.fn(),
}

const mockProject = {
  getSourceFiles: jest.fn().mockReturnValue([mockSourceFile]),
}

export { mockSourceFile, mockProject }

export class Project {
  constructor() {
    return mockProject
  }
}
