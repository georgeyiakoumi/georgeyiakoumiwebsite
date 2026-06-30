import React from "react";
import type { SnapshotItem, SnapshotContent } from "@/lib/strapi-queries";
import { Badge } from "@/components/ui/badge";

interface SnapshotBlockProps {
  items: SnapshotItem[];
  projectRole?: string;
  toolsContent?: React.ReactNode;
}

function SnapshotValue({ content, projectRole }: { content: SnapshotContent[]; projectRole?: string }) {
  const component = content[0];
  if (!component) return null;

  if (component.__component === 'project-blocks.badge-value') {
    return (
      <div className="flex flex-wrap gap-1.5">
        {component.badges.map((badge) => (
          <Badge key={badge.id} variant="secondary">{badge.name}</Badge>
        ))}
        {projectRole && (
          <Badge variant="secondary">
            <span aria-hidden="true">&#x1F64B;</span> {projectRole}
          </Badge>
        )}
      </div>
    );
  }

  if (component.__component === 'project-blocks.string-value') {
    return <span>{component.text}</span>;
  }

  return null;
}

export function SnapshotBlock({ items: rawItems, projectRole, toolsContent }: SnapshotBlockProps) {
  const items = rawItems.filter((item) => item.label?.trim() && item.content?.length > 0);

  if (items.length === 0 && !toolsContent) return null;

  return (
    <div className="mx-auto w-full md:max-w-2xl xl:max-w-2xl px-8 md:px-0">
      <section className="md:max-w-xl mx-auto">
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-5">
          {items.map((item) => (
            <React.Fragment key={item.id}>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground pt-0.5">
                {item.label}
              </dt>
              <dd className="text-sm text-foreground">
                <SnapshotValue
                  content={item.content}
                  projectRole={item.label.toLowerCase() === 'team' ? projectRole : undefined}
                />
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
      </section>
    </div>
  );
}
