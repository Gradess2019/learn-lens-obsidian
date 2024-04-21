import BaseFilter from "./base-filter";
import { SliderComponent, ToggleComponent, Workspace } from "obsidian";
import { GraphView, MetadataCache } from "./core/graph-view";
import { IGraphLinksMetadata } from "./core/graph-node";




export default class FilterByConnections extends BaseFilter {
    graphView: GraphView;
    slider: SliderComponent;
    toggle: ToggleComponent;

    constructor(leaf: GraphView) {
        super(leaf);

        this.graphView = leaf;

        this.setName('Connections');
        this.addSlider((slider) => {
            this.slider = slider;
            this.slider.setLimits(1, 10, 1);
            this.slider.setValue(3);
            this.slider.setDynamicTooltip();

            this.slider.onChange((value) => {
                this.filter();
            });
        });

        this.addToggle((toggle) => {
            this.toggle = toggle;
            this.toggle.toggleEl.classList.add('mod-small');
            this.toggle.setValue(false);

            this.toggle.onChange((value) => {
                this.filter();
            });
        });
    }

    filter(): void {
        let metadataCache = this.graphView.view.app.metadataCache as MetadataCache;
        let unresolvedLinks = { ...metadataCache.unresolvedLinks } as IGraphLinksMetadata;

        if (!metadataCache.hiddenLinks) {
            metadataCache.hiddenLinks = {};
        }

        for (let link in metadataCache.hiddenLinks) {
            unresolvedLinks[link] = metadataCache.hiddenLinks[link];
        }

        let connectionsCounter = {} as { [key: string]: number };
        for (let nodeMeta in unresolvedLinks) {
            let nodeUnresolvedLinks = unresolvedLinks[nodeMeta];
            for (let link in nodeUnresolvedLinks) {
                if (link in connectionsCounter) {
                    connectionsCounter[link]++;
                }
                else {
                    connectionsCounter[link] = 1;
                }
            }
        }

        let minConnections = this.toggle.getValue() ? this.slider.getValue() : 1;
        for (let nodeMeta in unresolvedLinks) {
            let nodeUnresolvedLinks = unresolvedLinks[nodeMeta];
            for (let link in nodeUnresolvedLinks) {
                if (connectionsCounter[link] < minConnections) {

                    if (!metadataCache.hiddenLinks[nodeMeta]) {
                        metadataCache.hiddenLinks[nodeMeta] = {};
                    }

                    metadataCache.hiddenLinks[nodeMeta][link] = nodeUnresolvedLinks[link];
                    delete metadataCache.unresolvedLinks[nodeMeta][link];
                    continue;
                }

                metadataCache.unresolvedLinks[nodeMeta][link] = nodeUnresolvedLinks[link];
            }
        }

        this.graphView.view.dataEngine.render();
    }
}
