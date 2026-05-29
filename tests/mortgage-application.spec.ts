/**
 * Playwright E2E Tests for Rabobank Mortgage Application Portal
 * 
 * Test Case: TC-F001 - Verify successful mortgage application submission
 * User Story: RBTES-1130 - Submit Mortgage Application
 * Zephyr Test Case: RBTES-T1615
 * 
 * @author NAVI Automation
 * @date 2026-05-29
 */

import { test, expect, Page } from '@playwright/test';

// Test data constants
const TEST_DATA = {
  baseUrl: process.env.MORTGAGE_PORTAL_URL || 'https://hypotheek.rabobank.nl',
  credentials: {
    username: process.env.TEST_USERNAME || 'test.customer@rabobank.nl',
    password: process.env.TEST_PASSWORD || 'TestPassword123!'
  },
  personalDetails: {
    name: 'Jan de Vries',
    address: 'Kerkstraat 123',
    postalCode: '1012 GH',
    city: 'Amsterdam',
    bsn: '123456789',
    dateOfBirth: '15-03-1985',
    phone: '+31 6 12345678',
    email: 'jan.devries@email.nl'
  },
  incomeDetails: {
    employmentType: 'Employed',
    employer: 'ABN AMRO Bank',
    annualIncome: '75000',
    employmentStartDate: '01-01-2018'
  },
  propertyDetails: {
    address: 'Prinsengracht 456',
    postalCode: '1016 HN',
    city: 'Amsterdam',
    propertyType: 'Apartment',
    propertyValue: '450000',
    purchasePrice: '440000'
  },
  mortgageDetails: {
    requestedAmount: '400000',
    term: '30',
    mortgageType: 'Annuity'
  }
};

// Page Object Model for Mortgage Application
class MortgageApplicationPage {
  constructor(private page: Page) {}

  // Locators
  private loginButton = '[data-testid="login-button"]';
  private usernameInput = '[data-testid="username-input"], #username, input[name="username"]';
  private passwordInput = '[data-testid="password-input"], #password, input[name="password"]';
  private submitLoginButton = '[data-testid="submit-login"], button[type="submit"]';
  
  private newApplicationButton = '[data-testid="new-mortgage-application"], button:has-text("New Mortgage Application"), a:has-text("Nieuwe hypotheekaanvraag")';
  
  // Personal Details Section
  private nameInput = '[data-testid="name-input"], #name, input[name="name"]';
  private addressInput = '[data-testid="address-input"], #address, input[name="address"]';
  private postalCodeInput = '[data-testid="postal-code-input"], #postalCode, input[name="postalCode"]';
  private cityInput = '[data-testid="city-input"], #city, input[name="city"]';
  private bsnInput = '[data-testid="bsn-input"], #bsn, input[name="bsn"]';
  private dobInput = '[data-testid="dob-input"], #dateOfBirth, input[name="dateOfBirth"]';
  private phoneInput = '[data-testid="phone-input"], #phone, input[name="phone"]';
  private emailInput = '[data-testid="email-input"], #email, input[name="email"]';
  
  // Income Section
  private employmentTypeSelect = '[data-testid="employment-type"], #employmentType, select[name="employmentType"]';
  private employerInput = '[data-testid="employer-input"], #employer, input[name="employer"]';
  private annualIncomeInput = '[data-testid="annual-income"], #annualIncome, input[name="annualIncome"]';
  private employmentStartInput = '[data-testid="employment-start"], #employmentStart, input[name="employmentStart"]';
  
  // Property Section
  private propertyAddressInput = '[data-testid="property-address"], #propertyAddress, input[name="propertyAddress"]';
  private propertyPostalCodeInput = '[data-testid="property-postal-code"], #propertyPostalCode, input[name="propertyPostalCode"]';
  private propertyCityInput = '[data-testid="property-city"], #propertyCity, input[name="propertyCity"]';
  private propertyTypeSelect = '[data-testid="property-type"], #propertyType, select[name="propertyType"]';
  private propertyValueInput = '[data-testid="property-value"], #propertyValue, input[name="propertyValue"]';
  private purchasePriceInput = '[data-testid="purchase-price"], #purchasePrice, input[name="purchasePrice"]';
  
