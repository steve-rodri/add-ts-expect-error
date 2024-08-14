import { vi } from "vitest"

export const writeFile = vi.fn()

export const mockReadFile = vi.fn().mockReturnValue("line1\nline2\nline3")
