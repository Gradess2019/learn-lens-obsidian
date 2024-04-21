import { Setting, WorkspaceLeaf } from "obsidian";


export default class BaseFilter extends Setting {
    container: HTMLElement;

    constructor(leaf: WorkspaceLeaf) {
        const modFilter = leaf.view.containerEl.querySelector('.mod-filter')?.querySelector(".tree-item-children") as HTMLElement;
        super(modFilter);

        this.container = modFilter;
    }

    delete(): void {
        this.settingEl.remove();
    }
}