import { Quartet } from "../../../tree-direction/quartet";
import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { DataType } from "../utils/DataType";
import { DynamicDataType } from "../utils/DynamicDataType";
import { ArithType } from "../utils/arith-type";

export class ArithmeticOperation extends Node {
    private _arithType: ArithType;
    private _nodeLeft: Node;
    private _nodeRight: Node;
    private _value: any;

    constructor(positionToken: PositionToken, token: string, arithType: ArithType, nodeLeft: Node, nodeRight: Node) {
        super(positionToken, null, token);
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
        
        if (resLeft != null && resRight != null) {
            //Comprobacion de tipos
            const resType: DynamicDataType = this._typeVerifier.verifierTypeArithNode(resLeft, resRight, this.arithType);
            if (resType != null) {
                this.type = resType;
                return resType;
            } else {
                const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la operacion << ${this.nodeLeft.token} ${this.token} ${this.nodeRight.token} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
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

    public getSignNode(){
        switch(this.arithType){
            case ArithType.ADD:
                return "+";
            case ArithType.SUBTRAC:
                return "-";
            case ArithType.MULTI:
                return "*";
            case ArithType.DIV:
                return "/";
            case ArithType.MOD:
                return "%";
                default :
                return "+";
        }
    }

    public override execute(environment: Environment): any {
        if (this.arithType == ArithType.ADD) {
            // Verifica si es una concatenacion o un suma entre numeros
            const resType: DynamicDataType = this._typeVerifier.verifierTypeArithNode(this.nodeLeft.type, this.nodeRight.type, this.arithType);

            if (resType.name == "STRING") {
                //CODIGO DE TRES DIRECCIONES PARA REALIZAR UNA CONCATENACION
            } else {
                const arg1 =  this.nodeLeft.execute(environment);
                const arg2 =  this.nodeRight.execute(environment);
                const tTemp = environment.addT();

                //Codigo de tres direciones para realizar una suma entre float, int, char
                if (resType.name == "FLOAT") {
                    environment.handlerQuartet.listTempsFloat.push(tTemp);
                    const quartet: Quartet = {operator: this.getSignNode()+"f", arg1: arg1, arg2: arg2, result: "t"+tTemp};
                    environment.handlerQuartet.insertQuartet(quartet);
                } else if (resType.name == "INTEGER") {
                    environment.handlerQuartet.listTempsInt.push(tTemp);
                    const quartet: Quartet = {operator: this.getSignNode()+"i", arg1: arg1, arg2: arg2, result: "t"+tTemp};
                    environment.handlerQuartet.insertQuartet(quartet);
                } else if (resType.name == "CHAR") {
                    environment.handlerQuartet.listTempsInt.push(tTemp);
                    const quartet: Quartet = {operator: this.getSignNode()+"c", arg1: arg1, arg2: arg2, result: "t"+tTemp};
                    environment.handlerQuartet.insertQuartet(quartet);
                }

                return "t"+tTemp;
            }

        } else {
            const arg1 =  this.nodeLeft.execute(environment);
            const arg2 =  this.nodeRight.execute(environment);
            const tTemp = environment.addT();


            //Codigo de tres direciones para realizar una suma entre float, int, char
            if (this.type.name == "FLOAT") {
                environment.handlerQuartet.listTempsFloat.push(tTemp);
                const quartet: Quartet = {operator: this.getSignNode()+"f", arg1: arg1, arg2: arg2, result: "t"+tTemp};
                environment.handlerQuartet.insertQuartet(quartet);
            } else if (this.type.name == "INTEGER") {
                environment.handlerQuartet.listTempsInt.push(tTemp);
                const quartet: Quartet = {operator: this.getSignNode()+"i", arg1: arg1, arg2: arg2, result: "t"+tTemp};
                environment.handlerQuartet.insertQuartet(quartet);
            } else if (this.type.name == "CHAR") {
                environment.handlerQuartet.listTempsInt.push(tTemp);
                const quartet: Quartet = {operator: this.getSignNode()+"i", arg1: arg1, arg2: arg2, result: "t"+tTemp};
                environment.handlerQuartet.insertQuartet(quartet);
            }

            return "t"+tTemp;
        }
    }
    
}
