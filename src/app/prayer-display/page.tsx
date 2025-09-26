'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PrayerType, DonationData, SessionData, LanguageType } from '@/types';
import { 
  getDonationData, 
  getSessionData, 
  saveSessionData,
  saveDonationData,
  getPrayerTypeDisplayName,
  generateTransactionId
} from '@/lib/storage';

// Prayer texts for all types
const PRAYERS = {
  'self-male': {
    hebrew: `זֶה חֲלִיפָתִי, זֶה תְּמוּרָתִי, זֶה כַּפָּרָתִי. זֶה הַכֶּסֶף יֵלֵךְ לִצְדָקָה וַאֲנִי אֶכָּנֵס וְאֵלֵךְ לְחַיִּים טוֹבִים אֲרֻכִּים וּלְשָׁלוֹם:`,
    transliteration: `Zeh chalifati, zeh temurati, zeh kaparati. Zeh hakesef yelech litzedakah va'ani ekanes ve'elech l'chayim tovim arukim ul'shalom.`,
    english: `This is my substitute, this is my exchange, this is my atonement. This money shall go to charity, and I shall enter and go to a good, long life and peace.`
  },
  'self-female': {
    hebrew: `זֶה חֲלִיפָתִי. זֶה תְּמוּרָתִי. זֶה כַּפָּרָתִי. זֶה הַכֶּסֶף יֵלֵךְ לִצְדָקָה, וַאֲנִי אֶכָּנֵס וְאֵלֵךְ לְחַיִּים טוֹבִים אֲרוּכִים וּלְשָׁלוֹם:`,
    transliteration: `Zeh chalifati. Zeh temurati. Zeh kaparati. Zeh hakesef yelech litzedakah, va'ani ekanes ve'elech l'chayim tovim arukim ul'shalom.`,
    english: `This is my substitute. This is my exchange. This is my atonement. This money shall go to charity, and I shall enter and go to a good, long life and peace.`
  },
  'self-pregnant': {
    hebrew: `זֶה חֲלִיפָתִי. זֶה תְּמוּרָתִי. זֶה כַּפָּרָתִי. זֶה הַכֶּסֶף יֵלֵךְ לִצְדָקָה, וַאֲנִי אֶכָּנֵס וְאֵלֵךְ לְחַיִּים טוֹבִים אֲרוּכִים וּלְשָׁלוֹם:`,
    transliteration: `Zeh chalifati. Zeh temurati. Zeh kaparati. Zeh hakesef yelech litzedakah, va'ani ekanes ve'elech l'chayim tovim arukim ul'shalom.`,
    english: `This is my substitute. This is my exchange. This is my atonement. This money shall go to charity, and I shall enter and go to a good, long life and peace.`
  },
  'other-male': {
    hebrew: `זֶה חֲלִיפָתְךָ. זֶה תְּמוּרָתְךָ. זֶה כַּפָּרָתְךָ. זֶה הַכֶּסֶף יֵלֵךְ לִצְדָקָה, וְאַתָּה תִּכָּנֵס וְתֵלֵךְ לְחַיִּים טוֹבִים אֲרוּכִים וּלְשָׁלוֹם:`,
    transliteration: `Zeh chalifatcha. Zeh temuratcha. Zeh kaparatcha. Zeh hakesef yelech litzedakah, ve'ata tikanes vetelech l'chayim tovim arukim ul'shalom.`,
    english: `This is your substitute. This is your exchange. This is your atonement. This money shall go to charity, and you shall enter and go to a good, long life and peace.`
  },
  'other-female': {
    hebrew: `זֶה חֲלִיפָתֵךְ. זֶה תְּמוּרָתֵךְ. זֶה כַּפָּרָתֵךְ. זֶה הַכֶּסֶף יֵלֵךְ לִצְדָקָה, וְאַתְּ תִּכָּנְסִי וְתֵלְכִי לְחַיִּים טוֹבִים אֲרוּכִים וּלְשָׁלוֹם:`,
    transliteration: `Zeh chalifatech. Zeh temuratech. Zeh kaparatech. Zeh hakesef yelech litzedakah, ve'at tikans'i vetelchi l'chayim tovim arukim ul'shalom.`,
    english: `This is your substitute. This is your exchange. This is your atonement. This money shall go to charity, and you shall enter and go to a good, long life and peace.`
  },
  'other-pregnant': {
    hebrew: `זֶה חֲלִיפָתְכֶם. זֶה תְּמוּרָתְכֶם. זֶה כַּפָּרָתְכֶם. זֶה הַכֶּסֶף יֵלֵךְ לִצְדָקָה, וְאַתֶּם תִּכָּנְסוּ וְתֵלְכוּ לְחַיִּים טוֹבִים אֲרוּכִים וּלְשָׁלוֹם:`,
    transliteration: `Zeh chalifatchem. Zeh temuratchem. Zeh kaparatchem. Zeh hakesef yelech litzedakah, ve'atem tikans'u vetelchu l'chayim tovim arukim ul'shalom.`,
    english: `This is your substitute. This is your exchange. This is your atonement. This money shall go to charity, and you shall enter and go to a good, long life and peace.`
  }
};

