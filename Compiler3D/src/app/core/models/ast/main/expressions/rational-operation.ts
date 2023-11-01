import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { DataType } from "../utils/DataType";
import { DynamicDataType } from "../utils/DynamicDataType";
import { ArithType } from "../utils/arith-type";
import { RationalType } from "../utils/rational-type";

export class RationalOperation extends Node{
    private _rationalType: RationalType;
    private _nodeLeft: Node;
    private _nodeRight: Node;
    private _value: any;

    constructor(positionToken: PositionToken, token: string, rationalType: RationalType, nodeLeft: Node, nodeRight: Node) {
        super(positionToken, null, token);
		this._rationalType = rationalType;
        this._nodeLeft = nodeLeft;
        this._nodeRight = nodeRight;
	}

    public get rationalType(): RationalType {
        return this._rationalType;
    }

    public set rationalType(value: RationalType) {
        this._rationalType = value;
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
            const resType: DynamicDataType = this._typeVerifier.verifierTypeRationalNode(resLeft, resRight, this.rationalType);
            if (resLeft) {
                return resType;
            } else {
                // const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la operacion << ${this.nodeLeft.toke} ${this.token} ${this.nodeRight.toke} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC); 
                // handlerComprobation.listError.push(errorGramm);
            }
        }else{
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la operacion << ${this.nodeLeft.token} ${this.token} ${this.nodeRight.token} >>.`, ErrorType.SEMANTIC); 
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
