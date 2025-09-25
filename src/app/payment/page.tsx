'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DonationData, PaymentMethod } from '@/types';
import { 
  getDonationData, 
  saveDonationData,
  clearSessionData,
  getPrayerTypeDisplayName,
  generateTransactionId
} from '@/lib/storage';
import { config } from '@/lib/config';

export default function Payment() {
  const router = useRouter();
  const [donationData, setDonationData] = useState<DonationData | null>(null);

  useEffect(() => {
    const data = getDonationData();
    
    if (!data) {
      // Redirect to home page if no donation data
      router.push('/');
      return;
    }
    
    setDonationData(data);
  }, [router]);

  const getPaymentUrls = (amount: number, email: string) => {
    const encodedEmail = encodeURIComponent(email || '');
    
    return {
      stripe: `${config.payments.stripeUrl}?prefilled_email=${encodedEmail}`,
      matbia: config.payments.matbiaUrl,
      ojc: config.payments.ojcUrl
    };
  };

  const handlePaymentMethodSelect = async (method: PaymentMethod) => {
    if (!donationData) return;

    const paymentUrls = getPaymentUrls(donationData.amount, donationData.email);
    
    // Payment method names for display
    const paymentMethodNames = {
      'stripe': 'Credit Card (Stripe)',
      'paypal': 'PayPal',
      'matbia': 'Matbia Platform',
      'ojc': 'OJC Payment System',
      'zelle': 'Zelle/QuickPay'
    };
    
    // Update donation data with payment info
    const updatedData: DonationData = {
      ...donationData,
      paymentMethod: paymentMethodNames[method] || method,
      timestamp: new Date().toISOString(),
      transactionId: donationData.transactionId || generateTransactionId()
    };
    
    // Save donation record
    saveDonationData(updatedData);
    
    // TODO: Save to Google Sheets via API route
    try {
      await fetch('/api/save-donation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
    } catch (error) {
      console.error('Error saving to database:', error);
    }
    
    // Clear accumulated session after payment method selection
    clearSessionData();
    
    // Handle different payment methods
    switch (method) {
      case 'stripe':
        const stripeConfirm = window.confirm(
          `Stripe Payment:\n\nClick OK to go to Stripe to make your $${donationData.amount} donation.\n\nYour email will be pre-filled on the payment form.\n\nAfter completing payment, please return to this website to complete your Kapparot prayer.\n\nClick OK to proceed to Stripe, or Cancel to choose a different payment method.`
        );
        
        if (stripeConfirm) {
          // Store transaction ID in localStorage before redirecting
          localStorage.setItem('pendingPayment', JSON.stringify({
            transactionId: updatedData.transactionId,
            amount: updatedData.amount,
            email: updatedData.email,
            timestamp: new Date().toISOString()
          }));
          window.location.href = paymentUrls.stripe;
        }
        break;
        
      case 'matbia':
        const matbiaConfirm = window.confirm(
          `Matbia Payment:\n\nClick OK to go to Matbia platform to make your $${donationData.amount} donation.\n\nAfter completing payment, please return to this website to complete your Kapparot prayer.\n\nClick OK to proceed to Matbia, or Cancel to choose a different payment method.`
        );
        
        if (matbiaConfirm) {
          window.location.href = paymentUrls.matbia;
        }
        break;
        
      case 'ojc':
        const ojcConfirm = window.confirm(
          `OJC Payment:\n\nClick OK to go to OJC secure payment system to make your $${donationData.amount} donation.\n\nAfter completing payment, please return to this website to complete your Kapparot prayer.\n\nClick OK to proceed to OJC, or Cancel to choose a different payment method.`
        );
        
        if (ojcConfirm) {
          window.location.href = paymentUrls.ojc;
        }
        break;
        
      case 'paypal':
        const paypalMessage = 
          `PayPal Payment Instructions:\n\n` +
          `Send your donation to: ${config.contactEmail}\n` +
          `Amount: $${donationData.amount}\n\n` +
          `Please include "Kapparot - ${getPrayerTypeDisplayName(donationData.prayerType)}" in the notes.\n\n` +
          `After sending your payment, click OK to complete your Kapparot.`;
        
        window.alert(paypalMessage);
        // Mark as completed and redirect
        updatedData.completedAt = new Date().toISOString();
        saveDonationData(updatedData);
        router.push('/completion');
        break;
        
      case 'zelle':
        const zelleMessage = 
          `Zelle/QuickPay Payment Instructions:\n\n` +
          `Send your donation to: ${config.contactEmail}\n` +
          `Amount: $${donationData.amount}\n\n` +
          `Please include "Kapparot - ${getPrayerTypeDisplayName(donationData.prayerType)}" in the notes.\n\n` +
          `After sending your payment, click OK to complete your Kapparot.`;
        
        window.alert(zelleMessage);
        // Mark as completed and redirect
        updatedData.completedAt = new Date().toISOString();
        saveDonationData(updatedData);
        router.push('/completion');
        break;
        
      default:
        window.alert(`Payment method not yet implemented. Please contact us at ${config.contactEmail}`);
    }
  };

  if (!donationData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Payment Information</h1>
        <p className="subtitle">Complete your Kapparot donation</p>
      </header>

      <main className="main-content">
        <div className="donation-summary">
          <h2>Donation Summary</h2>
          <div className="summary-card">
            <p><strong>Donor Email:</strong> {donationData.email || 'Not provided'}</p>
            <p><strong>Performing Kapparot for:</strong> {getPrayerTypeDisplayName(donationData.prayerType)}</p>
            <p><strong>Amount:</strong> ${donationData.amount}</p>
          </div>
        </div>

        <div className="payment-options">
          <h2>Choose Your Payment Method</h2>
          <p className="payment-description">Select your preferred way to complete your Kapparot donation to Ahavas Yisroel Inc:</p>
          
          <div className="payment-group">
            <h3>Payment Methods</h3>
            
            <div className="payment-method" onClick={() => handlePaymentMethodSelect('stripe')}>
              <div className="method-header">
                <h4>Credit Card (Stripe)</h4>
              </div>
              <p>Pay with any major credit or debit card through our secure Stripe donation page (return to this website after payment to complete your prayer)</p>
            </div>

            <div className="payment-method" onClick={() => handlePaymentMethodSelect('paypal')}>
              <div className="method-header">
                <h4>PayPal</h4>
              </div>
              <p>Send to: <strong>{config.contactEmail}</strong></p>
            </div>

            <div className="payment-method" onClick={() => handlePaymentMethodSelect('zelle')}>
              <div className="method-header">
                <h4>Zelle / QuickPay</h4>
              </div>
              <p>Send to: <strong>{config.contactEmail}</strong></p>
            </div>
            
            <div className="payment-method" onClick={() => handlePaymentMethodSelect('matbia')}>
              <div className="method-header">
                <h4>Matbia</h4>
                <span className="method-badge">Jewish Platform</span>
              </div>
              <p>Donate through the Matbia charitable giving platform</p>
            </div>

            <div className="payment-method" onClick={() => handlePaymentMethodSelect('ojc')}>
              <div className="method-header">
                <h4>OJC Payment System</h4>
                <span className="method-badge">Jewish Platform</span>
              </div>
              <p>Orthodox Jewish Chamber secure payment portal</p>
            </div>
          </div>

          <div className="contact-info">
            <h3>Questions or Other Inquiries</h3>
            <p>Email us at: <a href={`mailto:${config.contactEmail}`} style={{ color: '#667eea', textDecoration: 'underline' }}><strong>{config.contactEmail}</strong></a></p>
          </div>

          <div className="security-info">
            <p><strong>All Donations Secure:</strong> Your charitable contribution helps fulfill the mitzvah of tzedakah as part of your Kapparot observance. All online payments are processed through secure, encrypted systems.</p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Kapparot Online. Helping fulfill the tradition of tzedakah during the High Holy Days.</p>
        <p>
          <a href="/privacy-policy" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'underline' }}>Privacy Policy</a>
        </p>
      </footer>
    </div>
  );
}
