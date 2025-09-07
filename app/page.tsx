import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Brain, Shield, Users } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-emerald-900">Health Metrica</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/demo">
              <Button>Try Demo</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-emerald-900 mb-6 text-balance">
            AI-Powered Diagnostic Support for Healthcare Professionals
          </h1>
          <p className="text-xl text-emerald-700 mb-8 max-w-3xl mx-auto text-pretty">
            Enhance your diagnostic accuracy with advanced AI analysis, differential diagnosis suggestions, and
            intelligent clinical decision support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                Get Started
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="border-emerald-200">
            <CardHeader>
              <Brain className="w-8 h-8 text-emerald-600 mb-2" />
              <CardTitle className="text-emerald-900">AI Diagnosis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Advanced machine learning algorithms analyze symptoms and provide differential diagnosis suggestions
                with confidence scores.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader>
              <Activity className="w-8 h-8 text-emerald-600 mb-2" />
              <CardTitle className="text-emerald-900">Smart Chatbot</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Interactive symptom analysis through intelligent questioning that adapts based on patient responses and
                medical history.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader>
              <Shield className="w-8 h-8 text-emerald-600 mb-2" />
              <CardTitle className="text-emerald-900">Clinical Safety</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built with medical safety standards, providing decision support while maintaining physician oversight
                and final authority.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-emerald-200">
            <CardHeader>
              <Users className="w-8 h-8 text-emerald-600 mb-2" />
              <CardTitle className="text-emerald-900">Patient Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Comprehensive patient tracking, consultation history, and integrated lab result management for complete
                care coordination.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg border border-emerald-200">
          <h2 className="text-3xl font-bold text-emerald-900 mb-4">Ready to enhance your diagnostic capabilities?</h2>
          <p className="text-emerald-700 mb-6 max-w-2xl mx-auto">
            Join healthcare professionals who are already using Health Metrica to improve patient outcomes and
            diagnostic accuracy.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-emerald-600">
          <p>&copy; 2024 Health Metrica. Professional diagnostic support system.</p>
        </div>
      </footer>
    </div>
  )
}
