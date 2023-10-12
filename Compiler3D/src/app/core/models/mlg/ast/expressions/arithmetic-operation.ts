import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { DataType } from "../utils/DataType";
import { ArithType } from "../utils/arith-type";

export class ArithmeticOperation extends Node {
    private _arithType: ArithType;
    private _nodeLeft: Node;
    private _nodeRight: Node;
    private _value: any;

    constructor(positionToken: PositionToken, toke: string, arithType: ArithType, nodeLeft: Node, nodeRight: Node) {
        super(positionToken, null, toke);
		this._arithType = arithType;
        this._nodeLeft = nodeLeft;
        this._nodeRight = nodeRight;
	}

    public get arithType(): ArithType {
        return this._arithType;
    }

    public set arithType(value: ArithType) {
        this._arithType = value;
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
            const resType: DataType = this._typeVerifier.verifierTypeArithNode(resLeft, resRight);
            if (resLeft) {
                return resType;
            } else {
                const errorGramm = new ErrorGramm(this.positionToken, this.toke, `No es posible realizar la operacion << ${this.nodeLeft.toke} ${this.toke} ${this.nodeRight.toke} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
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
