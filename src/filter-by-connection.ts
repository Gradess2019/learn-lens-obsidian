import BaseFilter from "./base-filter";
import { App, Workspace } from "obsidian";
import { GraphView, ISetDataPayload } from "./core/graph-view";
import { GraphNodeHelper, NodeType } from "./core/graph-node";




export default class FilterByConnectiobs extends BaseFilter {
    workspace: Workspace;
    graphView: GraphView;

    constructor(workspace: Workspace) {
        super();

        this.workspace = workspace;
        this.graphView = this.workspace.getLeavesOfType('graph')[0] as GraphView;

        this.setName('Connections');
        this.addSlider((slider) => {
            slider.setLimits(1, 10, 1);
            slider.setValue(3);
            slider.setDynamicTooltip();

            slider.onChange((value) => {
                console.log(value);
            });
        });

        this.addToggle((toggle) => {
            toggle.toggleEl.classList.add('mod-small');
            toggle.setValue(false);

            toggle.onChange((value) => {
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
        let filteredNodes = GraphNodeHelper.filterByType(nodes, NodeType.DEFAULT);

        let payload = { nodes: {} } as ISetDataPayload;

        filteredNodes.forEach(node => {
            payload.nodes[node.id] = {
                type: node.type,
                links: GraphNodeHelper.generateLinksPayload(node)
            }
        });

        this.graphView.view.renderer.setData(payload);
    }
}
