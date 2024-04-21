import { log } from 'console';
import { App, Editor, Modal, Plugin, PluginSettingTab, Setting, Workspace } from 'obsidian';
import FilterByConnections from './graph-menu/filter-by-connection';
import BaseFilter from './graph-menu/base-filter';
import { GraphView } from './core/graph-view';
import { GraphUnresolvedLinkRemover } from './graph-menu/graph-unresolved-link-remover';

// Remember to rename these classes and interfaces!

export default class LearnLens extends Plugin {
	newSettings: Setting;

	onload(): void {
		this.app.workspace.onLayoutReady(() => {
			let leafs = this.app.workspace.getLeavesOfType('graph') as GraphView[];
			leafs.forEach(leaf => {
				if (!leaf.view.customFilters || leaf.view.customFilters.length == 0) {
					this.registerFilters(leaf);
				}
			});
		});

		this.registerEvent(
			this.app.workspace.on('layout-change', this.onLayoutChange.bind(this))
		);
	}

	onunload(): void {
		let leafs = this.app.workspace.getLeavesOfType('graph') as GraphView[];
		leafs.forEach(leaf => {
			this.unregisterFilters(leaf);
		});
	}

	onLayoutChange(): void {
		let leafs = this.app.workspace.getLeavesOfType('graph') as GraphView[];
		leafs.forEach(leaf => {
			if (!leaf.view.customFilters || leaf.view.customFilters.length == 0) {
				this.registerFilters(leaf);
			}
		});
	}

	registerFilters(leaf: GraphView) {
		if (!leaf.view.customFilters) {
			leaf.view.customFilters = [];
		}

		let unreasolvedFilter = new FilterByConnections(leaf);
		let unresolvedLinkRemover = new GraphUnresolvedLinkRemover(leaf);

		leaf.view.customFilters.push(unreasolvedFilter);
		leaf.view.customFilters.push(unresolvedLinkRemover);
	}

	unregisterFilters(leaf: GraphView) {
		leaf.view.customFilters.forEach(filter => {
			filter.delete();
		});

		leaf.view.customFilters = [];
	}
}

// interface MyPluginSettings {
// 	mySetting: string;
// }

// const DEFAULT_SETTINGS: MyPluginSettings = {
// 	mySetting: 'default'
// }

// export default class MyPlugin extends Plugin {
// 	settings: MyPluginSettings;

// 	async onload() {
// 		await this.loadSettings();
// 		console.log('Loaded plugin: Sample Plugin');

// 		// This creates an icon in the left ribbon.
// 		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
// 			// Called when the user clicks the icon.
// 			new Notice('This is a notice!');
// 		});
// 		// Perform additional things with the ribbon
// 		ribbonIconEl.addClass('my-plugin-ribbon-class');

// 		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
// 		const statusBarItemEl = this.addStatusBarItem();
// 		statusBarItemEl.setText('Status Bar Text');

// 		// This adds a simple command that can be triggered anywhere
// 		this.addCommand({
// 			id: 'open-sample-modal-simple',
// 			name: 'Open sample modal (simple)',
// 			callback: () => {
// 				new SampleModal(this.app).open();
// 			}
// 		});
// 		// This adds an editor command that can perform some operation on the current editor instance
// 		this.addCommand({
// 			id: 'sample-editor-command',
// 			name: 'Sample editor command',
// 			editorCallback: (editor: Editor, view: MarkdownView) => {
// 				console.log(editor.getSelection());
// 				editor.replaceSelection('Sample Editor Command');
// 			}
// 		});
// 		// This adds a complex command that can check whether the current state of the app allows execution of the command
// 		this.addCommand({
// 			id: 'open-sample-modal-complex',
// 			name: 'Open sample modal (complex)',
// 			checkCallback: (checking: boolean) => {
// 				// Conditions to check
// 				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
// 				if (markdownView) {
// 					// If checking is true, we're simply "checking" if the command can be run.
// 					// If checking is false, then we want to actually perform the operation.
// 					if (!checking) {
// 						new SampleModal(this.app).open();
// 					}

// 					// This command will only show up in Command Palette when the check function returns true
// 					return true;
// 				}
// 			}
// 		});

// 		// This adds a settings tab so the user can configure various aspects of the plugin
// 		this.addSettingTab(new SampleSettingTab(this.app, this));

// 		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
// 		// Using this function will automatically remove the event listener when this plugin is disabled.
// 		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
// 			console.log('click', evt);
// 		});

// 		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
// 		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
// 	}

// 	onunload() {

// 	}

// 	async loadSettings() {
// 		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
// 	}

// 	async saveSettings() {
// 		await this.saveData(this.settings);
// 	}
// }

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

// class SampleSettingTab extends PluginSettingTab {
// 	plugin: MyPlugin;

// 	constructor(app: App, plugin: MyPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		const {containerEl} = this;

// 		containerEl.empty();

// 		new Setting(containerEl)
// 			.setName('Setting #1')
// 			.setDesc('It\'s a secret')
// 			.addText(text => text
// 				.setPlaceholder('Enter your secret')
// 				.setValue(this.plugin.settings.mySetting)
// 				.onChange(async (value) => {
// 					this.plugin.settings.mySetting = value;
// 					await this.plugin.saveSettings();
// 				}));
// 	}
// }
