@echo off
echo Adding image files...
git add pictures/*.png pictures/*.jpg pictures/*.jpeg pictures/*.webp -f

echo Committing images...
git commit -m "Add image files"

echo Pushing to GitHub...
git push origin main

echo Done!
pause