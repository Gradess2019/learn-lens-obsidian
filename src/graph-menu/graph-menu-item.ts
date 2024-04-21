import { Setting, WorkspaceLeaf } from "obsidian";
import { GraphView } from "src/core/graph-view";


export class GraphMenuItem extends Setting { 
    leaf: GraphView;

    constructor(leaf: GraphView) {        
        const modFilter = leaf.view.containerEl.querySelector('.mod-filter')?.querySelector(".tree-item-children") as HTMLElement;
        super(modFilter);

        this.leaf = leaf;
    }

    delete(): void {
        this.settingEl.remove();
    }
}