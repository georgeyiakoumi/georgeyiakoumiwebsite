"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { createHighlighter, type Highlighter } from "shiki";
import { BlockFigure } from "./block-figure";
import { BlockCaption } from "./block-caption";
import type { CodeBlockType } from "@/lib/strapi-queries";

const SUPPORTED_LANGS = [
  "typescript", "javascript", "css", "html", "json",
  "bash", "python", "go", "rust", "sql", "yaml", "markdown", "diff",
] as const;

const THEMES = ["github-dark", "github-light"] as const;

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [...THEMES],
      langs: [...SUPPORTED_LANGS],
    });
  }
  return highlighterPromise;
}

interface CodeBlockProps {
  block: CodeBlockType;
}

export function CodeBlock({ block }: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const { resolvedTheme } = useTheme();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    const theme = resolvedTheme === "dark" ? "github-dark" : "github-light";

    getHighlighter().then((highlighter) => {
      if (!mountedRef.current) return;
      const result = highlighter.codeToHtml(block.code, {
        lang: block.language || "typescript",
        theme,
      });
      setHtml(result);
    });

    return () => { mountedRef.current = false; };
  }, [block.code, block.language, resolvedTheme]);

  return (
    <BlockFigure>
      {block.filename && (
        <div className={`w-full rounded-t-lg border border-b-0 border-border bg-muted px-4 py-2 text-xs -mb-2 text-muted-foreground font-mono ${html ? "" : "mb-0"}`}>
          {block.filename}
        </div>
      )}
      <div
        className={`w-full [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-relaxed [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border ${block.filename ? "[&_pre]:rounded-t-none [&_pre]:border-t-0 -mt-2" : ""}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {block.caption && (
        <BlockCaption>{block.caption}</BlockCaption>
      )}
    </BlockFigure>
  );
}
