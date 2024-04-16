import BaseFilter from "./base-filter";
import { App, Workspace } from "obsidian";
import { GraphView } from "./core/graph-view";
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
            });
        });

        
    }

    filter(): void {
        console.log(this.graphView.view.renderer.nodes);
        let forward = GraphNodeHelper.getForward(this.graphView.view.renderer.nodes[1]);
        let reverse = GraphNodeHelper.getReverse(this.graphView.view.renderer.nodes[1]);

        // filter them
        let forwardFiltered = GraphNodeHelper.filterByType(forward, NodeType.UNRESOLVED);
        let reverseFiltered = GraphNodeHelper.filterByType(reverse, NodeType.UNRESOLVED);
        console.log('Raw forward:', forward);
        console.log('Filtered forward:', forwardFiltered);
        console.log('Raw reverse:', reverse);
        console.log('Filtered reverse:', reverseFiltered);
        
    }
}