// Utility functions for localStorage management

import { DonationData, SessionData, PrayerType } from '@/types';

// Storage keys
const DONATION_KEY = 'kapparotDonation';
const SESSION_KEY = 'kapparotSession';

// Donation data functions
export const getDonationData = (): DonationData | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(DONATION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading donation data:', error);
    return null;
  }
};

export const saveDonationData = (data: DonationData): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(DONATION_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving donation data:', error);
  }
};

export const clearDonationData = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(DONATION_KEY);
  } catch (error) {
    console.error('Error clearing donation data:', error);
  }
};

// Session data functions
export const getSessionData = (): SessionData => {
  if (typeof window === 'undefined') return { totalAmount: 0, currentAmount: 0, email: '', prayers: [] };
  
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : { totalAmount: 0, currentAmount: 0, email: '', prayers: [] };
  } catch (error) {
    console.error('Error reading session data:', error);
    return { totalAmount: 0, currentAmount: 0, email: '', prayers: [] };
  }
};

export const saveSessionData = (data: SessionData): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving session data:', error);
  }
};

export const clearSessionData = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Error clearing session data:', error);
  }
};

// Utility functions
export const getPrayerTypeDisplayName = (prayerType: PrayerType): string => {
  const names: Record<PrayerType, string> = {
    'self-male': 'Male (For Yourself)',
    'self-female': 'Female (For Yourself)',
    'self-pregnant': 'Pregnant Woman (For Yourself)',
    'other-male': 'Male (For Other)',
    'other-female': 'Female (For Other)',
    'other-pregnant': 'Pregnant Woman (For Other)',
  };
  
  return names[prayerType] || prayerType;
};

export const generateTransactionId = (): string => {
  return 'KAP-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
