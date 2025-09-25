// Configuration file for Kapparot Online Next.js app
// Environment variables are loaded from .env.local file

export const config = {
  // Google Sheets API Configuration
  googleSheets: {
    apiKey: process.env.GOOGLE_SHEETS_API_KEY || '',
    sheetId: process.env.GOOGLE_SHEETS_SHEET_ID || '',
    sheetName: process.env.GOOGLE_SHEETS_SHEET_NAME || 'Donations',
    get apiUrl() {
      return `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${this.sheetName}:append?valueInputOption=RAW&key=${this.apiKey}`;
    }
  },

  // Payment URLs
  payments: {
    stripeUrl: process.env.NEXT_PUBLIC_STRIPE_DONATION_URL || '',
    matbiaUrl: process.env.NEXT_PUBLIC_MATBIA_URL || '',
    ojcUrl: process.env.NEXT_PUBLIC_OJC_URL || '',
  },

  // Contact Information
  contactEmail: process.env.CONTACT_EMAIL || 'yishuveypushka@gmail.com',

  // App Configuration
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Kapparot Online',
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Digital Tzedakah for Atonement',
  }
};

// Validation function to check if required environment variables are set
export const validateConfig = () => {
  const required = [
    'GOOGLE_SHEETS_API_KEY',
    'GOOGLE_SHEETS_SHEET_ID',
    'NEXT_PUBLIC_STRIPE_DONATION_URL',
    'NEXT_PUBLIC_MATBIA_URL',
    'NEXT_PUBLIC_OJC_URL'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
    return false;
  }
  
  return true;
};
