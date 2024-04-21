import { TFile, ToggleComponent, WorkspaceLeaf } from "obsidian";
import { GraphMenuItem } from "./graph-menu-item";
import { GraphView, IMetadataCache, MetadataCache } from "src/core/graph-view";
import { NodeType } from "src/core/graph-node";
import { MarkdownLeaf } from "src/core/markdown-leaf";
import { assert } from "console";


export class GraphUnresolvedLinkRemover extends GraphMenuItem {
    toggle: ToggleComponent;

    originalCallback: () => void;

    constructor(leaf: GraphView) {
        super(leaf);

        this.setName('Remove Unresolved');
        this.addToggle((toggle) => {
            this.toggle = toggle;
            this.toggle.setValue(false);
            this.toggle.toggleEl.classList.add('mod-small');
            this.toggle.onChange((value) => {
                if (value) {
                    this.overrideOnNodeClick();
                } else {
                    this.revertOnNodeClick();
                }
            });
        });
    }
    
    overrideOnNodeClick(): void {
        this.originalCallback = this.leaf.view.renderer.onNodeClick;

        this.leaf.view.renderer.onNodeClick = this.onNodeClick.bind(this);
    }

    revertOnNodeClick(): void {
        this.leaf.view.renderer.onNodeClick = this.originalCallback;
    }

    onNodeClick(event: Event, nodeName: string, type: NodeType): void {
        if (type !== NodeType.UNRESOLVED) {
            return;
        }

        let cache = this.leaf.view.app.metadataCache as MetadataCache;
        let hiddenLinks =  cache.hiddenLinks;
        let unresolvedLinks = { ...this.leaf.view.app.metadataCache.unresolvedLinks};

        let combinedLinks = { ...hiddenLinks };
        for (let key in unresolvedLinks) {
            if (combinedLinks[key]) {
                combinedLinks[key] = { ...combinedLinks[key], ...unresolvedLinks[key] };
            } else {
                combinedLinks[key] = unresolvedLinks[key];
            }
        }

        let fileNames = [];
        for (let key in combinedLinks) {
            if (combinedLinks[key][nodeName]) {
                fileNames.push(key);
            }
        }
        
        fileNames.forEach((fileName) => {
            let vault = this.leaf.view.app.vault;
            let files = vault.getMarkdownFiles();
            console.log(files);
            let file = files.find((file) => file.name === fileName) as TFile;
            console.log(file);
            
            vault.read(file).then((content) => {
                let newContent = content.replace(new RegExp(`\\[\\[${nodeName}\\]\\]`, 'g'), nodeName);
                vault.modify(file, newContent);
            });
        });
    }
}