"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MapPin, User, FileText, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PatientData {
  patientId: string
  name: string
  age: string
  gender: string
  dateOfBirth: string
  contactInfo: string
  location: string
  medicalHistory: string
  symptoms: string
}

export function PatientIntakeForm() {
  const router = useRouter()
  const [patientData, setPatientData] = useState<PatientData>({
    patientId: `PAT${Date.now().toString().slice(-6)}`,
    name: "",
    age: "",
    gender: "",
    dateOfBirth: "",
    contactInfo: "",
    location: "",
    medicalHistory: "",
    symptoms: "",
  })

  const [extractedSymptoms, setExtractedSymptoms] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    if (patientData.symptoms.length > 10) {
      setIsAnalyzing(true)
      const timer = setTimeout(() => {
        const symptoms = extractSymptomsFromText(patientData.symptoms)
        setExtractedSymptoms(symptoms)
        setIsAnalyzing(false)
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      setExtractedSymptoms([])
    }
  }, [patientData.symptoms])

  const extractSymptomsFromText = (text: string): string[] => {
    const symptomKeywords = [
      "fever",
      "headache",
      "nausea",
      "vomiting",
      "diarrhea",
      "cough",
      "sore throat",
      "fatigue",
      "weakness",
      "dizziness",
      "rash",
      "pain",
      "ache",
      "swelling",
      "shortness of breath",
      "chest pain",
      "abdominal pain",
      "joint pain",
      "muscle pain",
      "chills",
      "sweating",
      "loss of appetite",
      "weight loss",
      "difficulty breathing",
      "runny nose",
      "congestion",
      "sneezing",
    ]

    const lowerText = text.toLowerCase()
    const found = symptomKeywords.filter(
      (symptom) => lowerText.includes(symptom) || lowerText.includes(symptom.replace(" ", "")),
    )

    return [...new Set(found)] // Remove duplicates
  }

  const handleInputChange = (field: keyof PatientData, value: string) => {
    setPatientData((prev) => ({ ...prev, [field]: value }))
  }

  const handleProceedToChatbot = () => {
    // Store patient data in localStorage for demo purposes
    localStorage.setItem("current_patient_data", JSON.stringify(patientData))
    localStorage.setItem("extracted_symptoms", JSON.stringify(extractedSymptoms))
    router.push("/consultation/chatbot")
  }

  const isFormValid = patientData.name && patientData.age && patientData.gender && patientData.symptoms.length > 20

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Patient Demographics Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-primary" />
            <span>Patient Demographics</span>
          </CardTitle>
          <CardDescription>Enter the patient's basic information and medical background</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientId">Patient ID</Label>
              <Input
                id="patientId"
                value={patientData.patientId}
                onChange={(e) => handleInputChange("patientId", e.target.value)}
                placeholder="Auto-generated"
                className="bg-muted"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={patientData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter patient's full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={patientData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                placeholder="Age in years"
                min="0"
                max="120"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={patientData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={patientData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">Contact Information</Label>
              <Input
                id="contactInfo"
                value={patientData.contactInfo}
                onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                placeholder="Phone number or email"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Geographical Location</span>
              </Label>
              <Input
                id="location"
                value={patientData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="City, Country (important for endemic diseases)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalHistory">Medical History</Label>
              <Textarea
                id="medicalHistory"
                value={patientData.medicalHistory}
                onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                placeholder="Previous conditions, medications, allergies..."
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Narrative/Anamnesis Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>Patient Narrative & Symptoms</span>
          </CardTitle>
          <CardDescription>
            Describe the patient's symptoms and narrative in detail. Our AI will extract key symptoms in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symptoms">Patient's Symptoms/Narrative *</Label>
            <Textarea
              id="symptoms"
              value={patientData.symptoms}
              onChange={(e) => handleInputChange("symptoms", e.target.value)}
              placeholder="Describe the patient's symptoms, when they started, severity, associated factors, etc. Be as detailed as possible..."
              rows={8}
              className="min-h-32"
              required
            />
            <p className="text-sm text-muted-foreground">
              Minimum 20 characters required. The more detailed the description, the better the AI analysis.
            </p>
          </div>

          {/* Live NLP Feedback */}
          {(extractedSymptoms.length > 0 || isAnalyzing) && (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">{isAnalyzing ? "Analyzing symptoms..." : "Extracted Symptoms:"}</p>
                  {isAnalyzing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span className="text-sm">Processing natural language...</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {extractedSymptoms.map((symptom, index) => (
                        <Badge key={index} variant="secondary" className="capitalize">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>

        <Button onClick={handleProceedToChatbot} disabled={!isFormValid} className="min-w-48">
          Proceed to Chatbot Analysis
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {!isFormValid && (
        <Alert>
          <AlertDescription>
            Please fill in all required fields (marked with *) and provide a detailed symptom description (minimum 20
            characters) to proceed.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
