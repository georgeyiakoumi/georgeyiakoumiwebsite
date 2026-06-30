"use client";

import type { SnapshotItem, SnapshotContent, ToolData } from "@/lib/strapi-queries";
import { Badge } from "@/components/ui/badge";
import { DataList } from "@/components/ui/data-list";
import { ToolBadge } from "@/components/project/project-blocks/tool-badge";
import { LinkIcon, type LinkIconHandle } from "@/components/ui/link";
import { GithubIcon, type GithubIconHandle } from "@/components/ui/github";
import { useRef } from "react";

interface SnapshotBlockProps {
  items: SnapshotItem[];
  projectRole?: string;
  tools?: ToolData[];
  websiteUrl?: string;
  githubUrl?: string;
}

function ensureProtocol(url: string) {
  return url.match(/^https?:\/\//) ? url : `https://${url}`;
}

function LinkRow({ url, type }: { url: string; type: 'website' | 'github' }) {
  const linkIconRef = useRef<LinkIconHandle>(null);
  const githubIconRef = useRef<GithubIconHandle>(null);

  if (type === 'github') {
    return (
      <DataList.Button
        href={ensureProtocol(url)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View source on GitHub"
        onMouseEnter={() => githubIconRef.current?.startAnimation()}
        onMouseLeave={() => githubIconRef.current?.stopAnimation()}
      >
        <GithubIcon ref={githubIconRef} size={14} />
        GitHub Repo
      </DataList.Button>
    );
  }

  return (
    <DataList.Button
      href={ensureProtocol(url)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visit website"
      onMouseEnter={() => linkIconRef.current?.startAnimation()}
      onMouseLeave={() => linkIconRef.current?.stopAnimation()}
    >
      <LinkIcon ref={linkIconRef} size={14} />
      View project
    </DataList.Button>
  );
}

function SnapshotValue({ content, projectRole }: { content: SnapshotContent[]; projectRole?: string }) {
  const component = content[0];
  if (!component) return null;

  if (component.__component === 'project-blocks.badge-value') {
    return (
      <>
        {component.badges.map((badge) => (
          <Badge key={badge.id} variant="outline">{badge.name}</Badge>
        ))}
        {projectRole && (
          <Badge variant="outline">
            <span aria-hidden="true">&#x1F64B;</span> {projectRole}
          </Badge>
        )}
      </>
    );
  }

  if (component.__component === 'project-blocks.string-value') {
    return (
      <span className="flex flex-col">
        <span>{component.text}</span>
        {component.subtext && (
          <span className="text-xs text-muted-foreground">{component.subtext}</span>
        )}
      </span>
    );
  }

  return null;
}

export function SnapshotBlock({ items: rawItems, projectRole, tools, websiteUrl, githubUrl }: SnapshotBlockProps) {
  const items = rawItems.filter((item) => item.label?.trim() && item.content?.length > 0);

  if (items.length === 0 && !tools?.length) return null;

  return (
    
      <section className="bg-gradient-to-b from-background to-muted/70 -mb-0 border-b border-border">
        <DataList orientation="horizontal" className="px-8 py-12 md:px-0">
          {items.map((item) => (
            <DataList.Item key={item.id}>
              <DataList.Label label={item.label} />
              <DataList.Value layout={item.content[0]?.__component === 'project-blocks.badge-value' ? 'wrap' : undefined}>
                <SnapshotValue
                  content={item.content} 
                  projectRole={item.label.toLowerCase() === 'team' ? projectRole : undefined}
                />
              </DataList.Value>
            </DataList.Item>
          ))}
          {tools && tools.length > 0 && (
            <DataList.Item>
              <DataList.Label label="Tools" />
              <DataList.Value layout="wrap">
                {tools.map((tool) => <ToolBadge key={tool.id} tool={tool} />)}
              </DataList.Value>
            </DataList.Item>
          )}
          {(websiteUrl || githubUrl) && (
            <DataList.Item>
              <DataList.Label label="Links" />
              <DataList.Value layout="wrap">
                {websiteUrl && <LinkRow url={websiteUrl} type="website" />}
                {githubUrl && <LinkRow url={githubUrl} type="github" />}
              </DataList.Value>
            </DataList.Item>
          )}
        </DataList>
      </section>
    
  );
}
