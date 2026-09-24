import { Suspense } from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/components/providers/language-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { SearchProvider } from "@/components/providers/search-provider";
import { SearchModal } from "@/components/search/search-modal";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RouteTransitionLoader } from "@/components/layout/route-transition-loader";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Bangladesh Software Job Preparation`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon.ico?v=2" },
      { url: "/logo.png?v=2", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: "/logo.png?v=2",
  },
  keywords: [
    "Bangladesh software job preparation",
    "C# programming",
    "Enosis interview questions",
    "Brain Station 23 interview",
    "data structures algorithms",
    "system design",
    "competitive programming",
    "software engineering Dhaka",
    "Therap BD questions",
    "Samsung R&D coding test",
  ],
  openGraph: {
    title: `${SITE_NAME} — Bangladesh Software Job Preparation`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Bangladesh Software Job Preparation`,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": SITE_NAME,
    "description": SITE_DESCRIPTION,
    "provider": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL,
    },
    "inLanguage": ["en", "bn"],
    "isAccessibleForFree": true,
  };

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <SearchProvider>
                <Suspense fallback={null}>
                  <RouteTransitionLoader />
                </Suspense>
                <Navbar />
                <div className="flex-1 flex flex-col">{children}</div>
                <Footer />
                <SearchModal />
              </SearchProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
