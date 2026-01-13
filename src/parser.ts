import type { LinearIssue } from "./linear-api";

export interface DocumentSection {
  key: string;
  title: string;
  body: string;
}

/**
 * Parse document content into sections based on H1 headers.
 * Expected format: # [KEY] Title
 */
export function parseDocument(content: string): DocumentSection[] {
  const sections: DocumentSection[] = [];
  const lines = content.split("\n");

  let currentSection: DocumentSection | null = null;
  let bodyLines: string[] = [];

  for (const line of lines) {
    const headerMatch = line.match(/^#\s+\[([^\]]+)\]\s+(.+)$/);

    if (headerMatch) {
      // Save previous section if exists
      if (currentSection) {
        currentSection.body = bodyLines.join("\n").trim();
        sections.push(currentSection);
      }

      // Start new section
      currentSection = {
        key: headerMatch[1],
        title: headerMatch[2],
        body: "",
      };
      bodyLines = [];
    } else if (currentSection) {
      bodyLines.push(line);
    }
  }

  // Save last section
  if (currentSection) {
    currentSection.body = bodyLines.join("\n").trim();
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Extract all issue keys from a document.
 */
export function extractExistingKeys(content: string): Set<string> {
  const keys = new Set<string>();
  const regex = /^#\s+\[([^\]]+)\]/gm;
  let match;

  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }

  return keys;
}

/**
 * Prepend new issue sections to the document.
 */
export function prependSections(content: string, issues: LinearIssue[]): string {
  if (issues.length === 0) {
    return content;
  }

  const newSections = issues
    .map((issue) => `# [${issue.identifier}] ${issue.title}\n\n`)
    .join("");

  return newSections + content;
}

/**
 * Format a single issue as a markdown section.
 */
export function formatIssueSection(issue: LinearIssue): string {
  return `# [${issue.identifier}] ${issue.title}\n\n`;
}
