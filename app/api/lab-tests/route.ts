import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { testIds, patientId, priority } = await request.json()

    // Simulate lab processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const orderId = `ORD${Date.now()}`
    const results = generateMockLabResults(testIds)

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        status: "ordered",
        estimatedCompletion: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        tests: results,
        totalCost: calculateTotalCost(testIds),
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Lab ordering API error" }, { status: 500 })
  }
}

function generateMockLabResults(testIds: string[]) {
  const testResults: Record<string, any> = {
    dengue_ns1: {
      name: "Dengue NS1 Antigen",
      status: "pending",
      expectedResult: "positive",
      turnaroundTime: "2-4 hours",
    },
    cbc: {
      name: "Complete Blood Count",
      status: "pending",
      expectedResult: "abnormal",
      turnaroundTime: "1-2 hours",
    },
    rapid_flu: {
      name: "Rapid Influenza Test",
      status: "pending",
      expectedResult: "negative",
      turnaroundTime: "15-30 minutes",
    },
  }

  return testIds.map((id) => testResults[id] || { name: "Unknown Test", status: "error" })
}

function calculateTotalCost(testIds: string[]): number {
  const costs: Record<string, number> = {
    dengue_ns1: 35,
    cbc: 30,
    rapid_flu: 25,
    platelet_count: 20,
  }

  return testIds.reduce((total, id) => total + (costs[id] || 0), 0)
}
