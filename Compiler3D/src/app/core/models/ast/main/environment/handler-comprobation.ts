import { Stack } from 'typescript-collections';
import { SymbolTable } from '../table/symbol-table';
import { ErrorGramm } from '../../error/error-gramm';
import { TypeTable } from '../table/TypeTable';

export class HandlerComprobation {
    private _symbolTable: SymbolTable = new SymbolTable();
    private _typeTable: TypeTable = new TypeTable();
    private _ambits: Stack<string> = new Stack<string>;
    private _pointers: Stack<number> = new Stack<number>;
    private _pointerNow: number;
    private _listError: Array<ErrorGramm> = new Array<ErrorGramm>;
    private _flagId = 0;
    sizeFuncProc: number;

    constructor(){
        this._pointers.push(0);
        this._pointerNow = this._pointers.peek();
    }

    public get symbolTable(): SymbolTable {
        return this._symbolTable;
    }

    public set symbolTable(value: SymbolTable) {
        this._symbolTable = value;
    }

	public get typeTable(): TypeTable  {
		return this._typeTable;
	}

	public set typeTable(value: TypeTable ) {
		this._typeTable = value;
	}

    public get listError(): Array<ErrorGramm> {
        return this._listError;
    }

    public set listError(value: Array<ErrorGramm>) {
        this._listError = value;
    }
    
    public getIdDynamic(){
        const idNum = this._flagId;
        this._flagId++;
        return idNum;
    }

    public addAmbitS(ambit: string){
        this._ambits.push(ambit);
    }

    public getAmbitS(): string{
        return this._ambits.peek();
    }

    public getPackageRoot(){
        return "";
    }

    public getAndAddPointer(): number {
        const flagPoint = this._pointers.pop();
        this._pointers.push(flagPoint + 1);
        this._pointerNow = flagPoint + 1;
        return flagPoint;
    }

    public addAmbit(){
        this.symbolTable.addNewTable();
    }

    public popAmbit(){
        this.symbolTable.popTableAmbit();
    }
    
    
}
