'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearDonationData, clearSessionData } from '@/lib/storage';

export default function Completion() {
  const router = useRouter();

  useEffect(() => {
    // Clear any leftover sensitive payment data
    clearDonationData();
  }, []);

  const handleStartNewSession = () => {
    // Clear all session data for a fresh start
    clearSessionData();
    clearDonationData();
    
    // Clear localStorage as well
    try {
      localStorage.removeItem('pendingPayment');
      localStorage.removeItem('sessionData');
      localStorage.removeItem('donationData');
    } catch (error) {
      console.warn('Error clearing localStorage:', error);
    }
    
    // Redirect to home page with reset flag
    router.push('/?reset=true');
  };


  return (
    <div className="container">
      <header className="header">
        <h1>Your Kapparot is Complete</h1>
        <p className="subtitle">May your prayers be answered</p>
      </header>

      <main className="main-content">
        <div className="completion-message">
          <div className="success-icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="40" cy="40" r="40" fill="#4CAF50"/>
              <path d="M25 40L35 50L55 30" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <h2>Thank You! 🙏</h2>
          <p className="completion-description">
            Your Kapparot has been completed. May this act of tzedakah bring you merit for a blessed new year.
          </p>
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
            <button className="btn primary-btn" onClick={handleStartNewSession}>
              Start New Kapparot
            </button>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Kapparot Online.</p>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginTop: '10px' }}>
          Ahavas Yisroel Inc. - 501(c)(3) Nonprofit Organization | Tax ID: 81-3495350
        </p>
      </footer>
    </div>
  );
}
