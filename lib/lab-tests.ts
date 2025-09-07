export interface LabTest {
  id: string
  name: string
  category: string
  normalRange?: string
  units?: string
  description: string
}

export interface LabOrder {
  id: string
  patientId: string
  testIds: string[]
  orderedBy: string
  orderedAt: string
  priority: "routine" | "urgent" | "stat"
  status: "pending" | "in-progress" | "completed" | "cancelled"
}

export interface LabResult {
  id: string
  orderId: string
  testId: string
  value: string
  status: "normal" | "abnormal" | "critical"
  resultedAt: string
  notes?: string
}

export const commonLabTests: LabTest[] = [
  {
    id: "cbc",
    name: "Complete Blood Count",
    category: "Hematology",
    description: "Measures different components of blood including red blood cells, white blood cells, and platelets",
  },
  {
    id: "dengue_ns1",
    name: "Dengue NS1 Antigen",
    category: "Serology",
    description: "Detects dengue virus NS1 protein in early stages of infection",
  },
  {
    id: "rapid_flu",
    name: "Rapid Influenza Test",
    category: "Molecular",
    description: "Quick test to detect influenza A and B viruses",
  },
  {
    id: "blood_culture",
    name: "Blood Culture",
    category: "Microbiology",
    description: "Identifies bacteria or fungi in blood samples",
  },
]

export function saveLabOrder(order: LabOrder): void {
  const orders = getStoredLabOrders()
  orders.push(order)
  localStorage.setItem("health_metrica_lab_orders", JSON.stringify(orders))
}

export function getStoredLabOrders(): LabOrder[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("health_metrica_lab_orders")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function saveLabResult(result: LabResult): void {
  const results = getStoredLabResults()
  results.push(result)
  localStorage.setItem("health_metrica_lab_results", JSON.stringify(results))
}

export function getStoredLabResults(): LabResult[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem("health_metrica_lab_results")
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}
