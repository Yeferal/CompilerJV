export interface NodeDir {
    // node: NodeDir;
    nodeFather?: NodeDir | null;
    typeNode: string;
    nodeChilds: Array<NodeDir>;
    name: string;
    path: string;
    pathArray: Array<string>;
}

const listChildNodes: Array<NodeDir> = [
    {
        nodeFather: null,
        typeNode: 'directory',
        nodeChilds: [
            {
                nodeFather: null,
                typeNode: 'directory',
                nodeChilds: [],
                name: 'carpeta 1.1',
                path: '',
                pathArray: []
            },
            {
                nodeFather: null,
                typeNode: 'file',
                nodeChilds: [],
                name: 'archivo 1.1',
                path: '',
                pathArray: []
            },
            {
                nodeFather: null,
                typeNode: 'file',
                nodeChilds: [],
                name: 'archivo 2.1',
                path: '',
                pathArray: []
            }
        ],
        name: 'carpeta 1',
        path: '',
        pathArray: []
    },
    {
        nodeFather: null,
        typeNode: 'directory',
        nodeChilds: [
            {
                nodeFather: null,
                typeNode: 'directory',
                nodeChilds: [
                    {
                        nodeFather: null,
                        typeNode: 'directory',
                        nodeChilds: [
                            {
                                nodeFather: null,
                                typeNode: 'directory',
                                nodeChilds: [
                                    {
                                        nodeFather: null,
                                        typeNode: 'directory',
                                        nodeChilds: [
                                            {
                                                nodeFather: null,
                                                typeNode: 'directory',
                                                nodeChilds: [
                                                    {
                                                        nodeFather: null,
                                                        typeNode: 'directory',
                                                        nodeChilds: [
                                                            {
                                                                nodeFather: null,
                                                                typeNode: 'directory',
                                                                nodeChilds: [],
                                                                name: 'carpetaaaaaaaaaadf 1.1',
                                                                path: '',
                                                                pathArray: []
                                                            },
                                                            {
                                                                nodeFather: null,
                                                                typeNode: 'file',
                                                                nodeChilds: [],
                                                                name: 'archivoasdf 1.1',
                                                                path: '',
                                                                pathArray: []
                                                            },
                                                            {
                                                                nodeFather: null,
                                                                typeNode: 'file',
                                                                nodeChilds: [],
                                                                name: 'archivoasdfadfad 2.1',
                                                                path: '',
                                                                pathArray: []
                                                            }
                                                        ],
                                                        name: 'carpeta 1.1',
                                                        path: '',
                                                        pathArray: []
                                                    },
                                                    {
                                                        nodeFather: null,
                                                        typeNode: 'file',
                                                        nodeChilds: [],
                                                        name: 'archivo 1.1',
                                                        path: '',
                                                        pathArray: []
                                                    },
                                                    {
                                                        nodeFather: null,
                                                        typeNode: 'file',
                                                        nodeChilds: [],
                                                        name: 'archivo 2.1',
                                                        path: '',
                                                        pathArray: []
                                                    }
                                                ],
                                                name: 'carpeta 1.1',
                                                path: '',
                                                pathArray: []
                                            },
                                            {
                                                nodeFather: null,
                                                typeNode: 'file',
                                                nodeChilds: [],
                                                name: 'archivo 1.1',
                                                path: '',
                                                pathArray: []
                                            },
                                            {
                                                nodeFather: null,
                                                typeNode: 'file',
                                                nodeChilds: [],
                                                name: 'archivo 2.1',
                                                path: '',
                                                pathArray: []
                                            }
                                        ],
                                        name: 'carpeta 1.1',
                                        path: '',
                                        pathArray: []
                                    },
                                    {
                                        nodeFather: null,
                                        typeNode: 'file',
                                        nodeChilds: [],
                                        name: 'archivo 1.1',
                                        path: '',
                                        pathArray: []
                                    },
                                    {
                                        nodeFather: null,
                                        typeNode: 'file',
                                        nodeChilds: [],
                                        name: 'archivo 2.1',
                                        path: '',
                                        pathArray: []
                                    }
                                ],
                                name: 'carpeta 1.1',
                                path: '',
                                pathArray: []
                            },
                            {
                                nodeFather: null,
                                typeNode: 'file',
                                nodeChilds: [],
                                name: 'archivo 1.1',
                                path: '',
                                pathArray: []
                            },
                            {
                                nodeFather: null,
                                typeNode: 'file',
                                nodeChilds: [],
                                name: 'archivo 2.1',
                                path: '',
                                pathArray: []
                            }
                        ],
                        name: 'carpeta 1.1',
                        path: '',
                        pathArray: []
                    },
                    {
                        nodeFather: null,
                        typeNode: 'file',
                        nodeChilds: [],
                        name: 'archivo 1.1',
                        path: '',
                        pathArray: []
                    },
                    {
                        nodeFather: null,
                        typeNode: 'file',
                        nodeChilds: [],
                        name: 'archivo 2.1',
                        path: '',
                        pathArray: []
                    }
                ],
                name: 'carpeta 1.1',
                path: '',
                pathArray: []
            },
            {
                nodeFather: null,
                typeNode: 'file',
                nodeChilds: [],
                name: 'archivo 1.1',
                path: '',
                pathArray: []
            },
            {
                nodeFather: null,
                typeNode: 'file',
                nodeChilds: [],
                name: 'archivo 2.1',
                path: '',
                pathArray: []
            }
        ],
        name: 'carpeta 2',
        path: '',
        pathArray: []
    },
    {
        nodeFather: null,
        typeNode: 'file',
        nodeChilds: [],
        name: 'archivo root',
        path: '',
        pathArray: []
    }
]

export const actualProject: NodeDir = {
    nodeFather: null,
    typeNode: 'root',
    nodeChilds: listChildNodes,
    name: 'proyecto prueba',
    path: '',
    pathArray: []
}