  // Mortgage Section
  private mortgageAmountInput = '[data-testid="mortgage-amount"], #mortgageAmount, input[name="mortgageAmount"]';
  private mortgageTermSelect = '[data-testid="mortgage-term"], #mortgageTerm, select[name="mortgageTerm"]';
  private mortgageTypeSelect = '[data-testid="mortgage-type"], #mortgageType, select[name="mortgageType"]';
  
  // Form Actions
  private gdprConsentCheckbox = '[data-testid="gdpr-consent"], #gdprConsent, input[name="gdprConsent"]';
  private privacyPolicyLink = '[data-testid="privacy-policy-link"], a:has-text("Privacy Policy"), a:has-text("Privacybeleid")';
  private submitApplicationButton = '[data-testid="submit-application"], button:has-text("Submit Application"), button:has-text("Aanvraag indienen")';
  private calculateEstimateButton = '[data-testid="calculate-estimate"], button:has-text("Calculate Estimate"), button:has-text("Bereken schatting")';
  
  // Confirmation Elements
  private confirmationMessage = '[data-testid="confirmation-message"], .confirmation-message, .success-message';
  private referenceNumber = '[data-testid="reference-number"], .reference-number, [data-reference]';
  private applicationStatus = '[data-testid="application-status"], .application-status';
  
  // Validation Elements
  private errorMessages = '.error-message, .field-error, [data-testid*="error"]';
  private fieldError = (fieldName: string) => `[data-testid="${fieldName}-error"], #${fieldName}-error, .field-error[data-field="${fieldName}"]`;

  // Actions
  async navigateToPortal() {
    await this.page.goto(TEST_DATA.baseUrl);
    await this.page.waitForLoadState('networkidle');
  }

  async login(username: string, password: string) {
    await this.page.click(this.loginButton);
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.submitLoginButton);
    await this.page.waitForLoadState('networkidle');
  }

  async startNewApplication() {
    await this.page.click(this.newApplicationButton);
    await this.page.waitForLoadState('networkidle');
  }

  async fillPersonalDetails(details: typeof TEST_DATA.personalDetails) {
    await this.page.fill(this.nameInput, details.name);
    await this.page.fill(this.addressInput, details.address);
    await this.page.fill(this.postalCodeInput, details.postalCode);
    await this.page.fill(this.cityInput, details.city);
    await this.page.fill(this.bsnInput, details.bsn);
    await this.page.fill(this.dobInput, details.dateOfBirth);
    await this.page.fill(this.phoneInput, details.phone);
    await this.page.fill(this.emailInput, details.email);
  }

  async fillIncomeDetails(details: typeof TEST_DATA.incomeDetails) {
    await this.page.selectOption(this.employmentTypeSelect, details.employmentType);
    await this.page.fill(this.employerInput, details.employer);
    await this.page.fill(this.annualIncomeInput, details.annualIncome);
    await this.page.fill(this.employmentStartInput, details.employmentStartDate);
  }

  async fillPropertyDetails(details: typeof TEST_DATA.propertyDetails) {
    await this.page.fill(this.propertyAddressInput, details.address);
    await this.page.fill(this.propertyPostalCodeInput, details.postalCode);
    await this.page.fill(this.propertyCityInput, details.city);
    await this.page.selectOption(this.propertyTypeSelect, details.propertyType);
    await this.page.fill(this.propertyValueInput, details.propertyValue);
    await this.page.fill(this.purchasePriceInput, details.purchasePrice);
  }

  async fillMortgageDetails(details: typeof TEST_DATA.mortgageDetails) {
    await this.page.fill(this.mortgageAmountInput, details.requestedAmount);
    await this.page.selectOption(this.mortgageTermSelect, details.term);
    await this.page.selectOption(this.mortgageTypeSelect, details.mortgageType);
  }

  async clickCalculateEstimate() {
    await this.page.click(this.calculateEstimateButton);
    await this.page.waitForLoadState('networkidle');
  }

  async acceptGdprConsent() {
    await this.page.check(this.gdprConsentCheckbox);
  }

  async verifyPrivacyPolicyLink() {
    await expect(this.page.locator(this.privacyPolicyLink)).toBeVisible();
  }

  async submitApplication() {
    await this.page.click(this.submitApplicationButton);
    await this.page.waitForLoadState('networkidle');
  }

  async getConfirmationMessage() {
    return this.page.locator(this.confirmationMessage);
  }

  async getReferenceNumber() {
    const refElement = this.page.locator(this.referenceNumber);
    await expect(refElement).toBeVisible();
    return refElement.textContent();
  }

  async getApplicationStatus() {
    return this.page.locator(this.applicationStatus).textContent();
  }

  async hasValidationErrors() {
    return this.page.locator(this.errorMessages).count();
  }

  async getFieldError(fieldName: string) {
    return this.page.locator(this.fieldError(fieldName)).textContent();
  }
}

