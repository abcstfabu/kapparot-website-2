# Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# Google Sheets API Configuration
GOOGLE_SHEETS_API_KEY=AIzaSyC1Xr9xXko-ZHZOFcHXdtZHXg0UAJA7WN8
GOOGLE_SHEETS_SHEET_ID=1HdnDgJj9bJYAOtK9d2JRXcIarazBTmn4leyxbichds4
GOOGLE_SHEETS_SHEET_NAME=Donations

# Payment URLs
STRIPE_DONATION_URL=https://donate.stripe.com/5kAdUbdiv2ZJ81O000
MATBIA_URL=https://matbia.org/d/00124222281
OJC_URL=https://secure.ojccardpaymentsite.org/MQAAADMAAAA3AAAANwAAADQAAAA=

# Contact Email
CONTACT_EMAIL=yishuveypushka@gmail.com

# App Configuration
NEXT_PUBLIC_APP_NAME=Kapparot Online
NEXT_PUBLIC_APP_DESCRIPTION=Digital Tzedakah for Atonement
```

## Google Sheets Setup

1. Go to [Google Cloud Console](https://console.developers.google.com)
2. Create a new project or select existing
3. Enable Google Sheets API
4. Create credentials (API Key)
5. Create a Google Sheet and get the Sheet ID from the URL
6. Make the sheet publicly editable or use service account
7. Update the environment variables above with your actual values

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
