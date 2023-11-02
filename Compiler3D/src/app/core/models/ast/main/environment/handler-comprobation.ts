import { Stack } from 'typescript-collections';
import { SymbolTable } from '../table/symbol-table';
import { ErrorGramm } from '../../error/error-gramm';
import { TypeTable } from '../table/TypeTable';
import { Symbol } from '../table/symbol';
import { Node } from '../node';
import { ClassInst } from '../instructions/class-inst';

export class HandlerComprobation {
    public symbolTable: SymbolTable = new SymbolTable();
    public symbolAmbit: SymbolTable = new SymbolTable();
    public typeTable: TypeTable = new TypeTable();
    public ambits: Stack<string> = new Stack<string>;
    public pointers: Stack<number> = new Stack<number>;
    public pointerNow: number;
    public listError: Array<ErrorGramm> = new Array<ErrorGramm>;
    public flagId = 0;
    public sizeFuncProc: number;
    public listGetters: Array<Node> = [];
    public listSetters: Array<Node> = [];
    public listStatic: Array<Node> = [];
    public actualClass: ClassInst;
    public listNode: Array<Node>;

    constructor(){
        this.pointers.push(0);
        this.pointerNow = this.pointers.peek()
        this.ambits.push(""); //GLOBAL
    }

    public getIdDynamic(){
        const idNum = this.flagId;
        this.flagId++;
        return idNum;
    }

    public addAmbitS(ambit: string){
        this.ambits.push(ambit);
    }

    public getAmbitS(): string{
        return this.ambits.peek();
    }

    public getPackageRoot(){
        return "";
    }

    public getAndAddPointer(): number {
        const flagPoint = this.pointers.pop();
        this.pointers.push(flagPoint + 1);
        this.pointerNow = flagPoint + 1;
        return flagPoint;
    }

    public resetPointer(): number {
        this.pointers.clear();
        this.pointers.push(0);
        return this.pointers.peek();
    }

    public addAmbit(){
        this.symbolAmbit.addNewTable();
    }

    public popAmbit(){
        this.symbolAmbit.popTableAmbit();
    }

    public popAmbitS(){
        if (!this.ambits.isEmpty()) {
            this.ambits.pop();
        }
    }

    public addSymbol(symbol: Symbol){
        this.symbolTable.addSymbol(symbol);
        this.symbolAmbit.addSymbol(symbol);
    }

    public searchSymbol(name: string){
        return this.symbolAmbit.searchSymbol(name);
    }
    
    public paintError(){
        for (let i = 0; i < this.listError.length; i++) {
            console.log(this.listError[i].toString());
            
            
        }
    }

    public isExistType(name: string): boolean {
        return this.typeTable.isExistType(name);
    }
}
