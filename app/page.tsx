"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  MapPin,
  Calendar,
  DollarSign,
  BarChart3,
  Train,
  Navigation,
  WifiOff,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getTransitProjects, type TransitProject } from "@/lib/supabase"

// Map configuration
const MAP_CONFIG = {
  center: { lat: 43.6532, lng: -79.3832 }, // Toronto
  zoom: 10,
  minZoom: 8,
  maxZoom: 18,
  tileSize: 256,
}

// Utility functions for map calculations
const latLngToTile = (lat: number, lng: number, zoom: number) => {
  const x = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom))
  const y = Math.floor(
    ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
      Math.pow(2, zoom),
  )
  return { x, y }
}

const latLngToPixel = (
  lat: number,
  lng: number,
  centerLat: number,
  centerLng: number,
  zoom: number,
  mapWidth: number,
  mapHeight: number,
) => {
  const centerTile = latLngToTile(centerLat, centerLng, zoom)
  const pointTile = latLngToTile(lat, lng, zoom)

  const x = (pointTile.x - centerTile.x) * MAP_CONFIG.tileSize + mapWidth / 2
  const y = (pointTile.y - centerTile.y) * MAP_CONFIG.tileSize + mapHeight / 2

  return { x, y }
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "#10b981" // green
    case "in progress":
      return "#3b82f6" // blue
    case "planned":
      return "#f59e0b" // amber
    case "delayed":
      return "#ef4444" // red
    default:
      return "#6b7280" // gray
  }
}

const getProjectTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "subway":
      return "#10b981" // emerald
    case "lrt":
      return "#8b5cf6" // violet
    case "go rail":
      return "#06b6d4" // cyan
    case "bus rapid transit":
      return "#f59e0b" // amber
    default:
      return "#6b7280" // gray
  }
}

