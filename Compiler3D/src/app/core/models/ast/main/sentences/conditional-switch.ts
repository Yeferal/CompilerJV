import { ErrorType } from "../../error/ErrorType";
import { ErrorGramm } from "../../error/error-gramm";
import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Node } from "../node";
import { ConditionalSwitchCase } from "./conditional-switch-case";

export class ConditionalSwitch extends Node {
    private _value: Node;
    private _listCases: Array<Node>;
    private _defaultCase: Node;

	constructor(positionToken: PositionToken, toke: string, value: Node, listCases: Array<Node>) {
		super(positionToken, null, toke);
        this._value = value;
		this._listCases = listCases;
	}

    /**
     * Getter value
     * @return {Node}
     */
	public get value(): Node {
		return this._value;
	}

    /**
     * Getter listCases
     * @return {Array<Node>}
     */
	public get listCases(): Array<Node> {
		return this._listCases;
	}

    /**
     * Getter defaultCase
     * @return {Node}
     */
	public get defaultCase(): Node {
		return this._defaultCase;
	}

    /**
     * Setter value
     * @param {Node} value
     */
	public set value(value: Node) {
		this._value = value;
	}

    /**
     * Setter listCases
     * @param {Array<Node>} value
     */
	public set listCases(value: Array<Node>) {
		this._listCases = value;
	}

    /**
     * Setter defaultCase
     * @param {Node} value
     */
	public set defaultCase(value: Node) {
		this._defaultCase = value;
	}


    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        const resCondition = this.value.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        if (resCondition == null) {
            //Error el valor de la condicional no es un booleano
            const errorGramm = new ErrorGramm(this.positionToken, this.token, `El tipo de valor << ${this.value.token}>> no es valido.`, ErrorType.SEMANTIC); 
            handlerComprobation.listError.push(errorGramm);
            return ;
        }

        if (this.listCases!=null && this.listCases.length > 0) {
            for (let i = 0; i < this.listCases.length; i++) {
                if (this.listCases[i] instanceof ConditionalSwitchCase) {
                    const caseTemp = this.listCases[i] as ConditionalSwitchCase;
                    const resConditionCase = caseTemp.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
                    if (resConditionCase== null  || resCondition.name != resConditionCase.name) {
                        const errorGramm = new ErrorGramm(this.positionToken, this.token, `El tipo de valor << ${this.value.token}>> y la condicion case <<${caseTemp.token}>> no son del mismo tipo.`, ErrorType.SEMANTIC); 
                        handlerComprobation.listError.push(errorGramm);
                        return ;
                    }
                }
            }
        }

        //AGREGAR UN AMBITO
        handlerComprobation.addAmbit();

        if (this.listCases!=null && this.listCases.length > 0) {
            for (let i = 0; i < this.listCases.length; i++) {
                if (this.listCases[i] instanceof ConditionalSwitchCase) {
                    const caseTemp = this.listCases[i] as ConditionalSwitchCase;
                    caseTemp.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
                }
            }
        }

        if (this.defaultCase != null) {
            this.defaultCase.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        }

        //SALIR DEL AMBITO
        handlerComprobation.popAmbit();

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
