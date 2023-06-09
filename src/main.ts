import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	annotation_folder: string;
	annotation_prefix: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	annotation_folder: 'Annotations',
	annotation_prefix: 'Annotationen '
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		// const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
		// 	// Called when the user clicks the icon.
		// 	new Notice('This is a notice!');
		// });

		// Adds context menu entry in the file menu
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
			  menu.addItem((item) => {
				item
				  .setTitle("Erstelle Annotation")
				  .setIcon("document")
				  .onClick(async () => {
					const file_basename = file.name.replace(".pdf", "");
					await app.vault.create(`${this.settings.annotation_folder}/${this.settings.annotation_prefix}${file_basename}.md`, 
`---
annotation-target: ${file.name}
---`);
					await app.workspace.getMostRecentLeaf();
			  });
			});
	}));

		// Perform additional things with the ribbon
		// ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)',
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	}
		// });
		// // This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		// // This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
	// 	this.addSettingTab(new SampleSettingTab(this.app, this));

	// 	// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
	// 	// Using this function will automatically remove the event listener when this plugin is disabled.
	// 	this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
	// 		console.log('click', evt);
	// 	});

	// 	// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
	// 	this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// class SampleModal extends Modal {
// 	constructor(app: App) {
// 		super(app);
// 	}

// 	onOpen() {
// 		const {contentEl} = this;
// 		contentEl.setText('Woah!');
// 	}

// 	onClose() {
// 		const {contentEl} = this;
// 		contentEl.empty();
// 	}
// }

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for Annotator-Helper.'});

		new Setting(containerEl)
			.setName('Annotation Folder')
			.setDesc('Folder where Annotations should be stored')
			.addText(text => text
				.setPlaceholder(this.plugin.settings.annotation_folder)
				.setValue(this.plugin.settings.annotation_folder)
				.onChange(async (value) => {
						this.plugin.settings.annotation_folder = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Annotation Prefix')
			.setDesc('Which prefix should the annotations have before the title of the annotated file')
			.addText(text => text
				.setPlaceholder(this.plugin.settings.annotation_prefix)
				.setValue(this.plugin.settings.annotation_prefix)
				.onChange(async (value) => {
						this.plugin.settings.annotation_prefix = value;
					await this.plugin.saveSettings();
				}));

	}
}
