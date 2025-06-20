@echo off
echo Adding all files...
git add .

echo Committing changes...
git commit -m "Update image paths to use GitHub raw URLs"

echo Pushing to GitHub...
git push -u origin main

echo Done!
pause