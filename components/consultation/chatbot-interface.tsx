"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Send, Bot, User, ArrowRight, SkipForward, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getCurrentPatientData, getExtractedSymptoms } from "@/lib/patient-data"

interface ChatMessage {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: Date
  options?: string[]
}

interface ChatbotQuestion {
  question: string
  options?: string[]
  followUp?: string
  category: string
}

export function ChatbotInterface() {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [patientData, setPatientData] = useState<any>(null)
  const [extractedSymptoms, setExtractedSymptoms] = useState<string[]>([])
  const [chatbotQuestions, setChatbotQuestions] = useState<ChatbotQuestion[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const patient = getCurrentPatientData()
    const symptoms = getExtractedSymptoms()

    if (!patient || symptoms.length === 0) {
      router.push("/consultation/new")
      return
    }

    setPatientData(patient)
    setExtractedSymptoms(symptoms)

    // Generate questions based on extracted symptoms
    const questions = generateQuestionsFromSymptoms(symptoms)
    setChatbotQuestions(questions)

    // Start with welcome message
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      type: "bot",
      content: `Hello! I'm here to help gather more information about ${patient.name}'s condition. Based on the initial symptoms, I have some follow-up questions to better understand the case.`,
      timestamp: new Date(),
    }

    setMessages([welcomeMessage])

    // Ask first question after a delay
    setTimeout(() => {
      if (questions.length > 0) {
        askNextQuestion(questions, 0)
      }
    }, 1500)
  }, [router])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const generateQuestionsFromSymptoms = (symptoms: string[]): ChatbotQuestion[] => {
    const questionBank: Record<string, ChatbotQuestion[]> = {
      fever: [
        {
          question: "How high is the fever? Has it been measured?",
          options: ["Low grade (99-100°F)", "Moderate (101-102°F)", "High (103°F+)", "Not measured"],
          category: "severity",
        },
        {
          question: "When did the fever start?",
          options: ["Today", "1-2 days ago", "3-5 days ago", "More than a week ago"],
          category: "timeline",
        },
      ],
      headache: [
        {
          question: "Can you describe the type of headache?",
          options: ["Throbbing/pulsating", "Constant dull ache", "Sharp/stabbing", "Pressure-like"],
          category: "quality",
        },
        {
          question: "Where is the headache located?",
          options: ["Forehead", "Temples", "Back of head", "All over"],
          category: "location",
        },
      ],
      nausea: [
        {
          question: "Has the nausea led to vomiting?",
          options: ["Yes, multiple times", "Yes, once or twice", "No, just nausea", "Dry heaving only"],
          category: "severity",
        },
      ],
      cough: [
        {
          question: "Is the cough productive (with phlegm) or dry?",
          options: ["Dry cough", "Productive with clear phlegm", "Productive with colored phlegm", "Blood in phlegm"],
          category: "quality",
        },
      ],
      rash: [
        {
          question: "Can you describe the appearance of the rash?",
          options: ["Red spots", "Raised bumps", "Flat red areas", "Blistering"],
          category: "appearance",
        },
        {
          question: "Where on the body is the rash located?",
          options: ["Face/neck", "Trunk", "Arms/legs", "Widespread"],
          category: "location",
        },
      ],
      pain: [
        {
          question: "On a scale of 1-10, how would you rate the pain intensity?",
          options: ["1-3 (Mild)", "4-6 (Moderate)", "7-8 (Severe)", "9-10 (Extreme)"],
          category: "severity",
        },
      ],
    }

    const questions: ChatbotQuestion[] = []

    // Add general questions
    questions.push({
      question: "Are there any recent travel history or exposure to sick individuals?",
      options: ["Recent travel", "Exposure to sick person", "Both", "Neither"],
      category: "exposure",
    })

    // Add symptom-specific questions
    symptoms.forEach((symptom) => {
      const symptomQuestions = questionBank[symptom.toLowerCase()]
      if (symptomQuestions) {
        questions.push(...symptomQuestions)
      }
    })

    // Add general follow-up questions
    questions.push(
      {
        question: "Has the patient taken any medications for these symptoms?",
        options: ["Over-the-counter pain relievers", "Antibiotics", "Other medications", "No medications"],
        category: "treatment",
      },
      {
        question: "Are there any other symptoms not mentioned yet?",
        category: "additional",
      },
    )

    return questions.slice(0, 8) // Limit to 8 questions max
  }

  const askNextQuestion = (questions: ChatbotQuestion[], index: number) => {
    if (index >= questions.length) {
      // All questions asked, show completion message
      const completionMessage: ChatMessage = {
        id: `completion-${Date.now()}`,
        type: "bot",
        content:
          "Thank you for providing the additional information. I now have enough details to generate a differential diagnosis. Would you like to proceed?",
        timestamp: new Date(),
        options: ["Generate Diagnosis", "Ask More Questions"],
      }
      setMessages((prev) => [...prev, completionMessage])
      return
    }

    setIsTyping(true)
    setTimeout(() => {
      const question = questions[index]
      const questionMessage: ChatMessage = {
        id: `question-${index}`,
        type: "bot",
        content: question.question,
        timestamp: new Date(),
        options: question.options,
      }
      setMessages((prev) => [...prev, questionMessage])
      setIsTyping(false)
    }, 1000)
  }

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setCurrentInput("")

    // Handle special responses
    if (content === "Generate Diagnosis") {
      handleGenerateDiagnosis()
      return
    }

    if (content === "Ask More Questions") {
      const followUpMessage: ChatMessage = {
        id: `followup-${Date.now()}`,
        type: "bot",
        content: "What additional information would you like to know?",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, followUpMessage])
      return
    }

    // Continue with next question
    const nextIndex = questionIndex + 1
    setQuestionIndex(nextIndex)

    setTimeout(() => {
      askNextQuestion(chatbotQuestions, nextIndex)
    }, 1500)
  }

  const handleGenerateDiagnosis = () => {
    // Store chat data and navigate to diagnosis
    const chatData = {
      messages,
      patientData,
      extractedSymptoms,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem("chatbot_session", JSON.stringify(chatData))
    router.push("/consultation/diagnosis")
  }

  const handleSkipChatbot = () => {
    router.push("/consultation/diagnosis")
  }

  const canGenerateDiagnosis = messages.filter((m) => m.type === "user").length >= 3

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Patient Info Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Patient: {patientData?.name || "Loading..."}</span>
            <Badge variant="outline">ID: {patientData?.patientId}</Badge>
          </CardTitle>
          <CardDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-sm">Extracted Symptoms:</span>
              {extractedSymptoms.map((symptom, index) => (
                <Badge key={index} variant="secondary" className="capitalize">
                  {symptom}
                </Badge>
              ))}
            </div>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Chat Interface */}
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <span>AI Diagnostic Assistant</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === "bot" && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    {message.type === "user" && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      {message.options && (
                        <div className="mt-2 space-y-1">
                          {message.options.map((option, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="w-full text-left justify-start h-auto py-1 px-2 bg-transparent"
                              onClick={() => handleSendMessage(option)}
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex space-x-2">
            <Input
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Type your response..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage(currentInput)}
              disabled={isTyping}
            />
            <Button onClick={() => handleSendMessage(currentInput)} disabled={!currentInput.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleSkipChatbot}>
            <SkipForward className="mr-2 h-4 w-4" />
            Skip Chatbot
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Manual Override
          </Button>
        </div>

        <Button onClick={handleGenerateDiagnosis} disabled={!canGenerateDiagnosis} className="min-w-48">
          Generate Differential Diagnosis
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {!canGenerateDiagnosis && (
        <Alert>
          <AlertDescription>
            Please answer at least 3 questions to generate a reliable differential diagnosis.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
