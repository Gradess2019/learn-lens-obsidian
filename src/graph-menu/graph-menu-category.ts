import { WorkspaceLeaf } from "obsidian";


export class GraphMenuCategory {
    graphControlsEl: HTMLElement;

    constructor(leaf: WorkspaceLeaf) {
        this.graphControlsEl = leaf.view.containerEl.querySelector('.graph-controls') as HTMLElement;
        
        // this.graphControlsEl.createDiv(
        //     "tree-item graph-control-section mod-custom is-collapsed"
        // ).createDiv(
        //     "tree-item-self"
        // ).createDiv(
        //     "tree-item-icon collapse-icon is-collapsed"
        // );
    }
}