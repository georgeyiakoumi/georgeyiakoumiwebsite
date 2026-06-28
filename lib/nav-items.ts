import { UserIcon } from "@/components/ui/user";
import { GalleryVerticalEndIcon } from "@/components/ui/gallery-vertical-end";
import { FileTextIcon } from "@/components/ui/file-text";
import { AtSignIcon } from "@/components/ui/at-sign";
import { GithubIcon } from "@/components/ui/github";
import { LinkedinIcon } from "@/components/ui/linkedin";
import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";

type IconHandle = { startAnimation: () => void; stopAnimation: () => void };

export interface NavItemConfig {
  href: string;
  label: string;
  ariaLabel: string;
  icon: React.ComponentType<{ ref?: React.Ref<IconHandle> }>;
  external?: boolean;
  className?: string;
}

export function getNavItems(cvUrl?: string, email?: string): NavItemConfig[] {
  return [
    { href: NAV_LINKS.about.href, label: NAV_LINKS.about.label, ariaLabel: NAV_LINKS.about.ariaLabel, icon: UserIcon, className: "pl-6" },
    { href: NAV_LINKS.projects.href, label: NAV_LINKS.projects.label, ariaLabel: NAV_LINKS.projects.ariaLabel, icon: GalleryVerticalEndIcon },
    ...(cvUrl ? [{ href: cvUrl, label: "CV", ariaLabel: "View CV", icon: FileTextIcon, external: true }] : []),
    ...(email ? [{ href: `mailto:${email}`, label: "Email", ariaLabel: `Email ${email}`, icon: AtSignIcon, external: true }] : []),
    { href: SOCIAL_LINKS.linkedin.url, label: SOCIAL_LINKS.linkedin.label, ariaLabel: SOCIAL_LINKS.linkedin.ariaLabel, icon: LinkedinIcon, external: true },
    { href: SOCIAL_LINKS.github.url, label: SOCIAL_LINKS.github.label, ariaLabel: SOCIAL_LINKS.github.ariaLabel, icon: GithubIcon, external: true, className: "pr-6" },
  ];
}
