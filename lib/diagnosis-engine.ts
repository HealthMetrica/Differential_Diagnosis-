export interface DiagnosisResult {
  diagnoses: any[]
  confidence: number
  rationale: string[]
  recommendedTests: string[]
  timestamp: string
}

export function generateDiagnosisFromSymptoms(symptoms: string[], patientData: any, chatData: any): DiagnosisResult {
  // Mock AI diagnosis engine
  const confidence = Math.min(95, 60 + symptoms.length * 5 + (chatData?.messages?.length || 0) * 2)

  const rationale = [
    `Analyzed ${symptoms.length} primary symptoms`,
    `Considered patient demographics (age: ${patientData.age}, location: ${patientData.location || "not specified"})`,
    `Incorporated ${chatData?.messages?.filter((m: any) => m.type === "user").length || 0} additional clinical details`,
    `Applied epidemiological data and clinical guidelines`,
  ]

  return {
    diagnoses: [],
    confidence,
    rationale,
    recommendedTests: [],
    timestamp: new Date().toISOString(),
  }
}

export function saveDiagnosisResults(results: DiagnosisResult): void {
  const stored = getStoredDiagnosisResults()
  stored.push(results)
  localStorage.setItem("health_metrica_diagnosis_results", JSON.stringify(stored))
}

export function getStoredDiagnosisResults(): DiagnosisResult[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("health_metrica_diagnosis_results")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function getCurrentDiagnosisResults(): any {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem("diagnosis_results")
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}
