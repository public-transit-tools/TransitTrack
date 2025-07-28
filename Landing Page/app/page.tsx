"use client"

import { useState, useEffect } from "react"
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle,
  DollarSign,
  ExternalLink,
  Github,
  MapPin,
  Menu,
  Monitor,
  Play,
  Shield,
  Star,
  Train,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: <MapPin className="w-8 h-8 text-green-600" />,
      title: "Interactive Transit Maps",
      description:
        "Visualize all GTA transit projects on an interactive map with real-time updates and detailed project information.",
      image: "/images/feature-map.png",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      title: "Progress Tracking",
      description:
        "Monitor construction progress, budget allocation, and timeline updates for every transit project in the region.",
      image: "/images/feature-analytics.png",
    },
    {
      icon: <Calendar className="w-8 h-8 text-purple-600" />,
      title: "Timeline & Milestones",
      description: "Stay informed about project milestones, completion dates, and upcoming transit service launches.",
      image: "/images/feature-timeline.png",
    },
  ]

  const stats = [
    { label: "Active Projects", value: "25+", icon: <Train className="w-5 h-5" /> },
    { label: "Total Investment", value: "$50B+", icon: <DollarSign className="w-5 h-5" /> },
    { label: "New Stations", value: "150+", icon: <MapPin className="w-5 h-5" /> },
    { label: "Data Sources", value: "5", icon: <BarChart3 className="w-5 h-5" /> },
  ]

  const projects = [
    {
      name: "Ontario Line",
      type: "Subway",
      status: "In Progress",
      progress: 35,
      completion: "2031",
      color: "#10b981",
    },
    {
      name: "Eglinton Crosstown LRT",
      type: "LRT",
      status: "In Progress",
      progress: 85,
      completion: "2024",
      color: "#8b5cf6",
    },
    {
      name: "Finch West LRT",
      type: "LRT",
      status: "In Progress",
      progress: 75,
      completion: "2024",
      color: "#06b6d4",
    },
    {
      name: "Hazel McCallion LRT",
      type: "LRT",
      status: "Planned",
      progress: 15,
      completion: "2026",
      color: "#f59e0b",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Train className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">TransitTrack</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#projects" className="text-gray-600 hover:text-gray-900 transition-colors">
                Projects
              </a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </a>
              <Button asChild>
                <a href="/app">Launch App</a>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-2">
              <a href="#features" className="block py-2 text-gray-600 hover:text-gray-900">
                Features
              </a>
              <a href="#projects" className="block py-2 text-gray-600 hover:text-gray-900">
                Projects
              </a>
              <a href="#about" className="block py-2 text-gray-600 hover:text-gray-900">
                About
              </a>
              <a href="#contact" className="block py-2 text-gray-600 hover:text-gray-900">
                Contact
              </a>
              <Button className="w-full mt-2" asChild>
                <a href="/app">Launch App</a>
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <Zap className="w-3 h-3 mr-1" />
                  Real-time Data
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  <Shield className="w-3 h-3 mr-1" />
                  Open Source
                </Badge>
              </div>

              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Track Transit
                <span className="text-green-600"> Progress</span>
                <br />
                Across the GTA
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Monitor construction progress, budgets, and timelines for all major transit infrastructure projects in
                the Greater Toronto Area with real-time data and interactive visualizations.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-green-600 hover:bg-green-700" asChild>
                  <a href="/app" className="flex items-center">
                    <Play className="w-5 h-5 mr-2" />
                    Launch App
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#features" className="flex items-center">
                    Learn More
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2 text-green-600">{stat.icon}</div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Live Project Status</h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Live</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {projects.map((project, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{project.name}</h4>
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: `${project.color}20`,
                            color: project.color,
                          }}
                        >
                          {project.type}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>{project.status}</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2 mb-2" />
                      <div className="text-xs text-gray-500">Expected completion: {project.completion}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Transit Monitoring
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get comprehensive insights into GTA transit projects with our suite of monitoring and visualization tools.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl cursor-pointer transition-all ${
                    activeFeature === index
                      ? "bg-green-50 border-2 border-green-200"
                      : "bg-gray-50 border-2 border-transparent hover:border-gray-200"
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    {features[activeFeature].icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{features[activeFeature].title}</h3>
                  <p className="text-gray-600">Interactive preview coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Showcase */}
      <section id="projects" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Major Transit Projects</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track progress on the most significant transit infrastructure investments in GTA history.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Ontario Line",
                description: "A new 15.6 km subway line connecting Ontario Place to the Ontario Science Centre",
                investment: "$19B",
                stations: "15",
                completion: "2031",
                status: "In Progress",
                progress: 35,
                type: "Subway",
                color: "#10b981",
              },
              {
                name: "Eglinton Crosstown LRT",
                description: "25 km light rail line connecting Mount Dennis to Kennedy Station",
                investment: "$12.8B",
                stations: "25",
                completion: "2024",
                status: "Testing",
                progress: 85,
                type: "LRT",
                color: "#8b5cf6",
              },
              {
                name: "Scarborough Subway Extension",
                description: "7.8 km extension of Line 2 to Scarborough Centre",
                investment: "$5.5B",
                stations: "3",
                completion: "2030",
                status: "In Progress",
                progress: 25,
                type: "Subway",
                color: "#06b6d4",
              },
              {
                name: "Finch West LRT",
                description: "11 km light rail line along Finch Avenue West",
                investment: "$2.5B",
                stations: "18",
                completion: "2024",
                status: "Testing",
                progress: 75,
                type: "LRT",
                color: "#f59e0b",
              },
              {
                name: "Yonge North Subway Extension",
                description: "7.4 km extension of Line 1 to Richmond Hill",
                investment: "$5.6B",
                stations: "6",
                completion: "2030",
                status: "Planning",
                progress: 15,
                type: "Subway",
                color: "#ef4444",
              },
              {
                name: "GO Expansion Program",
                description: "Electrification and increased service across the GO network",
                investment: "$13.5B",
                stations: "100+",
                completion: "2028",
                status: "In Progress",
                progress: 45,
                type: "GO Rail",
                color: "#6366f1",
              },
            ].map((project, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: `${project.color}20`,
                        color: project.color,
                      }}
                    >
                      {project.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{project.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Investment</div>
                        <div className="font-semibold">{project.investment}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Stations</div>
                        <div className="font-semibold">{project.stations}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Completion</div>
                        <div className="font-semibold">{project.completion}</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{project.status}</Badge>
                      <Button variant="ghost" size="sm">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <a href="/app">
                View All Projects
                <ExternalLink className="w-5 h-5 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Built for Transit Transparency</h2>
              <p className="text-lg text-gray-600 mb-6">
                TransitTrack was created to provide citizens, planners, and stakeholders with unprecedented visibility
                into the GTA's massive transit expansion program. Our platform aggregates data from multiple sources to
                deliver real-time insights.
              </p>

              <div className="space-y-4">
                {[
                  "Real-time project status updates",
                  "Interactive mapping and visualization",
                  "Budget and timeline tracking",
                  "Open source and transparent",
                  "Multiple data source integration",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button asChild>
                  <a href="https://github.com/transittrack" className="flex items-center">
                    <Github className="w-5 h-5 mr-2" />
                    View on GitHub
                  </a>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 text-center">
                <Monitor className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Real-time Data</h3>
                <p className="text-sm text-gray-600">Live updates from official sources and construction feeds</p>
              </Card>

              <Card className="p-6 text-center">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Community Driven</h3>
                <p className="text-sm text-gray-600">Open source project built by and for the community</p>
              </Card>

              <Card className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
                <p className="text-sm text-gray-600">Advanced insights and trend analysis</p>
              </Card>

              <Card className="p-6 text-center">
                <Shield className="w-8 h-8 text-orange-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Transparent</h3>
                <p className="text-sm text-gray-600">All data sources and methodologies are public</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Track Transit Progress?</h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of users monitoring GTA transit development in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100" asChild>
              <a href="/app" className="flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Launch TransitTrack
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
              asChild
            >
              <a href="https://github.com/transittrack" className="flex items-center">
                <Github className="w-5 h-5 mr-2" />
                View Source Code
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Train className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">TransitTrack</span>
              </div>
              <p className="text-gray-400 mb-4">
                Monitoring and visualizing transit infrastructure progress across the Greater Toronto Area.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white" asChild>
                  <a href="https://github.com/transittrack">
                    <Github className="w-5 h-5" />
                  </a>
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Star className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#projects" className="hover:text-white transition-colors">
                    Projects
                  </a>
                </li>
                <li>
                  <a href="/app" className="hover:text-white transition-colors">
                    Launch App
                  </a>
                </li>
                <li>
                  <a href="/api" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/docs" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="/support" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 TransitTrack. Open source project for transit transparency.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
