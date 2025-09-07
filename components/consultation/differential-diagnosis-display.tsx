"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  ChevronUp,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Info,
  Star,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { getCurrentPatientData, getExtractedSymptoms } from "@/lib/patient-data"
import { getCurrentChatbotSession } from "@/lib/chatbot-questions"

interface Diagnosis {
  id: string
  name: string
  probability: number
  severity: "low" | "medium" | "high"
  description: string
  keySymptoms: string[]
  contributingFactors: string[]
  riskFactors: string[]
  nextSteps: string[]
}

export function DifferentialDiagnosisDisplay() {
  const router = useRouter()
  const [patientData, setPatientData] = useState<any>(null)
  const [extractedSymptoms, setExtractedSymptoms] = useState<string[]>([])
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([])
  const [expandedDiagnosis, setExpandedDiagnosis] = useState<string | null>(null)
  const [selectedPrimary, setSelectedPrimary] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    const patient = getCurrentPatientData()
    const symptoms = getExtractedSymptoms()
    const chatSession = getCurrentChatbotSession()

    if (!patient || symptoms.length === 0) {
      router.push("/consultation/new")
      return
    }

    setPatientData(patient)
    setExtractedSymptoms(symptoms)

    // Simulate AI diagnosis generation
    setTimeout(() => {
      const generatedDiagnoses = generateDifferentialDiagnoses(symptoms, chatSession?.messages || [])
      setDiagnoses(generatedDiagnoses)
      setSelectedPrimary(generatedDiagnoses[0]?.id || null)
      setIsGenerating(false)
    }, 3000)
  }, [router])

  const generateDifferentialDiagnoses = (symptoms: string[], chatMessages: any[]): Diagnosis[] => {
    // Mock AI diagnosis generation based on symptoms
    const diagnosisBank: Record<string, Diagnosis> = {
      dengue: {
        id: "dengue",
        name: "Dengue Fever",
        probability: 72,
        severity: "high",
        description:
          "A mosquito-borne viral infection common in tropical and subtropical areas. Characterized by high fever, severe headache, and muscle pain.",
        keySymptoms: ["fever", "headache", "muscle pain", "nausea"],
        contributingFactors: [
          "High fever (>101°F)",
          "Severe frontal headache",
          "Muscle and joint pain",
          "Geographic location (tropical/subtropical)",
        ],
        riskFactors: ["Recent travel to endemic areas", "Monsoon season", "Urban environment"],
        nextSteps: ["Dengue NS1 antigen test", "Platelet count", "Complete blood count"],
      },
      influenza: {
        id: "influenza",
        name: "Influenza A/B",
        probability: 45,
        severity: "medium",
        description:
          "A viral respiratory illness that can cause mild to severe illness. Most common during flu season.",
        keySymptoms: ["fever", "cough", "headache", "fatigue"],
        contributingFactors: ["Sudden onset of fever", "Dry cough", "Generalized body aches", "Seasonal timing"],
        riskFactors: ["Flu season", "Close contact with infected individuals", "Lack of vaccination"],
        nextSteps: ["Rapid influenza diagnostic test", "Supportive care", "Antiviral consideration"],
      },
      meningitis: {
        id: "meningitis",
        name: "Bacterial Meningitis",
        probability: 28,
        severity: "high",
        description:
          "A serious infection of the membranes surrounding the brain and spinal cord. Requires immediate medical attention.",
        keySymptoms: ["fever", "headache", "neck stiffness", "nausea"],
        contributingFactors: ["Severe headache", "High fever", "Neck stiffness (if present)", "Altered mental status"],
        riskFactors: ["Age extremes", "Immunocompromised state", "Close quarters living"],
        nextSteps: ["Lumbar puncture", "Blood cultures", "CT scan of head"],
      },
      gastroenteritis: {
        id: "gastroenteritis",
        name: "Viral Gastroenteritis",
        probability: 35,
        severity: "low",
        description:
          "An intestinal infection marked by watery diarrhea, abdominal cramps, nausea or vomiting, and sometimes fever.",
        keySymptoms: ["nausea", "vomiting", "diarrhea", "abdominal pain"],
        contributingFactors: [
          "Nausea and vomiting",
          "Gastrointestinal symptoms",
          "Recent food exposure",
          "Dehydration signs",
        ],
        riskFactors: ["Contaminated food/water", "Close contact with infected person", "Poor hygiene"],
        nextSteps: ["Stool analysis", "Electrolyte panel", "Hydration assessment"],
      },
    }

    // Select diagnoses based on symptoms
    const relevantDiagnoses: Diagnosis[] = []

    if (symptoms.includes("fever") && symptoms.includes("headache")) {
      if (symptoms.includes("muscle pain") || symptoms.includes("joint pain")) {
        relevantDiagnoses.push(diagnosisBank.dengue)
      }
      if (symptoms.includes("cough") || symptoms.includes("fatigue")) {
        relevantDiagnoses.push(diagnosisBank.influenza)
      }
      if (symptoms.includes("neck stiffness") || symptoms.includes("confusion")) {
        relevantDiagnoses.push(diagnosisBank.meningitis)
      }
    }

    if (symptoms.includes("nausea") || symptoms.includes("vomiting")) {
      relevantDiagnoses.push(diagnosisBank.gastroenteritis)
    }

    // If no specific matches, add common diagnoses
    if (relevantDiagnoses.length === 0) {
      relevantDiagnoses.push(diagnosisBank.influenza, diagnosisBank.gastroenteritis)
    }

    // Sort by probability
    return relevantDiagnoses.sort((a, b) => b.probability - a.probability)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "outline"
    }
  }

  const handleProceedToValidation = () => {
    // Store diagnosis results
    const diagnosisResults = {
      diagnoses,
      selectedPrimary,
      patientData,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem("diagnosis_results", JSON.stringify(diagnosisResults))
    router.push("/consultation/validation")
  }

  if (isGenerating) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <h3 className="text-lg font-semibold">Generating Differential Diagnosis</h3>
              <p className="text-muted-foreground">
                Our AI is analyzing the patient data and symptoms to generate the most likely diagnoses...
              </p>
              <div className="max-w-md mx-auto">
                <Progress value={66} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">Processing clinical data...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Patient Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>AI Differential Diagnosis - {patientData?.name}</span>
            <Badge variant="outline">ID: {patientData?.patientId}</Badge>
          </CardTitle>
          <CardDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-sm">Key Symptoms:</span>
              {extractedSymptoms.map((symptom, index) => (
                <Badge key={index} variant="secondary" className="capitalize">
                  {symptom}
                </Badge>
              ))}
            </div>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Diagnosis Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Probabilistic Diagnoses</span>
          </CardTitle>
          <CardDescription>
            AI-generated differential diagnoses ranked by probability based on clinical presentation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {diagnoses.map((diagnosis, index) => (
            <Card
              key={diagnosis.id}
              className={`transition-all ${selectedPrimary === diagnosis.id ? "ring-2 ring-primary" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                      <div>
                        <h3 className="text-lg font-semibold">{diagnosis.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Progress value={diagnosis.probability} className="w-24 h-2" />
                          <span className="text-sm font-medium">{diagnosis.probability}%</span>
                          <Badge variant={getSeverityBadge(diagnosis.severity)} className="capitalize">
                            {diagnosis.severity} Risk
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant={selectedPrimary === diagnosis.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPrimary(diagnosis.id)}
                    >
                      <Star className="mr-1 h-3 w-3" />
                      {selectedPrimary === diagnosis.id ? "Primary" : "Mark Primary"}
                    </Button>

                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedDiagnosis(expandedDiagnosis === diagnosis.id ? null : diagnosis.id)}
                        >
                          <Eye className="mr-1 h-3 w-3" />
                          Details
                          {expandedDiagnosis === diagnosis.id ? (
                            <ChevronUp className="ml-1 h-3 w-3" />
                          ) : (
                            <ChevronDown className="ml-1 h-3 w-3" />
                          )}
                        </Button>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                          <div>
                            <h4 className="font-medium mb-2 flex items-center">
                              <Info className="mr-1 h-4 w-4" />
                              Description
                            </h4>
                            <p className="text-sm text-muted-foreground mb-3">{diagnosis.description}</p>

                            <h4 className="font-medium mb-2">Contributing Factors</h4>
                            <ul className="text-sm space-y-1">
                              {diagnosis.contributingFactors.map((factor, idx) => (
                                <li key={idx} className="flex items-start">
                                  <CheckCircle className="mr-2 h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                                  {factor}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Risk Factors</h4>
                            <ul className="text-sm space-y-1 mb-3">
                              {diagnosis.riskFactors.map((risk, idx) => (
                                <li key={idx} className="flex items-start">
                                  <AlertTriangle className="mr-2 h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                                  {risk}
                                </li>
                              ))}
                            </ul>

                            <h4 className="font-medium mb-2">Recommended Next Steps</h4>
                            <ul className="text-sm space-y-1">
                              {diagnosis.nextSteps.map((step, idx) => (
                                <li key={idx} className="flex items-start">
                                  <ArrowRight className="mr-2 h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* AI Confidence & Rationale */}
      <Alert>
        <TrendingUp className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">AI Analysis Summary</p>
            <p className="text-sm">
              Based on the clinical presentation, the most likely diagnosis is <strong>{diagnoses[0]?.name}</strong>{" "}
              with {diagnoses[0]?.probability}% probability. Key contributing factors include the combination of
              symptoms and patient demographics. Consider the recommended diagnostic tests to confirm the diagnosis.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => router.back()}>
          Back to Chatbot
        </Button>

        <Button onClick={handleProceedToValidation} className="min-w-48">
          Proceed to Validation & Lab Tests
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
