import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { DataType } from "../utils/DataType";
import { DeclarationArray } from "./declaration-array";
import { DeclarationVar } from "./declaration-var";

export class ListDeclaration extends Node {
    private _isConst: boolean;
    private _isArray: boolean;
    private _dataType: DataType;
    private _listDeclaration: Array<Node>;


	constructor(positionToken: PositionToken, type: DataType, toke: string, isConst: boolean, isArray: boolean, dataType: DataType, listDeclaration: Array<Node>) {
        super(positionToken, type, toke);
		this._isConst = isConst;
		this._isArray = isArray;
		this._dataType = dataType;
		this._listDeclaration = listDeclaration;
	}
    
    public get isConst(): boolean {
        return this._isConst;
    }
    
    public set isConst(value: boolean) {
        this._isConst = value;
    }
    
    public get isArray(): boolean {
        return this._isArray;
    }
    
    public set isArray(value: boolean) {
        this._isArray = value;
    }
    
    public get dataType(): DataType {
        return this._dataType;
    }
    
    public set dataType(value: DataType) {
        this._dataType = value;
    }
    
    public get listDeclaration(): Array<Node> {
        return this._listDeclaration;
    }
    
    public set listDeclaration(value: Array<Node>) {
        this._listDeclaration = value;
    }

    

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        for (let i = 0; i < this.listDeclaration.length; i++) {
            this.listDeclaration[i].type = this.dataType;

            // if (this.listDeclaration[i] instanceof DeclarationVar) {
                
            // } else if (this.listDeclaration[i] instanceof DeclarationArray) {
                
            // }
            this.listDeclaration[i].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            
        }

    }

    public override executeComprobationControlFlow(handlerComprobation: HandlerComprobation): any {
        return this.type;
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
