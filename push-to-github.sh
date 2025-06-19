#!/bin/bash

echo "Initializing Git repository..."
git init

echo "Adding all files to Git..."
git add .

echo "Committing changes..."
git commit -m "Initial commit: Camera landing page with admin panel"

echo "Setting up remote repository..."
echo "Please enter your GitHub repository URL (e.g., https://github.com/username/repo.git):"
read repo_url

echo "Adding remote repository..."
git remote add origin $repo_url

echo "Pushing to GitHub..."
git push -u origin master

echo "Done! Your project has been pushed to GitHub."