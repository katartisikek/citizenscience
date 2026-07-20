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
5. Αν το schema έχει ήδη τρέξει παλιότερα, τρέξτε και το `supabase/migrations/002_project_data_types.sql`
   (στήλη `data_types` ανά project + admin role updates)
6. **Authentication → Users → Add user**: δημιουργήστε admin λογαριασμό (email + password)
7. **SQL Editor** — προώθηση σε admin (αλλάξτε το email):
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'you@example.com';
   ```
8. Κάντε restart το Vite (`npm run dev`) ώστε να φορτωθεί το `.env`

**Έλεγχος E2E:** εγγραφή πολίτη → Projects → Collect (GPS + φωτο) → Admin Observations → Approve → Open Data χάρτης

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
