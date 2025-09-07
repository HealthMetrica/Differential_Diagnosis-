import { AuthGuard } from "@/components/auth/auth-guard"
import { ConsultationHeader } from "@/components/consultation/consultation-header"
import { DifferentialDiagnosisDisplay } from "@/components/consultation/differential-diagnosis-display"

export default function DiagnosisPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <ConsultationHeader title="Differential Diagnosis" showSaveDraft={false} />
        <main className="container mx-auto px-4 py-6">
          <DifferentialDiagnosisDisplay />
        </main>
      </div>
    </AuthGuard>
  )
}
