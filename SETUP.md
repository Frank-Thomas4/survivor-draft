# Survivor 50 Draft — Setup Guide

## What You're Getting
A web app hosted at a free public URL where all 6 friends can track the Survivor 50 draft standings.

---

## Step 1: Create a GitHub Account

1. Go to **https://github.com** and click **Sign Up**
2. Choose a free username, enter your email and password
3. Verify your email address
4. You're in! (Free plan is all you need)

---

## Step 2: Create a New Repository

A "repository" (repo) is just a folder on GitHub that holds your code.

1. After logging in, click the **+** icon (top right) → **New repository**
2. Name it: `survivor-draft`
3. Make sure **Public** is selected
4. Leave everything else as default
5. Click **Create repository**

---

## Step 3: Upload Your Files

1. On the repo page, click **uploading an existing file** (you'll see this link in the center of the page)
2. You need to upload with the correct folder structure. The easiest way:
   - **Drag and drop** the entire `survivor-draft` folder — GitHub will preserve the structure
   - OR use the GitHub Desktop app (free) if drag/drop doesn't work
3. Scroll down, add a commit message like `"Initial upload"`, click **Commit changes**

---

## Step 4: Create a Vercel Account & Deploy

1. Go to **https://vercel.com** and click **Sign Up**
2. Choose **Continue with GitHub** — this links your accounts automatically
3. You'll be taken to the Vercel dashboard
4. Click **Add New Project** → **Import Git Repository**
5. Find `survivor-draft` and click **Import**
6. Vercel will auto-detect it as a React app — click **Deploy**
7. Wait ~2 minutes for it to build
8. You'll get a URL like `https://survivor-draft-yourname.vercel.app` 🎉

---

## Step 5: Share the Link

Send that URL to Frank, James, Graham, Coley, Robbie, and Adam. Everyone can view it from any device!

---

## Step 6: Admin Setup

- The default admin PIN is **1234**
- To change it: open `src/components/AdminPanel.js`, find line 4 (`const ADMIN_PIN = '1234'`), change it to your PIN, re-upload and redeploy
- Click the **⚙ Admin** button (bottom-right of the site) to access the admin panel

---

## Admin Panel — How To Use

### Edit Cast Names (do this first!)
- Admin → **Edit Cast** tab
- Replace "Survivor 1", "Survivor 2", etc. with the actual contestant names
- Press Tab or click away to save each name

### Assign Draft Picks
- Admin → **Draft Picks** tab
- Click survivor names to assign them to each tribe (max 3 per tribe)
- Orange = assigned to this tribe, strikethrough = taken by another

### Edit Tribe Names & Icons
- Admin → **Tribe Settings** tab
- Update tribe names and upload icon images for each tribe

### Mark Eliminations
- Admin → **Eliminations** tab
- Click **Eliminate** on each survivor as they're voted out
- The app automatically assigns the correct boot number and locks in their points
- Click **Reinstate** if you make a mistake

---

## How Points Work

| Finish | Points |
|--------|--------|
| 1st boot | 1 pt |
| 2nd boot | 2 pts |
| ... | ... |
| Runner-up | 23 pts |
| Winner | 24 pts |

Active survivors show **tentative points (~)** — the points they'd earn if they were the next one out. These update automatically as more people are eliminated.

---

## Updating the Site Later

When you make changes (like marking eliminations), it saves automatically in each viewer's browser. But if you want changes to persist for ALL users after uploading new code:
- Make your edits to the files
- Go to your GitHub repo → drag/drop the updated files
- Vercel will automatically redeploy within ~1 minute

---

## Questions?
Ask Claude! Just paste any error messages you see and I can help troubleshoot.
