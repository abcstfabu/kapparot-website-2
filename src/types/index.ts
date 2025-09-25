// Types for the Kapparot Online application

export type PrayerType = 
  | 'self-male'
  | 'self-female' 
  | 'self-pregnant'
  | 'other-male'
  | 'other-female'
  | 'other-pregnant';

export interface DonationData {
  prayerType: PrayerType;
  amount: number;
  email: string;
  transactionId?: string;
  paymentMethod?: string;
  timestamp?: string;
  completedAt?: string;
}

export interface SessionData {
  totalAmount: number;
  currentAmount: number;
  email: string;
  prayers: Array<{
    prayerType: PrayerType;
    amount: number;
    timestamp: string;
    completedAt?: string;
  }>;
}

export interface PrayerContent {
  hebrew: string;
  transliteration: string;
  english: string;
}

export type PaymentMethod = 
  | 'stripe'
  | 'paypal'
  | 'zelle'
  | 'matbia'
  | 'ojc';

export interface PaymentUrls {
  stripe: string;
  matbia: string;
  ojc: string;
}

export type LanguageType = 'hebrew' | 'transliteration' | 'english';
