import { App, WorkspaceLeaf } from "obsidian";
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

export interface IMetadataCache {
    hiddenLinks: {
        [key: string]: {
            [key: string]: number;
        }
    };
    
    getTags(): { [key: string]: number };
}

export type MetadataCache = App['metadataCache'] & IMetadataCache;

export interface IGraphView {
    view: {
        app: App;
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