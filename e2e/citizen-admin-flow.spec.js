import { test, expect } from '@playwright/test';

const citizenEmail = process.env.E2E_CITIZEN_EMAIL;
const citizenPassword = process.env.E2E_CITIZEN_PASSWORD;
const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const credentialsAvailable = Boolean(
  citizenEmail && citizenPassword && adminEmail && adminPassword
);

test('citizen submission is approved by admin and reaches Open Data', async ({ page }) => {
  test.skip(!credentialsAvailable, 'Add E2E citizen/admin credentials to .env.test.local');

  const marker = `E2E observation ${Date.now()}`;

  await page.goto('/login');
  await page.getByLabel('Email').fill(citizenEmail);
  await page.getByLabel('Κωδικός').fill(citizenPassword);
  await page.getByRole('button', { name: 'Σύνδεση', exact: true }).click();
  await expect(page).toHaveURL(/\/profile$/);
  await expect(page.getByText('Τα Projects μου')).toBeVisible();

  let collectLink = page.locator('[data-testid^="my-project-"] a[href$="/collect"]').first();
  if (await collectLink.count() === 0) {
    await page.getByRole('button', { name: 'Εγγραφή σε Project', exact: true }).click();
    let availableProject = page.locator('[data-testid^="available-project-"]').filter({
      hasText: 'Mosquito Watch',
    });
    if (await availableProject.count() === 0) {
      availableProject = page.locator('[data-testid^="available-project-"]').first();
    }
    await availableProject.getByRole('button', { name: 'Εγγραφή', exact: true }).click();
    collectLink = page.locator('[data-testid^="my-project-"] a[href$="/collect"]').first();
  }

  await expect(collectLink).toBeVisible();
  await collectLink.click();
  await expect(page).toHaveURL(/\/projects\/\d+\/collect$/);
  await expect(page.getByText(/35\.33870, 25\.14420/)).toBeVisible();

  const observationDescription = page.getByPlaceholder('Τι παρατηρήσατε;');
  if (await observationDescription.count()) {
    await observationDescription.fill(marker);
  }

  const photoInput = page.locator('input[type="file"][accept="image/*"]');
  if (await photoInput.count()) {
    await photoInput.setInputFiles({
      name: 'e2e-observation.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Z4n8AAAAASUVORK5CYII=',
        'base64'
      ),
    });
  }

  const consent = page.getByLabel(/Συναινώ στη συλλογή/);
  if (await consent.count()) await consent.check();

  await page.getByRole('button', { name: 'Υποβολή Παρατήρησης' }).click();
  await expect(page.getByRole('heading', { name: 'Η παρατήρηση υποβλήθηκε!' })).toBeVisible({
    timeout: 30_000,
  });

  await page.goto('/profile');
  await page.getByRole('button', { name: 'Αποσύνδεση' }).click();

  await page.goto('/admin/login');
  await page.getByLabel('Email Admin').fill(adminEmail);
  await page.getByLabel('Κωδικός Πρόσβασης').fill(adminPassword);
  await page.getByRole('button', { name: 'Σύνδεση', exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);

  await page.goto('/admin/observations');
  const observationRow = page.locator('tr').filter({ hasText: marker });
  await expect(observationRow).toBeVisible({ timeout: 20_000 });
  await observationRow.getByRole('button', { name: /Έγκριση παρατήρησης/ }).click();
  await expect(observationRow).toContainText('Εγκεκριμένη');

  await page.getByRole('button', { name: 'Αποσύνδεση' }).click();
  await page.goto('/open-data');
  await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText(/^[1-9]\d* εγκεκριμένες παρατηρήσεις$/)).toBeVisible();
});
