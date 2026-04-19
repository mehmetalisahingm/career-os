import { test, expect } from "@playwright/test";

test("signup page renders", async ({ page }) => {
  await page.goto("/signup");
  await expect(page.getByRole("heading", { name: "Hesap oluştur" })).toBeVisible();
});

test("login page renders", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Tekrar hoş geldin" })).toBeVisible();
});
