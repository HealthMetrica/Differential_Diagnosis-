export interface PatientData {
  patientId: string
  name: string
  age: string
  gender: string
  dateOfBirth: string
  contactInfo: string
  location: string
  medicalHistory: string
  symptoms: string
  extractedSymptoms?: string[]
  createdAt: string
}

export function savePatientData(data: PatientData): void {
  const patients = getStoredPatients()
  const patientWithTimestamp = {
    ...data,
    createdAt: new Date().toISOString(),
  }
  patients.push(patientWithTimestamp)
  localStorage.setItem("health_metrica_patients", JSON.stringify(patients))
}

export function getStoredPatients(): PatientData[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("health_metrica_patients")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function getCurrentPatientData(): PatientData | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem("current_patient_data")
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function getExtractedSymptoms(): string[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("extracted_symptoms")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}
