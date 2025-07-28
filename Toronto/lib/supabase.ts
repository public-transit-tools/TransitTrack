import { createClient } from "@supabase/supabase-js"

// Environment variables with validation and fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Validate environment variables
const isValidUrl = (url: string): boolean => {
  if (!url || url.trim() === "") return false
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === "https:" && (url.includes("supabase.co") || url.includes("localhost"))
  } catch {
    return false
  }
}

const isValidKey = (key: string): boolean => {
  return !!(key && key.trim() !== "" && key.length > 20)
}

// Only create Supabase client if we have valid configuration
const hasValidConfig = isValidUrl(supabaseUrl) && isValidKey(supabaseAnonKey)

console.log("Supabase Configuration Check:", {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
  urlValid: isValidUrl(supabaseUrl),
  keyValid: isValidKey(supabaseAnonKey),
  hasValidConfig,
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : "Not provided",
})

// Create Supabase client only if configuration is valid
export const supabase = hasValidConfig ? createClient(supabaseUrl, supabaseAnonKey) : null

// Log the client creation result
if (hasValidConfig) {
  console.log("✅ Supabase client created successfully")
} else {
  console.log("⚠️ Supabase client not created - using fallback data sources")
  console.log("To enable Supabase:")
  console.log("1. Copy .env.example to .env.local")
  console.log("2. Add your Supabase URL and anon key")
  console.log("3. Restart the development server")
}

// Database types
export interface TransitProject {
  id: number
  name: string
  status: string
  progress_percentage: number
  budget_total: string
  estimated_completion: string
  project_type: string
  length: string
  stations: number
  description: string
  coordinates: [number, number][]
  created_at: string
  updated_at: string
  color?: string
  metadata?: any
}

// Enhanced GeoJSON types to support complex transit data
export interface GeoJSONMetadata {
  type?: string
  color?: string
  offset?: number
  id?: string
  icon?: string
  source?: string[]
  name?: string
  description?: string
  sources?: string[]
  searchTerms?: string[]
}

export interface GeoJSONFeatureProperties {
  // Basic project properties
  id?: number
  name?: string
  status?: string
  progressPercentage?: number
  budgetTotal?: string
  estimatedCompletion?: string
  projectType?: string
  length?: string
  stations?: number
  description?: string

  // Feature-specific properties
  type?: string // tracks, station-label, station-platforms, etc.
  lines?: string[]
  major?: boolean
}

export interface GeoJSONFeature {
  type: "Feature"
  properties: GeoJSONFeatureProperties
  geometry: {
    type: "LineString" | "Point" | "MultiPolygon" | "Polygon"
    coordinates: any // Can be various coordinate formats
  }
}

export interface GeoJSONCollection {
  type: "FeatureCollection"
  metadata?: GeoJSONMetadata
  features: GeoJSONFeature[]
  bbox?: [number, number, number, number]
}

