# AMS Life — Setup (free, ~5 minutes)

The app works two ways:

- **Local mode** (zero setup): data stays on the device/browser you use. Great to try instantly.
- **Cloud mode** (recommended): free Supabase database so your phone and laptop stay in sync.

## Run it locally (no setup)

```bash
cd ams-app
npm install
npm run dev
```

Open http://localhost:3000 — login password is in `.env.local` (`AUTH_PASSWORD`, default `ams2026`).

---

## Cloud sync with Supabase (free, recommended)

This is the only "setup" and it's just copy-paste. No credit card.

### 1. Create a free Supabase project
1. Go to [supabase.com](https://supabase.com) → sign in with GitHub
2. Click **New Project**, give it a name, set a database password, pick a region → **Create**
3. Wait ~1 minute for it to provision

### 2. Create the tables (one paste)
1. In your project, open **SQL Editor** (left sidebar)
2. Open the file [`supabase-schema.sql`](./supabase-schema.sql) from this repo, copy everything
3. Paste into the SQL editor → click **Run**

That creates all the tables the app needs.

### 3. Copy your two keys
1. Go to **Project Settings** (gear icon) → **API**
2. Copy the **Project URL** → this is `SUPABASE_URL`
3. Under **Project API keys**, copy the **`service_role`** key → this is `SUPABASE_SERVICE_KEY`
   - (This key is only ever used on the server, never exposed to the browser.)

### 4. Add them to your env
Edit `.env.local`:

```env
AUTH_SECRET=any-long-random-string
AUTH_PASSWORD=your_password
AUTH_USER=Anshul Sahu

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci...your-service-role-key
```

### 5. Seed your data
Restart `npm run dev`, sign in, go to **Settings → Seed / Initialize Data**.
That fills your cloud database with the starter courses, skills, habits, etc.
Then click **Import from Excel** to pull in your existing daily log.

---

## Deploy online for free (Vercel)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. In **Environment Variables**, add the same 5 values from your `.env.local`
4. Click **Deploy**

You'll get a free `https://your-app.vercel.app` URL that works on your phone, synced via Supabase.

> Tip: On your phone, open the URL in Chrome/Safari → "Add to Home Screen" for an app-like icon.
