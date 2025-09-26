'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PrayerType, DonationData, SessionData } from '@/types';
import { 
  getSessionData, 
  saveSessionData, 
  saveDonationData,
  clearSessionData,
  isValidEmail
} from '@/lib/storage';

// Component that uses useSearchParams - needs to be wrapped in Suspense
function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedPrayerType, setSelectedPrayerType] = useState<PrayerType | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [activeSection, setActiveSection] = useState<'self' | 'other'>('self');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Check for email parameter and prefill if present
    const prefillEmail = searchParams.get('email');
    const resetSession = searchParams.get('reset');
    
    if (resetSession === 'true') {
      clearSessionData();
    }
    
    if (prefillEmail) {
      setEmail(prefillEmail);
      // Clean up URL after prefilling
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams]);

  useEffect(() => {
    // Check form validity
    const hasAmount = Boolean(amount && parseFloat(amount) >= 1);
    const hasPrayerType = selectedPrayerType !== null;
    const hasEmail = Boolean(email && isValidEmail(email));
    
    setIsFormValid(hasAmount && hasPrayerType && hasEmail);
  }, [amount, selectedPrayerType, email]);

  const handleSectionToggle = (section: 'self' | 'other') => {
    setActiveSection(section);
    setSelectedPrayerType(null);
  };

  const handlePrayerOptionSelect = (prayerType: PrayerType) => {
    setSelectedPrayerType(prayerType);
  };

  const handleAmountButtonClick = (buttonAmount: string) => {
    setAmount(buttonAmount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid || !selectedPrayerType) return;

    // Get existing session data
    const existingSession = getSessionData();
    const existingTotal = existingSession.totalAmount || 0;
    const currentAmount = parseFloat(amount);
    
    // Create form data
    const formData: DonationData = {
      prayerType: selectedPrayerType,
      amount: currentAmount,
      email: email
    };
    
    // Update session data
    const sessionData: SessionData = {
      totalAmount: existingTotal + currentAmount,
      currentAmount: currentAmount,
      email: email,
      prayers: existingSession.prayers || []
    };
    
    // Add current prayer to list
    sessionData.prayers.push({
      prayerType: selectedPrayerType,
      amount: currentAmount,
      timestamp: new Date().toISOString()
    });
    
    // Save data
    saveDonationData(formData);
    saveSessionData(sessionData);
    
    // Navigate to prayer display
    router.push('/prayer-display');
  };

  const prayerOptions = {
    self: [
      { type: 'self-male' as PrayerType, title: 'For a Male', description: 'Select this if you are a male performing Kapparot for yourself' },
      { type: 'self-female' as PrayerType, title: 'For a Female', description: 'Select this if you are a female performing Kapparot for yourself' },
      { type: 'self-pregnant' as PrayerType, title: 'For a Pregnant Woman', description: 'Select this if you are an expectant mother performing Kapparot for yourself' },
    ],
    other: [
      { type: 'other-male' as PrayerType, title: 'For a Male', description: 'Select this if you are performing Kapparot for another male' },
      { type: 'other-female' as PrayerType, title: 'For a Female', description: 'Select this if you are performing Kapparot for another female' },
      { type: 'other-pregnant' as PrayerType, title: 'For a Pregnant Woman', description: 'Select this if you are performing Kapparot for an expectant mother' },
    ]
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Kapparot Online</h1>
        <p className="subtitle">Perform the ancient tradition of Kapparot through charitable giving</p>
      </header>

      <main className="main-content">
        <div className="info-section">
          <h2>About Kapparot</h2>
          <p>Kapparot is a Jewish ritual performed before Yom Kippur where we symbolically transfer our sins through charitable giving. Your donation will go directly to help those in need, fulfilling the mitzvah of tzedakah while performing this meaningful tradition.</p>
        </div>

        <div className="donation-purpose">
          <div className="purpose-card">
            <div className="purpose-icon">🏡</div>
            <div className="purpose-details">
              <h3>Where Your Donation Goes</h3>
              <p>Your charitable contribution supports <strong>Jewish families who have made aliyah</strong> and are building new lives in Eretz Yisrael. These brave souls answered the call to settle in the Holy Land, and we help ease their journey with financial support during the High Holy Days.</p>
              <p className="purpose-highlight">Your tzedakah becomes part of the great mitzvah of <em>Yishuv Eretz Yisrael</em> - settling the Land of Israel.</p>
            </div>
          </div>
        </div>

        <div className="nonprofit-info">
          <div className="nonprofit-card">
            <div className="nonprofit-icon">🏛️</div>
            <div className="nonprofit-details">
              <h3>Tax-Deductible Donations</h3>
              <p><strong>Ahavas Yisroel Inc.</strong> is recognized as a nonprofit organization by the IRS.</p>
              <p><strong>501(c)(3) Status</strong> • Tax ID: 81-3495350</p>
            </div>
          </div>
        </div>

        <div className="prayer-selection">
          <h2>Who is performing Kapparot?</h2>
          <p className="instruction">Please select the appropriate prayer based on who is performing the ritual:</p>
          
          {/* Section Toggle Buttons */}
          <div className="section-toggles">
            <button 
              className={`section-toggle ${activeSection === 'self' ? 'active' : ''}`}
              onClick={() => handleSectionToggle('self')}
            >
              Doing for Yourself
            </button>
            <button 
              className={`section-toggle ${activeSection === 'other' ? 'active' : ''}`}
              onClick={() => handleSectionToggle('other')}
            >
              Doing for Other
            </button>
          </div>
          
          {/* Prayer Options */}
          <div className={`prayer-section ${activeSection === 'self' ? 'active' : ''}`}>
            <div className="prayer-options">
              {prayerOptions.self.map((option) => (
                <div
                  key={option.type}
                  className={`prayer-option ${selectedPrayerType === option.type ? 'selected' : ''}`}
                  onClick={() => handlePrayerOptionSelect(option.type)}
                >
                  <div className="option-header">
                    <h4>{option.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`prayer-section ${activeSection === 'other' ? 'active' : ''}`}>
            <div className="prayer-options">
              {prayerOptions.other.map((option) => (
                <div
                  key={option.type}
                  className={`prayer-option ${selectedPrayerType === option.type ? 'selected' : ''}`}
                  onClick={() => handlePrayerOptionSelect(option.type)}
                >
                  <div className="option-header">
                    <h4>{option.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="donation-form">
          <h2>Select Your Donation Amount</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="donorEmail">Your Email Address</label>
              <input
                type="email"
                id="donorEmail"
                name="donorEmail"
                placeholder="your-email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <small style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                In case we need to contact you about your donation.
              </small>
            </div>
            
            <div className="form-group">
              <label htmlFor="amount">Donation Amount ($)</label>
              <div className="amount-buttons">
                {['18', '36', '54', '72'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    className={`amount-btn ${amount === amt ? 'active' : ''}`}
                    onClick={() => handleAmountButtonClick(amt)}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
              <input
                type="number"
                id="amount"
                name="amount"
                min="1"
                step="1"
                placeholder="Enter custom amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={!isFormValid}
            >
              Continue to Prayer
            </button>
          </form>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Kapparot Online. Helping fulfill the tradition of tzedakah during the High Holy Days.</p>
        <p>
          <a href="/privacy-policy" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'underline' }}>Privacy Policy</a> | 
          <Link href="/?reset=true" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}> Start Fresh Session</Link>
        </p>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginTop: '10px' }}>
          Ahavas Yisroel Inc. - 501(c)(3) Nonprofit Organization | Tax ID: 81-3495350
        </p>
      </footer>
    </div>
  );
}

// Main component with Suspense boundary
export default function Home() {
  return (
    <Suspense fallback={<div className="container"><div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div></div>}>
      <HomeContent />
    </Suspense>
  );
}