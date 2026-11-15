import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { generateSiteMetadata } from "@/lib/metadata";
import { SEOScripts } from "@/components/seo-scripts";
import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { getAboutPage } from "@/lib/strapi-queries";

// Import safelist to ensure Tailwind scans it for dynamic Strapi classes
import "@/lib/tailwind-safelist";

const font = Outfit({
  subsets: ["latin"],
  display: 'swap',
});

export const generateMetadata = generateSiteMetadata;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const aboutData = await getAboutPage();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
<SEOScripts />
      </head>
      <body className={font.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ConditionalLayout cvUrl={aboutData?.cvUrl} email={aboutData?.email}>
            {children}
          </ConditionalLayout>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}