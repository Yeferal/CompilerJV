import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { DynamicDataType } from "../utils/DynamicDataType";

export class DataArray extends Node {
    private _contentList: Array<Node>;

    constructor(positionToken: PositionToken, token: string, contentList: Array<Node>){
        super(positionToken, null, token);
        this._contentList = contentList;
    }

    public get contentList(): Array<Node> {
        return this._contentList;
    }
    public set contentList(value: Array<Node>) {
        this._contentList = value;
    }

    public searchTypeArray(handlerComprobation: HandlerComprobation): DynamicDataType {
        let typeArray: DynamicDataType = null;
        for (let i = 0; i < this.contentList.length; i++) {
            if (this.contentList[i] instanceof DataArray) {
                const element: DataArray = this.contentList[i] as DataArray;
                const res = element.searchTypeArray(handlerComprobation);
                
                if (res == null) {
                    const errorGramm = new ErrorGramm(this.positionToken, this.token, `Los valores de los datos del arreglo no son correctos, no pertenecen al mismo tipo de dato << ${element.token} >> El tipo de dato no es compatible.`, ErrorType.SEMANTIC); 
                    handlerComprobation.listError.push(errorGramm);
                    return null;
                }

                if (i == 0) {
                    this.type = res;
                    typeArray = res;
                }else {
                    if (typeArray.name != res.name) {
                        //ERROR de tipos
                        const errorGramm = new ErrorGramm(this.positionToken, this.token, `Los valores de los datos del arreglo no son correctos, no pertenecen al mismo tipo de dato << ${element.token} >> El tipo de dato no es compatible.`, ErrorType.SEMANTIC); 
                        handlerComprobation.listError.push(errorGramm);
                        return null;
                    }
                }
                
            } else {
                const element: Node = this.contentList[i] as Node;
                const res = element.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);

                if (res == null) {
                    const errorGramm = new ErrorGramm(this.positionToken, this.token, `Los valores de los datos del arreglo no son correctos, no pertenecen al mismo tipo de dato << ${element.token} >> El tipo de dato no es compatible.`, ErrorType.SEMANTIC); 
                    handlerComprobation.listError.push(errorGramm);
                    return null;
                }
                
                if (i == 0) {
                    this.type = res;
                    typeArray = res;
                }else {
                    if (typeArray.name != res.name) {
                        //ERROR de tipos
                        const errorGramm = new ErrorGramm(this.positionToken, this.token, `Los valores de los datos del arreglo no son correctos, no pertenecen al mismo tipo de dato << ${element.token} >> El tipo de dato no es compatible.`, ErrorType.SEMANTIC); 
                        handlerComprobation.listError.push(errorGramm);
                        return null;
                    }
                }
            }
            
        }
        return typeArray;
    }

    public verifyDimArray(handlerComprobation: HandlerComprobation, listNode: Array<Node>): number{
        let dimCount: number = 0;
        if (listNode!=null) {
            for (let i = 0; i < listNode.length; i++) {
                if (listNode[i] instanceof DataArray) {
                    let dataArray: DataArray = listNode[i] as DataArray;
                    if (i == 0) {
                        dimCount = dataArray.contentList.length;
                        this.verifyDimArray(handlerComprobation, dataArray.contentList);
                    } else {
                        if (dimCount != dataArray.contentList.length) {
                            //Error de unicidad o dimensiones
                            const errorGramm = new ErrorGramm(this.positionToken, this.token, `El numero de valores de los arreglos no son congruentes.`, ErrorType.SEMANTIC); 
                            handlerComprobation.listError.push(errorGramm);
                            return 0;
                        }
                        this.verifyDimArray(handlerComprobation, dataArray.contentList);
                    }
                }
                // else {
                //     dimCount = listNode.length;
                //     break;
                // }
            }
            
        }

        return dimCount;
    }

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        //Fase 1: Verificar los tipos de dato que sean del mismo cada valor de toda la data
        const resType = this.searchTypeArray(handlerComprobation);
        if (resType != null) {
            //Fase 2: Verificar que las dimensiones del arreglo sean congruentes.
            this.verifyDimArray(handlerComprobation, this.contentList);

            //Fase 3: Contar u obtner el numero de dimensiones de toda la data. esto se hara en la asignacion o declaracion del arreglo, aqui no.
            
            
            return resType; //retornamos el tipo de dato de los valores del arreglo
        }
        //ERROR de tipos
        const errorGramm = new ErrorGramm(this.positionToken, this.token, `Los valores de los datos del arreglo no son correctos, no pertenecen al mismo tipo de dato. El tipo de dato es inconsistente.`, ErrorType.SEMANTIC); 
        handlerComprobation.listError.push(errorGramm);
        return null;

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
        // throw new Error("Method not implemented.");
    }
}
