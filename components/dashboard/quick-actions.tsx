"use client"

import { useRouter } from "next/navigation"
import { Plus, FileText, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function QuickActions() {
  const router = useRouter()

  const handleNewConsultation = () => {
    router.push("/consultation/new")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Start a new consultation or access key features</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleNewConsultation} className="flex-1 h-12 text-base" size="lg">
            <Plus className="mr-2 h-5 w-5" />
            Start New Patient Consultation
          </Button>

          <Button variant="outline" className="flex-1 h-12 bg-transparent" size="lg">
            <FileText className="mr-2 h-5 w-5" />
            View Pending Lab Results
          </Button>

          <Button variant="outline" className="flex-1 h-12 bg-transparent" size="lg">
            <Activity className="mr-2 h-5 w-5" />
            Analytics Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
