# Security Checklist - CRITICAL

## IMMEDIATE ACTIONS REQUIRED

### 1. If .env was committed to GitHub - REMOVE IT NOW

Run these commands in your git repository:

```bash
# Remove .env from git tracking (keeps local file)
git rm --cached .env

# Commit the removal
git add .gitignore
git commit -m "Remove .env from tracking"

# Push to GitHub
git push origin main
```

### 2. ROTATE ALL EXPOSED API KEYS

If your .env file was ever committed to GitHub, ALL keys in it are compromised and visible in git history. You MUST rotate them:

**Gemini API Key:**
1. Go to https://aistudio.google.com/app/apikey
2. Delete the old key
3. Create a new key
4. Update your local .env file with the new key

**Supabase Keys:**
1. Go to your Supabase project settings
2. If the anon key was exposed, consider resetting it (though anon keys are meant to be public)
3. NEVER expose service_role key - this one is truly sensitive

**Stripe Keys:**
1. Go to Stripe Dashboard → Developers → API Keys
2. Roll/rotate any exposed keys
3. Update your local .env file

### 3. Clean Git History (if .env was committed)

If .env is in your git history, removing it isn't enough. Use BFG Repo-Cleaner or git-filter-repo:

```bash
# Install BFG
# brew install bfg (Mac) or download from https://rtyley.github.io/bfg-repo-cleaner/

# Clone a fresh copy
git clone --mirror https://github.com/your-username/your-repo.git

# Remove .env from all history
bfg --delete-files .env your-repo.git

# Clean up
cd your-repo.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (WARNING: This rewrites history)
git push --force
```

## NETLIFY CONFIGURATION

Your environment variables should be set in Netlify, NOT in your .env file when deployed.

### How to add environment variables to Netlify:

1. Go to your Netlify site dashboard
2. Click "Site settings"
3. Click "Environment variables" in the sidebar
4. Add these variables:
   - `VITE_GEMINI_API_KEY` → your NEW Gemini API key
   - `VITE_SUPABASE_URL` → your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` → your Supabase anon key
   - `VITE_STRIPE_CHECKOUT_URL` → your Stripe checkout URL
   - `VITE_STRIPE_PORTAL_URL` → your Stripe portal URL

5. Redeploy your site

## VERIFY SECURITY

✅ .env is in .gitignore (CONFIRMED)
✅ .env.example exists with no real values (CREATED)
✅ All code uses import.meta.env.VITE_* (VERIFIED)
✅ No hardcoded API keys in source code (VERIFIED)

⚠️ YOU NEED TO:
- [ ] Remove .env from git if it was committed
- [ ] Rotate all API keys that were exposed
- [ ] Add environment variables to Netlify dashboard
- [ ] Clean git history if .env was in it
- [ ] Never commit .env again

## FILES THAT ARE SAFE TO COMMIT

- .env.example ✅ (template only)
- .gitignore ✅
- All source code files ✅ (they use env vars)

## FILES THAT MUST NEVER BE COMMITTED

- .env ❌ (contains real API keys)
- Any file with actual API keys ❌

## How Environment Variables Work

**Local Development:**
- Create a `.env` file (already done)
- Add your real API keys
- Vite automatically loads these via `import.meta.env.VITE_*`

**Production (Netlify):**
- DO NOT use .env file
- Set variables in Netlify dashboard
- Netlify injects them during build

## Additional Security Tips

1. **Never log API keys** - Check console.log statements
2. **Use VITE_ prefix** - Only VITE_ prefixed vars are exposed to client
3. **Supabase RLS** - Always use Row Level Security policies
4. **Regular audits** - Check GitHub for accidentally committed secrets
