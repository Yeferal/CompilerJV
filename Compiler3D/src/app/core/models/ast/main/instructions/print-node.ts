import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { Primitive } from "../expressions/primitive";
import { Node } from "../node";

export class PrintNode extends Node {
    private _value: Node;
    private _isLn: boolean;

	constructor(positionToken: PositionToken, toke: string, value: Node, isLn: boolean) {
        super(positionToken, null, toke);
        this._value = value;
		this._isLn = isLn;
	}

    /**
     * Getter value
     * @return {Node}
     */
	public get value(): Node {
		return this._value;
	}

    /**
     * Getter isLn
     * @return {boolean}
     */
	public get isLn(): boolean {
		return this._isLn;
	}

    /**
     * Setter value
     * @param {Node} value
     */
	public set value(value: Node) {
		this._value = value;
	}

    /**
     * Setter isLn
     * @param {boolean} value
     */
	public set isLn(value: boolean) {
		this._isLn = value;
	}

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        const resType = this.value.executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
        this.type = resType;
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
        const ln = this.isLn? "\n" : "";
        if (this.value instanceof Primitive) {
            if (this.value.type.name == "STRING") {
                environment.handlerQuartet.insertQuartet({operator: "printfsimple", arg1: "\""+this.value.value+ln+"\"", arg2: null, result: null});
            } else if (this.value.type.name == "FLOAT") {
                environment.handlerQuartet.insertQuartet({operator: "printf", arg1: "\"%f"+ln+"\"", arg2: this.value.value, result: null}); 
            } else if (this.value.type.name == "INTEGER") {
                environment.handlerQuartet.insertQuartet({operator: "printf", arg1: "\"%d"+ln+"\"", arg2: this.value.value, result: null}); 
            } else if (this.value.type.name == "CHAR") {
                environment.handlerQuartet.insertQuartet({operator: "printf", arg1: "\"%c"+ln+"\"", arg2: this.value.value, result: null}); 
            } else if (this.value.type.name == "BOOLEAN") {
                environment.handlerQuartet.insertQuartet({operator: "printf", arg1: "\"%d"+ln+"\"", arg2: this.value.value? 1 : 0, result: null}); 
            }
            
        } else {
            const tTemp = this.value.execute(environment);

            if (this.value.type.name == "STRING") {
                environment.handlerQuartet.insertQuartet({operator: "printf", arg1: "\"%s"+ln+"\"", arg2: tTemp, result: null}); 
            } else if (this.value.type.name == "FLOAT") {
                environment.handlerQuartet.insertQuartet({operator: "printf", arg1: "\"%f"+ln+"\"", arg2: tTemp, result: null}); 
            } else if (this.value.type.name == "INTEGER") {
                environment.handlerQuartet.insertQuartet({operator: "printf", arg1: "\"%d"+ln+"\"", arg2: tTemp, result: null}); 
            } else if (this.value.type.name == "CHAR") {
                environment.handlerQuartet.insertQuartet({operator: "printf", arg1: "\"%c"+ln+"\"", arg2: tTemp, result: null}); 
            } else if (this.value.type.name == "BOOLEAN") {
                environment.handlerQuartet.insertQuartet({operator: "printf", arg1: "\"%d"+ln+"\"", arg2: tTemp, result: null}); 
            }
        }
    }
}