export default function TransitTrack() {
  const [projects, setProjects] = useState<TransitProject[]>([])
  const [selectedProject, setSelectedProject] = useState<TransitProject | null>(null)
  const [mapCenter, setMapCenter] = useState(MAP_CONFIG.center)
  const [mapZoom, setMapZoom] = useState(MAP_CONFIG.zoom)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)
  const [tiles, setTiles] = useState<Array<{ x: number; y: number; url: string }>>([])
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [dataSource, setDataSource] = useState<"supabase" | "geojson" | "mock">("mock")
  const [loading, setLoading] = useState(true)

  // Load projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)
        const result = await getTransitProjects()
        setProjects(result.projects)
        setDataSource(result.source)
        setLastUpdated(new Date())

        // Set first project as selected if none selected
        if (result.projects.length > 0 && !selectedProject) {
          setSelectedProject(result.projects[0])
        }

        console.log(`Loaded ${result.projects.length} projects from ${result.source}`)
      } catch (error) {
        console.error("Failed to load projects:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  // Calculate map dimensions based on sidebar states
  const getMapDimensions = () => {
    const leftWidth = leftSidebarOpen ? 320 : 48
    const rightWidth = rightSidebarOpen ? 384 : 48
    const totalSidebarWidth = leftWidth + rightWidth

    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1200
    const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 800

    return {
      width: Math.max(400, viewportWidth - totalSidebarWidth),
      height: Math.max(300, viewportHeight),
      leftOffset: leftWidth,
      rightOffset: rightWidth,
    }
  }

  const mapDimensions = getMapDimensions()

  // Update map tiles when center, zoom, or dimensions change
  useEffect(() => {
    const centerTile = latLngToTile(mapCenter.lat, mapCenter.lng, mapZoom)
    const newTiles = []

    const tilesX = Math.ceil(mapDimensions.width / MAP_CONFIG.tileSize) + 2
    const tilesY = Math.ceil(mapDimensions.height / MAP_CONFIG.tileSize) + 2

    const startX = Math.floor(-tilesX / 2)
    const endX = Math.ceil(tilesX / 2)
    const startY = Math.floor(-tilesY / 2)
    const endY = Math.ceil(tilesY / 2)

    for (let dx = startX; dx <= endX; dx++) {
      for (let dy = startY; dy <= endY; dy++) {
        const x = centerTile.x + dx
        const y = centerTile.y + dy
        if (x >= 0 && y >= 0 && x < Math.pow(2, mapZoom) && y < Math.pow(2, mapZoom)) {
          newTiles.push({
            x,
            y,
            url: `https://tile.openstreetmap.org/${mapZoom}/${x}/${y}.png`,
          })
        }
      }
    }

    setTiles(newTiles)
  }, [mapCenter, mapZoom, mapDimensions.width, mapDimensions.height])

  const handleZoomIn = () => {
    if (mapZoom < MAP_CONFIG.maxZoom) {
      setMapZoom(mapZoom + 1)
    }
  }

  const handleZoomOut = () => {
    if (mapZoom > MAP_CONFIG.minZoom) {
      setMapZoom(mapZoom - 1)
    }
  }

  const handleProjectClick = (project: TransitProject) => {
    setSelectedProject(project)
    if (project.coordinates && project.coordinates.length > 0) {
      const [lng, lat] = project.coordinates[0]
      setMapCenter({ lat, lng })
    }
  }

  const renderTransitLine = (project: TransitProject) => {
    if (!project.coordinates || project.coordinates.length < 2) return null

    const points = project.coordinates.map(([lng, lat]: [number, number]) =>
      latLngToPixel(lat, lng, mapCenter.lat, mapCenter.lng, mapZoom, mapDimensions.width, mapDimensions.height),
    )

    const pathData = points.reduce((path: string, point: any, index: number) => {
      return path + (index === 0 ? `M ${point.x} ${point.y}` : ` L ${point.x} ${point.y}`)
    }, "")

    // Use project's custom color if available, otherwise use type-based color
    const color = project.color || getProjectTypeColor(project.project_type)
    const statusColor = getStatusColor(project.status)
    const isSelected = selectedProject?.id === project.id

    return (
      <g key={project.id}>
        {/* Main line */}
        <path
          d={pathData}
          stroke={color}
          strokeWidth={isSelected ? 8 : 5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="cursor-pointer hover:opacity-80 transition-all"
          onClick={() => handleProjectClick(project)}
          opacity={isSelected ? 1 : 0.8}
        />

        {/* Progress overlay */}
        <path
          d={pathData}
          stroke={statusColor}
          strokeWidth={isSelected ? 4 : 3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`${project.progress_percentage / 2} ${(100 - project.progress_percentage) / 2}`}
          opacity={0.9}
          className="pointer-events-none"
        />

        {/* Station markers - show fewer for complex lines */}
        {points.map((point: any, index: number) => {
          // For lines with many points, only show every nth marker
          const showMarker = points.length <= 20 || index % Math.ceil(points.length / 15) === 0
          if (!showMarker) return null

          return (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={isSelected ? 7 : 5}
              fill="white"
              stroke={color}
              strokeWidth={2}
              className="cursor-pointer hover:r-8 transition-all"
              onClick={() => handleProjectClick(project)}
            />
          )
        })}

        {/* Project label for selected line */}
        {isSelected && points.length > 0 && (
          <text
            x={points[Math.floor(points.length / 2)].x}
            y={points[Math.floor(points.length / 2)].y - 15}
            textAnchor="middle"
            className="fill-gray-900 text-sm font-bold pointer-events-none"
            stroke="white"
            strokeWidth="3"
            paintOrder="stroke"
          >
            {project.name}
          </text>
        )}
      </g>
    )
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setMapZoom((prev) => prev)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const getDataSourceLabel = () => {
    switch (dataSource) {
      case "supabase":
        return "Supabase DB"
      case "geojson":
        return "GeoJSON Files"
      case "mock":
        return "Mock Data"
      default:
        return "Unknown"
    }
  }

  const getDataSourceIcon = () => {
    switch (dataSource) {
      case "supabase":
        return <BarChart3 className="w-3 h-3 text-green-600" />
      case "geojson":
        return <BarChart3 className="w-3 h-3 text-blue-600" />
      case "mock":
        return <WifiOff className="w-3 h-3 text-gray-600" />
      default:
        return <WifiOff className="w-3 h-3 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Train className="w-5 h-5 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Loading TransitTrack</h2>
          <p className="text-gray-600">Loading transit project data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Left Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${leftSidebarOpen ? "w-80" : "w-12"} flex flex-col flex-shrink-0 h-full`}
      >
        {/* Left Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          {leftSidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Train className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">TransitTrack</h1>
                <div className="flex items-center space-x-2 text-sm">
                  {getDataSourceIcon()}
                  <span className="text-gray-600 font-medium">{getDataSourceLabel()}</span>
                </div>
              </div>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setLeftSidebarOpen(!leftSidebarOpen)} className="p-2">
            {leftSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {/* Left Sidebar Content */}
        {leftSidebarOpen && (
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* Connection Status */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 text-sm">
                  {getDataSourceIcon()}
                  <span className="text-gray-600 font-medium">
                    {dataSource === "mock" ? "Demo Mode" : `${getDataSourceLabel()} Connected`}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
                  <RefreshCw className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-xs text-gray-500">Last updated: {lastUpdated.toLocaleTimeString()}</p>
            </div>

            {/* Navigation */}
            <div className="p-4 border-b border-gray-200 flex-shrink-0">
              <nav className="space-y-2">
                <Button variant="default" className="w-full justify-start">
                  <MapPin className="w-4 h-4 mr-2" />
                  Map View
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Timeline
                </Button>
              </nav>
            </div>

            {/* Project List - Scrollable */}
            <div className="p-4 flex-1 min-h-0">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 sticky top-0 bg-white py-2 -mt-2">
                Transit Projects ({projects.length})
              </h3>
              <div className="space-y-3 pb-4">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedProject?.id === project.id ? "ring-2 ring-green-500" : ""
                    }`}
                    onClick={() => handleProjectClick(project)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{project.name}</h4>
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: `${project.color || getProjectTypeColor(project.project_type)}20`,
                            color: project.color || getProjectTypeColor(project.project_type),
                          }}
                        >
                          {project.project_type}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{project.status}</span>
                          <span>{project.progress_percentage}%</span>
                        </div>
                        <Progress value={project.progress_percentage} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{project.length}</span>
                          <span>{project.budget_total}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative min-w-0 h-full">
        {/* Map Container */}
        <div className="w-full h-full relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: "#f3f4f6",
              width: "100%",
              height: "100%",
            }}
          >
            {/* Render map tiles as img elements */}
            {tiles.map((tile) => {
              const centerTile = latLngToTile(mapCenter.lat, mapCenter.lng, mapZoom)
              const x =
                (tile.x - centerTile.x) * MAP_CONFIG.tileSize + mapDimensions.width / 2 - MAP_CONFIG.tileSize / 2
              const y =
                (tile.y - centerTile.y) * MAP_CONFIG.tileSize + mapDimensions.height / 2 - MAP_CONFIG.tileSize / 2

              return (
                <img
                  key={`${tile.x}-${tile.y}`}
                  src={tile.url || "/placeholder.svg"}
                  alt=""
                  className="absolute pointer-events-none"
                  style={{
                    left: x,
                    top: y,
                    width: MAP_CONFIG.tileSize,
                    height: MAP_CONFIG.tileSize,
                    imageRendering: "pixelated",
                  }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                  }}
                />
              )
            })}

            {/* SVG overlay for transit lines */}
            <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
              {/* Render transit lines */}
              <g className="pointer-events-auto">{projects.map((project) => renderTransitLine(project))}</g>

              {/* Attribution */}
              <text x="10" y={mapDimensions.height - 10} fill="#666" fontSize="10" className="pointer-events-none">
                © OpenStreetMap contributors • Data: {getDataSourceLabel()}
              </text>
            </svg>
          </div>

          {/* Floating Sidebar Toggle Buttons - Only show when sidebars are collapsed */}
          {!leftSidebarOpen && (
            <div className="absolute top-20 left-4 z-30">
              <Button
                size="sm"
                onClick={() => setLeftSidebarOpen(true)}
                className="bg-white hover:bg-gray-50 text-gray-900 shadow-lg border border-gray-200 p-3"
                title="Open project list"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          )}

          {!rightSidebarOpen && (
            <div className="absolute top-20 right-4 z-30">
              <Button
                size="sm"
                onClick={() => setRightSidebarOpen(true)}
                className="bg-white hover:bg-gray-50 text-gray-900 shadow-lg border border-gray-200 p-3"
                title="Open project details"
              >
                <Navigation className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Map Controls */}
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 space-y-2 z-20">
            <Button size="sm" onClick={handleZoomIn} disabled={mapZoom >= MAP_CONFIG.maxZoom}>
              +
            </Button>
            <div className="text-xs text-center px-2 py-1 bg-gray-100 rounded">{mapZoom}</div>
            <Button size="sm" onClick={handleZoomOut} disabled={mapZoom <= MAP_CONFIG.minZoom}>
              -
            </Button>
          </div>

          {/* Map Info */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-20">
            <h4 className="text-sm font-semibold mb-1">GTA Transit Map</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Zoom: {mapZoom}</div>
              <div>Projects: {projects.length}</div>
              <div className="flex items-center space-x-1">
                <span>Source:</span>
                <span className="font-medium">{getDataSourceLabel()}</span>
              </div>
              <div>
                Size: {mapDimensions.width}×{mapDimensions.height}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-20">
            <h4 className="text-sm font-semibold mb-3">Project Types</h4>
            <div className="space-y-2">
              {["Subway", "LRT", "GO Rail"].map((type) => (
                <div key={type} className="flex items-center space-x-2 text-xs">
                  <div className="w-4 h-2 rounded" style={{ backgroundColor: getProjectTypeColor(type) }} />
                  <span>{type}</span>
                </div>
              ))}
            </div>
            <h4 className="text-sm font-semibold mb-2 mt-4">Status</h4>
            <div className="space-y-2">
              {["Completed", "In Progress", "Planned", "Delayed"].map((status) => (
                <div key={status} className="flex items-center space-x-2 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor(status) }} />
                  <span>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div
        className={`bg-white border-l border-gray-200 transition-all duration-300 ${rightSidebarOpen ? "w-96" : "w-12"} flex flex-col flex-shrink-0 h-full`}
      >
        {/* Right Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setRightSidebarOpen(!rightSidebarOpen)} className="p-2">
            {rightSidebarOpen ? <ChevronRight className="w-4 h-4" /> : <Navigation className="w-4 h-4" />}
          </Button>
          {rightSidebarOpen && <h2 className="text-lg font-semibold text-gray-900">Project Details</h2>}
        </div>

        {/* Right Sidebar Content */}
        {rightSidebarOpen && (
          <div className="flex-1 overflow-y-auto p-4 min-h-0">
            {selectedProject ? (
              <div className="space-y-6 pb-4">
                {/* Project Header */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{selectedProject.name}</h3>
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: `${getStatusColor(selectedProject.status)}20`,
                        color: getStatusColor(selectedProject.status),
                      }}
                    >
                      {selectedProject.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{selectedProject.description}</p>
                </div>

                {/* Progress */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Construction Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Completion</span>
                        <span className="font-semibold">{selectedProject.progress_percentage}%</span>
                      </div>
                      <Progress value={selectedProject.progress_percentage} className="h-3" />
                    </div>
                  </CardContent>
                </Card>

                {/* Project Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-500">Investment</p>
                          <p className="text-sm font-semibold">{selectedProject.budget_total}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Completion</p>
                          <p className="text-sm font-semibold">{selectedProject.estimated_completion}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Navigation className="w-4 h-4 text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-500">Length</p>
                          <p className="text-sm font-semibold">{selectedProject.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-orange-600" />
                        <div>
                          <p className="text-xs text-gray-500">Stations</p>
                          <p className="text-sm font-semibold">{selectedProject.stations}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Data Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Data Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Type</span>
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: `${selectedProject.color || getProjectTypeColor(selectedProject.project_type)}20`,
                            color: selectedProject.color || getProjectTypeColor(selectedProject.project_type),
                          }}
                        >
                          {selectedProject.project_type}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Coordinates</span>
                        <span className="text-sm">{selectedProject.coordinates.length} points</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Data Source</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium">{getDataSourceLabel()}</span>
                        </div>
                      </div>
                      {selectedProject.color && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Line Color</span>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-4 h-4 rounded border border-gray-300"
                              style={{ backgroundColor: selectedProject.color }}
                            />
                            <span className="text-sm font-mono">{selectedProject.color}</span>
                          </div>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Last Updated</span>
                        <span className="text-sm">{new Date(selectedProject.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* External Link */}
                <Button className="w-full" asChild>
                  <a
                    href={`https://www.metrolinx.com/en/projects-and-programs`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Metrolinx Website
                  </a>
                </Button>
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-8">
                <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a project on the map to view details</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
