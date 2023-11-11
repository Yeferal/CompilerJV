import { Stack } from 'typescript-collections';
import { Symbol } from './symbol';
import { forEach } from 'typescript-collections/dist/lib/arrays';
import { SymbolType } from './symbol-type';
import { DynamicDataType } from '../utils/DynamicDataType';

export class SymbolTable {
    public stackTable: Stack<Array<Symbol>> = new Stack<Array<Symbol>>();

    constructor(){
        this.stackTable.push([]);
    }

    public addNewTable(){
        let newTable = new Array<Symbol>;
        if (!this.stackTable.isEmpty()) {
            
            
            newTable.push(...this.stackTable.peek());
        }
        this.stackTable.add(newTable);
    }

    public searchSymbol(name: string): Symbol{
        if (!this.stackTable.isEmpty()) {
            const tableTemp = this.stackTable.peek();
            for (let i = 0; i < tableTemp.length; i++) {
                const symbol = tableTemp[i];
                if (name === symbol.name) {
                    return symbol;
                }
            }
        }
        return null;
    }

    public searchSymbolThis(name: string): Symbol{
        if (!this.stackTable.isEmpty()) {
            const tableTemp = this.stackTable.peek();
            
            for (let i = 0; i < tableTemp.length; i++) {
                const symbol = tableTemp[i];
                
                if (name === symbol.name && symbol.symbolType == SymbolType.ATRIBUT) {
                    return symbol;
                }
            }
        }
        return null;
    }

    public searchSymbolAtribClass(name: string, ambit: string): Symbol{
        if (!this.stackTable.isEmpty()) {
            const tableTemp = this.stackTable.peek();
            for (let i = 0; i < tableTemp.length; i++) {
                const symbol = tableTemp[i];
                // console.log(symbol);
                // console.log(name, "===",symbol.name, ambit, "==", symbol.ambit);
                
                if (name === symbol.name && ambit == symbol.ambit) {
                    return symbol;
                }
            }
        }
        return null;
    }

    public searchSymbolVar(name: string, ambit: string): Symbol{
        if (!this.stackTable.isEmpty()) {
            const tableTemp = this.stackTable.peek();
            for (let i = 0; i < tableTemp.length; i++) {
                const symbol = tableTemp[i];
                if (name === symbol.name && ambit == symbol.ambit && symbol.symbolType == SymbolType.VAR) {
                    return symbol;
                }
            }
        }
        return this.searchSymbolParam(name, ambit);
    }

    public searchSymbolParam(name: string, ambit: string): Symbol{
        if (!this.stackTable.isEmpty()) {
            const tableTemp = this.stackTable.peek();
            for (let i = 0; i < tableTemp.length; i++) {
                const symbol = tableTemp[i];
                if (name === symbol.name && ambit == symbol.ambit && symbol.symbolType == SymbolType.PARAM) {
                    return symbol;
                }
            }
        }
        return null;
    }



    public searchSymbolConstructor(name: string): Symbol{
        if (!this.stackTable.isEmpty()) {
            const tableTemp = this.stackTable.peek();
            for (let i = 0; i < tableTemp.length; i++) {
                const symbol = tableTemp[i];
                if (name === symbol.name && symbol.symbolType == SymbolType.CONSTRUCTOR) {
                    return symbol;
                }
            }
        }
        return null;
    }
    

    public addSymbol(symbol: Symbol){
        this.stackTable.peek().push(symbol);
    }

    public popTableAmbit(){
        if (!this.stackTable.isEmpty()) {
            this.stackTable.pop();
        }
    }

    public setListParams(name: string, ambit: string, listParams: Array<DynamicDataType>){
        if (!this.stackTable.isEmpty()) {
            for (let i = 0; i < this.stackTable.peek().length; i++) {
                if (name === this.stackTable.peek()[i].name && ambit == this.stackTable.peek()[i].ambit) {
                    this.stackTable.peek()[i].listParams = listParams;
                    
                    return this.stackTable.peek()[i];
                }
            }
        }
        return null;
    }

    public setListSize(name: string, ambit: string, size: number){
        if (!this.stackTable.isEmpty()) {
            for (let i = 0; i < this.stackTable.peek().length; i++) {
                if (name === this.stackTable.peek()[i].name && ambit == this.stackTable.peek()[i].ambit) {
                    this.stackTable.peek()[i].size = size;
                    return this.stackTable.peek()[i];
                }
            }
        }
        return null;
    }
}
