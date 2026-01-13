import { Notice, Plugin } from "obsidian";
import {
  LinearSyncSettings,
  DEFAULT_SETTINGS,
  LinearSyncSettingTab,
} from "./src/settings";
import { LinearApiClient } from "./src/linear-api";
import { syncIssuesToDocument } from "./src/sync-issues";
import { syncDocumentToLinear } from "./src/sync-document";

export default class LinearSyncPlugin extends Plugin {
  settings: LinearSyncSettings;
  linearApi: LinearApiClient;

  async onload() {
    await this.loadSettings();

    this.linearApi = new LinearApiClient(() => this.settings.apiKey);

    this.addSettingTab(new LinearSyncSettingTab(this.app, this));

    this.addCommand({
      id: "sync-issues",
      name: "Sync Issues to Document",
      callback: async () => {
        if (!this.validateSettings()) return;
        try {
          await syncIssuesToDocument(this.app, this.linearApi, this.settings);
          new Notice("Issues synced to document successfully");
        } catch (error) {
          console.error("Linear Sync error:", error);
          new Notice(`Failed to sync issues: ${error.message}`);
        }
      },
    });

    this.addCommand({
      id: "sync-document",
      name: "Sync Document to Linear",
      callback: async () => {
        if (!this.validateSettings()) return;
        try {
          await syncDocumentToLinear(this.app, this.linearApi, this.settings);
          new Notice("Document synced to Linear successfully");
        } catch (error) {
          console.error("Linear Sync error:", error);
          new Notice(`Failed to sync document: ${error.message}`);
        }
      },
    });
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  private validateSettings(): boolean {
    if (!this.settings.apiKey) {
      new Notice("Please configure your Linear API key in settings");
      return false;
    }
    if (!this.settings.documentPath) {
      new Notice("Please configure the document path in settings");
      return false;
    }
    return true;
  }
}
