"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRef, useTransition, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { getNavItems, type NavItemConfig } from "@/lib/nav-items";

type IconHandle = { startAnimation: () => void; stopAnimation: () => void };

// --- NavItem ---

function NavItem({
  item,
  pathname,
  isPending,
  pendingPath,
  onNavClick,
}: {
  item: NavItemConfig;
  pathname: string;
  isPending?: boolean;
  pendingPath?: string | null;
  onNavClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) {
  const iconRef = useRef<IconHandle>(null);
  const isActive = !item.external && pathname === item.href;
  const showSpinner = isPending && pendingPath === item.href;
  const Icon = item.icon;

  const linkProps = {
    "aria-label": item.ariaLabel,
    onMouseEnter: () => iconRef.current?.startAnimation(),
    onMouseLeave: () => iconRef.current?.stopAnimation(),
  };

  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild active={isActive} className={item.className}>
        {item.external ? (
          <a
            href={item.href}
            target={item.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            {...linkProps}
          >
            <Icon ref={iconRef} />
            <span>{item.label}</span>
          </a>
        ) : (
          <Link
            href={item.href}
            onClick={(e) => onNavClick?.(e, item.href)}
            {...linkProps}
          >
            {showSpinner ? <Spinner className="size-5" /> : <Icon ref={iconRef} />}
            <span>{item.label}</span>
          </Link>
        )}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

// --- SiteNavigation ---

interface SiteNavigationProps {
  cvUrl?: string;
  email?: string;
  className?: string;
}

export function SiteNavigation({ cvUrl, email, className }: SiteNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const navVisible = useScrollVisibility();
  const [isPending, startTransition] = useTransition();
  const pendingPathRef = useRef<string | null>(null);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === pathname) return;
    pendingPathRef.current = href;
    startTransition(() => {
      router.push(href);
    });
  };

  const navItems = useMemo(() => getNavItems(cvUrl, email), [cvUrl, email]);

  return (
    <NavigationMenu
      orientation="vertical"
      style={{ transform: `translateX(-50%) translateY(${navVisible ? '0' : '120%'})` }}
      className={cn(
        "fixed box-border items-start left-1/2 bottom-8",
        "lg:!transform-none lg:left-16 lg:bottom-auto lg:top-16",
        "bg-background rounded-full border border-border",
        "lg:border-0 overflow-hidden lg:overflow-visible lg:rounded-lg",
        "transition-[transform,opacity] duration-300 ease-out will-change-transform motion-reduce:transition-none",
        navVisible
          ? "opacity-100"
          : "opacity-0 pointer-events-none lg:opacity-100 lg:pointer-events-auto",
        className
      )}
    >
      <NavigationMenuList>
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            pathname={pathname}
            isPending={isPending}
            pendingPath={pendingPathRef.current}
            onNavClick={item.external ? undefined : handleNavClick}
          />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
