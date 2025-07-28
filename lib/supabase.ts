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
}

// GeoJSON types
export interface GeoJSONFeature {
  type: "Feature"
  properties: {
    id: number
    name: string
    status: string
    progressPercentage: number
    budgetTotal: string
    estimatedCompletion: string
    projectType: string
    length: string
    stations: number
    description: string
  }
  geometry: {
    type: "LineString"
    coordinates: [number, number][]
  }
}

export interface GeoJSONCollection {
  type: "FeatureCollection"
  features: GeoJSONFeature[]
}

// Load GeoJSON files as fallback
export const loadGeoJSONFiles = async (): Promise<GeoJSONFeature[]> => {
  const geojsonFiles = [
    "ontario-line.geojson",
    "eglinton-crosstown.geojson",
    "finch-west-lrt.geojson",
    "lakeshore-west.geojson",
    "hazel-mccallion-lrt.geojson",
  ]

  const allFeatures: GeoJSONFeature[] = []

  for (const filename of geojsonFiles) {
    try {
      const response = await fetch(`/geojson/${filename}`)
      if (!response.ok) {
        console.warn(`Failed to load ${filename}: ${response.status}`)
        continue
      }

      const data: GeoJSONCollection = await response.json()
      if (data.features && Array.isArray(data.features)) {
        allFeatures.push(...data.features)
      }
    } catch (error) {
      console.warn(`Error loading ${filename}:`, error)
    }
  }

  return allFeatures
}

// Convert GeoJSON to TransitProject format
export const convertGeoJSONToTransitProject = (feature: GeoJSONFeature): TransitProject => {
  return {
    id: feature.properties.id,
    name: feature.properties.name,
    status: feature.properties.status,
    progress_percentage: feature.properties.progressPercentage,
    budget_total: feature.properties.budgetTotal,
    estimated_completion: feature.properties.estimatedCompletion,
    project_type: feature.properties.projectType,
    length: feature.properties.length,
    stations: feature.properties.stations,
    description: feature.properties.description,
    coordinates: feature.geometry.coordinates,
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
    const geoJsonFeatures = await loadGeoJSONFiles()
    if (geoJsonFeatures.length > 0) {
      console.log(`✅ Successfully loaded ${geoJsonFeatures.length} projects from GeoJSON files`)
      return {
        projects: geoJsonFeatures.map(convertGeoJSONToTransitProject),
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
