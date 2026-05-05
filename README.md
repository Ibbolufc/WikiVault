# WikiVault

WikiVault is a free, self-hosted knowledgebase/wiki app for guides, support docs, community documentation and internal notes.

It was rebuilt to run without Supabase, Bolt Cloud, paid APIs or hosted database services. Your data is stored locally in a persistent JSON database file, making it simple to run on a VPS, dedicated server or home lab.

## Features

- Public knowledgebase homepage
- Public category pages
- Public article pages
- Markdown article editor with live preview
- Draft and published article status
- Article tags, excerpts and featured articles
- Protected admin dashboard
- Article create/edit/delete
- Category create/edit/delete
- Site settings page
- Local search across published articles
- Light/dark mode
- Docker and Docker Compose support
- Persistent data volume for self-hosting

## Default local login

For first local use:

```text
Email: admin@example.com
Password: admin123
```

Change these before exposing the app publicly.

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production build without Docker

```bash
npm install
cp .env.example .env
npm run build
npm start
```

The local database is created automatically on first start. By default it is stored in:

```text
./data/wikivault.json
```

You can change this with:

```bash
WIKIVAULT_DATA_DIR=/path/to/data
```

## Docker install

Create your `.env` file first:

```bash
cp .env.example .env
nano .env
```

Then start WikiVault:

```bash
docker compose up -d --build
```

Open:

```text
http://your-server-ip:3000
```

Docker Compose creates persistent volumes for:

```text
wikivault_data      # local database
wikivault_uploads   # uploaded files if/when uploads are enabled
```

## Docker update

```bash
git pull
docker compose up -d --build
```

## Important production security steps

Before public deployment, edit `.env` and change:

```text
SESSION_SECRET=change-this-long-random-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

Generate a strong session secret:

```bash
openssl rand -base64 32
```

For stronger password storage, use `ADMIN_PASSWORD_HASH` instead of `ADMIN_PASSWORD`.

Generate a scrypt password hash:

```bash
node -e "const crypto=require('crypto');const password='your-new-password';const salt=crypto.randomBytes(16).toString('hex');const hash=crypto.scryptSync(password,salt,64).toString('hex');console.log(`scrypt$${salt}$${hash}`)"
```

Then set this in `.env`:

```text
ADMIN_PASSWORD_HASH=scrypt$your-generated-value
```

Remove or comment out `ADMIN_PASSWORD` after adding the hash.

## Reverse proxy example

You can run WikiVault behind Nginx, Caddy, Cloudflare Tunnel or any normal reverse proxy.

Basic Nginx example:

```nginx
server {
    server_name docs.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then add HTTPS with Certbot or your preferred TLS setup.

## GitHub workflow

Initialise and push as a new repository:

```bash
git init
git add .
git commit -m "Initial WikiVault release"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

Update an existing GitHub repository:

```bash
git status
git add .
git commit -m "Update WikiVault"
git push
```

## What not to commit

The `.gitignore` excludes local secrets, build folders, dependencies and private runtime data:

- `.env`
- `.env.local`
- `node_modules/`
- `.next/`
- local database files in `data/`
- uploaded private files in `public/uploads/`

## Notes

WikiVault is intentionally simple. It uses a local JSON database so it can be hosted almost anywhere without running PostgreSQL, MySQL or Supabase. For very large teams or high-write environments, you may eventually want to add PostgreSQL support, but this version is ideal for a lightweight self-hosted knowledgebase.