// Introductory prayer (recited before all Kapparot prayers)
const INTRODUCTORY_PRAYER = {
  hebrew: `בְּנֵי אָדָם יֹשְׁבֵי חֹשֶׁךְ וְצַלְמָוֶת אֲסִירֵי עֳנִי וּבַרְזֶל: יוֹצִיאֵם מֵחֹשֶׁךְ וְצַלְמָוֶת וּמוֹסְרוֹתֵיהֶם יְנַתֵּק: אֱוִלִים מִדֶּרֶךְ פִּשְׁעָם וּמֵעֲוֹנֹתֵיהֶם יִתְעַנּוּ: כָּל אֹכֶל תְּתַעֵב נַפְשָׁם וַיַּגִּיעוּ עַד שַׁעֲרֵי מָוֶת: וַיִּזְעֲקוּ אֶל אֲדֹנָי בַּצַּר לָהֶם מִמְּצֻקוֹתֵיהֶם יוֹשִׁיעֵם: יִשְׁלַח דְּבָרוֹ וְיִרְפָּאֵם וִימַלֵּט מִשְּׁחִיתוֹתָם: יוֹדוּ לַיהוָה חַסְדּוֹ וְנִפְלְאוֹתָיו לִבְנֵי אָדָם: אִם יֵשׁ עָלָיו מַלְאָךְ מֵלִיץ אֶחָד מִנִּי אָלֶף, לְהַגִּיד לְאָדָם יָשְׁרוֹ: וַיְחֻנֶּנּוּ וַיֹּאמֶר פְּדָעֵהוּ מֵרֶדֶת שָׁחַת מָצָאתִי כֹפֶר:`,
  transliteration: `B'nei adam yoshvei choshech v'tzalmavet asirei oni uvarzel: yotziem mechoshech v'tzalmavet umosrotehem yenatek: evilim miderech pish'am ume'avonoteihem yit'anu: kol ochel teta'ev nafsham vayagi'u ad sha'arei mavet: vayiz'aku el Adonai batzar lahem mimtzukoteihem yoshi'em: yishlach d'varo v'yirpa'em vimaltet mishchitotam: yodu l'Adonai chasdo v'nifla'otav livnei adam: im yesh alav mal'ach melitz echad mini alef, l'hagid l'adam yoshro: vayechunennu vayomer peda'ehu meredet shachat matzati chofer.`,
  english: `Children of man who sit in darkness and the shadow of death, bound in affliction and iron chains: He brings them out from darkness and the shadow of death, and breaks their bonds. Fools, because of their transgression and their iniquities, are afflicted. Their soul abhors all food, and they draw near to the gates of death. Then they cry to the Lord in their trouble, and He delivers them from their distress. He sends His word and heals them, and rescues them from their destruction. Let them give thanks to the Lord for His steadfast love and His wonderful works to the children of man! If there be an angel over him, an interpreter, one among a thousand, to declare to man what is right for him, and he is gracious to him, and says, 'Deliver him from going down to the pit; I have found a ransom.'`
};

