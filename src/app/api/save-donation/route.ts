import { NextRequest, NextResponse } from 'next/server';
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

// Save donation to Google Sheets via Apps Script
const saveToGoogleSheets = async (donationData: DonationData): Promise<{ success: boolean; error?: string }> => {
  try {
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    
    if (!appsScriptUrl) {
      throw new Error('Google Apps Script URL not configured');
    }
    
    const payload = {
      timestamp: new Date().toISOString(),
      prayerType: getPrayerTypeDisplayName(donationData.prayerType),
      amount: String(donationData.amount),
      email: donationData.email || '',
      transactionId: donationData.transactionId || '',
      paymentMethod: donationData.paymentMethod || '',
      status: donationData.completedAt ? 'Completed' : 'Payment Selected'
    };
    
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        return { success: true };
      } else {
        throw new Error(result.error || 'Apps Script error');
      }
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
const validateDonationData = (data: unknown): data is DonationData => {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  const obj = data as Record<string, unknown>;
  
  return (
    typeof obj.prayerType === 'string' &&
    typeof obj.amount === 'number' &&
    obj.amount > 0 &&
    typeof obj.email === 'string' &&
    obj.email.includes('@')
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
    
    // Check if Apps Script URL is configured
    if (!process.env.GOOGLE_APPS_SCRIPT_URL) {
      console.warn('Google Apps Script not configured, falling back to localStorage');
      return NextResponse.json(
        { 
          success: true, 
          method: 'localStorage',
          message: 'Data saved locally (Google Apps Script not configured)' 
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
          method: 'apps-script',
          message: 'Data saved to Google Sheets via Apps Script successfully' 
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
      configured: !!process.env.GOOGLE_APPS_SCRIPT_URL,
      method: 'Google Apps Script',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );
}
