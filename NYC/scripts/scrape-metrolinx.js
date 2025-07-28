// Web scraper for Metrolinx project data
import { JSDOM } from "jsdom"

async function scrapeMetrolinxProjects() {
  try {
    console.log("Scraping Metrolinx project data...")

    const response = await fetch("https://metrolinx.com/en/projects-and-programs")
    const html = await response.text()

    const dom = new JSDOM(html)
    const document = dom.window.document

    const projects = []

    // Look for project cards or sections
    const projectElements = document.querySelectorAll(".project-card, .project-item, [data-project]")

    projectElements.forEach((element, index) => {
      const titleElement = element.querySelector("h2, h3, .project-title, .title")
      const descriptionElement = element.querySelector("p, .description, .project-description")
      const statusElement = element.querySelector(".status, .project-status")

      if (titleElement) {
        const project = {
          id: index + 1,
          name: titleElement.textContent?.trim() || `Project ${index + 1}`,
          description: descriptionElement?.textContent?.trim() || "Project description not available",
          status: statusElement?.textContent?.trim() || "In Progress",
          source: "metrolinx.com",
        }

        projects.push(project)
      }
    })

    console.log(`Found ${projects.length} projects:`)
    projects.forEach((project) => {
      console.log(`- ${project.name}: ${project.status}`)
    })

    return projects
  } catch (error) {
    console.error("Error scraping Metrolinx data:", error)

    // Return fallback data based on known Metrolinx projects
    return [
      {
        id: 1,
        name: "Ontario Line",
        description:
          "The Ontario Line will be a 15.6-kilometre subway line that will make it faster and easier to travel across the city.",
        status: "In Progress",
        source: "fallback",
      },
      {
        id: 2,
        name: "Hazel McCallion LRT",
        description: "The new transit system will feature 18 stops, travel through two urban growth centres.",
        status: "In Progress",
        source: "fallback",
      },
      {
        id: 3,
        name: "Eglinton Crosstown LRT",
        description: "The Eglinton Crosstown LRT is a 19-kilometre light rail transit line.",
        status: "Delayed",
        source: "fallback",
      },
    ]
  }
}

// Execute the scraper
scrapeMetrolinxProjects()
