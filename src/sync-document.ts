import { App, TFile } from "obsidian";
import type { LinearApiClient } from "./linear-api";
import type { LinearSyncSettings } from "./settings";
import { parseDocument } from "./parser";
import { extractNonMarkerContent, buildDescription } from "./marker";

export async function syncDocumentToLinear(
  app: App,
  linearApi: LinearApiClient,
  settings: LinearSyncSettings
): Promise<void> {
  // 1. Get the document
  const file = app.vault.getAbstractFileByPath(settings.documentPath);

  if (!(file instanceof TFile)) {
    throw new Error(`Document not found: ${settings.documentPath}`);
  }

  const content = await app.vault.read(file);

  // 2. Parse document into sections
  const sections = parseDocument(content);

  if (sections.length === 0) {
    return;
  }

  // 3. Process each section
  for (const section of sections) {
    // Skip sections with empty body
    if (!section.body.trim()) {
      continue;
    }

    // Find the issue by identifier
    const issue = await linearApi.getIssueByIdentifier(section.key);

    if (!issue) {
      console.warn(`Issue not found: ${section.key}`);
      continue;
    }

    // Get existing non-marker content
    const existingContent = extractNonMarkerContent(issue.description);

    // Build new description with marker
    const newDescription = buildDescription(existingContent, section.body);

    // Update the issue
    await linearApi.updateIssueDescription(issue.id, newDescription);
  }
}
