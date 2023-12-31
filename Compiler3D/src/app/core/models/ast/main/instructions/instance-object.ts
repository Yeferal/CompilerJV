import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { DynamicDataType } from "../utils/DynamicDataType";
import { ClassInst } from "./class-inst";
import { ConstructorInst } from "./constructor-inst";
import { DeclarationParam } from "./declaration-param";

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

    public isTypeCorrectPrimitive(name: string): boolean{
        const typesCorrect = ["FLOAT", "INTEGER", "BOOLEAN", "CHAR"];
        return typesCorrect.includes(name);
    }


    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        
        const resType = handlerComprobation.typeTable.getDataType(this.id);
        if (resType == null) {
            //Error no existe un tipo de dato
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `El tipo de dato << ${this.id}>> no existe.`, ErrorType.SEMANTIC); 
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
        // console.log(this.type);
        //El constructor aun no existe tenesmos que buscarlo, pero solo para sus parametros
        let isExisteClass = false;
        let isExisteConstructor = false;
        
        // if (handlerComprobation.actualClass!= null) {
            
        // }
        for (let i = 0; i < handlerComprobation.listNode.length; i++) {
            //Busca que sea una clase
            
            if (handlerComprobation.listNode[i] instanceof ClassInst) {
                const element = handlerComprobation.listNode[i] as ClassInst;
                // console.log(handlerComprobation.actualClass);
                
                // Encuentra la clase
                // console.log(element.name, "==", handlerComprobation.actualClass.name);
                
                if (element.name == this.id) {
                    isExisteClass = true;
                    // Busca el constructor
                    for (let j = 0; j < element.instructions.length; j++) {
                        if (element.instructions[j] instanceof ConstructorInst) {
                            // Encuentra el constructor
                            isExisteConstructor = true;
                            const constructorNode = element.instructions[j] as ConstructorInst;
                            let listTypeParamsConst: Array<DynamicDataType> = new Array<DynamicDataType>;
                            // En lista los tipos de datos de los parametros
                            for (let k = 0; k < constructorNode.listParams.length; k++) {
                                
                                const resParam = constructorNode.listParams[k] as DeclarationParam;
                                listTypeParamsConst.push(resParam.type);
                            }

                            if (listTypeParams.length != listTypeParamsConst.length) {
                                const errorGramm = new ErrorGramm(this.positionToken, this.token, `El numero de parametros del construtor de la clase << ${this.id} >> no es el mismo.`, ErrorType.SEMANTIC); 
                                handlerComprobation.listError.push(errorGramm);
                                return ;
                            }else {
                                for (let k = 0; k < listTypeParamsConst.length; k++) {
                                    if ((this.isTypeCorrectPrimitive(listTypeParamsConst[k].name) && listTypeParams[k].name=="NULL")) {
                                        //Error no son del mismo tipo
                                        const errorGramm = new ErrorGramm(this.positionToken, this.token, `El tipo de dato de los parametros de la clase no es el mismo << ${this.id} >>.`, ErrorType.SEMANTIC); 
                                        handlerComprobation.listError.push(errorGramm);
                                        return ;
                                        
                                    }
                                    // if (listTypeParamsConst[k].name != listTypeParams[k].name) {
                                    //     const errorGramm = new ErrorGramm(this.positionToken, this.token, `El tipo de dato de los parametros de la clase no es el mismo << ${this.id} >>.`, ErrorType.SEMANTIC); 
                                    //     handlerComprobation.listError.push(errorGramm);
                                    //     return ;
                                    // }
                                }
                                return this.type;
                            }
                        }
                        
                    }
                    
                    if (!isExisteConstructor) {
                        if (listTypeParams.length > 0) {
                            const errorGramm = new ErrorGramm(this.positionToken, this.token, `El numero de parametros del construtor de la clase no es el mismo << ${this.id} >> no es el mismo.`, ErrorType.SEMANTIC); 
                            handlerComprobation.listError.push(errorGramm);
                            return ;
                        }
                    }
                    // console.log(this.type);
                    
                    return this.type;
                }
                // return ;
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

        let symbolAmbit;
        if (environment.isClass) {
            symbolAmbit = environment.symbolTable.searchSymbolFuncProc(environment.voidNow.peek(), environment.acutalClass.name); 
        } else {
            symbolAmbit = environment.symbolTable.searchSymbolMain(environment.ambitNow.peek());
        }
        // console.log(symbolAmbit);
        

        //Buscar el construtor
        const symbolConstructor = environment.symbolTable.searchSymbolConstructor(this.id);
        const sizeStack = environment.sizeMain;
        
        
        
        if (this.params!= null && this.params.length>0) {
            //Preparar el heap
            
    
            //Preparar los parametros
            for (let i = 0; i < this.params.length; i++) {
                const tAsig = this.params[i].execute(environment);

                environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "PREPARANDO EL PARAMETRO PARA LA INSTANCIA DE "+this.id, arg2: null, result: null});
                const tTemp = environment.addT();
                environment.handlerQuartet.listTempsInt.push(tTemp)
                environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbolAmbit.size, result: "t"+tTemp});

                const tTemp2 = environment.addT();
                environment.handlerQuartet.listTempsInt.push(tTemp2)
                environment.handlerQuartet.insertQuartet({operator: "+", arg1: "t"+tTemp, arg2: i+1, result: "t"+tTemp2});
                environment.handlerQuartet.insertQuartet({operator: "stack_asig_i", arg1: tAsig, arg2: i+1, result: "t"+tTemp2});
                
            }
        }
        

        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbolAmbit.size, result: "ptr"});
        // environment.handlerQuartet.insertQuartet({operator: "call_func", arg1: symbolConstructor.name+"_"+symbolConstructor.name, arg2: null, result: null});
        environment.handlerQuartet.insertQuartet({operator: "call_func", arg1: this.id+"_"+this.id, arg2: null, result: null});
        environment.handlerQuartet.insertQuartet({operator: "-", arg1: "ptr", arg2: symbolAmbit.size, result: "ptr"});


        environment.handlerQuartet.insertQuartet({operator: "comment", arg1: "Obteniendo el valor del constructor", arg2: null, result: null});

        //Mover el puntero temporalmente
        const tTemp3 = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTemp3);
        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "ptr", arg2: symbolAmbit.size, result: "t"+tTemp3});

        //Obtener la direcciones del this
        const tTemp4 = environment.addT();
        environment.handlerQuartet.listTempsInt.push(tTemp4);
        environment.handlerQuartet.insertQuartet({operator: "+", arg1: "t"+tTemp3, arg2: "0", result: "t"+tTemp4});

        //Obtener la direcciones de valor this
        // const tTemp5 = environment.addT();
        // environment.handlerQuartet.listTempsInt.push(tTemp5);
        environment.handlerQuartet.insertQuartet({operator: "stack_declar_f", arg1: "t"+tTemp4, arg2: null, result: "t"+tTemp4});

        return "t"+tTemp4;

    }
}
