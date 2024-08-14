import { DiagnosticMessageChain } from "ts-morph"

export function stringifyDiagnosticMessage(
  diagnosticMessage: string | DiagnosticMessageChain,
): string {
  if (isDiagnosticMessageChain(diagnosticMessage)) {
    return stringifyDiagnosticMessageChain(diagnosticMessage)
  }
  return diagnosticMessage.toString()
}

function isDiagnosticMessageChain(
  message: any,
): message is DiagnosticMessageChain {
  return typeof message === "object" && "getMessageText" in message
}

function stringifyDiagnosticMessageChain(
  diagnosticMessage: DiagnosticMessageChain,
): string {
  let messages = [extractMessageText(diagnosticMessage)]
  let next = diagnosticMessage.getNext()

  while (next && next.length > 0) {
    messages.push(extractMessageText(next[0]))
    next = next[0].getNext()
  }

  return messages.join(" ")
}

function extractMessageText(diagnosticMessage: DiagnosticMessageChain): string {
  return diagnosticMessage.getMessageText().toString()
}
