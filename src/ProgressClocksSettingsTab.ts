import ProgressClocksPlugin from "./ProgressClocksPlugin";
import { App, PluginSettingTab, Setting } from "obsidian";

export class ProgressClocksSettingsTab extends PluginSettingTab {
  plugin: ProgressClocksPlugin;

  constructor(app: App, plugin: ProgressClocksPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Show Buttons for Inline Clocks")
      .setDesc("When turned on, inline clocks will render with buttons to increment/decrement the clock, and " +
        "add/remove segments from the clock. When turned off, inline clocks will render without any buttons.")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showButtonsForInlineClocks)
          .onChange(async (value) => {
            this.plugin.settings.showButtonsForInlineClocks = value;
            await this.plugin.saveSettings();
          })
      );
    
    new Setting(containerEl)
      .setName("Allow Click Interaction for Inline Clocks")
      .setDesc("When turned on, inline clocks will respond to mouse clicks by adjusting the value of the " +
        "clock. When turned off, the only way to update inline clocks is to edit the inline code block.")
      .addToggle((toggle) => 
        toggle
          .setValue(this.plugin.settings.allowClickInteractionForInlineClocks)
          .onChange(async (value) => {
            this.plugin.settings.allowClickInteractionForInlineClocks = value;
            await this.plugin.saveSettings();
          })
      );
  }
}