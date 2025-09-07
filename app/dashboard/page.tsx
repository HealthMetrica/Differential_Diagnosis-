import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { PatientList } from "@/components/dashboard/patient-list"
import { AnalyticsWidgets } from "@/components/dashboard/analytics-widgets"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6 space-y-6">
          <QuickActions />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <PatientList />
            </div>
            <div className="lg:col-span-1">
              <AnalyticsWidgets />
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
