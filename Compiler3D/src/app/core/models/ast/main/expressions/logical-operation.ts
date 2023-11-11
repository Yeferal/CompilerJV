import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { DataType } from "../utils/DataType";
import { DynamicDataType } from "../utils/DynamicDataType";
import { LogicalType } from "../utils/logical-type";

export class LogicalOperation extends Node{
    private _logicalType: LogicalType;
    private _nodeLeft: Node;
    private _nodeRight: Node;
    private _value: any;

    constructor(positionToken: PositionToken, token: string, logicalType: LogicalType, nodeLeft: Node, nodeRight: Node) {
        super(positionToken, null, token);
		this._logicalType = logicalType;
        this._nodeLeft = nodeLeft;
        this._nodeRight = nodeRight;
	}

    public get logicalType(): LogicalType {
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
        let resRight;
        if (this.nodeRight != null) {
            resRight = this.nodeRight.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        }
        
        if (resLeft!= null && resRight!= null) {
            //Comprobacion de tipos
            
            const resType: DynamicDataType = this._typeVerifier.verifierTypeLogicalNode(resLeft, resRight, this.logicalType);
            
            if (resLeft) {
                this.type = resType;
                return resType;
            } else {
                const errorGramm = new ErrorGramm(this.positionToken, this.token, `No es posible realizar la operacion << ${this.nodeLeft.token} ${this.token} ${this.nodeRight.token} >> Los Tipos de datos no son compatibles.`, ErrorType.SEMANTIC); 
                handlerComprobation.listError.push(errorGramm);
            }
        }else{
            if (resLeft!= null) {
                const resType: DynamicDataType = this._typeVerifier.verifierTypeLogicalNode(resLeft, resRight, this.logicalType);
                if (resLeft) {
                    this.type = resType;
                    return resType;
                }
            }
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
        
        switch (this.logicalType) {
            case LogicalType.AND:
                const tTempAnd1 = this.nodeLeft.execute(environment);
                if (!(this.nodeLeft instanceof LogicalOperation)) {
                    const etTempAndTrue = environment.addEt();
                    const etTempAndFalse = environment.addEt();
                    environment.etTrue.push("et"+etTempAndTrue);
                    environment.etFalse.push("et"+etTempAndFalse);
                    environment.handlerQuartet.insertQuartet({operator: "if_simple", arg1: tTempAnd1, arg2: null, result: "et"+etTempAndTrue});
                    environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempAndFalse});
                    
                }

                if (!environment.etTrue.isEmpty()) {
                    environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: environment.etTrue.pop()});
                    // while (!environment.etTrue.isEmpty()) {
                    // }
                }

                const tTempAnd2 = this.nodeRight.execute(environment);
                if (!(this.nodeRight instanceof LogicalOperation)) {
                    

                    const etTempAndTrue2 = environment.addEt();
                    const etTempAndFalse2 = environment.addEt();
                    environment.etTrue.push("et"+etTempAndTrue2);
                    environment.etFalse.push("et"+etTempAndFalse2);
                    environment.handlerQuartet.insertQuartet({operator: "if_simple", arg1: tTempAnd2, arg2: null, result: "et"+etTempAndTrue2});
                    environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempAndFalse2});
                } 
                break;
            case LogicalType.OR:

                const tTempOr1 = this.nodeLeft.execute(environment);
                if (!(this.nodeLeft instanceof LogicalOperation)) {
                    const etTempOrTrue = environment.addEt();
                    const etTempOrFalse = environment.addEt();
                    environment.etTrue.push("et"+etTempOrTrue);
                    environment.etFalse.push("et"+etTempOrFalse);
                    environment.handlerQuartet.insertQuartet({operator: "if_simple", arg1: tTempOr1, arg2: null, result: "et"+etTempOrTrue});
                    environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempOrFalse});
                }


                if (!environment.etFalse.isEmpty()) {
                    while (!environment.etFalse.isEmpty()) {
                        environment.handlerQuartet.insertQuartet({operator: "label", arg1: null, arg2: null, result: environment.etFalse.pop()});
                    }
                }

                const tTempOr2 = this.nodeRight.execute(environment);
                if (!(this.nodeRight instanceof LogicalOperation)) {
                    
                    const etTempOrTrue2 = environment.addEt();
                    const etTempOrFalse2 = environment.addEt();
                    environment.etTrue.push("et"+etTempOrTrue2);
                    environment.etFalse.push("et"+etTempOrFalse2);
                    environment.handlerQuartet.insertQuartet({operator: "if_simple", arg1: tTempOr2, arg2: null, result: "et"+etTempOrTrue2});
                    environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempOrFalse2});
                } 
                break;
            case LogicalType.NOT:
                
                const tTempNot1 = this.nodeLeft.execute(environment);
                if (!(this.nodeLeft instanceof LogicalOperation)) {
                    const etTempNotTrue = environment.addEt();
                    const etTempNotFalse = environment.addEt();
                    environment.etTrue.push("et"+etTempNotFalse);
                    environment.etFalse.push("et"+etTempNotTrue);
                    environment.handlerQuartet.insertQuartet({operator: "if_simple", arg1: tTempNot1, arg2: null, result: "et"+etTempNotFalse});
                    environment.handlerQuartet.insertQuartet({operator: "jump", arg1: null, arg2: null, result: "et"+etTempNotTrue});
                    
                }

                break;
        }
    }
}

