import { test, expect } from "@playwright/test";

test.describe("Full Booking Flow: Search → Results → Details → Confirmation", () => {
  test("completes a flight reservation from home page search through to confirmation e-ticket", async ({
    page,
  }) => {
    // 1. Visit Home Page
    await page.goto("/");
    await expect(page).toHaveTitle(/AeroBook/i);
    await expect(page.getByRole("heading", { name: /fly smarter/i })).toBeVisible();

    // 2. Perform Flight Search (DEL to BOM default)
    const searchButton = page.getByRole("button", { name: /search flights/i });
    await expect(searchButton).toBeVisible();
    await searchButton.click();

    // 3. Results Page
    await page.waitForURL(/\/flights\/DEL-BOM/);
    await expect(page.getByText(/showing/i)).toBeVisible({ timeout: 15000 });

    // Verify at least one flight card is rendered
    const flightCards = page.locator('[data-slot="flight-card"]');
    await expect(flightCards.first()).toBeVisible();

    // Click "Select Flight" on the first offer
    const selectFlightButton = flightCards.first().getByRole("button", { name: /select flight/i });
    await selectFlightButton.click();

    // 4. Offer Details Page
    await page.waitForURL(/\/flights\/DEL-BOM\/offer-/);
    await expect(page.getByRole("heading", { name: /delhi.*to.*mumbai/i })).toBeVisible();
    await expect(page.getByText("Flight Itinerary Timeline")).toBeVisible();
    await expect(page.getByText("Baggage Allowance & Policies")).toBeVisible();
    await expect(page.getByText("Price Breakdown")).toBeVisible();

    // Click "Book This Flight"
    const bookFlightButton = page.getByRole("button", { name: /book this flight/i });
    await bookFlightButton.click();

    // 5. Booking Flow - Step 1: Passenger & Contact Details
    await page.waitForURL(/\/booking/);
    await expect(
      page.getByRole("heading", { name: /passenger & contact information/i })
    ).toBeVisible();

    // Fill passenger details
    await page.getByPlaceholder(/e\.g\. aditya/i).fill("Aditya");
    await page.getByPlaceholder(/e\.g\. mishra/i).fill("Mishra");

    // Fill contact details
    await page.getByPlaceholder(/e\.g\. traveller@example\.com/i).fill("aditya@aerobook.in");
    await page.getByPlaceholder(/9876543210/i).fill("9876543210");

    // Proceed to Step 2
    const proceedToReviewButton = page.getByRole("button", {
      name: /proceed to review booking/i,
    });
    await proceedToReviewButton.click();

    // 6. Booking Flow - Step 2: Review & Mock Payment
    await expect(
      page.getByRole("heading", { name: /review your itinerary & payment/i })
    ).toBeVisible();
    await expect(page.getByText(/aditya mishra/i)).toBeVisible();
    await expect(page.getByText(/aditya@aerobook\.in/i)).toBeVisible();

    // Click "Confirm & Pay"
    const confirmButton = page.getByRole("button", { name: /confirm & pay/i });
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();

    // 7. Booking Confirmation Page
    await page.waitForURL(/\/booking\/confirmation/);
    await expect(
      page.getByRole("heading", { name: /thank you! your flight is booked\./i })
    ).toBeVisible({ timeout: 10000 });

    // Verify booking reference (AB-XXXXXX)
    await expect(page.getByText(/booking id:/i)).toBeVisible();
    await expect(page.getByText(/airline pnr:/i)).toBeVisible();
    await expect(page.getByText(/reservation confirmed • e-ticket issued/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /print e-ticket/i })).toBeVisible();
  });
});
