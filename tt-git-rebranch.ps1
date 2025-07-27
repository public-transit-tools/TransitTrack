# Git Repository Setup for TransitTrack
# This script sets up proper Git workflow with dev, preview, and clean main branches

Write-Host "🚀 Setting up TransitTrack Git repository structure..."

# Set the current directory
$script:CurrentPath = "C:\Users\jamme\Documents\git\TransitTrack"
if (Test-Path $script:CurrentPath) {
    Set-Location $script:CurrentPath
    Write-Host "Navigated to: $($script:CurrentPath)"
} else {
    Write-Error "The specified path does not exist: $($script:CurrentPath). Please ensure the repository is cloned."
    exit 1
}

# 1. Check current status
Write-Host "📋 Current Git status:"
git status

# 2. Stage all current work
Write-Host "📦 Staging all current work..."
git add .

# 3. Commit current work with descriptive message
Write-Host "💾 Committing current TransitTrack development..."
git commit -m "feat: Complete TransitTrack implementation

- Add Supabase integration with real-time updates
- Implement GeoJSON-based transit line rendering
- Create responsive map with OpenStreetMap tiles
- Add collapsible sidebars with project details
- Include fallback system (Supabase → GeoJSON → Mock)
- Add environment configuration and validation
- Implement CRUD operations for transit projects
- Add connection status monitoring and error handling"

# 4. Create and switch to dev branch
Write-Host "🌿 Creating and switching to dev branch..."
git checkout -b dev

# 5. Push dev branch to remote
Write-Host "⬆️ Pushing dev branch to remote..."
git push -u origin dev

# 6. Create preview branch from dev
Write-Host "🔍 Creating preview branch from dev..."
git checkout -b preview

# 7. Push preview branch to remote
Write-Host "⬆️ Pushing preview branch to remote..."
git push -u origin preview

# 8. Switch back to main branch
Write-Host "🏠 Switching back to main branch..."
git checkout main

# 9. Reset main to clean state (keep only essential files)
Write-Host "🧹 Cleaning main branch..."

# Create a clean main branch with only essential files
git rm -r --cached .
git clean -fd

# Add back only essential files
Write-Host "📁 Adding essential files back to main..."

# Create clean README for main branch using Add-Content
# Set-Content overwrites, Add-Content appends
Set-Content -Path "README.md" "# TransitTrack"
Add-Content -Path "README.md" "" # Empty line
Add-Content -Path "README.md" "A modern web application for visualizing Greater Toronto Area (GTA) transit infrastructure projects with real-time construction progress tracking."
Add-Content -Path "README.md" "" # Empty line
Add-Content -Path "README.md" "## 🚀 Quick Start"
Add-Content -Path "README.md" "" # Empty line
Add-Content -Path "README.md" '```bash' # Changed to single quotes here!
Add-Content -Path "README.md" "# Clone the repository"
Add-Content -Path "README.md" "git clone <repository-url>"
Add-Content -Path "README.md" "cd transittrack"
Add-Content -Path "README.md" "" # Empty line
Add-Content -Path "README.md" "# Switch to development branch"
Add-Content -Path "README.md" "git checkout dev"
Add-Content -Path "README.md" "" # Empty line
Add-Content -Path "README.md" "# Install dependencies"
Add-Content -Path "README.md" "npm install"
Add-Content -Path "README.md" "" # Empty line
Add-Content -Path "README.md" "# Set up environment variables"
Add-Content -Path "README.md" "cp .env.example .env.local"
Add-Content -Path "README.md" "# Edit .env.local with your Supabase credentials"
Add-Content -Path "README.md" "" # Empty line
Add-Content -Path "README.md" "# Start development server"
Add-Content -Path "README.md" "npm run dev"
Add-Content -Path "README.md" '```' # Changed to single quotes here!

Write-Host "✅ Git repository setup complete!"