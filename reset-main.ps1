# Git Main Branch Reset Script for TransitTrack
# This script cleans the local main branch and force-pushes it to remote main,
# effectively resetting the remote main to contain only essential files (like README.md).
# ASSUMES YOU ARE ALREADY ON THE 'MAIN' BRANCH LOCALLY WHEN RUNNING.

Write-Host "⚠️ Starting Git Main Branch Reset for TransitTrack..."
Write-Host "This script will FORCE PUSH to 'origin/main'. Use with EXTREME CAUTION!"
Write-Host "Press any key to continue, or Ctrl+C to abort."
$Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyUp") | Out-Null # Wait for user input

# Set the current directory (good as a safeguard even if assumed already there)
$script:CurrentPath = "C:\Users\jamme\Documents\git\TransitTrack"
if (Test-Path $script:CurrentPath) {
    Set-Location $script:CurrentPath
    Write-Host "Navigated to: $($script:CurrentPath)"
} else {
    Write-Error "The specified path does not exist: $($script:CurrentPath). Please ensure the repository is cloned."
    exit 1
}

# 1. Check current branch (just for verification, not switching)
Write-Host "📋 Verifying current local branch:"
$currentBranch = git rev-parse --abbrev-ref HEAD
if ($currentBranch -ne "main") {
    Write-Error "You are currently on branch '$currentBranch'. This script is intended to run while on the 'main' branch. Aborting."
    exit 1
}
Write-Host "Confirmed: You are on the 'main' branch locally."


# 2. Reset local main to a clean state (only essential files)
Write-Host "🧹 Cleaning local 'main' branch..."
# Remove all tracked files from the index
git rm -r --cached .
# Remove untracked files and directories from the working tree
git clean -fd
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to clean local 'main' branch. Aborting."
    exit 1
}


# 3. Add back only essential files (the README.md)
Write-Host "📁 Adding clean README.md back to main..."

# Create clean README for main branch using Add-Content
# Set-Content overwrites, Add-Content appends
Set-Content -Path "README.md" "# TransitTrack"
Add-Content -Path "README.md" "" # Empty line
Add-Content -Path "README.md" "A modern web application for visualizing Greater Toronto Area (GTA) transit infrastructure projects with real-time construction progress tracking."
Add-Content -Path "README.md" "" # Empty line
Add-Content -Path "README.md" "## Quick Start"
Add-Content -Path "README.md" "" # Empty line
Add-Content -Path "README.md" '```bash'
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
Add-Content -Path "README.md" '```'

# 4. Stage and commit the new README.md
Write-Host "💾 Staging and committing new README.md for main branch..."
git add README.md
git commit -m "docs: Reset main branch to clean README"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to commit README.md. Aborting."
    exit 1
}

# 5. Force push the cleaned local main branch to remote
Write-Host "⬆️ Force pushing cleaned 'main' branch to 'origin/main'..."
git push --force origin main
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to force push 'main' branch. Please check Git authentication and network."
    exit 1
}

# --- Verification Step ---
Write-Host "🌲 Listing remote 'origin' branches to confirm 'main' state:"
git branch -r