// Test Suite
test.describe('Rabobank Mortgage Application - Submit Application (TC-F001)', () => {
  let mortgagePage: MortgageApplicationPage;

  test.beforeEach(async ({ page }) => {
    mortgagePage = new MortgageApplicationPage(page);
    await mortgagePage.navigateToPortal();
  });

  /**
   * TC-F001: Verify successful mortgage application submission
   * Covers: AC-1.1 - Successful application submission
   */
  test('TC-F001: Should successfully submit a complete mortgage application', async ({ page }) => {
    // Step 1: Login with valid credentials
    await test.step('Login with valid customer credentials', async () => {
      await mortgagePage.login(TEST_DATA.credentials.username, TEST_DATA.credentials.password);
      await expect(page).not.toHaveURL(/login/);
    });

    // Step 2: Start new application
    await test.step('Start new mortgage application', async () => {
      await mortgagePage.startNewApplication();
    });

    // Step 3: Fill Personal Details
    await test.step('Fill in Personal Details section', async () => {
      await mortgagePage.fillPersonalDetails(TEST_DATA.personalDetails);
    });

    // Step 4: Fill Income Information
    await test.step('Fill in Income Information section', async () => {
      await mortgagePage.fillIncomeDetails(TEST_DATA.incomeDetails);
    });

    // Step 5: Fill Property Details
    await test.step('Fill in Property Details section', async () => {
      await mortgagePage.fillPropertyDetails(TEST_DATA.propertyDetails);
    });

    // Step 6: Fill Mortgage Details
    await test.step('Fill in Mortgage Details section', async () => {
      await mortgagePage.fillMortgageDetails(TEST_DATA.mortgageDetails);
    });

    // Step 7: Verify GDPR consent elements
    await test.step('Verify GDPR consent and privacy policy', async () => {
      await mortgagePage.verifyPrivacyPolicyLink();
      await mortgagePage.acceptGdprConsent();
    });

    // Step 8: Submit application
    await test.step('Submit the mortgage application', async () => {
      await mortgagePage.submitApplication();
    });

    // Step 9: Verify confirmation
    await test.step('Verify confirmation message and reference number', async () => {
      const confirmationMessage = await mortgagePage.getConfirmationMessage();
      await expect(confirmationMessage).toBeVisible();
      
      const referenceNumber = await mortgagePage.getReferenceNumber();
      expect(referenceNumber).toMatch(/^MRT-\d{8}-\d{5}$/);
      
      const status = await mortgagePage.getApplicationStatus();
      expect(status).toContain('Submitted');
    });
  });

  /**
   * TC-F003: Verify mortgage calculation preview
   * Covers: AC-1.3 - Mortgage calculation preview
   */
  test('TC-F003: Should display accurate mortgage calculation preview', async ({ page }) => {
    await mortgagePage.login(TEST_DATA.credentials.username, TEST_DATA.credentials.password);
    await mortgagePage.startNewApplication();
    
    // Fill property and mortgage details for calculation
    await mortgagePage.fillPropertyDetails(TEST_DATA.propertyDetails);
    await mortgagePage.fillMortgageDetails(TEST_DATA.mortgageDetails);
    
    await mortgagePage.clickCalculateEstimate();
    
    // Verify calculation results are displayed
    await expect(page.locator('[data-testid="monthly-payment"], .monthly-payment')).toBeVisible();
    await expect(page.locator('[data-testid="interest-rate"], .interest-rate')).toBeVisible();
    await expect(page.locator('[data-testid="total-repayment"], .total-repayment')).toBeVisible();
  });

  /**
   * TC-F004: Verify validation of required fields
   * Covers: AC-1.4 - Validation of required fields
   */
  test('TC-F004: Should prevent submission with missing required fields', async ({ page }) => {
    await mortgagePage.login(TEST_DATA.credentials.username, TEST_DATA.credentials.password);
    await mortgagePage.startNewApplication();
    
    // Try to submit without filling any fields
    await mortgagePage.submitApplication();
    
    // Verify validation errors are shown
    const errorCount = await mortgagePage.hasValidationErrors();
    expect(errorCount).toBeGreaterThan(0);
    
    // Verify specific field errors with red borders
    await expect(page.locator('input:invalid, .field-error, .border-red-500')).toHaveCount({ minimum: 1 });
  });

  /**
   * TC-F005: Verify dynamic income fields based on employment type
   * Covers: AC-1.5 - Income verification requirements
   */
  test('TC-F005: Should display dynamic income fields based on employment type', async ({ page }) => {
    await mortgagePage.login(TEST_DATA.credentials.username, TEST_DATA.credentials.password);
    await mortgagePage.startNewApplication();
    
    const employmentTypeSelect = '[data-testid="employment-type"], #employmentType';
    
    // Test for "Employed" type
    await page.selectOption(employmentTypeSelect, 'Employed');
    await expect(page.locator('[data-testid="employer-input"], #employer')).toBeVisible();
    await expect(page.locator('[data-testid="salary-slip-upload"], .salary-slip-section')).toBeVisible();
    
    // Test for "Self-employed" type
    await page.selectOption(employmentTypeSelect, 'Self-employed');
    await expect(page.locator('[data-testid="business-name-input"], #businessName')).toBeVisible();
    await expect(page.locator('[data-testid="tax-returns-upload"], .tax-returns-section')).toBeVisible();
    
    // Test for "Retired" type
    await page.selectOption(employmentTypeSelect, 'Retired');
    await expect(page.locator('[data-testid="pension-income-input"], #pensionIncome')).toBeVisible();
    await expect(page.locator('[data-testid="pension-statement-upload"], .pension-section')).toBeVisible();
  });

  /**
   * TC-E001: Verify LTV ratio warning
   * Edge Case: Mortgage amount exceeding 100% of property value
   */
  test('TC-E001: Should display LTV warning for excessive mortgage amount', async ({ page }) => {
    await mortgagePage.login(TEST_DATA.credentials.username, TEST_DATA.credentials.password);
    await mortgagePage.startNewApplication();
    
    // Fill property with value lower than mortgage amount
    await page.fill('[data-testid="property-value"], #propertyValue', '300000');
    await page.fill('[data-testid="mortgage-amount"], #mortgageAmount', '350000'); // >100% LTV
    
    // Trigger validation
    await page.click('[data-testid="mortgage-amount"], #mortgageAmount');
    await page.keyboard.press('Tab');
    
    // Verify LTV warning is displayed
    await expect(page.locator('[data-testid="ltv-warning"], .ltv-warning')).toBeVisible();
    await expect(page.locator('[data-testid="ltv-warning"], .ltv-warning')).toContainText(/LTV|loan.*value/i);
  });

  /**
   * TC-E002: Verify property outside Netherlands handling
   * Edge Case: Property located outside the Netherlands
   */
  test('TC-E002: Should reject property outside Netherlands', async ({ page }) => {
    await mortgagePage.login(TEST_DATA.credentials.username, TEST_DATA.credentials.password);
    await mortgagePage.startNewApplication();
    
    // Fill property with non-Dutch address
    await page.fill('[data-testid="property-address"], #propertyAddress', '123 Baker Street');
    await page.fill('[data-testid="property-postal-code"], #propertyPostalCode', 'W1U 6TY');
    await page.fill('[data-testid="property-city"], #propertyCity', 'London');
    await page.selectOption('[data-testid="property-country"], #propertyCountry', 'United Kingdom');
    
    // Verify ineligibility message
    await expect(page.locator('[data-testid="geo-restriction-message"], .geo-error')).toBeVisible();
    await expect(page.locator('[data-testid="geo-restriction-message"], .geo-error')).toContainText(/not eligible|Netherlands|Nederland/i);
  });

  /**
   * TC-E003: Verify age eligibility restriction
   * Edge Case: User under 18 years old
   */
  test('TC-E003: Should prevent submission for users under 18', async ({ page }) => {
    await mortgagePage.login(TEST_DATA.credentials.username, TEST_DATA.credentials.password);
    await mortgagePage.startNewApplication();
    
    // Calculate date that makes user under 18
    const today = new Date();
    const underageDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
    const dobString = underageDate.toLocaleDateString('nl-NL', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
    await page.fill('[data-testid="dob-input"], #dateOfBirth', dobString);
    await page.keyboard.press('Tab');
    
    // Verify age restriction message
    await expect(page.locator('[data-testid="age-restriction-message"], .age-error')).toBeVisible();
    await expect(page.locator('[data-testid="age-restriction-message"], .age-error')).toContainText(/18|leeftijd|age/i);
  });
});

// Accessibility Tests
test.describe('Accessibility Tests - Mortgage Application', () => {
  test('Should meet WCAG 2.1 AA accessibility standards', async ({ page }) => {
    const mortgagePage = new MortgageApplicationPage(page);
    await mortgagePage.navigateToPortal();
    
    // Check for basic accessibility requirements
    await expect(page.locator('html')).toHaveAttribute('lang', /nl|en/);
    
    // Check all images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    for (let i = 0; i < imageCount; i++) {
      await expect(images.nth(i)).toHaveAttribute('alt');
    }
    
    // Check form labels are associated with inputs
    const inputs = page.locator('input:not([type="hidden"]), select, textarea');
    const inputCount = await inputs.count();
    for (let i = 0; i < inputCount; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeAttached();
      }
    }
  });
});

// Performance Tests
test.describe('Performance Tests - Mortgage Application', () => {
  test('Should load mortgage application form within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    const mortgagePage = new MortgageApplicationPage(page);
    await mortgagePage.navigateToPortal();
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(3000);
  });

  test('Should complete form submission within 3 seconds', async ({ page }) => {
    const mortgagePage = new MortgageApplicationPage(page);
    await mortgagePage.navigateToPortal();
    await mortgagePage.login(TEST_DATA.credentials.username, TEST_DATA.credentials.password);
    await mortgagePage.startNewApplication();
    
    // Fill all required fields
    await mortgagePage.fillPersonalDetails(TEST_DATA.personalDetails);
    await mortgagePage.fillIncomeDetails(TEST_DATA.incomeDetails);
    await mortgagePage.fillPropertyDetails(TEST_DATA.propertyDetails);
    await mortgagePage.fillMortgageDetails(TEST_DATA.mortgageDetails);
    await mortgagePage.acceptGdprConsent();
    
    // Measure submission time
    const startTime = Date.now();
    await mortgagePage.submitApplication();
    const submissionTime = Date.now() - startTime;
    
    expect(submissionTime).toBeLessThan(3000);
  });
});
