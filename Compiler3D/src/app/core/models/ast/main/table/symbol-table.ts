import { Stack } from 'typescript-collections';
import { Symbol } from './symbol';
import { forEach } from 'typescript-collections/dist/lib/arrays';

export class SymbolTable {
    public stackTable: Stack<Array<Symbol>> = new Stack<Array<Symbol>>();

    constructor(){
        this.stackTable.push([]);
    }

    public addNewTable(){
        let newTable = new Array<Symbol>;
        if (!this.stackTable.isEmpty) {
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

    public addSymbol(symbol: Symbol){
        this.stackTable.peek().push(symbol);
    }

    public popTableAmbit(){
        if (!this.stackTable.isEmpty) {
            this.stackTable.pop();
        }
    }
}
