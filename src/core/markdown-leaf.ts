import { WorkspaceLeaf } from "obsidian";


export interface IMarkdownLeaf {
    view: {
        app: any;
        file: {
            basename: string;
            extension: string;
            name: string;
            path: string;
            data: string;
            
            deleted: boolean;
        }
    }
}

export type MarkdownLeaf = WorkspaceLeaf & IMarkdownLeaf;