import BaseFilter from "./base-filter";
import { SliderComponent, ToggleComponent, Workspace } from "obsidian";
import { GraphView, ISetDataPayload } from "./core/graph-view";
import { GraphNodeHelper, NodeType } from "./core/graph-node";




export default class FilterByConnectiobs extends BaseFilter {
    workspace: Workspace;
    graphView: GraphView;
    slider: SliderComponent;
    toggle: ToggleComponent;

    constructor(workspace: Workspace) {
        super();

        this.workspace = workspace;
        this.graphView = this.workspace.getLeavesOfType('graph')[0] as GraphView;

        this.setName('Connections');
        this.addSlider((slider) => {
            this.slider = slider;
            this.slider.setLimits(1, 10, 1);
            this.slider.setValue(3);
            this.slider.setDynamicTooltip();

            this.slider.onChange((value) => {
                if (this.toggle.getValue()) {
                    this.filter();
                }
            });
        });

        this.addToggle((toggle) => {
            this.toggle = toggle;
            this.toggle.toggleEl.classList.add('mod-small');
            this.toggle.setValue(false);

            this.toggle.onChange((value) => {
                if (value) {
                    this.filter();
                }
                else {
                    this.graphView.view.dataEngine.render();
                }
            });
        });
    }

    filter(): void {
        let nodes = this.graphView.view.renderer.nodes;
        let unresolvedNodes = GraphNodeHelper.filterByType(nodes, [NodeType.UNRESOLVED]);
        let resolvedNodes = GraphNodeHelper.filterByType(nodes, [NodeType.DEFAULT, NodeType.TAG]);

        let payload = { nodes: {} } as ISetDataPayload;

        // include all resolvedNodes into payload
        resolvedNodes.forEach(node => {
            payload.nodes[node.id] = {
                type: node.type,
                links: GraphNodeHelper.generateLinksPayload(node)
            }
        });

        // get slider value
        let minConnections = this.slider.getValue();

        // include unresolvedNodes with more than min reverse connections into payload
        unresolvedNodes.forEach(node => {
            if (GraphNodeHelper.getReverse(node).length >= minConnections) {
                payload.nodes[node.id] = {
                    type: node.type,
                    links: GraphNodeHelper.generateLinksPayload(node)
                }
            }
        });

        this.graphView.view.renderer.setData(payload);
    }
}
