"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { CalendarDaysIcon, type CalendarDaysIconHandle } from "@/components/ui/calendar-days";
import { Typography } from "@/components/ui/typography";

const CALENDLY_URL = "https://calendly.com/georgeyiakoumi/30min";

interface CalendlyButtonProps {
  label?: string;
}

export function CalendlyButton({ label = "Book a 30 minute call" }: CalendlyButtonProps) {
  const [open, setOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const calendarIconRef = useRef<CalendarDaysIconHandle>(null);

  useEffect(() => {
    if (!open) return;
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, [open]);

  return (
    <>
      <Button
        size="lg"
        variant="outline"
        onClick={() => setOpen(true)}
        onMouseEnter={() => calendarIconRef.current?.startAnimation()}
        onMouseLeave={() => calendarIconRef.current?.stopAnimation()}
      >
        <CalendarDaysIcon ref={calendarIconRef} />
        {label}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
            <SheetTitle asChild>
              <Typography variant="h4">Book a call</Typography>
            </SheetTitle>
            <Typography variant="muted">30 min · Google Meet</Typography>
          </SheetHeader>

          <div className="flex-1 min-h-0">
            <iframe
              ref={iframeRef}
              src={`${CALENDLY_URL}?embed_type=Inline&hide_landing_page_details=1&hide_gdpr_banner=1`}
              className="w-full h-full border-0"
              title="Book a call with George Yiakoumi"
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
