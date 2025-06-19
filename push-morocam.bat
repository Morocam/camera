@echo off
echo Initializing Git repository...
git init

echo Adding all files...
git add .

echo Committing changes...
git commit -m "Initial commit: Camera landing page with admin panel"

echo Setting default branch to main...
git branch -M main

echo Adding remote repository...
git remote add origin https://github.com/yourusername/morocam.git

echo Pushing to GitHub...
git push -u origin main

echo Done!
pause