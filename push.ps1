# Update PATH to ensure git is found after installation
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Initialize and Push
git init
git add .
git commit -m "Update collections layout with carousel and add Diwali theme"
git branch -M main
git remote add origin https://github.com/RishiRohanK/Yemnest.git
git push -u origin main
