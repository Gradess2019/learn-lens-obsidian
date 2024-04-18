// NodeType definition
export enum NodeType {
    DEFAULT = '',
    UNRESOLVED = 'unresolved',
    TAG = 'tag',
}

export interface IGraphNode {
    id: string;
    forward: { [key: string]: IGraphNodeTarget }; 
    reverse: { [key: string]: IGraphNodeTarget }; 
    text: {
        _text: string;
    }
    type: string;

    onClick(): void;
}

export interface IGraphNodeTarget {
    source: IGraphNode;
    target: IGraphNode;
}

export class GraphNodeHelper {
    static getForward(node: IGraphNode): IGraphNode[] {
        const propertyNames = Object.keys(node.forward) as string[];
        return propertyNames.map((propertyName) => node.forward[propertyName].target) as IGraphNode[];
    }


    static getReverse(node: IGraphNode): IGraphNode[] {
        const propertyNames = Object.keys(node.reverse) as string[];
        return propertyNames.map((propertyName) => node.reverse[propertyName].source) as IGraphNode[];
    }

    static filterByType(nodes: IGraphNode[], type: NodeType): IGraphNode[] {
        return nodes.filter((node) => node.type === type);
    }

    static generateLinksPayload(node: IGraphNode): { [key: string]: boolean } {
        const links = node.forward;
        const propertyNames = Object.keys(links) as string[];

        const payload = {} as { [key: string]: boolean };
        propertyNames.forEach((propertyName) => {
            payload[propertyName] = true;
        });

        return payload;
    }
        
}