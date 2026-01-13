import { App, PluginSettingTab, Setting } from "obsidian";
import type LinearSyncPlugin from "../main";

export interface LinearSyncSettings {
  apiKey: string;
  documentPath: string;
}

export const DEFAULT_SETTINGS: LinearSyncSettings = {
  apiKey: "",
  documentPath: "",
};

export class LinearSyncSettingTab extends PluginSettingTab {
  plugin: LinearSyncPlugin;

  constructor(app: App, plugin: LinearSyncPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "Linear Sync Settings" });

    new Setting(containerEl)
      .setName("API Key")
      .setDesc("Your Linear API key")
      .addText((text) =>
        text
          .setPlaceholder("lin_api_...")
          .setValue(this.plugin.settings.apiKey)
          .onChange(async (value) => {
            this.plugin.settings.apiKey = value;
            await this.plugin.saveSettings();
          })
      )
      .then((setting) => {
        const inputEl = setting.controlEl.querySelector("input");
        if (inputEl) {
          inputEl.type = "password";
        }
      });

    new Setting(containerEl)
      .setName("Document Path")
      .setDesc("Path to the document for syncing issues (e.g., Linear/Tasks.md)")
      .addText((text) =>
        text
          .setPlaceholder("path/to/document.md")
          .setValue(this.plugin.settings.documentPath)
          .onChange(async (value) => {
            this.plugin.settings.documentPath = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
