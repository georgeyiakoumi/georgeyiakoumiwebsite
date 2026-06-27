import { Typography } from "@/components/ui/typography";
import { Section } from "@/components/layout/section";

interface ProjectDescriptionProps {
  description?: string | null;
}

export function ProjectDescription({ description }: ProjectDescriptionProps) {
  if (!description) return null;

  return (
    <Section className="min-h-svh py-16">
      <Typography variant="display" align="center" className="max-w-xl lg:max-w-2xl">
        {description}
      </Typography>
    </Section>
  );
}
