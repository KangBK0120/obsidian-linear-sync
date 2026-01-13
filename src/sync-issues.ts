import { App, TFile } from "obsidian";
import type { LinearApiClient } from "./linear-api";
import type { LinearSyncSettings } from "./settings";
import { extractExistingKeys, prependSections, updateMetadata } from "./parser";

export async function syncIssuesToDocument(
  app: App,
  linearApi: LinearApiClient,
  settings: LinearSyncSettings
): Promise<void> {
  // 1. Fetch assigned issues from Linear
  const issues = await linearApi.fetchAssignedIssues();

  if (issues.length === 0) {
    return;
  }

  // 2. Get or create the document
  let file = app.vault.getAbstractFileByPath(settings.documentPath);
  let content = "";

  if (file instanceof TFile) {
    content = await app.vault.read(file);
  } else {
    // Create the file if it doesn't exist
    const parentPath = settings.documentPath.substring(
      0,
      settings.documentPath.lastIndexOf("/")
    );
    if (parentPath) {
      await app.vault.createFolder(parentPath).catch(() => {
        // Folder might already exist
      });
    }
    file = await app.vault.create(settings.documentPath, "");
  }

  // 3. Extract existing issue keys from the document
  const existingKeys = extractExistingKeys(content);

  // 4. Separate new and existing issues
  const newIssues = issues.filter((issue) => !existingKeys.has(issue.identifier));
  const existingIssues = issues.filter((issue) => existingKeys.has(issue.identifier));

  // 5. Update metadata for existing issues
  let updatedContent = updateMetadata(content, existingIssues);

  // 6. Prepend new sections to the document
  updatedContent = prependSections(updatedContent, newIssues);

  // 7. Save the file if changed
  if (file instanceof TFile && updatedContent !== content) {
    await app.vault.modify(file, updatedContent);
  }
}
