import { test, expect } from '@playwright/test';

test('public citizen-science pages load from Supabase', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Citizen Science Hub of Crete');
  await expect(page.getByRole('alert')).toHaveCount(0);

  await page.goto('/projects');
  await expect(page.getByRole('heading', { name: /Projects/ })).toBeVisible();
  await expect(page.getByText('Mosquito Watch').first()).toBeVisible();

  await page.goto('/open-data');
  await expect(page.getByRole('heading', { name: /Ανοικτά Δεδομένα|Open Data/ })).toBeVisible();
  await expect(page.getByText(/^\d+ εγκεκριμένες παρατηρήσεις$/)).toBeVisible();
});

test('private data is not exposed through anonymous REST access', async ({ page }) => {
  await page.goto('/');

  const result = await page.evaluate(async ({ url, key }) => {
    const headers = { apikey: key, Authorization: `Bearer ${key}` };

    const [profilesResponse, observationsResponse] = await Promise.all([
      fetch(`${url}/rest/v1/profiles?select=id,email,phone`, { headers }),
      fetch(`${url}/rest/v1/observations?select=id,user_id,data`, { headers }),
    ]);

    return {
      profiles: await profilesResponse.json(),
      observations: await observationsResponse.json(),
    };
  }, {
    url: process.env.VITE_SUPABASE_URL,
    key: process.env.VITE_SUPABASE_ANON_KEY,
  });

  expect(result.profiles).toEqual([]);
  expect(result.observations).toEqual([]);
});

test('password recovery pages are available', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('link', { name: 'Ξεχάσατε τον κωδικό σας;' }).click();
  await expect(page.getByRole('heading', { name: 'Ξεχάσατε τον κωδικό;' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Αποστολή email επαναφοράς' })).toBeVisible();

  await page.goto('/reset-password');
  await expect(page.getByRole('heading', { name: 'Ο σύνδεσμος δεν είναι έγκυρος' })).toBeVisible();
});
