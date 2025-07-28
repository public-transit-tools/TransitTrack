"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, DollarSign, Activity, Home, FileText, Settings } from "lucide-react"

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("../components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-800 flex items-center justify-center">
      <div className="text-white">Loading map...</div>
    </div>
  ),
})

// Sample transit project data
const transitProjects = [
  {
    id: 1,
    name: "Metro Blue Line Extension",
    status: "In Progress",
    progressPercentage: 65,
    budgetTotal: "$2.8B",
    coordinates: [
      [40.7589, -73.9851],
      [40.7614, -73.9776],
      [40.7648, -73.9712],
      [40.7691, -73.9654],
    ],
    description:
      "Extending the Blue Line to connect downtown with the northern districts, improving accessibility and reducing traffic congestion.",
    estimatedCompletion: "Q3 2025",
  },
  {
    id: 2,
    name: "Central Bus Rapid Transit",
    status: "Planned",
    progressPercentage: 15,
    budgetTotal: "$850M",
    coordinates: [
      [40.7505, -73.9934],
      [40.7543, -73.9857],
      [40.7589, -73.9851],
      [40.7634, -73.9798],
    ],
    description:
      "High-frequency bus rapid transit system with dedicated lanes and modern stations along the central corridor.",
    estimatedCompletion: "Q1 2026",
  },
  {
    id: 3,
    name: "Green Line Modernization",
    status: "Completed",
    progressPercentage: 100,
    budgetTotal: "$1.2B",
    coordinates: [
      [40.7282, -73.9942],
      [40.7359, -73.9911],
      [40.7434, -73.9881],
      [40.7505, -73.9934],
    ],
    description:
      "Complete modernization of existing Green Line infrastructure with new stations, upgraded tracks, and improved accessibility.",
    estimatedCompletion: "Completed",
  },
  {
    id: 4,
    name: "East Side Light Rail",
    status: "Delayed",
    progressPercentage: 42,
    budgetTotal: "$3.1B",
    coordinates: [
      [40.7691, -73.9654],
      [40.7723, -73.9589],
      [40.7756, -73.9523],
      [40.7789, -73.9456],
    ],
    description:
      "New light rail system connecting eastern neighborhoods with the city center, currently experiencing delays due to environmental reviews.",
    estimatedCompletion: "Q2 2027",
  },
  {
    id: 5,
    name: "Airport Express Link",
    status: "In Progress",
    progressPercentage: 78,
    budgetTotal: "$4.5B",
    coordinates: [
      [40.7434, -73.9881],
      [40.7398, -73.9823],
      [40.7362, -73.9765],
      [40.7326, -73.9707],
      [40.729, -73.9649],
    ],
    description:
      "High-speed rail connection between downtown and the international airport, featuring state-of-the-art stations and rolling stock.",
    estimatedCompletion: "Q4 2024",
  },
]

// Status color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "#22c55e" // green
    case "In Progress":
      return "#3b82f6" // blue
    case "Planned":
      return "#f59e0b" // amber
    case "Delayed":
      return "#ef4444" // red
    default:
      return "#6b7280" // gray
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Completed":
      return "default" as const
    case "In Progress":
      return "secondary" as const
    case "Planned":
      return "outline" as const
    case "Delayed":
      return "destructive" as const
    default:
      return "secondary" as const
  }
}

export default function TransitTrack() {
  const [selectedProject, setSelectedProject] = useState(transitProjects[0])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-screen bg-gray-900 text-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p>Loading TransitTrack...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Left Sidebar Navigation */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-blue-400">TransitTrack</h1>
          <p className="text-sm text-gray-400 mt-1">Infrastructure Monitoring</p>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-2">
            <Button variant="secondary" className="w-full justify-start bg-blue-600 hover:bg-blue-700">
              <MapPin className="mr-2 h-4 w-4" />
              Map View
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700">
              <Activity className="mr-2 h-4 w-4" />
              Active Projects
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700">
              <FileText className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700">
              <Home className="mr-2 h-4 w-4" />
              Projects
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-700">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <div className="text-xs text-gray-400">
            <div className="flex items-center justify-between mb-2">
              <span>Active Projects</span>
              <span className="font-semibold">{transitProjects.filter((p) => p.status === "In Progress").length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Budget</span>
              <span className="font-semibold">$12.3B</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Map Container */}
        <div className="flex-1 relative">
          <MapComponent
            projects={transitProjects}
            selectedProject={selectedProject}
            onProjectSelect={setSelectedProject}
          />
        </div>

        {/* Right Sidebar - Project Details */}
        <div className="w-96 bg-gray-800 border-l border-gray-700 p-6 overflow-y-auto">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl text-white">{selectedProject.name}</CardTitle>
                <Badge variant={getStatusVariant(selectedProject.status)}>{selectedProject.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-300">Progress</span>
                  <span className="text-sm text-gray-400">{selectedProject.progressPercentage}%</span>
                </div>
                <Progress value={selectedProject.progressPercentage} className="h-2" />
              </div>

              {/* Budget Section */}
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Total Budget</p>
                  <p className="text-lg font-semibold text-white">{selectedProject.budgetTotal}</p>
                </div>
              </div>

              {/* Completion Date */}
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Estimated Completion</p>
                  <p className="text-lg font-semibold text-white">{selectedProject.estimatedCompletion}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Project Description</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">{selectedProject.progressPercentage}%</p>
                  <p className="text-xs text-gray-400">Complete</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">
                    {selectedProject.status === "Completed" ? "✓" : "○"}
                  </p>
                  <p className="text-xs text-gray-400">Status</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project List */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">All Projects</h3>
            <div className="space-y-2">
              {transitProjects.map((project) => (
                <Button
                  key={project.id}
                  variant={selectedProject.id === project.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor(project.status) }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{project.name}</p>
                      <p className="text-xs text-gray-400">
                        {project.progressPercentage}% • {project.status}
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
