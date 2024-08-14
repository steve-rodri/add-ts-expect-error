import { DiagnosticMessageChain } from "ts-morph"
import { stringifyDiagnosticMessage } from "./stringifyDiagnosticMessage"

const createMockDiagnosticMessageChain = (
  messageText: string,
  next: DiagnosticMessageChain[] = [],
) => {
  return {
    getMessageText: vi.fn(() => messageText),
    getNext: vi.fn(() => next),
  } as unknown as DiagnosticMessageChain
}

describe("stringifyDiagnosticMessage", () => {
  it("should return the message as string if it is not a DiagnosticMessageChain", () => {
    const message = "Simple error message"
    const result = stringifyDiagnosticMessage(message)
    expect(result).toBe(message)
  })

  it("should return the message as string for a single DiagnosticMessageChain", () => {
    const messageChain = createMockDiagnosticMessageChain("Error message")
    const result = stringifyDiagnosticMessage(messageChain)
    expect(result).toBe("Error message")
  })

  it("should concatenate messages from a DiagnosticMessageChain with next elements", () => {
    const nextMessageChain =
      createMockDiagnosticMessageChain("Next error message")
    const messageChain = createMockDiagnosticMessageChain("Error message", [
      nextMessageChain,
    ])
    const result = stringifyDiagnosticMessage(messageChain)
    expect(result).toBe("Error message Next error message")
  })

  it("should concatenate multiple messages from a long DiagnosticMessageChain", () => {
    const thirdMessageChain = createMockDiagnosticMessageChain(
      "Third error message",
    )
    const secondMessageChain = createMockDiagnosticMessageChain(
      "Second error message",
      [thirdMessageChain],
    )
    const firstMessageChain = createMockDiagnosticMessageChain(
      "First error message",
      [secondMessageChain],
    )
    const result = stringifyDiagnosticMessage(firstMessageChain)
    expect(result).toBe(
      "First error message Second error message Third error message",
    )
  })
})
