import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Kapparot Online - Ancient Jewish Atonement Ritual | Digital Tzedakah",
    template: "%s | Kapparot Online"
  },
  description: "Perform Kapparot (Kaporos) online - the ancient Jewish atonement ritual before Yom Kippur. Complete with Hebrew prayers, tzedakah donation options, and step-by-step guidance. Support Jewish families in Israel through this meaningful High Holy Days tradition. Free access to traditional prayers, modern payment methods, and authentic Jewish ceremony from anywhere in the world.",
  keywords: [
    // Core Terms
    "Kapparot", "Kaporos", "Kaparot", "Kaparos", "Kapparat", "Kapporos",
    "Yom Kippur", "Day of Atonement", "Atonement ritual", "Jewish atonement",
    
    // Jewish Traditions & Holidays
    "Jewish tradition", "Jewish ritual", "Jewish ceremony", "Jewish practice",
    "Jewish holidays", "High Holy Days", "High Holidays", "Rosh Hashanah",
    "Jewish New Year", "Judaism", "Orthodox", "Conservative", "Reform",
    "Hasidic", "Ashkenazi", "Sephardic", "religious ceremony",
    
    // Prayers & Religious Terms
    "Hebrew prayers", "Jewish prayers", "prayer book", "siddur", "machzor",
    "synagogue", "temple", "shul", "rabbi", "spiritual", "religious practice",
    "mitzvah", "commandment", "halacha", "halakha", "kosher", "ritual",
    
    // Charity & Giving
    "tzedakah", "tsedakah", "charity", "charitable giving", "donation",
    "Jewish charity", "religious donation", "online donation", "donate online",
    "give charity", "help Jewish families", "nonprofit", "501c3", "tax deductible",
    
    // Israel & Community
    "Israel support", "Eretz Yisrael", "Holy Land", "Jewish families",
    "aliyah", "Jewish immigration", "Jewish community", "help Israel",
    "support Israel", "Jewish families Israel", "Israeli families",
    
    // Concepts & Themes
    "atonement", "forgiveness", "repentance", "teshuvah", "spiritual cleansing",
    "ancient tradition", "traditional practice", "religious observance",
    "spiritual practice", "faith", "belief", "sacred", "holy",
    
    // Modern/Digital Terms
    "online Kapparot", "digital Kapparot", "virtual Kapparot", "online ritual",
    "digital ceremony", "internet donation", "online Jewish practice",
    "modern Judaism", "contemporary Jewish practice",
    
    // Search Variations
    "how to do Kapparot", "Kapparot ceremony", "Kapparot prayer", "Kapparot ritual",
    "what is Kapparot", "Kapparot explained", "Kapparot tradition", "Kapparot online",
    "perform Kapparot", "Kapparot at home", "Kapparot without chicken",
    "Kapparot with money", "Kapparot donation", "Kapparot charity"
  ],
  authors: [{ name: "Ahavas Yisroel Inc." }],
  creator: "Ahavas Yisroel Inc.",
  publisher: "Ahavas Yisroel Inc.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  category: 'Religion & Spirituality',
  classification: 'Jewish Religious Practice',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['he_IL'],
    siteName: 'Kapparot Online',
    title: 'Kapparot Online - Ancient Jewish Atonement Ritual | Digital Tzedakah',
    description: 'Perform the ancient Jewish tradition of Kapparot before Yom Kippur through charitable giving. Support Jewish families in Israel with traditional Hebrew prayers.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Kapparot Online - Jewish Atonement Ritual',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@KapparotOnline',
    creator: '@AhavasYisroel',
    title: 'Kapparot Online - Ancient Jewish Atonement Ritual',
    description: 'Perform Kapparot before Yom Kippur through tzedakah. Traditional Hebrew prayers with modern convenience.',
    images: ['/twitter-image.png'],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://kapparot.org',
    languages: {
      'en-US': '/en-US',
      'he-IL': '/he-IL',
    },
  },
  other: {
    'theme-color': '#1a365d',
    'color-scheme': 'light',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "#website",
        "name": "Kapparot Online",
        "description": "Ancient Jewish atonement ritual performed through charitable giving",
        "url": process.env.NEXT_PUBLIC_SITE_URL || "https://kapparot.org",
        "inLanguage": ["en-US", "he-IL"],
        "publisher": {
          "@id": "#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.google.com/search?q=site%3A{search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "#organization",
        "name": "Ahavas Yisroel Inc.",
        "legalName": "Ahavas Yisroel Inc.",
        "description": "501(c)(3) nonprofit organization supporting Jewish families who made aliyah to Israel",
        "taxID": "81-3495350",
        "nonprofitStatus": "501(c)(3)",
        "foundingDate": "2020",
        "url": process.env.NEXT_PUBLIC_SITE_URL || "https://kapparot.org",
        "logo": {
          "@type": "ImageObject",
          "url": "/favicon.svg",
          "width": "512",
          "height": "512"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "email": "yishuveypushka@gmail.com",
          "contactType": "customer service"
        },
        "areaServed": "Worldwide",
        "knowsAbout": [
          "Jewish traditions",
          "Kapparot ritual",
          "Yom Kippur",
          "Tzedakah",
          "Israel support"
        ]
      },
      {
        "@type": "WebApplication",
        "name": "Kapparot Online",
        "description": "Digital platform for performing the ancient Jewish Kapparot tradition through charitable giving",
        "url": process.env.NEXT_PUBLIC_SITE_URL || "https://kapparot.org",
        "applicationCategory": "Religious Application",
        "operatingSystem": "Web Browser",
        "permissions": "none",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "description": "Free platform for performing Kapparot ritual through donations"
        },
        "featureList": [
          "Traditional Hebrew prayers",
          "Multiple payment methods",
          "Guided ceremony",
          "Mobile-friendly interface",
          "Receipt generation"
        ]
      },
      {
        "@type": "Event",
        "name": "Kapparot Ritual",
        "description": "Ancient Jewish atonement ceremony performed before Yom Kippur",
        "eventStatus": "EventScheduled",
        "eventAttendanceMode": "OnlineEventAttendanceMode",
        "isAccessibleForFree": true,
        "inLanguage": ["en-US", "he-IL"],
        "keywords": "Kapparot, Yom Kippur, Jewish tradition, atonement, tzedakah",
        "organizer": {
          "@id": "#organization"
        },
        "location": {
          "@type": "VirtualLocation",
          "url": process.env.NEXT_PUBLIC_SITE_URL || "https://kapparot.org"
        }
      },
      {
        "@type": "Service",
        "name": "Online Kapparot Service",
        "description": "Digital platform enabling the performance of the traditional Jewish Kapparot ritual through charitable giving",
        "provider": {
          "@id": "#organization"
        },
        "serviceType": "Religious Service",
        "areaServed": "Worldwide",
        "availableLanguage": ["English", "Hebrew"],
        "isRelatedTo": [
          "Yom Kippur",
          "Jewish holidays",
          "Tzedakah",
          "Charitable giving"
        ]
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </head>
      <body className={inter.variable}>
        {children}
      </body>
    </html>
  );
}
