import { WorkspaceLeaf } from "obsidian";
import { IGraphNode } from "./graph-node"


export interface IGraphView {
    view: {
        renderer: {
            nodes: IGraphNode[];
            worker: Worker;
        }
    }
}

export type GraphView = WorkspaceLeaf & IGraphView;