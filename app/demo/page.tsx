"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { loadDemoData, demoPatients } from "@/lib/demo-data"
import { User, ArrowRight, TestTube, Activity } from "lucide-react"

export default function DemoPage() {
  const router = useRouter()

  useEffect(() => {
    loadDemoData()
  }, [])

  const handleStartDemo = (patientId: string) => {
    const patient = demoPatients.find((p) => p.id === patientId)
    if (patient) {
      // Pre-populate demo data
      localStorage.setItem(
        "current_patient_data",
        JSON.stringify({
          patientId: patient.id,
          name: patient.name,
          age: patient.age.toString(),
          gender: patient.gender,
          location: patient.location,
          symptoms: patient.symptoms,
        }),
      )
      localStorage.setItem("extracted_symptoms", JSON.stringify(patient.extractedSymptoms))

      router.push("/consultation/chatbot")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary rounded-lg mx-auto flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">HM</span>
            </div>
            <h1 className="text-3xl font-bold">Health Metrica Demo</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the complete diagnostic workflow with pre-configured patient cases. Each demo showcases
              different medical conditions and diagnostic pathways.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoPatients.map((patient) => (
              <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>{patient.name}</span>
                  </CardTitle>
                  <CardDescription>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{patient.age} years old</Badge>
                        <Badge
                          variant="secondary"
                          className={
                            patient.priority === "high"
                              ? "bg-red-100 text-red-800"
                              : patient.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }
                        >
                          {patient.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm">{patient.location}</p>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Presenting Symptoms:</h4>
                    <p className="text-sm text-muted-foreground line-clamp-3">{patient.symptoms}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Expected Diagnosis:</h4>
                    <Badge variant="outline" className="mb-2">
                      {patient.diagnosis}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <TestTube className="h-4 w-4" />
                    <span>Lab tests included</span>
                    <Activity className="h-4 w-4 ml-2" />
                    <span>AI analysis</span>
                  </div>

                  <Button onClick={() => handleStartDemo(patient.id)} className="w-full">
                    Start Demo Case
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center space-y-4">
            <Button variant="outline" onClick={() => router.push("/login")}>
              Return to Login
            </Button>
            <p className="text-sm text-muted-foreground">Demo credentials: doctor@healthmetrica.com / demo123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
