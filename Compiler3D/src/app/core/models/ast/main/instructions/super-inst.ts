import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { DynamicDataType } from "../utils/DynamicDataType";
import { ClassInst } from "./class-inst";
import { ConstructorInst } from "./constructor-inst";

export class SuperInst extends Node  {
    private _params: Array<Node>;

    constructor(positionToken: PositionToken, token: string, params: Array<Node>) {
		super(positionToken, null, token);
        this._params = params;
	}

    /**
     * Getter params
     * @return {Array<Node>}
     */
	public get params(): Array<Node> {
		return this._params;
	}

    /**
     * Setter params
     * @param {Array<Node>} value
     */
	public set params(value: Array<Node>) {
		this._params = value;
	}

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        let listTypeParams: Array<DynamicDataType> = new Array<DynamicDataType>;
        //Verificar que los parametros sean correctos
        for (let j = 0; j < this.params.length; j++) {
            const resParam = this.params[j].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            listTypeParams.push(resParam);
        }

        if (handlerComprobation.actualClass.nameExtends == null) {
            const errorGramm = new ErrorGramm(this.positionToken, handlerComprobation.actualClass.name, `El la clase << ${handlerComprobation.actualClass.name} >> no tiene padre.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        let isExisteClass = false;
        let isExisteConstructor = false;
        for (let i = 0; i < handlerComprobation.listNode.length; i++) {
            if (handlerComprobation.listNode[i] instanceof ClassInst) {
                const element = handlerComprobation.listNode[i] as ClassInst;
                if (element.name == handlerComprobation.actualClass.nameExtends) {
                    isExisteClass = true;
                    for (let j = 0; j < element.instructions.length; j++) {
                        if (element.instructions[j] instanceof ConstructorInst) {
                            isExisteConstructor = true;
                            const constructorNode = element.instructions[j] as ConstructorInst;
                            let listTypeParamsConst: Array<DynamicDataType> = new Array<DynamicDataType>;
                            
                            for (let k = 0; k < constructorNode.listParams.length; k++) {
                                const resParam = constructorNode.listParams[k].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
                                listTypeParamsConst.push(resParam);
                            }

                            if (listTypeParams.length != listTypeParamsConst.length) {
                                const errorGramm = new ErrorGramm(this.positionToken, this.token, `El numero de parametros del construto del padre no es el mismo que el super << super >>.`, ErrorType.SEMANTIC); 
                                handlerComprobation.listError.push(errorGramm);
                                return ;
                            }else {
                                for (let k = 0; k < listTypeParamsConst.length; k++) {
                                    if (listTypeParamsConst[k].name != listTypeParams[k].name) {
                                        const errorGramm = new ErrorGramm(this.positionToken, this.token, `El tipo de dato de los parametros de la sobrecarga no es el mismo << super >>.`, ErrorType.SEMANTIC); 
                                        handlerComprobation.listError.push(errorGramm);
                                        return ;
                                    }
                                }
                                return ;
                            }
                        }
                        
                    }
                    if (!isExisteConstructor) {
                        if (listTypeParams.length > 0) {
                            const errorGramm = new ErrorGramm(this.positionToken, this.token, `El numero de parametros del construto del padre no es el mismo que el super << super >>.`, ErrorType.SEMANTIC); 
                            handlerComprobation.listError.push(errorGramm);
                            return ;
                        }
                    }
                    return ;
                }
                // return ;
            }
        }
        if (!isExisteClass) {
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `No existe la clase ${handlerComprobation.actualClass.nameExtends}.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }
        return ;
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
