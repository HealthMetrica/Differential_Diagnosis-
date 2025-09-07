"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, Edit, DollarSign, Clock, AlertCircle, ArrowRight, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getCurrentDiagnosisResults } from "@/lib/diagnosis-engine"
import { getCurrentPatientData } from "@/lib/patient-data"

interface LabTest {
  id: string
  name: string
  reason: string
  costEffectiveness: "high" | "medium" | "low"
  urgency: "routine" | "urgent" | "stat"
  estimatedCost: string
  turnaroundTime: string
  selected: boolean
}

export function DiagnosisValidationForm() {
  const router = useRouter()
  const [diagnosisResults, setDiagnosisResults] = useState<any>(null)
  const [patientData, setPatientData] = useState<any>(null)
  const [physicianDiagnosis, setPhysicianDiagnosis] = useState("")
  const [physicianNotes, setPhysicianNotes] = useState("")
  const [isModifying, setIsModifying] = useState(false)
  const [recommendedTests, setRecommendedTests] = useState<LabTest[]>([])

  useEffect(() => {
    const results = getCurrentDiagnosisResults()
    const patient = getCurrentPatientData()

    if (!results || !patient) {
      router.push("/consultation/new")
      return
    }

    setDiagnosisResults(results)
    setPatientData(patient)
    setPhysicianDiagnosis(
      results.selectedPrimary
        ? results.diagnoses.find((d: any) => d.id === results.selectedPrimary)?.name || ""
        : results.diagnoses[0]?.name || "",
    )

    // Generate lab test recommendations based on primary diagnosis
    const tests = generateLabRecommendations(results.diagnoses, results.selectedPrimary)
    setRecommendedTests(tests)
  }, [router])

  const generateLabRecommendations = (diagnoses: any[], primaryId: string | null): LabTest[] => {
    const testBank: Record<string, LabTest[]> = {
      dengue: [
        {
          id: "dengue_ns1",
          name: "Dengue NS1 Antigen Test",
          reason: "Early detection of dengue virus (days 1-7)",
          costEffectiveness: "high",
          urgency: "urgent",
          estimatedCost: "$25-40",
          turnaroundTime: "2-4 hours",
          selected: true,
        },
        {
          id: "platelet_count",
          name: "Platelet Count",
          reason: "Monitor for thrombocytopenia (dengue complication)",
          costEffectiveness: "high",
          urgency: "urgent",
          estimatedCost: "$15-25",
          turnaroundTime: "1-2 hours",
          selected: true,
        },
        {
          id: "dengue_igg_igm",
          name: "Dengue IgG/IgM Serology",
          reason: "Confirm dengue infection (days 5+)",
          costEffectiveness: "medium",
          urgency: "routine",
          estimatedCost: "$30-50",
          turnaroundTime: "4-6 hours",
          selected: false,
        },
      ],
      influenza: [
        {
          id: "rapid_flu",
          name: "Rapid Influenza Diagnostic Test",
          reason: "Quick confirmation of influenza A/B",
          costEffectiveness: "high",
          urgency: "urgent",
          estimatedCost: "$20-35",
          turnaroundTime: "15-30 minutes",
          selected: true,
        },
        {
          id: "chest_xray",
          name: "Chest X-Ray",
          reason: "Rule out pneumonia complications",
          costEffectiveness: "medium",
          urgency: "routine",
          estimatedCost: "$75-150",
          turnaroundTime: "1-2 hours",
          selected: false,
        },
      ],
      meningitis: [
        {
          id: "lumbar_puncture",
          name: "Lumbar Puncture (CSF Analysis)",
          reason: "Definitive diagnosis of meningitis",
          costEffectiveness: "high",
          urgency: "stat",
          estimatedCost: "$200-400",
          turnaroundTime: "2-4 hours",
          selected: true,
        },
        {
          id: "blood_culture",
          name: "Blood Culture",
          reason: "Identify causative organism",
          costEffectiveness: "high",
          urgency: "stat",
          estimatedCost: "$50-100",
          turnaroundTime: "24-48 hours",
          selected: true,
        },
        {
          id: "ct_head",
          name: "CT Scan of Head",
          reason: "Rule out increased intracranial pressure before LP",
          costEffectiveness: "medium",
          urgency: "stat",
          estimatedCost: "$300-600",
          turnaroundTime: "30-60 minutes",
          selected: true,
        },
      ],
      gastroenteritis: [
        {
          id: "stool_analysis",
          name: "Stool Analysis & Culture",
          reason: "Identify bacterial/parasitic causes",
          costEffectiveness: "medium",
          urgency: "routine",
          estimatedCost: "$40-80",
          turnaroundTime: "24-48 hours",
          selected: true,
        },
        {
          id: "electrolytes",
          name: "Basic Metabolic Panel",
          reason: "Assess dehydration and electrolyte imbalance",
          costEffectiveness: "high",
          urgency: "urgent",
          estimatedCost: "$25-50",
          turnaroundTime: "1-2 hours",
          selected: true,
        },
      ],
    }

    // Get tests for primary diagnosis
    const primaryDiagnosis = diagnoses.find((d) => d.id === primaryId) || diagnoses[0]
    const primaryTests = testBank[primaryDiagnosis?.id] || []

    // Add common tests
    const commonTests: LabTest[] = [
      {
        id: "cbc",
        name: "Complete Blood Count (CBC)",
        reason: "Assess overall health and detect infections",
        costEffectiveness: "high",
        urgency: "routine",
        estimatedCost: "$20-40",
        turnaroundTime: "1-2 hours",
        selected: true,
      },
      {
        id: "crp",
        name: "C-Reactive Protein (CRP)",
        reason: "Measure inflammation levels",
        costEffectiveness: "medium",
        urgency: "routine",
        estimatedCost: "$15-30",
        turnaroundTime: "2-4 hours",
        selected: false,
      },
    ]

    return [...primaryTests, ...commonTests]
  }

  const handleValidateDiagnosis = () => {
    setPhysicianDiagnosis(
      diagnosisResults.diagnoses.find((d: any) => d.id === diagnosisResults.selectedPrimary)?.name ||
        diagnosisResults.diagnoses[0]?.name,
    )
    setIsModifying(false)
  }

  const handleTestSelection = (testId: string, selected: boolean) => {
    setRecommendedTests((prev) => prev.map((test) => (test.id === testId ? { ...test, selected } : test)))
  }

  const handleSubmitAndOrderLabs = () => {
    const selectedTests = recommendedTests.filter((test) => test.selected)
    const validationData = {
      patientData,
      aiDiagnosis:
        diagnosisResults.diagnoses.find((d: any) => d.id === diagnosisResults.selectedPrimary)?.name ||
        diagnosisResults.diagnoses[0]?.name,
      physicianDiagnosis,
      physicianNotes,
      orderedTests: selectedTests,
      timestamp: new Date().toISOString(),
    }

    localStorage.setItem("validation_data", JSON.stringify(validationData))
    router.push("/consultation/results")
  }

  const getCostEffectivenessColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "stat":
        return "destructive"
      case "urgent":
        return "secondary"
      case "routine":
        return "outline"
      default:
        return "outline"
    }
  }

  if (!diagnosisResults || !patientData) {
    return <div>Loading...</div>
  }

  const selectedTestCount = recommendedTests.filter((test) => test.selected).length
  const totalEstimatedCost = recommendedTests
    .filter((test) => test.selected)
    .reduce((sum, test) => {
      const cost = Number.parseInt(test.estimatedCost.replace(/[^0-9]/g, "")) || 0
      return sum + cost
    }, 0)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Patient & AI Diagnosis Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Patient: {patientData.name}</CardTitle>
          <CardDescription>
            <Badge variant="outline" className="mr-2">
              ID: {patientData.patientId}
            </Badge>
            <Badge variant="secondary">Age: {patientData.age}</Badge>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* AI Proposed Diagnosis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            <span>AI Proposed Diagnosis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">
              {diagnosisResults.diagnoses.find((d: any) => d.id === diagnosisResults.selectedPrimary)?.name ||
                diagnosisResults.diagnoses[0]?.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              Probability:{" "}
              {diagnosisResults.diagnoses.find((d: any) => d.id === diagnosisResults.selectedPrimary)?.probability ||
                diagnosisResults.diagnoses[0]?.probability}
              %
            </p>
            <p className="text-sm">
              {diagnosisResults.diagnoses.find((d: any) => d.id === diagnosisResults.selectedPrimary)?.description ||
                diagnosisResults.diagnoses[0]?.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Physician's Final Diagnosis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Physician's Final Diagnosis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="physician-diagnosis">Final Diagnosis</Label>
            {isModifying ? (
              <div className="flex space-x-2">
                <Input
                  id="physician-diagnosis"
                  value={physicianDiagnosis}
                  onChange={(e) => setPhysicianDiagnosis(e.target.value)}
                  placeholder="Enter your diagnosis"
                />
                <Button onClick={() => setIsModifying(false)}>Save</Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Input value={physicianDiagnosis} readOnly className="bg-muted" />
                <Button variant="outline" onClick={() => setIsModifying(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modify
                </Button>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleValidateDiagnosis} variant="outline">
              <Check className="mr-2 h-4 w-4" />
              Validate AI Diagnosis
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="physician-notes">Clinical Notes & Judgment</Label>
            <Textarea
              id="physician-notes"
              value={physicianNotes}
              onChange={(e) => setPhysicianNotes(e.target.value)}
              placeholder="Add your clinical reasoning, differential considerations, or additional context..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lab Test Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Laboratory Tests</CardTitle>
          <CardDescription>Select tests to order based on the clinical presentation and diagnosis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendedTests.map((test) => (
            <Card key={test.id} className={`transition-all ${test.selected ? "ring-2 ring-primary" : ""}`}>
              <CardContent className="pt-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={test.selected}
                    onCheckedChange={(checked) => handleTestSelection(test.id, checked as boolean)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{test.name}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getUrgencyBadge(test.urgency)} className="capitalize">
                          {test.urgency}
                        </Badge>
                        <span className={`text-sm font-medium ${getCostEffectivenessColor(test.costEffectiveness)}`}>
                          {test.costEffectiveness.toUpperCase()} Value
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">{test.reason}</p>

                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{test.estimatedCost}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{test.turnaroundTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Test Summary */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex justify-between items-center">
                <span>
                  <strong>{selectedTestCount}</strong> tests selected • Estimated total cost:{" "}
                  <strong>${totalEstimatedCost}</strong>
                </span>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => router.back()}>
          Back to Diagnosis
        </Button>

        <Button
          onClick={handleSubmitAndOrderLabs}
          disabled={!physicianDiagnosis || selectedTestCount === 0}
          className="min-w-48"
        >
          Submit Diagnosis & Order Labs
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {(!physicianDiagnosis || selectedTestCount === 0) && (
        <Alert>
          <AlertDescription>
            Please confirm your diagnosis and select at least one laboratory test to proceed.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
