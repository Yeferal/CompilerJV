import { Stack } from "typescript-collections";
import { HandlerQuartet } from "../../../tree-direction/handler-quartet";
import { ClassInst } from "../instructions/class-inst";
import { PackageNode } from "../package-node";
import { TypeTable } from "../table/TypeTable";
import { SymbolTable } from "../table/symbol-table";

export class Environment {
    public symbolTable: SymbolTable = new SymbolTable();
    public typeTable: TypeTable = new TypeTable();
    private _handlerQuartet: HandlerQuartet = new HandlerQuartet();
    public isClass = false;
    public acutalClass: ClassInst;
    public actualPKG: PackageNode;
    public ambitNow: string;
    public etTrue: Stack<string> = new Stack<string>();
    public etFalse: Stack<string> = new Stack<string>();
    public isAsig: boolean = false;
    public et = 1;
    public t = 0;
    public h = 0;
    public stack = 0;

	public get handlerQuartet(): HandlerQuartet  {
		return this._handlerQuartet;
	}

	public set handlerQuartet(value: HandlerQuartet ) {
		this._handlerQuartet = value;
	}

    public addEt(): number {
        const etTemp = this.et;
        this.et++;
        return etTemp;
    }

    public addT(): number {
        const tTemp = this.t;
        this.t++;
        return tTemp;
    }

    public addH(hAdd: number): number {
        this.h += hAdd;
        return this.h;
    }

    public searchSymbol(name: string){
        return this.symbolTable.searchSymbol(name);
    }

    public searchSymbolThis(name: string){
        return this.symbolTable.searchSymbolThis(name);
    }

    public searchSymbolAtribClass(name: string, ambit: string){
        return this.symbolTable.searchSymbolAtribClass(name, ambit);
    }

    public searchSymbolConstructor(name: string){
        return this.symbolTable.searchSymbolConstructor(name);
    }

}
