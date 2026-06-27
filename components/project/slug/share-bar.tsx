"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { CopyIcon, type CopyIconHandle } from "@/components/ui/copy";
import { CheckIcon, type CheckIconHandle } from "@/components/ui/check";
import { SendIcon, type SendIconHandle } from "@/components/ui/send";
import { LinkedinIcon, type LinkedinIconHandle } from "@/components/ui/linkedin";

interface ShareBarProps {
  url?: string;
  type?: "client" | "personal" | "article";
}

export function ShareBar({ url: urlProp, type }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [url, setUrl] = useState(urlProp ?? "");
  const linkedinRef = useRef<LinkedinIconHandle>(null);
  const copyRef = useRef<CopyIconHandle>(null);
  const checkRef = useRef<CheckIconHandle>(null);
  const sendRef = useRef<SendIconHandle>(null);

  useEffect(() => {
    if (!urlProp) setUrl(window.location.href);
    setCanShare(!!navigator.share && window.matchMedia("(pointer: coarse)").matches);
  }, [urlProp]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    checkRef.current?.startAnimation();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    navigator.share({ url });
  };

  const linkedInCopy =
    type === "article" ? "Check out this article" : "Check out this case study";
  const linkedInUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(`${linkedInCopy}\n\n${url}`)}`;

  return (
    <div className="flex items-center justify-center gap-2 mx-auto w-full md:max-w-lg lg:max-w-2xl xl:max-w-4xl 2xl:max-w-6xl px-8 lg:px-0 py-8 mt-16 border-t border-border">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className="cursor-pointer gap-1.5"
        onMouseEnter={() => (copied ? checkRef : copyRef).current?.startAnimation()}
        onMouseLeave={() => (copied ? checkRef : copyRef).current?.stopAnimation()}
      >
        {copied ? <CheckIcon ref={checkRef} /> : <CopyIcon ref={copyRef} />}
        {copied ? "Copied!" : "Copy link"}
      </Button>

      {canShare && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="cursor-pointer gap-1.5"
          onMouseEnter={() => sendRef.current?.startAnimation()}
          onMouseLeave={() => sendRef.current?.stopAnimation()}
        >
          <SendIcon ref={sendRef} />
          Share
        </Button>
      )}

      {!canShare && (
        <Button variant="outline" size="sm" asChild className="cursor-pointer gap-1.5">
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => linkedinRef.current?.startAnimation()}
            onMouseLeave={() => linkedinRef.current?.stopAnimation()}
          >
            <LinkedinIcon ref={linkedinRef}/>
            Share on LinkedIn
          </a>
        </Button>
      )}
    </div>
  );
}
