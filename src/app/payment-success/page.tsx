'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function PaymentSuccessContent() {
  const router = useRouter();

  useEffect(() => {
    // Update payment status and clean up localStorage
    const updatePaymentStatus = async () => {
      try {
        // Get pending payment info
        const pendingPaymentStr = localStorage.getItem('pendingPayment');
        
        if (pendingPaymentStr) {
          const pendingPayment = JSON.parse(pendingPaymentStr);
          
          // Update status in Google Sheets
          if (pendingPayment.transactionId) {
            await fetch('/api/update-payment-status', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                transactionId: pendingPayment.transactionId,
                status: 'Completed'
              })
            });
          }
        }
        
        // Clean up localStorage
        localStorage.removeItem('pendingPayment');
      } catch (error) {
        console.warn('Error updating payment status:', error);
        // Still clean up localStorage even if update fails
        try {
          localStorage.removeItem('pendingPayment');
        } catch (cleanupError) {
          console.warn('Error cleaning localStorage:', cleanupError);
        }
      }
    };
    
    updatePaymentStatus();
  }, []);

  const handleStartNew = () => {
    // Clear any session data for a fresh start
    try {
      localStorage.removeItem('pendingPayment');
      localStorage.removeItem('sessionData');
      localStorage.removeItem('donationData');
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
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
            <h2>Thank You! 🙏</h2>
            <p>Your Kapparot has been completed. May this act of tzedakah bring you merit for a blessed new year.</p>
          </div>
        </div>

        <div className="share-section">
          <div className="share-card">
            <h3>Share with Others</h3>
            <p>Help others fulfill the mitzvah of Kapparot by sharing this link:</p>
            
            <div className="share-buttons">
              <button 
                className="share-btn copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin);
                  alert('Link copied to clipboard!');
                }}
              >
                📋 Copy Link
              </button>
            </div>
          </div>
        </div>

          <div className="next-steps">
            <h3>What would you like to do next?</h3>
            <div className="button-group">
              <button onClick={handleStartNew} className="btn primary-btn">
                Start New Kapparot
              </button>
            </div>
          </div>

      </main>

      <footer className="footer">
        <p>&copy; 2025 Kapparot Online. May your prayers be answered and your giving bring blessing.</p>
        <p>
          <Link href="/privacy-policy" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'underline' }}>
            Privacy Policy
          </Link>
        </p>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginTop: '10px' }}>
          Ahavas Yisroel Inc. - 501(c)(3) Nonprofit Organization | Tax ID: 81-3495350
        </p>
      </footer>
    </div>
  );
}

export default function PaymentSuccess() {
  return <PaymentSuccessContent />;
}
