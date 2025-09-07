import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    // Simulate NLP processing
    await new Promise((resolve) => setTimeout(resolve, 800))

    const symptoms = extractSymptomsFromText(text)
    const entities = extractMedicalEntities(text)

    return NextResponse.json({
      success: true,
      data: {
        symptoms,
        entities,
        confidence: 0.87,
        processingTime: "0.8s",
        modelVersion: "HealthMetrica-NLP-v1.3",
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "NLP API error" }, { status: 500 })
  }
}

function extractSymptomsFromText(text: string): string[] {
  const symptomPatterns = [
    /fever|temperature|hot|chills/gi,
    /headache|head pain|migraine/gi,
    /nausea|nauseous|sick to stomach/gi,
    /vomit|vomiting|throw up/gi,
    /cough|coughing/gi,
    /sore throat|throat pain/gi,
    /fatigue|tired|exhausted|weakness/gi,
    /dizziness|dizzy|lightheaded/gi,
    /rash|skin irritation|red spots/gi,
    /pain|ache|aching|hurt/gi,
    /swelling|swollen|inflammation/gi,
    /shortness of breath|difficulty breathing/gi,
    /chest pain|chest discomfort/gi,
    /abdominal pain|stomach pain|belly pain/gi,
    /joint pain|arthritis/gi,
    /muscle pain|muscle ache/gi,
    /diarrhea|loose stools/gi,
    /constipation/gi,
    /loss of appetite|no appetite/gi,
  ]

  const symptoms: string[] = []
  const symptomNames = [
    "fever",
    "headache",
    "nausea",
    "vomiting",
    "cough",
    "sore throat",
    "fatigue",
    "dizziness",
    "rash",
    "pain",
    "swelling",
    "shortness of breath",
    "chest pain",
    "abdominal pain",
    "joint pain",
    "muscle pain",
    "diarrhea",
    "constipation",
    "loss of appetite",
  ]

  symptomPatterns.forEach((pattern, index) => {
    if (pattern.test(text)) {
      symptoms.push(symptomNames[index])
    }
  })

  return [...new Set(symptoms)] // Remove duplicates
}

function extractMedicalEntities(text: string) {
  return {
    medications: extractMedications(text),
    durations: extractDurations(text),
    severities: extractSeverities(text),
  }
}

function extractMedications(text: string): string[] {
  const medicationPatterns = [/tylenol|acetaminophen/gi, /ibuprofen|advil|motrin/gi, /aspirin/gi, /antibiotics?/gi]

  const medications: string[] = []
  medicationPatterns.forEach((pattern) => {
    const matches = text.match(pattern)
    if (matches) {
      medications.push(...matches.map((m) => m.toLowerCase()))
    }
  })

  return [...new Set(medications)]
}

function extractDurations(text: string): string[] {
  const durationPattern = /(\d+)\s*(day|days|hour|hours|week|weeks|month|months)/gi
  const matches = text.match(durationPattern) || []
  return matches.map((m) => m.toLowerCase())
}

function extractSeverities(text: string): string[] {
  const severityPattern = /(mild|moderate|severe|intense|slight|extreme|unbearable)/gi
  const matches = text.match(severityPattern) || []
  return [...new Set(matches.map((m) => m.toLowerCase()))]
}
