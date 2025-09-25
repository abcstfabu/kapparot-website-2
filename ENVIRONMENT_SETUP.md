# Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# Google Sheets API Configuration

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
