[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on_Vercel-000?style=for-the-badge&logo=vercel)](https://v0-transit-track-project-sgreenwood-rempathcoms-projects.vercel.app/)
[![GitHub stars](https://img.shields.io/github/stars/public-transit-tools/TransitTrack?style=for-the-badge)](https://github.com/public-transit-tools/TransitTrack/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/public-transit-tools/TransitTrack?style=for-the-badge)](https://github.com/public-transit-tools/TransitTrack/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://github.com/public-transit-tools/TransitTrack/blob/dev/LICENSE)

# TransitTrack - GTA Transit Infrastructure Visualization

A modern web application for visualizing Greater Toronto Area (GTA) transit infrastructure projects with real-time construction progress tracking.

🚀 Features

*   **Interactive Map**: Custom-built map with OpenStreetMap tiles
*   **Real-time Data**: GeoJSON-based project data with Supabase integration
*   **Project Tracking**: Construction progress visualization with status indicators
*   **Responsive Design**: Collapsible sidebars that adapt to different screen sizes
*   **Multiple Data Sources**: Supports GeoJSON files, Supabase database, and mock data

🛠️ Tech Stack

*   **Frontend**: Next.js 14, React 19, TypeScript
*   **Styling**: Tailwind CSS, shadcn/ui components
*   **Database**: Supabase (PostgreSQL)
*   **Maps**: Custom SVG-based map with OpenStreetMap tiles
*   **Data**: GeoJSON format for geographic data

📋 Prerequisites

*   Node.js 18+
*   npm or yarn
*   Supabase account (optional - app works with mock data)

🔧 Installation

1.  Clone the repository

    ```bash
    git clone https://github.com/public-transit-tools/TransitTrack.git
    cd TransitTrack
    ```

2.  Install dependencies

    ```bash
    npm install
    ```

3.  Set up environment variables

    ```bash
    cp .env.example .env.local
    ```

4.  Configure Supabase (Optional)
    *   Sign up at [supabase.com](https://supabase.com/)
    *   Create a new project
    *   Copy your project URL and anon key to .env.local
    *   Run the SQL script in scripts/create-supabase-tables.sql
5.  Start the development server

    ```bash
    npm run dev
    ```

6.  Open your browser
    Navigate to [http://localhost:3000](http://localhost:3000/)

🗄️ Database Setup

If using Supabase, run the SQL script to create the required tables:

```sql
-- Run this in your Supabase SQL editor
-- File: scripts/create-supabase-tables.sql
```

📁 Project Structure

```
├── app/ # Next.js app directory
│ ├── globals.css # Global styles
│ └── page.tsx # Main application page
├── components/ # React components
│ └── ui/ # shadcn/ui components
├── lib/ # Utility libraries
│ └── supabase.ts # Database configuration
├── public/ # Static assets
│ └── geojson/ # GeoJSON data files
├── scripts/ # Database scripts
└── .env.example # Environment variables template
```

🌍 Environment Variables

| Variable | Description | Required |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | No* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | No* |
| `NEXT_PUBLIC_APP_URL` | Application URL | No |

*App works with mock data if Supabase is not configured

📊 Data Sources

The application supports multiple data sources in order of priority:
1.  GeoJSON Files (Primary) - Located in /public/geojson/
2.  Supabase Database (Secondary) - PostgreSQL with real-time updates
3.  Mock Data (Fallback) - Hardcoded sample data

🗺️ GeoJSON Format

Transit projects should follow this GeoJSON structure:

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": 1,
        "name": "Project Name",
        "status": "In Progress",
        "progressPercentage": 65,
        "budgetTotal": "$4.6B",
        "estimatedCompletion": "2024",
        "projectType": "LRT",
        "length": "18 km",
        "stations": 18,
        "description": "Project description..."
      },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-79.6400, 43.5500],
          [-79.6350, 43.5700]
        ]
      }
    }
  ]
}
```

🚀 Deployment

Vercel (Recommended)

1.  Push your code to GitHub
2.  Connect your repository to Vercel
3.  Add environment variables in Vercel dashboard
4.  Deploy automatically

Other Platforms

The app can be deployed to any platform that supports Next.js:
*   Netlify
*   Railway
*   DigitalOcean App Platform
*   AWS Amplify

🤝 Contributing

1.  Fork the repository
2.  Create a feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

📝 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/public-transit-tools/TransitTrack/blob/dev/LICENSE) file for details.

🙏 Acknowledgments

*   [Metrolinx](https://metrolinx.com/) for transit project data
*   [OpenStreetMap](https://openstreetmap.org/) for map tiles
*   [shadcn/ui](https://ui.shadcn.com/) for UI components
*   [Supabase](https://supabase.com/) for database services

📞 Support

For support, please open an issue on GitHub or contact the development team.