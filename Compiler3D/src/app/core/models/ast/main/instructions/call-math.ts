import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { DynamicDataType } from "../utils/DynamicDataType";
import { MathType } from "../utils/math-type";

export class CallMath extends Node {
    private _mathType: MathType;
    private _paramLeft: Node;
    private _paramRight: Node;


	constructor(positionToken: PositionToken, token: string, mathType: MathType, paramLeft: Node, paramRight: Node) {
		super(positionToken, null, token);
        this._mathType = mathType;
		this._paramRight = paramRight;
		this._paramLeft = paramLeft;
	}

    /**
     * Getter mathType
     * @return {MathType}
     */
	public get mathType(): MathType {
		return this._mathType;
	}

    /**
     * Getter paramRight
     * @return {Node}
     */
	public get paramRight(): Node {
		return this._paramRight;
	}

    /**
     * Getter paramLeft
     * @return {Node}
     */
	public get paramLeft(): Node {
		return this._paramLeft;
	}

    /**
     * Setter mathType
     * @param {MathType} value
     */
	public set mathType(value: MathType) {
		this._mathType = value;
	}

    /**
     * Setter paramRight
     * @param {Node} value
     */
	public set paramRight(value: Node) {
		this._paramRight = value;
	}

    /**
     * Setter paramLeft
     * @param {Node} value
     */
	public set paramLeft(value: Node) {
		this._paramLeft = value;
	}


    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        let resLeft = null;
        let resRight = null;
        
        if (this.paramLeft != null) {
            resLeft = this.paramLeft.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        }

        if (this.paramRight!= null) {
            resRight = this.paramRight.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        }
        
        switch(this.mathType){
            // De un parametro
            case MathType.ABS:
            case MathType.CEIL:
            case MathType.FLOOR:
            case MathType.ROUND:
            case MathType.SQRT:
            case MathType.TO_RADIANS:
            case MathType.ACOS:
            case MathType.SIN:
            case MathType.ATAN:
            case MathType.EXP:
                
                if (resLeft == null) {
                    const errorGramm = new ErrorGramm(this.positionToken, this.token, `Parametros invalidos de la funciones Math.x << ${this.mathType} >>.`, ErrorType.SEMANTIC); 
                    handlerComprobation.listError.push(errorGramm);
                    return ;
                }
                if ((resLeft.name != "FLOAT" && resLeft.name != "INTEGER")) {
                    const errorGramm = new ErrorGramm(this.positionToken, this.token, `Parametros invalidos de la funciones Math.x << ${this.mathType} >> deben ser enteros o flotantes`, ErrorType.SEMANTIC); 
                    handlerComprobation.listError.push(errorGramm);
                    return ;
                }
                break;
            //De dos parametros
            case MathType.MAX:
            case MathType.MIN:
            case MathType.POW:
                if (resLeft == null || resRight==null) {
                    const errorGramm = new ErrorGramm(this.positionToken, this.token, `Parametros invalidos de la funciones Math.x << ${this.mathType} >>.`, ErrorType.SEMANTIC); 
                    handlerComprobation.listError.push(errorGramm);
                    return ;
                }
                if ((resLeft.name != "FLOAT" && resLeft.name != "INTEGER") || (resRight.name != "FLOAT" && resRight.name != "INTEGER")) {
                    const errorGramm = new ErrorGramm(this.positionToken, this.token, `Parametros invalidos de la funciones Math.x << ${this.mathType} >> deben ser enteros o flotantes`, ErrorType.SEMANTIC); 
                    handlerComprobation.listError.push(errorGramm);
                    return ;
                }
                break;
                
            //De 0 parametros
            case MathType.RANDOM:
                if (resLeft != null || resRight!=null) {
                    const errorGramm = new ErrorGramm(this.positionToken, this.token, `Parametros invalidos de la funciones Math.x << ${this.mathType} >>.`, ErrorType.SEMANTIC); 
                    handlerComprobation.listError.push(errorGramm);
                    return ;
                }
        }

        return new DynamicDataType(1, "FLOAT", 1);

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
