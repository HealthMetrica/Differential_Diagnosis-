import { AuthGuard } from "@/components/auth/auth-guard"
import { ConsultationHeader } from "@/components/consultation/consultation-header"
import { ChatbotInterface } from "@/components/consultation/chatbot-interface"

export default function ChatbotPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <ConsultationHeader title="Chatbot Interaction" showSaveDraft={false} />
        <main className="container mx-auto px-4 py-6">
          <ChatbotInterface />
        </main>
      </div>
    </AuthGuard>
  )
}
