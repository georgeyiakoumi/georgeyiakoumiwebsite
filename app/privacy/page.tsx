import Link from "next/link";
import { generatePageMetadata } from "@/lib/metadata";
import { Section } from "@/components/layout/section";
import { Typography } from "@/components/ui/typography";
import { PRIVACY_LAST_UPDATED } from "@/lib/constants";

const lastUpdated = new Date(PRIVACY_LAST_UPDATED).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export const revalidate = 3600;

export const generateMetadata = async () => {
  return generatePageMetadata({
    title: "Privacy",
    description: "This site doesn't use cookies, analytics or tracking. Here's the small amount of data its hosting providers process, and your rights.",
    path: "/privacy",
  });
};

export default function PrivacyPage() {
  return (
    <Section>
      <article className="flex flex-col gap-6 max-w-prose w-full">
        <Typography variant="h1">Privacy</Typography>

        <Typography>
          This site doesn&apos;t use cookies, analytics or tracking, and it doesn&apos;t collect any information about you.
        </Typography>

        <Typography>
          This site is hosted on Netlify and served through Cloudflare. To deliver pages and keep the site secure, they briefly process your IP address and basic technical details of each request. I don&apos;t see or use that data, and they keep it according to their own policies.
        </Typography>

        <Typography>
          If you choose to email me, your message is used only to reply.
        </Typography>

        <Typography>
          This site is run by George Yiakoumi. Under UK GDPR you have rights over your personal data, including the right to complain to the Information Commissioner&apos;s Office. For data requests, use the email link on the{" "}
          <Link href="/" className="text-primary underline underline-offset-4 xl:hover:no-underline">
            homepage
          </Link>
          .
        </Typography>

        <Typography variant="muted">
          Last updated: <time dateTime={PRIVACY_LAST_UPDATED}>{lastUpdated}</time>
        </Typography>
      </article>
    </Section>
  );
}
