"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, FileText, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LabResult {
  testId: string
  testName: string
  result: string
  resultDate: string
  notes: string
}

export function LabResultsForm() {
  const router = useRouter()
  const [validationData, setValidationData] = useState<any>(null)
  const [labResults, setLabResults] = useState<LabResult[]>([])
  const [finalDiagnosis, setFinalDiagnosis] = useState("")
  const [isConfirmed, setIsConfirmed] = useState(false)

  useEffect(() => {
    const data = localStorage.getItem("validation_data")
    if (!data) {
      router.push("/consultation/new")
      return
    }

    const parsed = JSON.parse(data)
    setValidationData(parsed)
    setFinalDiagnosis(parsed.physicianDiagnosis)

    // Initialize lab results
    const results = parsed.orderedTests.map((test: any) => ({
      testId: test.id,
      testName: test.name,
      result: "",
      resultDate: new Date().toISOString().split("T")[0],
      notes: "",
    }))
    setLabResults(results)
  }, [router])

  const handleResultChange = (testId: string, field: keyof LabResult, value: string) => {
    setLabResults((prev) => prev.map((result) => (result.testId === testId ? { ...result, [field]: value } : result)))
  }

  const handleCompleteConsultation = () => {
    const consultationData = {
      ...validationData,
      labResults,
      finalDiagnosis,
      completedAt: new Date().toISOString(),
      status: "completed",
    }

    // Save to consultation history
    const consultations = JSON.parse(localStorage.getItem("completed_consultations") || "[]")
    consultations.push(consultationData)
    localStorage.setItem("completed_consultations", JSON.stringify(consultations))

    // Clear current session data
    localStorage.removeItem("current_patient_data")
    localStorage.removeItem("extracted_symptoms")
    localStorage.removeItem("chatbot_session")
    localStorage.removeItem("diagnosis_results")
    localStorage.removeItem("validation_data")

    router.push("/dashboard")
  }

  if (!validationData) {
    return <div>Loading...</div>
  }

  const allResultsEntered = labResults.every((result) => result.result.trim() !== "")

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Patient Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Patient: {validationData.patientData.name}</CardTitle>
          <CardDescription>
            <Badge variant="outline" className="mr-2">
              ID: {validationData.patientData.patientId}
            </Badge>
            <Badge variant="secondary">Consultation Date: {new Date().toLocaleDateString()}</Badge>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Ordered Lab Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Laboratory Test Results</span>
          </CardTitle>
          <CardDescription>Enter the results for the ordered laboratory tests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {labResults.map((result, index) => (
            <Card key={result.testId}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{result.testName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`result-${result.testId}`}>Test Result *</Label>
                    <Select
                      value={result.result}
                      onValueChange={(value) => handleResultChange(result.testId, "result", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select result" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="positive">Positive</SelectItem>
                        <SelectItem value="negative">Negative</SelectItem>
                        <SelectItem value="elevated">Elevated</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inconclusive">Inconclusive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`date-${result.testId}`}>Result Date</Label>
                    <Input
                      id={`date-${result.testId}`}
                      type="date"
                      value={result.resultDate}
                      onChange={(e) => handleResultChange(result.testId, "resultDate", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`notes-${result.testId}`}>Additional Notes</Label>
                  <Textarea
                    id={`notes-${result.testId}`}
                    value={result.notes}
                    onChange={(e) => handleResultChange(result.testId, "notes", e.target.value)}
                    placeholder="Specific values, observations, or additional context..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Final Diagnosis Confirmation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            <span>Definitive Final Diagnosis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <h3 className="font-medium mb-2">Physician's Diagnosis:</h3>
            <p className="text-lg">{finalDiagnosis}</p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="confirm-diagnosis"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="confirm-diagnosis">
              I confirm this is the final diagnosis based on clinical presentation and laboratory results
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Feedback & Learning */}
      <Alert>
        <TrendingUp className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">Continuous Learning Feedback</p>
            <p className="text-sm">
              Your diagnosis and lab results have been recorded for AI model improvement. This helps enhance diagnostic
              accuracy for future cases with similar presentations.
            </p>
          </div>
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => router.back()}>
          Back to Validation
        </Button>

        <Button onClick={handleCompleteConsultation} disabled={!allResultsEntered || !isConfirmed} className="min-w-48">
          <CheckCircle className="mr-2 h-4 w-4" />
          Complete Consultation
        </Button>
      </div>

      {(!allResultsEntered || !isConfirmed) && (
        <Alert>
          <AlertDescription>
            Please enter all lab results and confirm the final diagnosis to complete the consultation.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
