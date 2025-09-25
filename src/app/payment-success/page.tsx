'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function PaymentSuccessContent() {
  const router = useRouter();
  const [updateStatus, setUpdateStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [paymentDetails, setPaymentDetails] = useState<{
    transactionId?: string;
    amount?: number;
    email?: string;
  }>({});

  useEffect(() => {
    const updatePaymentStatus = async () => {
      try {
        // Get transaction ID from localStorage (stored before Stripe redirect)
        let transactionId = null;
        let pendingPayment = null;
        
        try {
          const storedPayment = localStorage.getItem('pendingPayment');
          if (storedPayment) {
            pendingPayment = JSON.parse(storedPayment);
            transactionId = pendingPayment.transactionId;
            
            // Set payment details for display
            setPaymentDetails({
              transactionId: pendingPayment.transactionId,
              amount: pendingPayment.amount,
              email: pendingPayment.email
            });
            
            // Clear the stored payment (one-time use)
            localStorage.removeItem('pendingPayment');
          }
        } catch (error) {
          console.warn('Error reading pending payment from localStorage:', error);
        }
        
        if (!transactionId) {
          console.warn('No transaction ID found in localStorage');
          setUpdateStatus('error');
          setErrorMessage('Unable to identify the payment record');
          return;
        }

        console.log('Updating payment:', { transactionId });

        // Call API to update the payment status
        const response = await fetch('/api/update-payment-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            transactionId: transactionId,
            status: 'Completed'
          })
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Payment status updated:', result);
          setUpdateStatus('success');
        } else {
          console.error('Failed to update payment status');
          setUpdateStatus('error');
          setErrorMessage('Failed to update payment record');
        }
        
      } catch (error) {
        console.error('Error updating payment status:', error);
        setUpdateStatus('error');
        setErrorMessage('Network error updating payment record');
      }
    };

    updatePaymentStatus();
  }, []); // Run once on mount

  const handleReturnHome = () => {
    router.push('/');
  };

  const handlePerformAnother = () => {
    router.push('/?reset=true');
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Payment Successful! 🎉</h1>
        <p className="subtitle">Your Kapparot donation has been completed</p>
      </header>

      <main className="main-content">
        <div className="success-message">
          <div className="success-card">
            <h2>Thank You for Your Donation</h2>
            <p>Your charitable contribution has been processed successfully and helps fulfill the mitzvah of tzedakah as part of your Kapparot observance.</p>
            
            {paymentDetails.transactionId && (
              <div className="payment-details">
                <h3>Payment Details</h3>
                <p><strong>Amount:</strong> ${paymentDetails.amount}</p>
                <p><strong>Email:</strong> {paymentDetails.email}</p>
                <p><strong>Transaction ID:</strong> {paymentDetails.transactionId}</p>
              </div>
            )}
            
            {updateStatus === 'loading' && (
              <div className="status-indicator">
                <p>📝 Updating donation records...</p>
              </div>
            )}
            
            {updateStatus === 'success' && (
              <div className="status-indicator success">
                <p>✅ Donation recorded successfully</p>
              </div>
            )}
            
            {updateStatus === 'error' && (
              <div className="status-indicator error">
                <p>⚠️ Payment successful, but record update failed: {errorMessage}</p>
                <small>Your payment went through successfully. The record will be updated manually if needed.</small>
              </div>
            )}
          </div>
        </div>

        <div className="next-steps">
          <h3>What would you like to do next?</h3>
          <div className="action-buttons">
            <button 
              onClick={handlePerformAnother} 
              className="primary-btn"
            >
              Perform Another Kapparot
            </button>
            <button 
              onClick={handleReturnHome} 
              className="secondary-btn"
            >
              Return to Home
            </button>
          </div>
        </div>

        <div className="receipt-info">
          <h3>Receipt Information</h3>
          <p>
            If you need a donation receipt or have any questions about your contribution, 
            please contact us at: 
            <a href="mailto:yishuveypushka@gmail.com" style={{ color: '#667eea', textDecoration: 'underline' }}>
              <strong> yishuveypushka@gmail.com</strong>
            </a>
          </p>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Kapparot Online. May your prayers be answered and your giving bring blessing.</p>
        <p>
          <Link href="/privacy-policy" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'underline' }}>
            Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  );
}

export default function PaymentSuccess() {
  return <PaymentSuccessContent />;
}
