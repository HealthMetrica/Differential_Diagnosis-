export const demoPatients = [
  {
    id: "PAT001",
    name: "Maria Rodriguez",
    age: 34,
    gender: "female",
    location: "Manila, Philippines",
    symptoms:
      "High fever for 3 days, severe headache, muscle pain, nausea, and loss of appetite. Started suddenly after returning from a rural area.",
    extractedSymptoms: ["fever", "headache", "muscle pain", "nausea", "loss of appetite"],
    diagnosis: "Dengue Fever",
    status: "Active Diagnosis",
    lastVisit: "2024-01-15",
    priority: "high",
  },
  {
    id: "PAT002",
    name: "James Wilson",
    age: 45,
    gender: "male",
    location: "New York, USA",
    symptoms: "Dry cough, fever, fatigue, and body aches for 2 days. Coworker had similar symptoms last week.",
    extractedSymptoms: ["cough", "fever", "fatigue", "muscle pain"],
    diagnosis: "Influenza A",
    status: "Pending Labs",
    lastVisit: "2024-01-14",
    priority: "medium",
  },
  {
    id: "PAT003",
    name: "Sarah Chen",
    age: 28,
    gender: "female",
    location: "Singapore",
    symptoms: "Nausea, vomiting, diarrhea, and mild fever after eating at a street food market yesterday.",
    extractedSymptoms: ["nausea", "vomiting", "diarrhea", "fever"],
    diagnosis: "Viral Gastroenteritis",
    status: "Diagnosis Finalized",
    lastVisit: "2024-01-13",
    priority: "low",
  },
]

export const demoLabTests = [
  {
    id: "dengue_ns1",
    name: "Dengue NS1 Antigen Test",
    category: "Serology",
    cost: 35,
    turnaroundTime: "2-4 hours",
    normalRange: "Negative",
  },
  {
    id: "cbc",
    name: "Complete Blood Count",
    category: "Hematology",
    cost: 30,
    turnaroundTime: "1-2 hours",
    normalRange: "Various",
  },
  {
    id: "rapid_flu",
    name: "Rapid Influenza Test",
    category: "Molecular",
    cost: 25,
    turnaroundTime: "15-30 minutes",
    normalRange: "Negative",
  },
]

export function loadDemoData() {
  // Load demo patients into localStorage
  if (typeof window !== "undefined") {
    const existingPatients = localStorage.getItem("health_metrica_patients")
    if (!existingPatients) {
      localStorage.setItem("health_metrica_patients", JSON.stringify(demoPatients))
    }
  }
}
