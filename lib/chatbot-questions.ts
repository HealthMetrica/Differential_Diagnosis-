export interface ChatbotSession {
  patientId: string
  messages: any[]
  extractedSymptoms: string[]
  responses: Record<string, string>
  completedAt?: string
}

export function saveChatbotSession(session: ChatbotSession): void {
  const sessions = getStoredChatbotSessions()
  sessions.push(session)
  localStorage.setItem("health_metrica_chatbot_sessions", JSON.stringify(sessions))
}

export function getStoredChatbotSessions(): ChatbotSession[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("health_metrica_chatbot_sessions")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function getCurrentChatbotSession(): any {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem("chatbot_session")
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export const symptomQuestionBank = {
  fever: [
    "How high is the fever?",
    "When did the fever start?",
    "Is the fever constant or intermittent?",
    "Any chills or sweating with the fever?",
  ],
  headache: [
    "What type of headache is it?",
    "Where is the headache located?",
    "How severe is the headache on a scale of 1-10?",
    "Does anything make it better or worse?",
  ],
  nausea: ["Has the nausea led to vomiting?", "When does the nausea occur?", "Any specific triggers for the nausea?"],
  cough: [
    "Is it a dry or productive cough?",
    "Any blood in the sputum?",
    "When is the cough worse?",
    "How long has the cough been present?",
  ],
  rash: [
    "What does the rash look like?",
    "Where on the body is the rash?",
    "Is the rash itchy or painful?",
    "When did the rash first appear?",
  ],
}
