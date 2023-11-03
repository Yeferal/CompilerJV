import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { ImportNode } from "../import-node";
import { Node } from "../node";
import { PackageNode } from "../package-node";

export class MainNode extends Node {

    private _instructions: Array<Node>;
    private _packageNode: PackageNode;
    private _listImport: Array<ImportNode>;

	constructor(positionToken: PositionToken, token: string, instructions: Array<Node>) {
		super(positionToken, null, token);
        this._instructions = instructions;
	}

    /**
     * Getter instructions
     * @return {Array<Node>}
     */
	public get instructions(): Array<Node> {
		return this._instructions;
	}

    /**
     * Setter instructions
     * @param {Array<Node>} value
     */
	public set instructions(value: Array<Node>) {
		this._instructions = value;
	}

    /**
     * Getter packageNode
     * @return {PackageNode}
     */
	public get packageNode(): PackageNode {
		return this._packageNode;
	}

    /**
     * Getter listImport
     * @return {Array<ImportNode>}
     */
	public get listImport(): Array<ImportNode> {
		return this._listImport;
	}

    /**
     * Setter packageNode
     * @param {PackageNode} value
     */
	public set packageNode(value: PackageNode) {
		this._packageNode = value;
	}

    /**
     * Setter listImport
     * @param {Array<ImportNode>} value
     */
	public set listImport(value: Array<ImportNode>) {
		this._listImport = value;
	}


    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        throw new Error("Method not implemented.");
    }

    public override executeComprobationControlFlow(handlerComprobation: HandlerComprobation): any {
        throw new Error("Method not implemented.");
    }

    public override executeComprobationAccess(handlerComprobation: HandlerComprobation): any {
        throw new Error("Method not implemented.");
    }

    public override executeComprobation(handlerComprobation: HandlerComprobation): any {
        throw new Error("Method not implemented.");
    }

    public override execute(environment: Environment): any {
        throw new Error("Method not implemented.");
    }
}
