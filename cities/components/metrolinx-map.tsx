"use client"

import { useEffect, useRef } from "react"

interface MetrolinxProject {
  id: number
  name: string
  status: string
  progressPercentage: number
  budgetTotal: string
  coordinates: [number, number][]
  description: string
  estimatedCompletion: string
  projectType: string
  length?: string
  stations?: number
}

interface MetrolinxMapProps {
  projects: MetrolinxProject[]
  selectedProject: MetrolinxProject
  onProjectSelect: (project: MetrolinxProject) => void
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "#16a34a"
    case "In Progress":
      return "#2563eb"
    case "Planned":
      return "#ca8a04"
    case "Delayed":
      return "#dc2626"
    default:
      return "#6b7280"
  }
}

const getProjectTypeColor = (type: string) => {
  switch (type) {
    case "Subway":
      return "#059669"
    case "LRT":
      return "#7c3aed"
    case "GO Rail":
      return "#0891b2"
    default:
      return "#6b7280"
  }
}

export default function MetrolinxMap({ projects, selectedProject, onProjectSelect }: MetrolinxMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Dynamically import Leaflet
    import("leaflet").then((L) => {
      // Fix for default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/placeholder.svg?height=25&width=41&text=📍",
        iconUrl: "/placeholder.svg?height=25&width=41&text=📍",
        shadowUrl: "/placeholder.svg?height=41&width=41&text=shadow",
      })

      if (!mapInstanceRef.current) {
        // Create map centered on Greater Toronto Area
        const map = L.map(mapRef.current!).setView([43.6532, -79.3832], 10)

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map)

        mapInstanceRef.current = map
      }

      const map = mapInstanceRef.current

      // Clear existing layers (except tile layer)
      map.eachLayer((layer: any) => {
        if (layer.options && !layer.options.attribution) {
          map.removeLayer(layer)
        }
      })

      // Add project polylines
      projects.forEach((project) => {
        const isSelected = project.id === selectedProject.id

        // Main line
        const polyline = L.polyline(project.coordinates, {
          color: getProjectTypeColor(project.projectType),
          weight: isSelected ? 8 : 6,
          opacity: isSelected ? 1.0 : 0.8,
        }).addTo(map)

        // Progress overlay
        const progressLine = L.polyline(project.coordinates, {
          color: getStatusColor(project.status),
          weight: isSelected ? 4 : 3,
          opacity: 0.7,
          dashArray: `${project.progressPercentage / 10} ${(100 - project.progressPercentage) / 10}`,
        }).addTo(map)

        // Click handler
        polyline.on("click", () => {
          onProjectSelect(project)
        })

        progressLine.on("click", () => {
          onProjectSelect(project)
        })

        // Popup with project info
        const popupContent = `
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: 600; color: #1f2937;">${project.name}</h3>
            <div style="margin-bottom: 4px;">
              <span style="display: inline-block; width: 12px; height: 12px; background-color: ${getProjectTypeColor(project.projectType)}; border-radius: 2px; margin-right: 6px;"></span>
              <span style="font-size: 12px; color: #6b7280;">${project.projectType}</span>
            </div>
            <div style="margin-bottom: 4px;">
              <span style="display: inline-block; width: 12px; height: 12px; background-color: ${getStatusColor(project.status)}; border-radius: 2px; margin-right: 6px;"></span>
              <span style="font-size: 12px; color: #6b7280;">${project.status}</span>
            </div>
            <p style="margin: 4px 0; font-size: 12px; color: #6b7280;">Progress: ${project.progressPercentage}%</p>
            ${project.length ? `<p style="margin: 4px 0; font-size: 12px; color: #6b7280;">Length: ${project.length}</p>` : ""}
            <p style="margin: 4px 0; font-size: 12px; color: #6b7280;">Completion: ${project.estimatedCompletion}</p>
          </div>
        `

        polyline.bindPopup(popupContent)

        // Add station markers
        project.coordinates.forEach((coord, index) => {
          if (index % 3 === 0) {
            // Show every 3rd station to avoid clutter
            const marker = L.circleMarker(coord, {
              radius: isSelected ? 6 : 4,
              fillColor: getProjectTypeColor(project.projectType),
              color: "#ffffff",
              weight: 2,
              opacity: 1,
              fillOpacity: 0.8,
            }).addTo(map)

            marker.on("click", () => {
              onProjectSelect(project)
            })
          }
        })
      })

      // Fit map to show all projects
      if (projects.length > 0) {
        const group = new L.FeatureGroup(projects.map((project) => L.polyline(project.coordinates)))
        map.fitBounds(group.getBounds().pad(0.1))
      }
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [projects, selectedProject, onProjectSelect])

  return (
    <div className="relative h-full w-full">
      {/* Map Title Overlay */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-sm">
        <h3 className="text-gray-900 font-semibold">Greater Toronto Area Transit Projects</h3>
        <p className="text-gray-600 text-sm">Real-time construction progress • Click lines for details</p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-sm">
        <h4 className="text-gray-900 font-medium mb-3">Project Types</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-emerald-600 rounded"></div>
            <span className="text-sm text-gray-600">Subway</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-violet-600 rounded"></div>
            <span className="text-sm text-gray-600">LRT</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-cyan-600 rounded"></div>
            <span className="text-sm text-gray-600">GO Rail</span>
          </div>
        </div>

        <h4 className="text-gray-900 font-medium mb-3 mt-4">Status</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            <span className="text-sm text-gray-600">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-sm text-gray-600">In Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
            <span className="text-sm text-gray-600">Planned</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span className="text-sm text-gray-600">Delayed</span>
          </div>
        </div>
      </div>

      <div ref={mapRef} className="h-full w-full" />
    </div>
  )
}
