
import { DynamicDataType } from "../utils/DynamicDataType";
import { EncapsulationType } from "../utils/encapsulation-type";
import { SymbolType } from "./symbol-type";

export class Symbol {

	
    private _id: number;
    private _nameCode: string;
    private _name: string;
    private _symbolType: SymbolType;
    private _isFunction: boolean = false;
    private _type: DynamicDataType;
    private _numParams: number = 0;
    private _listParams: Array<DynamicDataType>;
    private _direction: number;
    private _ambit: (string | number);
    private _size: number;
    private _isArray: boolean = false;
    private _listDims: Array<number>;
    private _listDimsTemps: Array<string>; //para guardar los temporales de las dimensiones
    private _isReference: boolean = false;
    private _encapsulation: EncapsulationType = EncapsulationType.PUBLIC;
    private _fullName: string;
    private _isConst: boolean = false;
    private _value: any;
    private _parent: any;

    /**
     * @constructor 
     * @param id id del simbolo
     * @param nameCode nombre del simbolo para el codigo
     * @param name nombre del simbolo
     * @param symbolType tipo de simbolo si es(clase, atributo, funcion, metodo, this, main, variable, etc.)
     * @param isFunction si es una funcion o no
     * @param type tipo de dato, si es (integer, double, boolean, string, char)
     * @param numParams si es funcion o metodo; el numero de parametros que lleva
     * @param listParams listado de los tipos de dato de cada parametro
     * @param direction direccion que tiene segun sua ambtio o funcion, el puntero basicamente
     * @param ambit el ambito donde se encuentra el simbolo
     * @param size el tamanio; estp es mas para la clases, funciones o metodos, y arreglos
     * @param isArray si es un arreglo
     * @param listDims el listado de las dimensiones que tiene el arreglo
     * @param isReference la referencia hacia el simbolo
     * @param encapsulation si es public, private o protected
     * @param fullName el nombre completo, es decir desde la importancion o a la seccion que perteneces como el enpaquetado
     * @param isConst si es un simbolo de tipo var o atributo que sea una constante o no
     */

	constructor(id: number, nameCode: string, name: string, symbolType: SymbolType, isFunction: boolean , type: DynamicDataType, numParams: number , listParams: Array<DynamicDataType>, direction: number, size: number, isArray: boolean , listDims: Array<number>, isReference: boolean , encapsulation: EncapsulationType , fullName: string, isConst: boolean ) {
		this._id = id;
		this._nameCode = nameCode;
		this._name = name;
		this._symbolType = symbolType;
		this._isFunction = isFunction;
		this._type = type;
		this._numParams = numParams;
		this._listParams = listParams;
		this._direction = direction;
		this._size = size;
		this._isArray = isArray;
		this._listDims = listDims;
		this._isReference = isReference;
		this._encapsulation = encapsulation;
		this._fullName = fullName;
		this._isConst = isConst;
	}

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get nameCode(): string {
        return this._nameCode;
    }

    public set nameCode(value: string) {
        this._nameCode = value;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get symbolType(): SymbolType {
        return this._symbolType;
    }

    public set symbolType(value: SymbolType) {
        this._symbolType = value;
    }

    public get isFunction(): boolean {
        return this._isFunction;
    }

    public set isFunction(value: boolean) {
        this._isFunction = value;
    }
    
    public get type(): DynamicDataType {
        return this._type;
    }

    public set type(value: DynamicDataType) {
        this._type = value;
    }

    public get numParams(): number {
        return this._numParams;
    }

    public set numParams(value: number) {
        this._numParams = value;
    }

    public get listParams(): Array<DynamicDataType> {
        return this._listParams;
    }

    public set listParams(value: Array<DynamicDataType>) {
        this._listParams = value;
    }

    public get direction(): number {
        return this._direction;
    }

    public set direction(value: number) {
        this._direction = value;
    }

    public get ambit(): (string | number) {
        return this._ambit;
    }

    public set ambit(value: (string | number)) {
        this._ambit = value;
    }

    public get size(): number {
        return this._size;
    }

    public set size(value: number) {
        this._size = value;
    }

    public get isArray(): boolean {
        return this._isArray;
    }

    public set isArray(value: boolean) {
        this._isArray = value;
    }
    
    public get listDims(): Array<number> {
        return this._listDims;
    }

    public set listDims(value: Array<number>) {
        this._listDims = value;
    }

    public get isReference(): boolean {
        return this._isReference;
    }

    public set isReference(value: boolean) {
        this._isReference = value;
    }

    public get encapsulation(): EncapsulationType {
        return this._encapsulation;
    }

    public set encapsulation(value: EncapsulationType) {
        this._encapsulation = value;
    }

    public get fullName(): string {
        return this._fullName;
    }

    public set fullName(value: string) {
        this._fullName = value;
    }

    public get isConst(): boolean {
        return this._isConst;
    }

    public set isConst(value: boolean) {
        this._isConst = value;
    }
    
}
