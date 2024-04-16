import { Setting } from "obsidian";


export default class BaseFilter extends Setting {
    container: HTMLElement;

    constructor() {
        const modFilter = document.querySelector('.mod-filter')?.querySelector(".tree-item-children") as HTMLElement;
        super(modFilter);

        this.container = modFilter;
    }

    delete(): void {
        this.settingEl.remove();
    }
}