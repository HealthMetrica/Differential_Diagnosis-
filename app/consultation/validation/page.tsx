import { AuthGuard } from "@/components/auth/auth-guard"
import { ConsultationHeader } from "@/components/consultation/consultation-header"
import { DiagnosisValidationForm } from "@/components/consultation/diagnosis-validation-form"

export default function ValidationPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <ConsultationHeader title="Diagnosis Validation & Lab Tests" showSaveDraft={false} />
        <main className="container mx-auto px-4 py-6">
          <DiagnosisValidationForm />
        </main>
      </div>
    </AuthGuard>
  )
}