// Process complex GeoJSON files
export const processGeoJSONFile = (data: GeoJSONCollection): TransitProject | null => {
  if (!data.features || data.features.length === 0) {
    console.warn("No features found in GeoJSON file")
    return null
  }

  // Extract metadata
  const metadata = data.metadata || {}

  // Find track features to build the main line
  const trackFeatures = data.features.filter((f) => f.properties.type === "tracks" && f.geometry.type === "LineString")

  // Find station features
  const stationFeatures = data.features.filter((f) => f.properties.type === "station-label")

  if (trackFeatures.length === 0) {
    console.warn("No track features found in GeoJSON file")
    return null
  }

  // Combine all track coordinates into a single line
  const allCoordinates: [number, number][] = []
  trackFeatures.forEach((feature) => {
    if (feature.geometry.coordinates && Array.isArray(feature.geometry.coordinates)) {
      allCoordinates.push(...feature.geometry.coordinates)
    }
  })

  // Remove duplicate consecutive coordinates
  const uniqueCoordinates = allCoordinates.filter((coord, index) => {
    if (index === 0) return true
    const prev = allCoordinates[index - 1]
    return !(coord[0] === prev[0] && coord[1] === prev[1])
  })

  // Generate project data from metadata and features
  const projectName = metadata.name || metadata.description || "Unknown Transit Line"
  const projectId = metadata.id ? Number.parseInt(metadata.id.replace(/\D/g, "")) || Date.now() : Date.now()

  // Determine project type from metadata or features
  let projectType = "LRT" // default
  if (metadata.name?.toLowerCase().includes("subway") || metadata.description?.toLowerCase().includes("subway")) {
    projectType = "Subway"
  } else if (metadata.name?.toLowerCase().includes("go") || metadata.description?.toLowerCase().includes("go")) {
    projectType = "GO Rail"
  } else if (metadata.name?.toLowerCase().includes("lrt") || metadata.description?.toLowerCase().includes("lrt")) {
    projectType = "LRT"
  }

  // Estimate progress based on feature completeness (mock logic)
  const hasStations = stationFeatures.length > 0
  const hasPlatforms = data.features.some((f) => f.properties.type === "station-platforms")
  let progressPercentage = 30 // base progress
  if (hasStations) progressPercentage += 40
  if (hasPlatforms) progressPercentage += 25
  progressPercentage = Math.min(progressPercentage, 95) // Cap at 95%

  // Determine status based on progress and metadata
  let status = "In Progress"
  if (progressPercentage >= 95) {
    status = "Delayed" // High progress but not complete suggests delays
  } else if (progressPercentage < 50) {
    status = "Planned"
  }

  // Calculate approximate length
  const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
    const R = 6371 // Earth's radius in km
    const dLat = ((coord2[1] - coord1[1]) * Math.PI) / 180
    const dLon = ((coord2[0] - coord1[0]) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1[1] * Math.PI) / 180) *
        Math.cos((coord2[1] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  let totalLength = 0
  for (let i = 1; i < uniqueCoordinates.length; i++) {
    totalLength += calculateDistance(uniqueCoordinates[i - 1], uniqueCoordinates[i])
  }

  const project: TransitProject = {
    id: projectId,
    name: projectName,
    status: status,
    progress_percentage: progressPercentage,
    budget_total: "$" + (totalLength * 200).toFixed(1) + "M", // Rough estimate
    estimated_completion: progressPercentage >= 90 ? "2024" : progressPercentage >= 60 ? "2025" : "2026",
    project_type: projectType,
    length: totalLength.toFixed(1) + " km",
    stations: stationFeatures.length,
    description: metadata.description || `${projectType} line with ${stationFeatures.length} stations`,
    coordinates: uniqueCoordinates,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    color: metadata.color,
    metadata: metadata,
  }

  return project
}

// Load GeoJSON files as fallback
export const loadGeoJSONFiles = async (): Promise<TransitProject[]> => {
  const geojsonFiles = [
    "ontario-line.geojson",
    "eglinton-crosstown.geojson",
    "finch-west-lrt.geojson",
    "lakeshore-west.geojson",
    "hazel-mccallion-lrt.geojson",
    "lakeshore-west-line.geojson",
    "hurontario-lrt.geojson",
  ]

  const allProjects: TransitProject[] = []

  for (const filename of geojsonFiles) {
    try {
      console.log(`Loading ${filename}...`)
      const response = await fetch(`/geojson/${filename}`)
      if (!response.ok) {
        console.warn(`Failed to load ${filename}: ${response.status}`)
        continue
      }

      const data: GeoJSONCollection = await response.json()
      console.log(`Loaded ${filename}:`, {
        features: data.features?.length || 0,
        metadata: data.metadata,
        bbox: data.bbox,
      })

      // Check if this is a simple format (single feature with project properties)
      if (data.features && data.features.length === 1 && data.features[0].properties.id) {
        // Simple format - convert directly
        const feature = data.features[0]
        const project = convertGeoJSONToTransitProject(feature)
        allProjects.push(project)
      } else {
        // Complex format - process with new logic
        const project = processGeoJSONFile(data)
        if (project) {
          allProjects.push(project)
        }
      }
    } catch (error) {
      console.warn(`Error loading ${filename}:`, error)
    }
  }

  console.log(`Successfully processed ${allProjects.length} projects from GeoJSON files`)
  return allProjects
}

// Convert simple GeoJSON to TransitProject format (backward compatibility)
export const convertGeoJSONToTransitProject = (feature: GeoJSONFeature): TransitProject => {
  const props = feature.properties
  return {
    id: props.id || Date.now(),
    name: props.name || "Unknown Project",
    status: props.status || "In Progress",
    progress_percentage: props.progressPercentage || 50,
    budget_total: props.budgetTotal || "$1.0B",
    estimated_completion: props.estimatedCompletion || "2025",
    project_type: props.projectType || "LRT",
    length: props.length || "10 km",
    stations: props.stations || 10,
    description: props.description || "Transit project description",
    coordinates: feature.geometry.coordinates as [number, number][],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
}

// Mock data for complete fallback
const mockProjects: TransitProject[] = [
  {
    id: 1,
    name: "Ontario Line",
    status: "In Progress",
    progress_percentage: 35,
    budget_total: "$19.0B",
    estimated_completion: "2031",
    project_type: "Subway",
    length: "15.6 km",
    stations: 15,
    description: "A new 15.6-kilometre subway line that will bring 15 new stations to Toronto.",
    coordinates: [
      [-79.4194, 43.6362],
      [-79.4, 43.645],
      [-79.3832, 43.6532],
      [-79.37, 43.66],
      [-79.35, 43.665],
      [-79.33, 43.67],
      [-79.31, 43.675],
      [-79.29, 43.68],
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Eglinton Crosstown LRT",
    status: "Delayed",
    progress_percentage: 95,
    budget_total: "$12.8B",
    estimated_completion: "2024",
    project_type: "LRT",
    length: "19 km",
    stations: 25,
    description: "A 19-kilometre light rail transit line running along Eglinton Avenue.",
    coordinates: [
      [-79.5442, 43.7282],
      [-79.5142, 43.7282],
      [-79.4842, 43.7282],
      [-79.4542, 43.7282],
      [-79.4242, 43.7282],
      [-79.3942, 43.7282],
      [-79.3642, 43.7282],
      [-79.3342, 43.7282],
      [-79.3042, 43.7282],
      [-79.2742, 43.7282],
      [-79.2442, 43.7282],
      [-79.2142, 43.7282],
      [-79.1842, 43.7282],
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "Finch West LRT",
    status: "In Progress",
    progress_percentage: 85,
    budget_total: "$2.5B",
    estimated_completion: "2024",
    project_type: "LRT",
    length: "11 km",
    stations: 18,
    description: "An 11-kilometre light rail transit line along Finch Avenue West.",
    coordinates: [
      [-79.5, 43.76],
      [-79.47, 43.76],
      [-79.44, 43.76],
      [-79.41, 43.76],
      [-79.38, 43.76],
      [-79.35, 43.76],
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 4,
    name: "Lakeshore West Line",
    status: "In Progress",
    progress_percentage: 45,
    budget_total: "$2.1B",
    estimated_completion: "2025",
    project_type: "GO Rail",
    length: "67 km",
    stations: 12,
    description: "Improvements to the Lakeshore West GO line for more frequent service.",
    coordinates: [
      [-79.3832, 43.6426],
      [-79.45, 43.63],
      [-79.52, 43.62],
      [-79.59, 43.61],
      [-79.66, 43.6],
      [-79.73, 43.59],
      [-79.8, 43.58],
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 5,
    name: "Hazel McCallion LRT",
    status: "In Progress",
    progress_percentage: 65,
    budget_total: "$4.6B",
    estimated_completion: "2024",
    project_type: "LRT",
    length: "18 km",
    stations: 18,
    description: "An 18-kilometre light rail transit line through Mississauga.",
    coordinates: [
      [-79.64, 43.55],
      [-79.635, 43.57],
      [-79.63, 43.59],
      [-79.625, 43.61],
      [-79.62, 43.63],
      [-79.615, 43.65],
      [-79.61, 43.67],
      [-79.605, 43.69],
      [-79.6, 43.71],
    ],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

// Test Supabase connection - only if client exists
export const testSupabaseConnection = async (): Promise<{ connected: boolean; error?: string }> => {
  if (!supabase) {
    return {
      connected: false,
      error: "Supabase client not initialized - check environment variables in .env.local",
    }
  }

  try {
    console.log("Testing Supabase connection...")
    const { data, error } = await supabase.from("transit_projects").select("count", { count: "exact" }).limit(1)

    if (error) {
      console.error("Supabase connection test failed:", error)
      return { connected: false, error: error.message }
    }

    console.log("✅ Supabase connection successful")
    return { connected: true }
  } catch (error) {
    console.error("Supabase connection test error:", error)
    return { connected: false, error: error instanceof Error ? error.message : "Unknown connection error" }
  }
}

// Main function to get transit projects with intelligent fallback
export const getTransitProjects = async (): Promise<{
  projects: TransitProject[]
  source: "supabase" | "geojson" | "mock"
  connectionStatus?: { connected: boolean; error?: string }
}> => {
  console.log("🔄 Loading transit projects...")

  // First, try Supabase if available and properly configured
  if (supabase && hasValidConfig) {
    try {
      console.log("🔄 Attempting to connect to Supabase...")
      const connectionTest = await testSupabaseConnection()

      if (connectionTest.connected) {
        const { data, error } = await supabase.from("transit_projects").select("*").order("id")

        if (error) {
          console.error("❌ Supabase query error:", error)
        } else if (data && data.length > 0) {
          console.log(`✅ Successfully loaded ${data.length} projects from Supabase`)
          return {
            projects: data,
            source: "supabase",
            connectionStatus: connectionTest,
          }
        } else {
          console.warn("⚠️ Supabase connected but no data found")
        }
      } else {
        console.warn("⚠️ Supabase connection failed:", connectionTest.error)
      }
    } catch (error) {
      console.error("❌ Supabase connection error:", error)
    }
  } else {
    console.log("⚠️ Supabase not configured - using fallback data sources")
    if (!hasValidConfig) {
      console.log("Environment check:")
      console.log("- NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "Set" : "Missing")
      console.log("- NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "Set" : "Missing")
      console.log("- URL Valid:", isValidUrl(supabaseUrl))
      console.log("- Key Valid:", isValidKey(supabaseAnonKey))
    }
  }

  // Fallback to GeoJSON files
  try {
    console.log("🔄 Falling back to GeoJSON files...")
    const geoJsonProjects = await loadGeoJSONFiles()
    if (geoJsonProjects.length > 0) {
      console.log(`✅ Successfully loaded ${geoJsonProjects.length} projects from GeoJSON files`)
      return {
        projects: geoJsonProjects,
        source: "geojson",
      }
    }
  } catch (error) {
    console.warn("⚠️ Failed to load GeoJSON files:", error)
  }

  // Final fallback to mock data
  console.log("🔄 Using mock data as final fallback")
  return {
    projects: mockProjects,
    source: "mock",
  }
}

// Real-time subscription for project updates - only if Supabase is available
export const subscribeToProjectUpdates = (callback: (projects: TransitProject[]) => void) => {
  if (!supabase || !hasValidConfig) {
    console.warn("Supabase not available for real-time updates")
    return null
  }

  console.log("📡 Setting up real-time subscription...")
  const subscription = supabase
    .channel("transit_projects_changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "transit_projects",
      },
      async (payload) => {
        console.log("📡 Real-time update received:", payload)
        // Refetch all projects when any change occurs
        const result = await getTransitProjects()
        callback(result.projects)
      },
    )
    .subscribe()

  return subscription
}

// Update project progress - only if Supabase is available
export const updateProjectProgress = async (id: number, progress: number): Promise<TransitProject | null> => {
  if (!supabase || !hasValidConfig) {
    console.log("Mock update - Supabase not configured")
    return mockProjects.find((p) => p.id === id) || null
  }

  try {
    const { data, error } = await supabase
      .from("transit_projects")
      .update({
        progress_percentage: progress,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating project progress:", error)
      throw error
    }

    console.log(`✅ Updated project ${id} progress to ${progress}%`)
    return data
  } catch (error) {
    console.error("Error updating project:", error)
    throw error
  }
}

// Create new transit project - only if Supabase is available
export const createTransitProject = async (
  project: Omit<TransitProject, "id" | "created_at" | "updated_at">,
): Promise<TransitProject> => {
  if (!supabase || !hasValidConfig) {
    console.log("Mock create - Supabase not configured")
    const newProject = {
      ...project,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return newProject
  }

  try {
    const { data, error } = await supabase
      .from("transit_projects")
      .insert([
        {
          ...project,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error creating transit project:", error)
      throw error
    }

    console.log(`✅ Created new project: ${data.name}`)
    return data
  } catch (error) {
    console.error("Error creating project:", error)
    throw error
  }
}

// Delete transit project - only if Supabase is available
export const deleteTransitProject = async (id: number): Promise<boolean> => {
  if (!supabase || !hasValidConfig) {
    console.log("Mock delete - Supabase not configured")
    return true
  }

  try {
    const { error } = await supabase.from("transit_projects").delete().eq("id", id)

    if (error) {
      console.error("Error deleting transit project:", error)
      throw error
    }

    console.log(`✅ Deleted project ${id}`)
    return true
  } catch (error) {
    console.error("Error deleting project:", error)
    throw error
  }
}

// Get project statistics
export const getProjectStatistics = async () => {
  if (!supabase || !hasValidConfig) {
    return {
      total: mockProjects.length,
      byStatus: {
        "In Progress": mockProjects.filter((p) => p.status === "In Progress").length,
        Completed: mockProjects.filter((p) => p.status === "Completed").length,
        Planned: mockProjects.filter((p) => p.status === "Planned").length,
        Delayed: mockProjects.filter((p) => p.status === "Delayed").length,
      },
      byType: {
        Subway: mockProjects.filter((p) => p.project_type === "Subway").length,
        LRT: mockProjects.filter((p) => p.project_type === "LRT").length,
        "GO Rail": mockProjects.filter((p) => p.project_type === "GO Rail").length,
      },
    }
  }

  try {
    const { data: projects, error } = await supabase.from("transit_projects").select("status, project_type")

    if (error) throw error

    const stats = {
      total: projects.length,
      byStatus: projects.reduce(
        (acc, p) => {
          acc[p.status] = (acc[p.status] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
      byType: projects.reduce(
        (acc, p) => {
          acc[p.project_type] = (acc[p.project_type] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
    }

    return stats
  } catch (error) {
    console.error("Error getting project statistics:", error)
    throw error
  }
}
