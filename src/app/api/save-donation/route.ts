import { NextRequest, NextResponse } from 'next/server';
import { config, validateConfig } from '@/lib/config';
import { DonationData, PrayerType } from '@/types';

// Helper function to get prayer type display name
const getPrayerTypeDisplayName = (prayerType: PrayerType | string): string => {
  const names: Record<string, string> = {
    'self-male': 'Male (For Yourself)',
    'self-female': 'Female (For Yourself)',
    'self-pregnant': 'Pregnant Woman (For Yourself)',
    'other-male': 'Male (For Other)',
    'other-female': 'Female (For Other)',
    'other-pregnant': 'Pregnant Woman (For Other)',
    'multiple': 'Multiple Kapparot Prayers'
  };
  
  return names[prayerType] || String(prayerType);
};

// Initialize headers if they don't exist
const initializeHeaders = async (): Promise<boolean> => {
  const headers = [
    'Timestamp',
    'Prayer Type', 
    'Amount',
    'Email',
    'Transaction ID',
    'Payment Method',
    'Status'
  ];
  
  try {
    // Check if headers exist
    const checkResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${config.googleSheets.sheetId}/values/${config.googleSheets.sheetName}!A1:G1?key=${config.googleSheets.apiKey}`
    );
    
    if (checkResponse.ok) {
      const data = await checkResponse.json();
      
      // If no headers, add them
      if (!data.values || data.values.length === 0) {
        const headerResponse = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${config.googleSheets.sheetId}/values/${config.googleSheets.sheetName}!A1:G1?valueInputOption=RAW&key=${config.googleSheets.apiKey}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              values: [headers]
            })
          }
        );
        
        return headerResponse.ok;
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to initialize headers:', error);
    return false;
  }
};

// Save donation to Google Sheets
const saveToGoogleSheets = async (donationData: DonationData): Promise<{ success: boolean; error?: string }> => {
  try {
    // Initialize headers if needed
    await initializeHeaders();
    
    const row = [
      new Date().toISOString(),                                    // Timestamp
      getPrayerTypeDisplayName(donationData.prayerType),          // Prayer Type
      String(donationData.amount),                                // Amount
      donationData.email || '',                                   // Email
      donationData.transactionId || '',                          // Transaction ID
      donationData.paymentMethod || '',                          // Payment Method
      donationData.completedAt ? 'Completed' : 'Payment Selected' // Status
    ];
    
    const response = await fetch(config.googleSheets.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [row]
      })
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
  } catch (error) {
    console.error('Failed to save to Google Sheets:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Validate donation data
const validateDonationData = (data: any): data is DonationData => {
  return (
    data &&
    typeof data.prayerType === 'string' &&
    typeof data.amount === 'number' &&
    data.amount > 0 &&
    typeof data.email === 'string' &&
    data.email.includes('@')
  );
};

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const donationData = await request.json();
    
    // Validate donation data
    if (!validateDonationData(donationData)) {
      return NextResponse.json(
        { error: 'Invalid donation data provided' },
        { status: 400 }
      );
    }
    
    // Check if configuration is valid
    if (!validateConfig()) {
      console.warn('Google Sheets not configured properly, falling back to localStorage');
      return NextResponse.json(
        { 
          success: true, 
          method: 'localStorage',
          message: 'Data saved locally (Google Sheets not configured)' 
        },
        { status: 200 }
      );
    }
    
    // Try to save to Google Sheets
    const result = await saveToGoogleSheets(donationData);
    
    if (result.success) {
      return NextResponse.json(
        { 
          success: true, 
          method: 'sheets',
          message: 'Data saved to Google Sheets successfully' 
        },
        { status: 200 }
      );
    } else {
      // Log the error but don't fail the request entirely
      console.error('Failed to save to Google Sheets:', result.error);
      
      return NextResponse.json(
        { 
          success: true, 
          method: 'localStorage',
          message: 'Data saved locally (Google Sheets error)',
          error: result.error
        },
        { status: 200 }
      );
    }
    
  } catch (error) {
    console.error('API route error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Kapparot donation API is running',
      configured: validateConfig(),
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );
}
