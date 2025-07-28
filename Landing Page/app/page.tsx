"use client"

import { useState, useEffect } from "react"
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronDown,
  DollarSign,
  ExternalLink,
  Github,
  MapPin,
  Menu,
  Monitor,
  Navigation,
  Play,
  Shield,
  Train,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
      icon: <MapPin className="w-8 h-8 text-blue-600" />,
      title: "Interactive Transit Maps",
      description:
        "Visualize all GTA transit projects on an interactive map with real-time updates and detailed project information.",
      image: "/images/feature-map.png",
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-green-600" />,
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
    { label: "Completion Rate", value: "68%", icon: <TrendingUp className="w-5 h-5" /> },
    { label: "Data Sources", value: "3", icon: <Monitor className="w-5 h-5" /> },
  ]

  const projects = [
    {
      name: "Ontario Line",
      type: "Subway",
      status: "In Progress",
      progress: 45,
      completion: "2031",
      investment: "$19.0B",
      color: "#10b981",
    },
    {
      name: "Eglinton Crosstown LRT",
      type: "LRT",
      status: "In Progress",
      progress: 85,
      completion: "2024",
      investment: "$12.8B",
      color: "#8b5cf6",
    },
    {
      name: "Finch West LRT",
      type: "LRT",
      status: "In Progress",
      progress: 92,
      completion: "2024",
      investment: "$2.5B",
      color: "#8b5cf6",
    },
    {
      name: "Lakeshore West GO",
      type: "GO Rail",
      status: "Completed",
      progress: 100,
      completion: "2023",
      investment: "$1.2B",
      color: "#06b6d4",
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

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Features
                </a>
                <a href="#projects" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Projects
                </a>
                <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                  About
                </a>
                <Button asChild className="w-fit">
                  <a href="/app">Launch App</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  <Zap className="w-3 h-3 mr-1" />
                  Real-time Data
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Track Transit
                  <span className="text-green-600"> Progress</span>
                  <br />
                  Across the GTA
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Monitor construction progress, budgets, and timelines for all major transit infrastructure projects in
                  the Greater Toronto Area with our comprehensive tracking platform.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 py-6" asChild>
                  <a href="/app">
                    <Play className="w-5 h-5 mr-2" />
                    Explore Projects
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent" asChild>
                  <a href="#demo">
                    <Monitor className="w-5 h-5 mr-2" />
                    Watch Demo
                  </a>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2 text-green-600">{stat.icon}</div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                <div className="aspect-video bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <img
                    src="/images/hero-dashboard.png"
                    alt="TransitTrack Dashboard"
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                      target.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center">
                          <div class="text-center">
                            <div class="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                              </svg>
                            </div>
                            <h3 class="text-lg font-semibold text-gray-900 mb-2">Interactive Dashboard</h3>
                            <p class="text-gray-600">Real-time transit project monitoring</p>
                          </div>
                        </div>
                      `
                    }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Live Data</span>
                  </div>
                  <Badge variant="secondary">25 Projects</Badge>
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
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Comprehensive Transit Monitoring</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get complete visibility into transit infrastructure development with our advanced tracking and
              visualization tools.
            </p>
          </div>

          {/* Feature Showcase */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    activeFeature === index ? "border-green-200 bg-green-50" : "border-gray-200 hover:border-gray-300"
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
              <div className="bg-gray-100 rounded-2xl aspect-video flex items-center justify-center">
                <img
                  src={features[activeFeature].image || "/placeholder.svg"}
                  alt={features[activeFeature].title}
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    target.parentElement!.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center">
                        <div class="text-center">
                          ${features[activeFeature].icon}
                          <h3 class="text-lg font-semibold text-gray-900 mt-4">${features[activeFeature].title}</h3>
                        </div>
                      </div>
                    `
                  }}
                />
              </div>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Reliable Data</CardTitle>
                <CardDescription>Multiple data sources ensure accuracy and up-to-date information</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle>Public Access</CardTitle>
                <CardDescription>Free and open access to transit project information for everyone</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Navigation className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>Easy Navigation</CardTitle>
                <CardDescription>Intuitive interface designed for both experts and general public</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Featured Transit Projects</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore some of the major transit infrastructure projects currently transforming the Greater Toronto Area.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {project.type} • Completion: {project.completion}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: `${project.color}20`,
                        color: project.color,
                      }}
                    >
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span className="font-semibold">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">{project.investment}</span>
                      </div>
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
            <Button size="lg" asChild>
              <a href="/app">
                View All Projects
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">About TransitTrack</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                TransitTrack is an open-source platform dedicated to providing transparent, real-time information about
                transit infrastructure projects across the Greater Toronto Area. Our mission is to keep the public
                informed about the progress of major transportation investments that shape our communities.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Real-time Updates</h3>
                    <p className="text-gray-600">Automated data collection from multiple official sources</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Open Source</h3>
                    <p className="text-gray-600">Transparent development and community contributions welcome</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Public Benefit</h3>
                    <p className="text-gray-600">Free access to important transit infrastructure information</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    <span>Data Sources</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Metrolinx Official Data</span>
                      <Badge variant="secondary">Primary</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">GeoJSON Transit Files</span>
                      <Badge variant="secondary">Geographic</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Public APIs</span>
                      <Badge variant="secondary">Real-time</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Github className="w-5 h-5 text-gray-900" />
                    <span>Open Source</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    TransitTrack is built with modern web technologies and is completely open source. Contributions are
                    welcome!
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://github.com/transittrack" target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      View on GitHub
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Start Tracking Transit Progress Today</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Get instant access to comprehensive transit project data and stay informed about the future of
            transportation in the GTA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
              <a href="/app">
                <Play className="w-5 h-5 mr-2" />
                Launch TransitTrack
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
              asChild
            >
              <a href="#features">
                <ChevronDown className="w-5 h-5 mr-2" />
                Learn More
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Train className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">TransitTrack</span>
              </div>
              <p className="text-gray-400">Transparent transit project monitoring for the Greater Toronto Area.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2">
                <a href="#features" className="block text-gray-400 hover:text-white transition-colors">
                  Features
                </a>
                <a href="#projects" className="block text-gray-400 hover:text-white transition-colors">
                  Projects
                </a>
                <a href="/app" className="block text-gray-400 hover:text-white transition-colors">
                  Launch App
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <div className="space-y-2">
                <a href="#about" className="block text-gray-400 hover:text-white transition-colors">
                  About
                </a>
                <a
                  href="https://github.com/transittrack"
                  className="block text-gray-400 hover:text-white transition-colors"
                >
                  GitHub
                </a>
                <a href="/api" className="block text-gray-400 hover:text-white transition-colors">
                  API
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Data Sources</h3>
              <div className="space-y-2">
                <a href="https://metrolinx.com" className="block text-gray-400 hover:text-white transition-colors">
                  Metrolinx
                </a>
                <a href="https://toronto.ca" className="block text-gray-400 hover:text-white transition-colors">
                  City of Toronto
                </a>
                <a href="https://ontario.ca" className="block text-gray-400 hover:text-white transition-colors">
                  Province of Ontario
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 TransitTrack. Open source project for public benefit.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a href="https://github.com/transittrack" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy
              </a>
              <a href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
