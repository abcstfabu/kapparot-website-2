import { NextRequest, NextResponse } from 'next/server';

interface UpdatePaymentRequest {
  transactionId: string;
  status: string;
}

// Validate request data
const validateUpdateRequest = (data: unknown): data is UpdatePaymentRequest => {
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  const obj = data as Record<string, unknown>;
  
  return (
    typeof obj.status === 'string' &&
    typeof obj.transactionId === 'string' &&
    obj.transactionId.length > 0
  );
};

// Update payment status via Apps Script
const updatePaymentStatus = async (requestData: UpdatePaymentRequest): Promise<{ success: boolean; error?: string }> => {
  try {
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    
    if (!appsScriptUrl) {
      throw new Error('Google Apps Script URL not configured');
    }
    
    const payload = {
      action: 'update',
      transactionId: requestData.transactionId,
      status: requestData.status,
      completedAt: new Date().toISOString()
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
    console.error('Failed to update payment status:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const requestData = await request.json();
    
    // Validate request data
    if (!validateUpdateRequest(requestData)) {
      return NextResponse.json(
        { error: 'Invalid request data. transactionId and status are required.' },
        { status: 400 }
      );
    }
    
    // Check if Apps Script URL is configured
    if (!process.env.GOOGLE_APPS_SCRIPT_URL) {
      console.warn('Google Apps Script not configured for payment status update');
      return NextResponse.json(
        { 
          success: true, 
          method: 'localStorage',
          message: 'Payment status update skipped (Google Apps Script not configured)' 
        },
        { status: 200 }
      );
    }
    
    // Try to update payment status
    const result = await updatePaymentStatus(requestData);
    
    if (result.success) {
      return NextResponse.json(
        { 
          success: true, 
          method: 'apps-script',
          message: 'Payment status updated successfully' 
        },
        { status: 200 }
      );
    } else {
      // Log the error but don't fail the request entirely
      console.error('Failed to update payment status:', result.error);
      
      return NextResponse.json(
        { 
          success: false, 
          method: 'localStorage',
          message: 'Payment status update failed',
          error: result.error
        },
        { status: 200 } // Still return 200 so user sees success page
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
      message: 'Payment status update API is running',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  );
}