export default function PrayerDisplay() {
  const router = useRouter();
  const [activeLanguage, setActiveLanguage] = useState<LanguageType>('hebrew');
  const [donationData, setDonationData] = useState<DonationData | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [showIntroductory, setShowIntroductory] = useState<boolean>(true);

  useEffect(() => {
    // Load donation data and check if valid
    const data = getDonationData();
    const session = getSessionData();
    
    if (!data || !data.prayerType) {
      // No data - redirect back to start
      router.push('/');
      return;
    }
    
    setDonationData(data);
    setSessionData(session);
  }, [router]);

  const handleLanguageToggle = (language: LanguageType) => {
    setActiveLanguage(language);
  };

  const markPrayerCompleted = () => {
    if (!sessionData) return;
    
    // Mark the most recent prayer as completed
    if (sessionData.prayers && sessionData.prayers.length > 0) {
      sessionData.prayers[sessionData.prayers.length - 1].completedAt = new Date().toISOString();
      saveSessionData(sessionData);
    }
  };

  const handlePerformAnother = () => {
    markPrayerCompleted();
    
    // Get session data for email prefilling
    const email = sessionData?.email || '';
    
    // Redirect back to index with prefilled email
    router.push(email ? `/?email=${encodeURIComponent(email)}` : '/');
  };

  const handleProceedToDonate = () => {
    markPrayerCompleted();
    
    // Prepare final donation data
    if (sessionData && donationData) {
      const finalDonationData: DonationData = {
        prayerType: 'multiple' as PrayerType,
        amount: sessionData.totalAmount,
        email: sessionData.email,
        timestamp: new Date().toISOString(),
        transactionId: generateTransactionId()
      };
      
      // Store for payment page
      saveDonationData(finalDonationData);
    }
    
    // Go to payment page
    router.push('/payment');
  };

  if (!donationData) {
    return <div>Loading...</div>;
  }

  const prayer = PRAYERS[donationData.prayerType];
  const totalAmount = sessionData?.totalAmount || donationData.amount;

  return (
    <div className="container">
      <header className="header">
        <h1>Your Kapparot Prayer</h1>
        <p className="subtitle">Recite this prayer three times while circling the money over your head</p>
      </header>

      <main className="main-content">
        {/* Prayer Summary */}
        <div className="donation-summary">
          <h2>Prayer Details</h2>
          <div className="summary-card">
            <p><strong>Performing Kapparot for:</strong> {getPrayerTypeDisplayName(donationData.prayerType)}</p>
            <p><strong>Amount:</strong> ${donationData.amount}</p>
            {sessionData?.email && <p><strong>Email:</strong> {sessionData.email}</p>}
          </div>
        </div>

        {/* Prayer Instructions */}
        <div className="prayer-instructions">
          <h4>How to Perform Kapparot</h4>
          <ol>
            <li>Hold the money in your right hand</li>
            <li>Circle the money over your head three times</li>
            <li>Recite the prayer below each time you circle</li>
            <li>After completing, choose your next step below</li>
          </ol>
        </div>

        {/* Prayer Toggle Buttons */}
        <div className="prayer-controls">
          <div className="toggle-container">
            <button 
              className={`toggle-button ${activeLanguage === 'hebrew' ? 'active' : ''}`}
              onClick={() => handleLanguageToggle('hebrew')}
            >
              <span className="toggle-label-desktop">עברית (Hebrew)</span>
              <span className="toggle-label-mobile">עברית</span>
            </button>
            <button 
              className={`toggle-button ${activeLanguage === 'transliteration' ? 'active' : ''}`}
              onClick={() => handleLanguageToggle('transliteration')}
            >
              <span className="toggle-label-desktop">Transliteration</span>
              <span className="toggle-label-mobile">TR</span>
            </button>
            <button 
              className={`toggle-button ${activeLanguage === 'english' ? 'active' : ''}`}
              onClick={() => handleLanguageToggle('english')}
            >
              <span className="toggle-label-desktop">English</span>
              <span className="toggle-label-mobile">EN</span>
            </button>
          </div>
          
          {/* Introductory Prayer Toggle */}
          <div className="introductory-toggle">
            <button 
              className="intro-toggle-btn"
              onClick={() => setShowIntroductory(!showIntroductory)}
            >
              <span className="toggle-icon">📖</span>
              {showIntroductory ? 'Hide' : 'Show'} Introductory Prayer
              <span className="chevron-icon">{showIntroductory ? '↑' : '↓'}</span>
            </button>
          </div>
        </div>

        {/* Prayer Content */}
        <div className="prayer-container">
          {/* Hebrew Prayer */}
          <div className={`prayer-text ${activeLanguage === 'hebrew' ? 'active' : ''}`}>
            {showIntroductory && (
              <div className="introductory-prayer">
                <p className="prayer-content hebrew-text">{INTRODUCTORY_PRAYER.hebrew}</p>
                <div className="prayer-divider"></div>
              </div>
            )}
            <div className="main-prayer">
              <p className="prayer-content hebrew-text">{prayer.hebrew}</p>
            </div>
          </div>

          {/* Transliteration */}
          <div className={`prayer-text ${activeLanguage === 'transliteration' ? 'active' : ''}`}>
            {showIntroductory && (
              <div className="introductory-prayer">
                <p className="prayer-content transliteration-text">{INTRODUCTORY_PRAYER.transliteration}</p>
                <div className="prayer-divider"></div>
              </div>
            )}
            <div className="main-prayer">
              <p className="prayer-content transliteration-text">{prayer.transliteration}</p>
            </div>
          </div>

          {/* English Prayer */}
          <div className={`prayer-text ${activeLanguage === 'english' ? 'active' : ''}`}>
            {showIntroductory && (
              <div className="introductory-prayer">
                <p className="prayer-content english-text">{INTRODUCTORY_PRAYER.english}</p>
                <div className="prayer-divider"></div>
              </div>
            )}
            <div className="main-prayer">
              <p className="prayer-content english-text">{prayer.english}</p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="completion-section">
          <h3>What would you like to do next?</h3>
          <p>After reciting the prayer three times, choose your next step:</p>

          <div className="action-buttons">
            <button className="action-btn secondary-btn" onClick={handlePerformAnother}>
              Perform Another Kapparot
            </button>
            <button className="action-btn primary-btn" onClick={handleProceedToDonate}>
              Donate (Total: ${totalAmount.toFixed(2)})
            </button>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Kapparot.org . May your prayers be answered and your giving bring blessing.</p>
      </footer>
    </div>
  );
}
