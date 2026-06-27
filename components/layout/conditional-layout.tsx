"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SiteNavigation } from "@/components/layout/site-navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { ModeToggle } from "@/components/layout/mode-toggle";
import { ScrollVisibilityProvider } from "@/hooks/use-scroll-visibility";
import { useScrollVisibility } from "@/hooks/use-scroll-visibility";

gsap.registerPlugin(useGSAP);

function HeaderBackdrop() {
  const scrollVisible = useScrollVisibility();

  return (
    <div
      aria-hidden="true"
      style={{ transform: scrollVisible ? 'translateY(0)' : 'translateY(-120%)' }}
      className={`fixed top-0 left-0 right-0 h-20 z-9 pointer-events-none bg-background/90 backdrop-blur-sm lg:hidden transition-[transform,opacity] duration-300 ease-out will-change-transform motion-reduce:transition-none ${scrollVisible ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}

interface ConditionalLayoutProps {
  children: React.ReactNode;
  cvUrl?: string;
  email?: string;
}

export function ConditionalLayout({ children, cvUrl, email }: ConditionalLayoutProps) {
  const layoutRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!layoutRef.current) return;

    const nav = layoutRef.current.querySelector("nav");
    const toggle = layoutRef.current.querySelector("[data-layout-toggle]");
    const footer = layoutRef.current.querySelector("footer");

    const targets = [nav, toggle, footer].filter(Boolean);
    if (targets.length === 0) return;

    gsap.set(targets, { autoAlpha: 0 });

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        isMobile: "(max-width: 1023px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions!;

        if (reduceMotion) {
          gsap.set(targets, { autoAlpha: 1 });
          return;
        }

        const tl = gsap.timeline({ delay: 0.6 });

        // Fade + blur entrance for all breakpoints
        // (transforms conflict with CSS !transform-none and translateX(-50%) centering)
        if (nav) {
          tl.fromTo(nav,
            { autoAlpha: 0, filter: "blur(4px)" },
            { autoAlpha: 1, filter: "blur(0px)", duration: 0.6, ease: "power2.out", clearProps: "opacity,visibility,filter" },
            0
          );
        }
        if (toggle) {
          tl.fromTo(toggle,
            { autoAlpha: 0, filter: "blur(4px)" },
            { autoAlpha: 1, filter: "blur(0px)", duration: 0.6, ease: "power2.out", clearProps: "opacity,visibility,filter" },
            0.1
          );
        }
        if (footer) {
          tl.fromTo(footer,
            { autoAlpha: 0, filter: "blur(4px)" },
            { autoAlpha: 1, filter: "blur(0px)", duration: 0.6, ease: "power2.out", clearProps: "opacity,visibility,filter" },
            0.2
          );
        }
      }
    );
  }, { scope: layoutRef });

  return (
    <div ref={layoutRef}>
      <ScrollVisibilityProvider>
        <SiteNavigation cvUrl={cvUrl} email={email} />
        <ModeToggle />
        <HeaderBackdrop />

        <main className="h-dvh overflow-y-auto relative scrollbar-hide">
          {children}
        </main>

        <SiteFooter />
      </ScrollVisibilityProvider>
    </div>
  );
}
