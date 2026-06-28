"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useRef, useTransition } from "react";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";
import { UserIcon, type UserIconHandle } from "@/components/ui/user";
import { GalleryVerticalEndIcon, type GalleryVerticalEndIconHandle } from "@/components/ui/gallery-vertical-end";
import { FileTextIcon, type FileTextIconHandle } from "@/components/ui/file-text";
import { AtSignIcon, type AtSignIconHandle } from "@/components/ui/at-sign";
import { GithubIcon, type GithubIconHandle } from "@/components/ui/github";
import { LinkedinIcon, type LinkedinIconHandle } from "@/components/ui/linkedin";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";

interface SiteNavigationProps {
  cvUrl?: string;
  email?: string;
}

export function SiteNavigation({ cvUrl, email, className }: SiteNavigationProps & { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const userIconRef = useRef<UserIconHandle>(null);
  const galleryIconRef = useRef<GalleryVerticalEndIconHandle>(null);
  const fileTextIconRef = useRef<FileTextIconHandle>(null);
  const atSignIconRef = useRef<AtSignIconHandle>(null);
  const linkedinIconRef = useRef<LinkedinIconHandle>(null);
  const githubIconRef = useRef<GithubIconHandle>(null);
  const [isPending, startTransition] = useTransition();
  const pendingPathRef = useRef<string | null>(null);
  const navVisible = useScrollVisibility();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === pathname) return;
    pendingPathRef.current = href;
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <NavigationMenu orientation="vertical" style={{ transform: `translateX(-50%) translateY(${navVisible ? '0' : '120%'})` }} className={cn("bg-background rounded-full border border-border lg:border-0 overflow-hidden lg:overflow-visible lg:rounded-lg fixed box-border items-start left-1/2 lg:!transform-none lg:left-8 lg:left-16 bottom-8 lg:bottom-auto lg:top-8 lg:top-16 transition-[transform,opacity] duration-300 ease-out will-change-transform motion-reduce:transition-none", navVisible ? "opacity-100" : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto", className)}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild active={pathname === NAV_LINKS.about.href} className="pl-6">
            <Link
              href={NAV_LINKS.about.href}
              aria-label={NAV_LINKS.about.ariaLabel}
              onClick={(e) => handleNavClick(e, NAV_LINKS.about.href)}
              onMouseEnter={() => userIconRef.current?.startAnimation()}
              onMouseLeave={() => userIconRef.current?.stopAnimation()}
            >
              {isPending && pendingPathRef.current === NAV_LINKS.about.href ? (
                <Spinner />
              ) : (
                <UserIcon ref={userIconRef} />
              )}
              <span>{NAV_LINKS.about.label}</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild active={pathname === NAV_LINKS.projects.href}>
            <Link
              href={NAV_LINKS.projects.href}
              aria-label={NAV_LINKS.projects.ariaLabel}
              onClick={(e) => handleNavClick(e, NAV_LINKS.projects.href)}
              onMouseEnter={() => galleryIconRef.current?.startAnimation()}
              onMouseLeave={() => galleryIconRef.current?.stopAnimation()}
            >
              {isPending && pendingPathRef.current === NAV_LINKS.projects.href ? (
                <Spinner />
              ) : (
                <GalleryVerticalEndIcon ref={galleryIconRef} />
              )}
              <span>{NAV_LINKS.projects.label}</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        {cvUrl && (
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View CV"
                onMouseEnter={() => fileTextIconRef.current?.startAnimation()}
                onMouseLeave={() => fileTextIconRef.current?.stopAnimation()}
              >
                <FileTextIcon ref={fileTextIconRef} />
                <span>CV</span>
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
        {email && (
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <a
                href={`mailto:${email}`}
                aria-label={`Email ${email}`}
                onMouseEnter={() => atSignIconRef.current?.startAnimation()}
                onMouseLeave={() => atSignIconRef.current?.stopAnimation()}
              >
                <AtSignIcon ref={atSignIconRef} />
                <span>Email</span>
              </a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <a
              href={SOCIAL_LINKS.linkedin.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={SOCIAL_LINKS.linkedin.ariaLabel}
              onMouseEnter={() => linkedinIconRef.current?.startAnimation()}
              onMouseLeave={() => linkedinIconRef.current?.stopAnimation()}
            >
              <LinkedinIcon ref={linkedinIconRef} />
              <span>{SOCIAL_LINKS.linkedin.label}</span>
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className="pr-6">
            <a
              href={SOCIAL_LINKS.github.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={SOCIAL_LINKS.github.ariaLabel}
              onMouseEnter={() => githubIconRef.current?.startAnimation()}
              onMouseLeave={() => githubIconRef.current?.stopAnimation()}
            >
              <GithubIcon ref={githubIconRef} />
              <span>{SOCIAL_LINKS.github.label}</span>
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
