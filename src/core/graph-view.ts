import { WorkspaceLeaf } from "obsidian";
import { IGraphNode } from "./graph-node"


export interface ISetDataPayload {
    nodes: {
        [key: string]: {
            type: string;
            links: {
                [key: string]: boolean;
            }
        }
    }
}

export interface IGraphView {
    view: {
        renderer: {
            nodes: IGraphNode[];
            worker: Worker;
            setData: (data: ISetDataPayload) => void;
        }
        dataEngine: {
            render(): void;
        }
    }
}

export type GraphView = WorkspaceLeaf & IGraphView;