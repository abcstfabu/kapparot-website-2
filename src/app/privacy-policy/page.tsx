'use client';

import Link from 'next/link';
import { config } from '@/lib/config';

export default function PrivacyPolicy() {
  const lastUpdated = new Date().toLocaleDateString();

  return (
    <div className="container">
      <header className="header">
        <h1>Privacy Policy</h1>
        <p className="subtitle">Data collection and usage</p>
      </header>

      <main className="main-content">
        <div className="legal-content" style={{ padding: '40px' }}>
          <h2>Data Collection</h2>
          <p>We collect:</p>
          <ul>
            <li>Prayer type and donation amount</li>
            <li>Email address</li>
            <li>Payment method selected</li>
            <li>Transaction timestamp and ID</li>
          </ul>

          <h2>Data Use</h2>
          <p>Your data is used only to complete your Kapparot donation. We do not share, sell, or use your data for marketing.</p>

          <h2>Data Storage</h2>
          <p>Data is stored in Google Sheets and temporarily in your browser. We use secure connections and limit access to authorized personnel only.</p>

          <h2>Your Rights</h2>
          <p>You can request access to, correction of, or deletion of your personal data by contacting us at <strong>{config.contactEmail}</strong></p>

          <h2>Third Parties</h2>
          <p>We use Google Sheets for data storage and external payment processors (Stripe, PayPal, etc.) for donations.</p>

          <h2>Policy Updates</h2>
          <p>This policy may be updated. Check this page for changes.</p>

          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
            <p><small>Last updated: {lastUpdated}</small></p>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Kapparot Online.</p>
        <p>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'underline' }}>
            ← Back to Home
          </Link>
        </p>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginTop: '10px' }}>
          Ahavas Yisroel Inc. - 501(c)(3) Nonprofit Organization | Tax ID: 81-3495350
        </p>
      </footer>
    </div>
  );
}
