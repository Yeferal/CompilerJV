export interface NodeDir {
    // node: NodeDir;
    nodeFather?: NodeDir | null;
    typeNode: string;
    nodeChilds: Array<NodeDir>;
    name: string;
    path: string;
    pathArray: Array<string>;
    active: boolean;
    selected: boolean;
    update?: boolean;
    text?: string;
}