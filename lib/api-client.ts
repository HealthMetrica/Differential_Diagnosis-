interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

class HealthMetricaAPI {
  private baseUrl = "/api"

  async diagnose(symptoms: string[], patientData: any, chatData?: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/diagnose`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms, patientData, chatData }),
      })

      return await response.json()
    } catch (error) {
      return { success: false, error: "Network error" }
    }
  }

  async orderLabTests(testIds: string[], patientId: string, priority = "routine"): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/lab-tests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testIds, patientId, priority }),
      })

      return await response.json()
    } catch (error) {
      return { success: false, error: "Lab ordering failed" }
    }
  }

  async extractSymptoms(text: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${this.baseUrl}/nlp/extract-symptoms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      return await response.json()
    } catch (error) {
      return { success: false, error: "NLP processing failed" }
    }
  }
}

export const healthMetricaAPI = new HealthMetricaAPI()
