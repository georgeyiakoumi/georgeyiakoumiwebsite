import React from "react";
import type { SnapshotItem } from "@/lib/strapi-queries";
import { Badge } from "@/components/ui/badge";

interface SnapshotBlockProps {
  items: SnapshotItem[];
  toolsContent?: React.ReactNode;
}

/**
 * Parse snapshot value text for inline tags like {{me}}.
 * Returns the original string if no tags are found.
 */
function parseSnapshotValue(value: string): React.ReactNode {
  const ME_REGEX = /\{\{me\}\}/gi;
  if (!ME_REGEX.test(value)) return value;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let matchIndex = 0;

  const regex = new RegExp(ME_REGEX.source, 'gi');
  let match: RegExpExecArray | null;

  while ((match = regex.exec(value)) !== null) {
    if (match.index > lastIndex) {
      parts.push(value.slice(lastIndex, match.index));
    }
    parts.push(
      <Badge key={`me-${matchIndex}`} variant="secondary" className="text-xs">
        <span aria-hidden="true">&#x1F64B;</span> me
      </Badge>
    );
    lastIndex = match.index + match[0].length;
    matchIndex++;
  }

  if (lastIndex < value.length) {
    parts.push(value.slice(lastIndex));
  }

  return <>{parts}</>;
}

export function SnapshotBlock({ items: rawItems, toolsContent }: SnapshotBlockProps) {
  const items = rawItems.filter(
    (item) => item.label?.trim() && item.value?.trim()
  );

  if (items.length === 0) return null;

  return (
    <div className="mx-auto w-full md:max-w-lg lg:max-w-xl xl:max-w-2xl px-8 lg:px-0 mb-16">
      <div>
        <dl className="grid grid-cols-[4rem_1fr] gap-x-4 gap-y-5 sm:grid-cols-[3rem_1fr]">
          {items.map((item) => (
            <React.Fragment key={item.id}>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground pt-0.5">
                {item.label}
              </dt>
              <dd className="text-sm text-foreground">
                {parseSnapshotValue(item.value)}
              </dd>
            </React.Fragment>
          ))}
          {toolsContent && (
            <>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground pt-1">
                Tools
              </dt>
              <dd className="pt-0.5">
                <div className="flex flex-wrap gap-2">
                  {toolsContent}
                </div>
              </dd>
            </>
          )}
        </dl>
      </div>
    </div>
  );
}
