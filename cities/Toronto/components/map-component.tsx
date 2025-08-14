"use client"

import { useEffect, useRef } from "react"

// Define types for our project data
interface Project {
  id: number
  name: string
  status: string
  progressPercentage: number
  budgetTotal: string
  coordinates: number[][]
  description: string
  estimatedCompletion: string
}

interface MapComponentProps {
  projects: Project[]
  selectedProject: Project
  onProjectSelect: (project: Project) => void
}

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

export default function MapComponent({ projects, selectedProject, onProjectSelect }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // Only create map if it doesn't exist
      if (!mapInstanceRef.current) {
        // Create map
        const map = L.map(mapRef.current!).setView([40.7505, -73.9857], 13)

        // Add dark tile layer
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
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
        const polyline = L.polyline(project.coordinates as [number, number][], {
          color: getStatusColor(project.status),
          weight: 6,
          opacity: 0.8,
        }).addTo(map)

        // Add click handler
        polyline.on("click", () => {
          onProjectSelect(project)
        })

        // Add popup
        polyline.bindPopup(`
          <div style="color: #1f2937;">
            <h3 style="font-weight: 600; margin-bottom: 4px;">${project.name}</h3>
            <p style="font-size: 14px; margin: 2px 0;">Status: ${project.status}</p>
            <p style="font-size: 14px; margin: 2px 0;">Progress: ${project.progressPercentage}%</p>
          </div>
        `)

        // Highlight selected project
        if (project.id === selectedProject.id) {
          polyline.setStyle({ weight: 8, opacity: 1.0 })
        }
      })
    })

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [projects, selectedProject, onProjectSelect])

  return <div ref={mapRef} className="h-full w-full" style={{ background: "#1f2937" }} />
}
