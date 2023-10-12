import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { DataType } from "../utils/DataType";
import { LogicalType } from "../utils/logical-type";

export class LogicalOperation extends Node{
    private _logicalType: LogicalType;
    private _nodeLeft: Node;
    private _nodeRight: Node;
    private _value: any;

    constructor(positionToken: PositionToken, toke: string, logicalType: LogicalType, nodeLeft: Node, nodeRight: Node) {
        super(positionToken, null, toke);
		this._logicalType = logicalType;
        this._nodeLeft = nodeLeft;
        this._nodeRight = nodeRight;
	}

    public get rlogicalType(): LogicalType {
        return this._logicalType;
    }

    public set logicalType(value: LogicalType) {
        this._logicalType = value;
    }

    public get nodeLeft(): Node {
        return this._nodeLeft;
    }

    public set nodeLeft(value: Node) {
        this._nodeLeft = value;
    }

    public get nodeRight(): Node {
        return this._nodeRight;
    }

    public set nodeRight(value: Node) {
        this._nodeRight = value;
    }

    public get value(): any {
        return this._value;
    }

    public set value(value: any) {
        this._value = value;
    }
    
    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        let resLeft = this.nodeLeft.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        let resRight = this.nodeRight.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        if (resLeft && resRight) {
            //Comprobacion de tipos
            const resType: DataType = this._typeVerifier.verifierTypeLogicalNode(resLeft, resRight);
            if (resLeft) {
                this.type = resType;
                return resType;
            } else {
                // const errorGramm = new ErrorGramm(this.positionToken, this.toke, `No es posible realizar la operacion << ${this.nodeLeft.toke} ${this.toke} ${this.nodeRight.toke} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC); 
                // handlerComprobation.listError.push(errorGramm);
            }
        }else{
            const errorGramm = new ErrorGramm(this.positionToken, this.toke, `No es posible realizar la operacion << ${this.nodeLeft.toke} ${this.toke} ${this.nodeRight.toke} >>.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
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

