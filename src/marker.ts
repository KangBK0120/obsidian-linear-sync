export const MARKER_START = "<!-- obsidian-sync-start -->";
export const MARKER_END = "<!-- obsidian-sync-end -->";

/**
 * Extract content that exists outside of the obsidian-sync markers.
 * Returns the content before the markers (or all content if no markers exist).
 */
export function extractNonMarkerContent(description: string | null): string {
  if (!description) {
    return "";
  }

  const startIndex = description.indexOf(MARKER_START);

  if (startIndex === -1) {
    // No markers found, return everything
    return description.trim();
  }

  // Return content before the marker
  return description.substring(0, startIndex).trim();
}

/**
 * Build a new description by combining existing content with new content wrapped in markers.
 */
export function buildDescription(existingContent: string, newContent: string): string {
  const parts: string[] = [];

  if (existingContent) {
    parts.push(existingContent);
    parts.push("");
  }

  parts.push(MARKER_START);
  parts.push(newContent);
  parts.push(MARKER_END);

  return parts.join("\n");
}

/**
 * Check if description has obsidian-sync markers.
 */
export function hasMarkers(description: string | null): boolean {
  if (!description) {
    return false;
  }
  return description.includes(MARKER_START) && description.includes(MARKER_END);
}

/**
 * Extract content between markers.
 */
export function extractMarkerContent(description: string | null): string {
  if (!description) {
    return "";
  }

  const startIndex = description.indexOf(MARKER_START);
  const endIndex = description.indexOf(MARKER_END);

  if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
    return "";
  }

  return description
    .substring(startIndex + MARKER_START.length, endIndex)
    .trim();
}
