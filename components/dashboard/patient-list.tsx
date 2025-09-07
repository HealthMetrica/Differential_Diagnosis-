"use client"

import { useState } from "react"
import { MoreHorizontal, Filter, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const mockPatients = [
  {
    id: "PAT001",
    name: "Maria Rodriguez",
    age: 34,
    lastVisit: "2024-01-15",
    status: "Active Diagnosis",
    condition: "Suspected Dengue Fever",
    priority: "high",
  },
  {
    id: "PAT002",
    name: "James Wilson",
    age: 45,
    lastVisit: "2024-01-14",
    status: "Pending Labs",
    condition: "Bacterial Infection",
    priority: "medium",
  },
  {
    id: "PAT003",
    name: "Sarah Chen",
    age: 28,
    lastVisit: "2024-01-13",
    status: "Diagnosis Finalized",
    condition: "Viral Gastroenteritis",
    priority: "low",
  },
  {
    id: "PAT004",
    name: "Robert Johnson",
    age: 52,
    lastVisit: "2024-01-12",
    status: "Active Diagnosis",
    condition: "Respiratory Infection",
    priority: "high",
  },
  {
    id: "PAT005",
    name: "Lisa Thompson",
    age: 39,
    lastVisit: "2024-01-11",
    status: "Pending Labs",
    condition: "Suspected Malaria",
    priority: "medium",
  },
]

export function PatientList() {
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredPatients = mockPatients.filter((patient) => statusFilter === "all" || patient.status === statusFilter)

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Active Diagnosis":
        return "default"
      case "Pending Labs":
        return "secondary"
      case "Diagnosis Finalized":
        return "outline"
      default:
        return "default"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Consultations</CardTitle>
            <CardDescription>Manage your active patients and consultations</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                <SelectItem value="Active Diagnosis">Active Diagnosis</SelectItem>
                <SelectItem value="Pending Labs">Pending Labs</SelectItem>
                <SelectItem value="Diagnosis Finalized">Diagnosis Finalized</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(patient.priority)}`} />
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-muted-foreground">{patient.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{patient.lastVisit}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(patient.status)}>{patient.status}</Badge>
                </TableCell>
                <TableCell>{patient.condition}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>Continue Consultation</DropdownMenuItem>
                      <DropdownMenuItem>View Lab Results</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
