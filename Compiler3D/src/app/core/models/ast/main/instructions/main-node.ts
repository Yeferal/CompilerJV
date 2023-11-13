import { PositionToken } from "../../error/position-token";
import { Environment } from "../environment/environment";
import { HandlerComprobation } from "../environment/handler-comprobation";
import { ImportNode } from "../import-node";
import { Node } from "../node";
import { PackageNode } from "../package-node";
import { Symbol } from "../table/symbol";
import { SymbolType } from "../table/symbol-type";
import { DynamicDataType } from "../utils/DynamicDataType";
import { EncapsulationType } from "../utils/encapsulation-type";

export class MainNode extends Node {

    private _instructions: Array<Node>;
    private _packageNode: PackageNode;
    private _listImport: Array<ImportNode>;
    size: number = 0;
    

	constructor(positionToken: PositionToken, token: string, instructions: Array<Node>) {
		super(positionToken, null, token);
        this._instructions = instructions;
	}

    /**
     * Getter instructions
     * @return {Array<Node>}
     */
	public get instructions(): Array<Node> {
		return this._instructions;
	}

    /**
     * Setter instructions
     * @param {Array<Node>} value
     */
	public set instructions(value: Array<Node>) {
		this._instructions = value;
	}

    /**
     * Getter packageNode
     * @return {PackageNode}
     */
	public get packageNode(): PackageNode {
		return this._packageNode;
	}

    /**
     * Getter listImport
     * @return {Array<ImportNode>}
     */
	public get listImport(): Array<ImportNode> {
		return this._listImport;
	}

    /**
     * Setter packageNode
     * @param {PackageNode} value
     */
	public set packageNode(value: PackageNode) {
		this._packageNode = value;
	}

    /**
     * Setter listImport
     * @param {Array<ImportNode>} value
     */
	public set listImport(value: Array<ImportNode>) {
		this._listImport = value;
	}

    public addSymbol(handlerComprobation: HandlerComprobation, ambitMain: string){
        const newSymbol: Symbol = new Symbol(
            handlerComprobation.getIdDynamic(),     //id
            "main",                                //nameCode
            "main",                                //name
            SymbolType.MAIN,                 //symbolType
            false,                        //isFunction
            null,                              //type, tipo de dato
            null,                 //numParams
            null,                         //listParams
            null, //direccion o el numero de puntero para la pila de ejecucion
            handlerComprobation.sizeFuncProc,       //Tamanio del symbol
            false,                                  //isArray
            null,                                   //listDims
            false,                                  //isReference
            EncapsulationType.PUBLIC,                     //encapsulation
            handlerComprobation.getPackageRoot()+"main",//fullname, desde que paquete hasta el id
            false                                   //isConst
        );
            // console.log(handlerComprobation.actualPKG.path);
            
        newSymbol.ambit = ambitMain;
        newSymbol.packageS = handlerComprobation.actualPKG.path;

        handlerComprobation.addSymbol(newSymbol);
        // console.log(newSymbol);
        
    }

    public override executeComprobationTypeNameAmbitUniqueness(handlerComprobation: HandlerComprobation): any {
        if (this.packageNode != null) {
            handlerComprobation.actualPKG = this.packageNode;
        } else {
            this.packageNode = handlerComprobation.actualPKG;
        }
        
        
        let nameAmbit = handlerComprobation.actualPKG.path;
        if (handlerComprobation.actualClass != null) {
            nameAmbit += "."+handlerComprobation.actualClass.name
        }

        this.addSymbol(handlerComprobation, nameAmbit);

        handlerComprobation.addAmbitS(nameAmbit);
        handlerComprobation.addAmbit();
        handlerComprobation.sizeFuncProc = 0;

        for (let i = 0; i < this.instructions.length; i++) {
            this.instructions[i].executeComprobationTypeNameAmbitUniqueness(handlerComprobation);
            
        }

        // console.log("main", handlerComprobation.actualPKG.path, handlerComprobation.sizeFuncProc);
        
        this.size = handlerComprobation.sizeFuncProc;
        handlerComprobation.setListSizeTableSymbol("main", nameAmbit, this.size);
        
        //sacar el ambito
        handlerComprobation.popAmbitS();
        handlerComprobation.popAmbit();
        handlerComprobation.sizeFuncProc = 0;
        handlerComprobation.resetPointer();

        handlerComprobation.listMain.push(this);

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
        environment.actualPKG = this.packageNode;

        let nameAmbit = environment.actualPKG.path;
        
        // console.log(this.isClass);
        
        if (this.isClass) {
            nameAmbit += "."+this.nameClass
        }
        // console.log(nameAmbit);
        
        const symbolMain = environment.symbolTable.searchSymbolMain(nameAmbit);
        // console.log(symbolMain);
        
        environment.sizeMain = symbolMain.size;
        
        environment.handlerQuartet.insertQuartet({operator: "main", arg1: "main", arg2: "", result: ""});

        environment.ambitNow.push(nameAmbit);
        
        for (let i = 0; i < this.instructions.length; i++) {
            this.instructions[i].execute(environment);
            
        }

        environment.handlerQuartet.insertQuartet({operator: "close", arg1: "", arg2: "", result: ""});
        environment.ambitNow.pop();
    }
}
