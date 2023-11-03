import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { DynamicDataType } from "../utils/DynamicDataType";
import { ClassInst } from "./class-inst";
import { ConstructorInst } from "./constructor-inst";

export class InstanceObject extends Node {
    private _id: string;
    private _params: Array<Node>;
    

	constructor(positionToken: PositionToken, token: string, id: string, params: Array<Node>) {
		super(positionToken, null, token);
        this._id = id;
		this._params = params;
	}

    /**
     * Getter id
     * @return {string}
     */
	public get id(): string {
		return this._id;
	}

    /**
     * Getter params
     * @return {Array<Node>}
     */
	public get params(): Array<Node> {
		return this._params;
	}

    /**
     * Setter id
     * @param {string} value
     */
	public set id(value: string) {
		this._id = value;
	}

    /**
     * Setter params
     * @param {Array<Node>} value
     */
	public set params(value: Array<Node>) {
		this._params = value;
	}

    generateListParamsType(handlerComprobation: HandlerComprobation): Array<string>{
        let list: Array<string> = [];
        if (this.params!=null && this.params.length>0) {
            for (let i = 0; i < this.params.length; i++) {
                const element = this.params[i].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            }
        }
        return list;
    }


    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        
        const resType = handlerComprobation.typeTable.getDataType(this.id);
        if (resType == null) {
            //Error no existe un tipo de dato
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `El tipo de dato << ${this.type.name}>> no existe.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }else {
            this.type = resType;
        }

        let listTypeParams: Array<DynamicDataType> = new Array<DynamicDataType>;
        //Verificar que los parametros sean correctos
        for (let j = 0; j < this.params.length; j++) {
            const resParam = this.params[j].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            listTypeParams.push(resParam);
        }

        //El constructor aun no existe tenesmos que buscarlo, pero solo para sus parametros
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
                                const errorGramm = new ErrorGramm(this.positionToken, this.token, `El numero de parametros del construtor de la clase << ${this.id} >>.`, ErrorType.SEMANTIC); 
                                handlerComprobation.listError.push(errorGramm);
                                return ;
                            }else {
                                for (let k = 0; k < listTypeParamsConst.length; k++) {
                                    if (listTypeParamsConst[k].name != listTypeParams[k].name) {
                                        const errorGramm = new ErrorGramm(this.positionToken, this.token, `El tipo de dato de los parametros de la clase no es el mismo << ${this.id} >>.`, ErrorType.SEMANTIC); 
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
                            const errorGramm = new ErrorGramm(this.positionToken, this.token, `El numero de parametros del construto de la clase no es el mismo << ${this.id} >>.`, ErrorType.SEMANTIC); 
                            handlerComprobation.listError.push(errorGramm);
                            return ;
                        }
                    }
                    return ;
                }
                return ;
            }
        }

        return this.type;
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
