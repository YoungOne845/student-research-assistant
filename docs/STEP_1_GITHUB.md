# Step 1: GitHub Setup

This step only places the project into GitHub safely.

## Do this

1. Delete the old repo if you want a clean reset.
2. Create a new empty GitHub repo named `student-research-assistant`.
3. Extract this zip.
4. Open the extracted folder in VS Code.
5. Open terminal and run:

```bash
git init
git status
git add .
git commit -m "Initial Student Research Assistant project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/student-research-assistant.git
git push -u origin main
```

## Confirm

Your GitHub repo should show:

```txt
backend/
frontend/
docker-compose.yml
.env.example
.gitignore
README.md
```

Never push `.env` files.
