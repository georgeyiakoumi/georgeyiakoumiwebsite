import { Mulish } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from '@/components/google-analytics';
import { generateSiteMetadata } from "@/lib/metadata";
import { SEOScripts } from "@/components/seo-scripts";
import { ConditionalLayout } from "@/components/conditional-layout";
import { getAboutPage } from "@/lib/strapi-queries";

// Import safelist to ensure Tailwind scans it for dynamic Strapi classes
import "@/lib/tailwind-safelist";

const mulish = Mulish({
  subsets: ["latin"],
  display: 'swap',
});

export const generateMetadata = generateSiteMetadata;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const aboutData = await getAboutPage();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <SEOScripts />
      </head>
      <body className={mulish.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ConditionalLayout cvUrl={aboutData?.cvUrl} email={aboutData?.email}>
            {children}
          </ConditionalLayout>

          <Toaster />
        </ThemeProvider>
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}