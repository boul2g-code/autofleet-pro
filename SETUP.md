# AutoFleet Pro — Οδηγός Εγκατάστασης (Supabase + Vercel)

Ακολουθήστε τα βήματα με τη σειρά. Χρόνος: ~30 λεπτά.

---

## Βήμα 1 — Δημιουργία λογαριασμού Supabase (δωρεάν)

1. Πηγαίνετε στο **https://supabase.com**
2. Κλικ **"Start your project"** → **Sign up** με Google ή email
3. Κλικ **"New project"**
4. Συμπληρώστε:
   - **Name**: `autofleet`
   - **Database Password**: (επιλέξτε έναν δυνατό κωδικό — αποθηκεύστε τον!)
   - **Region**: `EU West (Ireland)` (για Ευρώπη)
5. Κλικ **"Create new project"** — περιμένετε ~2 λεπτά

---

## Βήμα 2 — Εκτέλεση του SQL Schema

1. Στο Supabase dashboard → αριστερά κλικ **"SQL Editor"**
2. Κλικ **"New query"**
3. Ανοίξτε το αρχείο `supabase/schema.sql` από το zip
4. Αντιγράψτε **όλο** το περιεχόμενό του
5. Επικολλήστε στον SQL Editor
6. Κλικ **"Run"** (▶)
7. Πρέπει να δείτε: `Success. No rows returned`

---

## Βήμα 3 — Αντιγραφή των κλειδιών Supabase

1. Αριστερά → **"Project Settings"** (εικονίδιο ⚙️)
2. Κλικ **"API"**
3. Αντιγράψτε:
   - **Project URL** → θα μοιάζει με `https://xxxx.supabase.co`
   - **anon / public key** → μακρύ string που αρχίζει με `eyJ...`

---

## Βήμα 4 — Δημιουργία λογαριασμού GitHub (αν δεν έχετε)

1. Πηγαίνετε στο **https://github.com** → Sign up (δωρεάν)
2. Επιβεβαιώστε το email σας

---

## Βήμα 5 — Ανέβασμα κώδικα στο GitHub

### Αν έχετε Windows — με GitHub Desktop (πιο εύκολο):
1. Κατεβάστε **GitHub Desktop**: https://desktop.github.com
2. Sign in με τον GitHub λογαριασμό σας
3. **File → Add Local Repository** → επιλέξτε τον φάκελο `autofleet-nextjs`
4. Κλικ **"Publish repository"**
5. Name: `autofleet-pro`, κρατήστε **Private** ✓
6. Κλικ **"Publish Repository"**

### Αλλιώς — με Command Line:
```bash
cd autofleet-nextjs
git init
git add .
git commit -m "AutoFleet Pro v2 - Supabase"
# Δημιουργήστε repo στο github.com/new
git remote add origin https://github.com/YOUR_USERNAME/autofleet-pro.git
git push -u origin main
```

---

## Βήμα 6 — Deploy στο Vercel (δωρεάν)

1. Πηγαίνετε στο **https://vercel.com**
2. **Sign up** → επιλέξτε **"Continue with GitHub"**
3. Κλικ **"Add New Project"**
4. Βρείτε το `autofleet-pro` → κλικ **"Import"**
5. **ΣΗΜΑΝΤΙΚΟ** — πριν κάνετε Deploy, ανοίξτε **"Environment Variables"** και βάλτε:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` (από Βήμα 3) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `eyJ...` (από Βήμα 3, το anon/public key) |
| `ANTHROPIC_API_KEY` | `sk-ant-...` (προαιρετικό, για AI εξαγωγή) |

6. Κλικ **"Deploy"**
7. Περιμένετε ~3 λεπτά
8. Vercel σας δίνει URL: `https://autofleet-pro-xxxx.vercel.app` 🎉

---

## Βήμα 7 — Ρύθμιση Email επιβεβαίωσης στο Supabase

1. Supabase → **Authentication → URL Configuration**
2. **Site URL**: βάλτε το Vercel URL σας (π.χ. `https://autofleet-pro.vercel.app`)
3. **Redirect URLs**: προσθέστε `https://autofleet-pro.vercel.app/auth/callback`
4. Κλικ **Save**

---

## Βήμα 8 — Πρώτη σύνδεση

1. Ανοίξτε το Vercel URL στον browser
2. Κλικ **"Εγγραφή"** → βάλτε email + κωδικό
3. Ελέγξτε το email για επιβεβαίωση
4. Συνδεθείτε → είστε μέσα! ✅

---

## Mobile App (iPhone / Android)

Το site λειτουργεί ήδη τέλεια από το τηλέφωνο στον browser.

Για να το προσθέσετε στην αρχική οθόνη σαν app:

**iPhone (Safari):**
1. Ανοίξτε το URL στο Safari
2. Κουμπί Share (□↑) → **"Add to Home Screen"**
3. Όνομα: `AutoFleet` → **Add**

**Android (Chrome):**
1. Ανοίξτε το URL στο Chrome
2. Μενού (⋮) → **"Add to Home screen"**

---

## Τι συμβαίνει τώρα με τα δεδομένα

```
Ανοίγω το app από τηλέφωνο
  ↓
Supabase ελέγχει αν είμαι logged in
  ↓
Κατεβάζει τα δεδομένα μου από cloud
  ↓
Real-time: αν αλλάξω κάτι στον υπολογιστή,
φαίνεται ΑΜΕΣΑ στο τηλέφωνο (και αντίστροφα)
```

---

## Αν κάτι πάει στραβά

| Πρόβλημα | Λύση |
|----------|------|
| "Invalid login credentials" | Ελέγξτε email/password. Επιβεβαιώσατε το email; |
| Λευκή σελίδα | Ελέγξτε στο Vercel → Logs αν υπάρχουν errors |
| Δεν φαίνονται δεδομένα | Σιγουρευτείτε ότι τρέξατε το schema.sql σωστά |
| Το AI δεν δουλεύει | Βάλτε το ANTHROPIC_API_KEY στο Vercel env variables |

---

## Κόστος

| Υπηρεσία | Plan | Κόστος |
|----------|------|--------|
| Vercel | Hobby | **Δωρεάν** |
| Supabase | Free | **Δωρεάν** έως 500MB + 50.000 users |
| Anthropic API | Pay-per-use | ~0.01€ ανά έγγραφο |

Για επαγγελματική χρήση με πολλά δεδομένα:
- Supabase Pro: $25/μήνα
- Vercel Pro: $20/μήνα
