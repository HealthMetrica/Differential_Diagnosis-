"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConsultationHeaderProps {
  title: string
  showSaveDraft?: boolean
  onSaveDraft?: () => void
}

export function ConsultationHeader({ title, showSaveDraft = true, onSaveDraft }: ConsultationHeaderProps) {
  const router = useRouter()

  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">{title}</h1>
              <p className="text-sm text-muted-foreground">Health Metrica Diagnostic System</p>
            </div>
          </div>

          {showSaveDraft && (
            <Button variant="outline" onClick={onSaveDraft}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
