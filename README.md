# Citizen Science Hub Crete

Πλατφόρμα συμμετοχικής επιστήμης για την Κρήτη — React + Vite + Supabase.

## Γρήγορη εκκίνηση

```bash
npm install
npm run dev
```

## Ρύθμιση Supabase (Backend)

1. Δημιουργήστε project στο [supabase.com](https://supabase.com)
2. **Project Settings → API**: αντιγράψτε `Project URL` και `anon public` key
3. Αντιγράψτε `.env.example` → `.env` και συμπληρώστε:
   ```
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. **SQL Editor**: επικολλήστε και τρέξτε όλο το `supabase/schema.sql`
   (δημιουργεί πίνακες, RLS, seed, bucket `observations` + storage policies)
5. Αν η βάση έχει ήδη δημιουργηθεί, τρέξτε με τη σειρά τα migrations που δεν
   έχουν εφαρμοστεί:
   - `002_project_data_types.sql`
   - `003_profile_phone.sql`
   - `004_fix_project_members_rls.sql`
   - `005_security_hardening.sql`
   - `006_public_forms.sql`

   Το `005` είναι απαραίτητο πριν από production χρήση: κλειδώνει τους admin
   ρόλους, τα προσωπικά δεδομένα, τις παρατηρήσεις και τα αρχεία.
   Το `006` ενεργοποιεί τα αιτήματα συνεργασίας φορέων, το newsletter και το
   αντίστοιχο admin inbox.
6. **Authentication → Users → Add user**: δημιουργήστε admin λογαριασμό (email + password)
7. **SQL Editor** — προώθηση σε admin (αλλάξτε το email):
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'you@example.com';
   ```
8. Κάντε restart το Vite (`npm run dev`) ώστε να φορτωθεί το `.env`

### Email επαναφοράς κωδικού

Στο Supabase ανοίξτε **Authentication → URL Configuration** και προσθέστε στα
Redirect URLs:

- `http://localhost:5173/reset-password`
- `https://<το-domain-σας>/reset-password`

Το email αποστέλλεται από το template **Authentication → Email Templates →
Reset Password**. Για production αποστολές συνιστάται η σύνδεση custom SMTP.
Ο σύνδεσμος του Reset Password template πρέπει να χρησιμοποιεί token hash:

```html
<a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=recovery">
  Αλλαγή κωδικού
</a>
```

### Πρόσκληση νέων admins

Η σελίδα **Admin → Χρήστες** χρησιμοποιεί την Edge Function `invite-admin`.
Για να την ενεργοποιήσετε:

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
npx supabase secrets set APP_URL=https://<το-domain-σας>
npx supabase functions deploy invite-admin
```

Το Supabase gateway επαληθεύει το JWT και η function ελέγχει επιπλέον εσωτερικά
τον χρήστη και τον admin ρόλο του πριν
χρησιμοποιήσει το server-side `service_role`. Μην προσθέσετε ποτέ το
`SUPABASE_SERVICE_ROLE_KEY` στο Vite ή στο repository.

**Έλεγχος E2E:** εγγραφή πολίτη → εγγραφή σε Project από το Profile → Collect
(GPS + φωτο) → Admin Observations → Approve → Open Data χάρτης

## Playwright E2E

```bash
cp .env.test.example .env.test.local
npm run test:e2e
```

Χρησιμοποιήστε αποκλειστικά επιβεβαιωμένους test λογαριασμούς. Ο citizen
λογαριασμός πρέπει να έχει `role = 'citizen'` και ο admin `role = 'admin'`.
Χωρίς credentials εκτελούνται τα public/security smoke tests και το πλήρες
citizen/admin flow σημειώνεται ως skipped.

**Σημαντικό:** Με ενεργό Supabase, το admin panel χρειάζεται πραγματικό login με `role=admin` (το demo `admin123` ισχύει μόνο χωρίς `.env`).

**Χωρίς Supabase:** Η εφαρμογή λειτουργεί σε demo mode με localStorage. Admin login: `admin123`

## Λειτουργίες

- Δημόσιες σελίδες (Projects, Νέα, Συμμετοχή, Ανοικτά Δεδομένα)
- Εγγραφή/Σύνδεση πολιτών
- Καταγραφή παρατηρήσεων (GPS + φωτογραφία + dynamic forms)
- Χάρτες Leaflet + export CSV/GeoJSON
- Admin panel (projects, news, προτάσεις, παρατηρήσεις)

## Deploy

Frontend: Vercel (ήδη configured με `vercel.json`)
