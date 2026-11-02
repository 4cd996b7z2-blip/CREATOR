# Rajkot Creators

A free catalog that connects Rajkot businesses with verified local Instagram creators.

- **Creators** register free with their Instagram username, fill their portfolio, prove ownership by sending a one-time code on Instagram, and get listed once you approve them.
- **Businesses** browse creators and prices, press *Send enquiry*, leave a phone number and details. No sign-up.
- **Enquiries** show up on the creator's *Enquiries* page, with Call and WhatsApp buttons. No SMS or alerts.
- **Admin** (`/admin`) is where you approve creators and see every enquiry.

Gujarati and English, Gujarati by default (switch in the header). Built with Next.js 16, Tailwind 4, Supabase (Postgres).

---

## Go live: two services, about 15 minutes

### 1. Supabase (the database)

1. Go to <https://supabase.com> → **New project**. Pick any name, set a database password (save it), and choose region **South Asia (Mumbai)**. Wait for it to finish creating.
2. Left menu → **SQL Editor** → **New query**. Open `supabase/schema.sql` from this repo, copy everything, paste it, press **Run**. It should say *Success*.
3. Left menu → **Project Settings** → **API Keys** (or **API**). Copy two things:
   - **Project URL** (looks like `https://abcdxyz.supabase.co`)
   - the **service_role** key (new projects call it the **secret** key). Keep it private. Never put it in the browser or share it.

### 2. Vercel (the website)

1. Push this repo to GitHub (already done if you are reading this there).
2. Go to <https://vercel.com/new> → **Import** this repository. Leave the framework as **Next.js**.
3. Open **Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `SUPABASE_URL` | the Project URL from step 1.3 |
   | `SUPABASE_SERVICE_ROLE_KEY` | the service_role / secret key from step 1.3 |
   | `ADMIN_PASSWORD` | a long password (12+ characters) for `/admin` |
   | `NEXT_PUBLIC_PLATFORM_IG` | your Instagram handle without `@`. Creators send their code here |
   | `NEXT_PUBLIC_SITE_NAME` | the site name you want shown, e.g. `Rajkot Creators` |

4. Press **Deploy**. When it finishes you have a live `*.vercel.app` link.

If you forget a variable, the site shows a "Setup is not finished" page listing what is missing. Add it under **Settings → Environment Variables** and redeploy.

### 3. First-day checklist

1. Open `/admin`, log in with `ADMIN_PASSWORD`.
2. Register yourself as a creator on the site with a test account, fill the profile, then approve yourself in `/admin` (type a follower count, press **Approve**).
3. Open the catalog on your phone, send yourself an enquiry, and confirm it appears under **Enquiries**. Delete the test creator in `/admin` afterwards.
4. Make sure your Instagram DMs accept messages from people who don't follow you (Message requests are fine, just check them daily).

## How verification works

1. A creator registers and sees a code like `RC-7K4MP` on their dashboard.
2. They send that code to your Instagram account from **their own** account.
3. In `/admin` you check the DM came from the same `@username` and contains the code, type their follower count from their profile, and press **Approve**. They are now public.

Follower counts are set by you, never by the creator.

## Local development

```bash
npm install
cp .env.example .env.local     # fill in, or use the fake-data mode below
USE_MOCK_DB=1 ADMIN_PASSWORD=test-admin npm run dev
```

`USE_MOCK_DB=1` uses an in-memory fake database with demo creators (login `rajkot_foodie` / `demo1234`). It is ignored on Vercel, so it can never run in production.

## Things to know

- **Passwords:** stored with bcrypt. There is no email on file, so a forgotten password is reset by you manually (delete the account and let them re-register, or ask Claude to add a reset command).
- **Spam protection without OTP:** hidden honeypot field, minimum fill time, 5 enquiries per hour per device, phone-number format check, consent tick-box. Add phone OTP later if spam appears.
- **Security model:** the browser never talks to the database. All reads and writes go through the server with the service-role key, and both tables have row-level security on with no public policies.
- **Free-tier limits:** Vercel **Hobby is for non-commercial use only**. Move to Pro before you take money or run ads. Supabase free pauses a project after about a week with no activity (just press *Restore* in the dashboard), so upgrade once real users depend on it.
- **Gujarati copy** is in `src/lib/dict.ts`. Have a native speaker read it before launch. Prices of options, niches and budgets are in `src/lib/constants.ts`.
- **Default language:** Gujarati. Set `NEXT_PUBLIC_DEFAULT_LANG=en` to default to English.

## Project map

```
src/app/                 pages and server actions
  page.tsx               home
  creators/              catalog + creator public page
  inquire/               enquiry form + action (spam checks)
  register, login/       creator account
  dashboard/             overview, profile form, enquiries inbox
  admin/                 verification + all enquiries
src/lib/                 store (Supabase / mock), session, i18n, helpers
supabase/schema.sql      run once in Supabase
```
