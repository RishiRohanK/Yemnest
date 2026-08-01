# Update PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Pull changes from GitHub first (merging unrelated histories if it's a new repo with a README)
git pull origin main --allow-unrelated-histories --no-edit

# Now push
git push -u origin main
