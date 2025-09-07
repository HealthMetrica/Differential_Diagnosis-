import { AuthGuard } from "@/components/auth/auth-guard"
import { ConsultationHeader } from "@/components/consultation/consultation-header"
import { LabResultsForm } from "@/components/consultation/lab-results-form"

export default function ResultsPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <ConsultationHeader title="Lab Results & Final Diagnosis" showSaveDraft={false} />
        <main className="container mx-auto px-4 py-6">
          <LabResultsForm />
        </main>
      </div>
    </AuthGuard>
  )
}
