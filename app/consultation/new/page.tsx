import { AuthGuard } from "@/components/auth/auth-guard"
import { PatientIntakeForm } from "@/components/consultation/patient-intake-form"
import { ConsultationHeader } from "@/components/consultation/consultation-header"

export default function NewConsultationPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <ConsultationHeader title="New Consultation" />
        <main className="container mx-auto px-4 py-6">
          <PatientIntakeForm />
        </main>
      </div>
    </AuthGuard>
  )
}
