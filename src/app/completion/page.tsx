'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { clearDonationData, clearSessionData } from '@/lib/storage';

export default function Completion() {
  const router = useRouter();

  useEffect(() => {
    // Clear any leftover sensitive payment data immediately
    clearDonationData();
  }, []);

  const handleStartNewSession = () => {
    // Clear all session data for a fresh start
    clearSessionData();
    clearDonationData();
    
    // Redirect to home page
    router.push('/');
  };

  const handleGoHome = () => {
    // Just redirect to home, keep session data intact
    router.push('/');
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
          
          <h2>Ritual Successfully Completed</h2>
          <p className="completion-description">
            You have fulfilled the sacred tradition of Kapparot. Your prayers have been recited with proper intention, and your charitable commitment has been made. Through this act of tzedakah, you have connected to generations of Jewish tradition.
          </p>
        </div>

        <div className="spiritual-significance">
          <div className="significance-card">
            <h3>The Meaning of Your Action</h3>
            <p>
              By performing Kapparot, you have engaged in an ancient practice of spiritual preparation for Yom Kippur. Your charitable giving transforms this ritual into an act of genuine teshuvah (repentance) and chesed (kindness), creating merit for the year ahead.
            </p>
          </div>
        </div>

        <div className="blessing-section">
          <h3>Traditional Blessings</h3>
          <div className="blessing-card">
            <div className="hebrew-blessing">
              <p>תזכו לשנים רבות נעימות וטובות</p>
            </div>
            <div className="english-blessing">
              <p><em>May you be inscribed for many pleasant and good years</em></p>
            </div>
          </div>
        </div>

        <div className="yom-kippur-reminder">
          <div className="reminder-card">
            <h3>G&apos;mar Chatimah Tovah</h3>
            <p>
              As we approach Yom Kippur, may you be sealed in the Book of Life for a year of health, happiness, and spiritual fulfillment.
            </p>
          </div>
        </div>

        <div className="completion-actions">
          <button className="action-btn primary-btn" onClick={handleStartNewSession}>
            Start New Session
          </button>
          <button className="action-btn secondary-btn" onClick={handleGoHome}>
            Return to Home
          </button>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Kapparot Online.</p>
      </footer>
    </div>
  );
}
