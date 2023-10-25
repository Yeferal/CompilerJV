%{
    var resultado;
    var listErrors = new Array();

    const { PositionToken } = require('src/app/core/models/ast/error/position-token.ts');
    const { ErrorGramm } = require("src/app/core/models/ast/error/error-gramm.ts");
    const { ErrorType } = require("src/app/core/models/ast/error/ErrorType.ts");

    //TREE
    const { TreeAST } = require("src/app/core/models/ast/main/tree/TreeAST.ts");
    const { Node } = require("src/app/core/models/ast/main/node.ts");
    
    //EXPRESSIONS
    const { ArithmeticOperation } = require("src/app/core/models/ast/main/expressions/arithmetic-operation.ts");
    const { Identifier } = require("src/app/core/models/ast/main/expressions/identifier.ts");
    const { LogicalOperation } = require("src/app/core/models/ast/main/expressions/logical-operation.ts");
    const { Primitive } = require("src/app/core/models/ast/main/expressions/primitive.ts");
    const { RationalOperation } = require("src/app/core/models/ast/main/expressions/rational-operation.ts");

    //INSTRUCTIONS
    const { AsigAtribObject } = require("src/app/core/models/ast/main/instructions/asig-atrib-object.ts");
    const { AsignationArray } = require("src/app/core/models/ast/main/instructions/asignation-array.ts");
    const { AsignationVar } = require("src/app/core/models/ast/main/instructions/asignation-var.ts");
    const { CallArray } = require("src/app/core/models/ast/main/instructions/call-array.ts");
    const { CallFunction } = require("src/app/core/models/ast/main/instructions/call-function.ts");
    const { CallFunctionObject } = require("src/app/core/models/ast/main/instructions/call-function-object.ts");
    const { CallMath } = require("src/app/core/models/ast/main/instructions/call-math.ts");
    const { CallValueObject } = require("src/app/core/models/ast/main/instructions/call-value-object.ts");
    const { ClassInst } = require("src/app/core/models/ast/main/instructions/class-inst.ts");
    const { ConstructorInst } = require("src/app/core/models/ast/main/instructions/constructor-inst.ts");
    const { DataArray } = require("src/app/core/models/ast/main/instructions/data-array.ts");
    const { DeclarationArray } = require("src/app/core/models/ast/main/instructions/declaration-array.ts");
    const { DeclarationAtribute } = require("src/app/core/models/ast/main/instructions/declaration-atribute.ts");
    const { DeclarationParam } = require("src/app/core/models/ast/main/instructions/declaration-param.ts");
    const { DeclarationVar } = require("src/app/core/models/ast/main/instructions/declaration-var.ts");
    const { DeclarationVarible } = require("src/app/core/models/ast/main/instructions/declaration-variable.ts");
    const { FunctionProcedure } = require("src/app/core/models/ast/main/instructions/function-procedure.ts");
    const { InputNode } = require("src/app/core/models/ast/main/instructions/input-node.ts");
    const { InstanceArray } = require("src/app/core/models/ast/main/instructions/instance-array.ts");
    const { InstanceObject } = require("src/app/core/models/ast/main/instructions/instance-object.ts");
    const { ListDeclaration } = require("src/app/core/models/ast/main/instructions/list-declaration.ts");
    const { MainNode } = require("src/app/core/models/ast/main/instructions/main-node.ts");
    const { PrintNode } = require("src/app/core/models/ast/main/instructions/print-node.ts");
    const { SuperInst } = require("src/app/core/models/ast/main/instructions/super-inst.ts");
    const { TostringNode } = require("src/app/core/models/ast/main/instructions/tostring-node.ts");

    //SENTENCES
    const { BreakNode } = require("src/app/core/models/ast/main/sentences/break-node.ts");
    const { ConditionalDoWhile } = require("src/app/core/models/ast/main/sentences/conditional-do-while.ts");
    const { ConditionalElse } = require("src/app/core/models/ast/main/sentences/conditional-else.ts");
    const { ConditionalElseIf } = require("src/app/core/models/ast/main/sentences/conditional-else-if.ts");
    const { ConditionalFor } = require("src/app/core/models/ast/main/sentences/conditional-for.ts");
    const { ConditionalIf } = require("src/app/core/models/ast/main/sentences/conditional-if.ts");
    const { ConditionalSwitch } = require("src/app/core/models/ast/main/sentences/conditional-switch.ts");
    const { ConditionalSwitchCase } = require("src/app/core/models/ast/main/sentences/conditional-switch-case.ts");
    const { ConditionalWhile } = require("src/app/core/models/ast/main/sentences/conditional-while.ts");
    const { ContinueNode } = require("src/app/core/models/ast/main/sentences/continue-node.ts");
    const { DefaultNode } = require("src/app/core/models/ast/main/sentences/default-node.ts");
    const { ReturnNode } = require("src/app/core/models/ast/main/sentences/return-node.ts");

    //UTILS
    const { ArithType } = require("src/app/core/models/ast/main/utils/arith-type.ts");
    const { DataType } = require("src/app/core/models/ast/main/utils/DataType.ts");
    const { DeclarationType } = require("src/app/core/models/ast/main/utils/declaration-type.ts");
    const { DynamicDataType } = require("src/app/core/models/ast/main/utils/DynamicDataType.ts");
    const { EncapsulationType } = require("src/app/core/models/ast/main/utils/encapsulation-type.ts");
    const { LogicalType } = require("src/app/core/models/ast/main/utils/logical-type.ts");
    const { MathType } = require("src/app/core/models/ast/main/utils/math-type.ts");
    const { RationalType } = require("src/app/core/models/ast/main/utils/rational-type.ts");
    

    function getListErrors(){
        return listErrors;
    }

    function paint(texto){
        console.log(texto);
    }

    function resetData(){
        // listErrors = [];
        // pilaAmbito = [];
    }

    function addError(row, column, token, description, errorType){
        console.log("Entro en los errores");
        const newError = new ErrorGramm(new PositionToken(row, column), token, description, errorType);
        listErrors.push(newError);
        console.log(newError.toString());
    }
%}

%lex

%options yylineno
%locations
%yyerrok

%s INITIAL



id              [a-zA-Z]([a-zA-Z_]|[0-9])*
Letra			[a-zA-Z][a-zA-Z0-9]*
Digito          [0-9]
Numero          {Digito} {Digito}*
Decimal         {Numero} [.] {Numero}

/* lexical grammar */
%%

/* COMENTARIOS */
// comentario simple línea
<INITIAL>[/][/][/]*[^\n]*[\n]?				                { /* paint(yytext);*/ return "simple_comment"}
// <INITIAL>[/][/].*				                            { return "simple_comment"}
// <INITIAL>"//".*				                                { return "simple_comment"}
// comentario multiple líneas
<INITIAL>[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]                { /* paint(yytext); */ return "block_comment"}

<INITIAL>"++"                                               { return "plus_plus"; }
<INITIAL>"--"                                               { return "minus_minus"; }

/* OPERADORES ARITMETICOS */
<INITIAL>"+"                                                { return "plus"; }
<INITIAL>"-"                                                { return "minus"; }
<INITIAL>"*"                                                { return "mult"; }
<INITIAL>"/"                                                { return "div"; }
<INITIAL>"%"                                                { return "mod"; }

/*OPERADORES RACIONALES*/
<INITIAL>"<"                                                { return 'less_than';}
<INITIAL>">"                                                { return 'greater_than';}
<INITIAL>"=="                                               { return 'equals_equals';}
<INITIAL>"<="                                               { return 'less_equals';}
<INITIAL>">="                                               { return 'greater_equals';}
<INITIAL>"!="                                               { return 'inequality';}


/*OPERADORES LOGICOS*/
<INITIAL>"&&"                                               { return 'and';}
<INITIAL>"||"                                               { return 'or';}
<INITIAL>"!"                                                { return 'not';}

/* SIGNOS Y SIMBOLOS */
<INITIAL>"."                                                { return 'period';}
<INITIAL>":"                                                { return 'colon';}
<INITIAL>","                                                { return 'comma';}
<INITIAL>";"                                                { return 'semicolon';}
<INITIAL>"("                                                { return 'parentheses_l';}
<INITIAL>")"                                                { return 'parentheses_r';}
<INITIAL>"["                                                { return 'brackets_l';}
<INITIAL>"]"                                                { return 'brackets_r';}
<INITIAL>"{"                                                { return 'keys_l';}
<INITIAL>"}"                                                { return 'keys_r';}
<INITIAL>"="                                                { return 'equal_mark';}

/* MAIN */
<INITIAL>"main"                                             { return "main"; }

/* TIPOS DE DATOS */
<INITIAL>"float"                                            { return "float"; }
<INITIAL>"int"                                              { return "int"; }
<INITIAL>"char"                                             { return "char"; }
<INITIAL>"boolean"                                          { return "boolean"; }
<INITIAL>("S"|"s")"tring"                                   { return "string"; }

/* INPUTS */
<INITIAL>"readfloat"                                            { return "readfloat"; }
<INITIAL>"readint"                                              { return "readint"; }
<INITIAL>"readchar"                                             { return "readchar"; }
<INITIAL>"readboolean"                                          { return "readboolean"; }
<INITIAL>("readS"|"reads")"tring"                                   { return "readstring"; }

/* OPERACIONES MATH*/
<INITIAL>"Math.abs"                                         { return 'math_abs';}
<INITIAL>"Math.ceil"                                        { return 'math_ceil';}
<INITIAL>"Math.floor"                                       { return 'math_floor';}
<INITIAL>"Math.round"                                       { return 'math_round';}
<INITIAL>"Math.max"                                         { return 'math_max';}
<INITIAL>"Math.min"                                         { return 'math_min';}
<INITIAL>"Math.pow"                                         { return 'math_pow';}
<INITIAL>"Math.sqrt"                                        { return 'math_sqrt';}
<INITIAL>"Math.random"                                      { return 'math_random';}
<INITIAL>"Math.toRadians"                                   { return 'math_toradians';}
<INITIAL>"Math.acos"                                        { return 'math_acos';}
<INITIAL>"Math.sin"                                         { return 'math_sin';}
<INITIAL>"Math.atan"                                        { return 'math_atan';}
<INITIAL>"Math.exp"                                         { return 'math_exp';}

/* RESERVADAS */
<INITIAL>"public"                                           { return 'public';}
<INITIAL>"private"                                          { return 'private';}
<INITIAL>"class"                                            { return 'class';}
<INITIAL>"final"                                            { return 'final';}
<INITIAL>"static"                                           { return 'static';}
<INITIAL>"extends"                                          { return 'extends';}
<INITIAL>"void"                                             { return 'void';}
<INITIAL>"this."                                            { return 'this';}
<INITIAL>"new"                                              { return 'new';}
<INITIAL>"true"                                             { return 'true';}
<INITIAL>"false"                                            { return 'false';}
<INITIAL>"System.out.println"                               { return 'println';}
<INITIAL>"System.out.print"                                 { return 'printf';}



/* SENTENCIAS */
<INITIAL>"while"                                            { return 'while';}
<INITIAL>"do"                                               { return 'do';}
<INITIAL>"else"\s+"if"                                      { return 'elseif';}
<INITIAL>"if"                                               { return 'if';}
<INITIAL>"else"                                             { return 'else';}
<INITIAL>"for"                                              { return 'for';}
<INITIAL>"switch"                                           { return 'switch';}
<INITIAL>"case"                                             { return 'case';}
<INITIAL>"break"                                            { return 'break';}
<INITIAL>"default"                                          { return 'default';}
<INITIAL>"continue"                                         { return 'continue';}
<INITIAL>"return"                                           { return 'return';}
<INITIAL>".equals"                                          { return 'equals';}
<INITIAL>"toString"                                         { return 'tostring';}
<INITIAL>"var"                                              { return 'var';}
<INITIAL>"null"                                             { return 'null';}
<INITIAL>"@Getter"                                          { return 'getter';}
<INITIAL>"@Setter"                                          { return 'setter';}
<INITIAL>"@Override"                                        { return 'override';}

/* EXPRESIONES REGULARES */
<INITIAL>\"[^\"]*\"			                                {/* paint(yytext); */ yytext = yytext.substr(0,yyleng-0); return 'string_primitive'; }
<INITIAL>\'[^\']?\'			                                {/* paint(yytext); */yytext = yytext.substr(0,yyleng-0); return 'char_primitive'; }
<INITIAL>{Numero}  	                                        {/* paint('entero: '+yytext); */ return 'integer_primitive';}
<INITIAL>{Decimal}                                          {/*paint('decimal: '+yytext); */ return 'decimal_primitive';}
<INITIAL>{id}                                               { return 'id';}

/**/
<INITIAL>\s+                                                /* skip whitespace */
<<EOF>>                                                     { console.log(yytext); return 'EOF';}
.                                                           { addError(yylloc.first_line, yylloc.first_column, yytext, "Token Invalido", ErrorType.LEXICAL); return 'INVALID';}


/lex

/* Asociación de operadores y precedencia */
//presedencia de menor a mayor
//Precediencia operadores logicos
%left 'or'
%left 'and'
%right 'not'

//Presedencia operadores matematicos
%left 'equals' 'equals_equals' 'inequality' 'less_than' 'less_equals' 'greater_than' 'greater_equals'
%left 'plus' 'minus'
%left 'mod' 'div' 'mult'
%left UMINUS

%start ini

%% /* lexical grammar */


ini
    :CODE EOF { /*console.log($1);*/ /*resultado = $1;*/ /*return $1;*/ return new TreeAST($1, getListErrors());}
    // |error EOF
;


CODE
    :CODE STRUCT_MAIN { $$ = $1; $$.push($2); }
    |CODE STRUCT_CLASS { $$ = $1; $$.push($2); }
    |CODE STATE_COMMENT { $$ = $1; }
    | { $$ = []; }
;

DATATYPE_PRIMITIVE
    :float { $$ = new DynamicDataType(1,"FLOAT", 1); }
    |int { $$ = new DynamicDataType(2,"INTEGER", 1); }
    |char { $$ = new DynamicDataType(3,"CHAR", 1); }
    |string { $$ = new DynamicDataType(4,"STRING", 1); }
    |boolean { $$ = new DynamicDataType(5,"BOOLEAN", 1); }
;

STATE_FINAL
    :final { $$ = true; }
    | { $$ = false; }
;

STATE_STATIC
    :static { $$ = true; }
    | { $$ = false; }
;

STATE_PUBLIC
    :public { $$ = true; }
    | { $$ = false; }
;

STATE_PRIVATE
    :private { $$ = true; }
    | { $$ = false; }
;

STATE_ENCAP
    :private { $$ = "private"; }
    |public { $$ = "public"; }
    | { $$ = null; }
;

STATE_COMMENT
    :block_comment
    |simple_comment
;

/*
======================================================================================================================================
|OPERADORES
======================================================================================================================================
*/

DATA_VALUE
    :decimal_primitive { $$ = new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"FLOAT", 1), $1, parseFloat($1));}
    |integer_primitive { $$ = new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"INTEGER", 1), $1, parseInt($1));}
    |char_primitive { $$ = new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"CHAR", 1), $1, $1);}
    |true { $$ = new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"BOOLEAN", 1), $1, true);}
    |false { $$ = new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"BOOLEAN", 1), $1, false);}
    |string_primitive { $$ = new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"FLOAT", 1), $1, $1);}
    |id { $$ = new Identifier(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, false);}
    |this id { $$ = new Identifier(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, false);}
    |null { $$ = new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"NULL", 0), $1, null);}
    |STRUCT_CALL_FUNCTION { $$ = $1;}
    |STRUCT_CALL_ARRAY { $$ = $1;}
    |STRUCT_CALL_OBJECT_VALUE { $$ = $1;}
    |STRUCT_CALL_FUNC_MATH { $$ = $1;}
;


ARITHMETIC_OPERATION
    :ARITHMETIC_OPERATION plus ARITHMETIC_OPERATION { $$ = new ArithmeticOperation(new PositionToken(this._$.first_line, this._$.first_column), $2, ArithType.ADD, $1, $3);}
    |ARITHMETIC_OPERATION minus ARITHMETIC_OPERATION { $$ = new ArithmeticOperation(new PositionToken(this._$.first_line, this._$.first_column), $2, ArithType.SUBTRAC, $1, $3);}
    |ARITHMETIC_OPERATION div ARITHMETIC_OPERATION { $$ = new ArithmeticOperation(new PositionToken(this._$.first_line, this._$.first_column), $2, ArithType.DIV, $1, $3);}
    |ARITHMETIC_OPERATION mult ARITHMETIC_OPERATION { $$ = new ArithmeticOperation(new PositionToken(this._$.first_line, this._$.first_column), $2, ArithType.MULTI, $1, $3);}
    |ARITHMETIC_OPERATION mod ARITHMETIC_OPERATION { $$ = new ArithmeticOperation(new PositionToken(this._$.first_line, this._$.first_column), $2, ArithType.MOD, $1, $3);}
    |minus ARITHMETIC_OPERATION %prec UMINUS {
        $$ = new ArithmeticOperation(
            new PositionToken(this._$.first_line, this._$.first_column),
            $2,
            ArithType.MULTI,
            new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"INTEGER", 1), "-1", (-1)),
            $2
            );
        }
    |parentheses_l ARITHMETIC_OPERATION parentheses_r { $$ = $2; }
    |DATA_VALUE { $$ = $1; }
;

RATIONAL_OPERATION
    :STATE_RATIONAL_OP equals_equals STATE_RATIONAL_OP { $$ = new RationalOperation(new PositionToken(this._$.first_line, this._$.first_column), $2, RationalType.EQUAL, $1, $3);}
    |STATE_RATIONAL_OP equals STATE_RATIONAL_OP { $$ = new RationalOperation(new PositionToken(this._$.first_line, this._$.first_column), $2, RationalType.EQUAL_OBJ, $1, $3);}
    |STATE_RATIONAL_OP inequality STATE_RATIONAL_OP { $$ = new RationalOperation(new PositionToken(this._$.first_line, this._$.first_column), $2, RationalType.NOT_EQUAL, $1, $3);}
    |STATE_RATIONAL_OP less_than STATE_RATIONAL_OP { $$ = new RationalOperation(new PositionToken(this._$.first_line, this._$.first_column), $2, RationalType.LESS_THAN, $1, $3);}
    |STATE_RATIONAL_OP less_equals STATE_RATIONAL_OP { $$ = new RationalOperation(new PositionToken(this._$.first_line, this._$.first_column), $2, RationalType.LESS_THAN_EQUAL, $1, $3);}
    |STATE_RATIONAL_OP greater_than STATE_RATIONAL_OP { $$ = new RationalOperation(new PositionToken(this._$.first_line, this._$.first_column), $2, RationalType.GRATE_THAN, $1, $3);}
    |STATE_RATIONAL_OP greater_equals STATE_RATIONAL_OP { $$ = new RationalOperation(new PositionToken(this._$.first_line, this._$.first_column), $2, RationalType.GRATE_THAN_EQUAL, $1, $3);}
;

STATE_RATIONAL_OP
    :RATIONAL_OPERATION { $$ = $1; }
    |parentheses_l RATIONAL_OPERATION parentheses_r { $$ = $2; }
    |ARITHMETIC_OPERATION { $$ = $1; }
;

LOGICAL_OPERATION
    :STATE_LOGICAL_OP and STATE_LOGICAL_OP { $$ = new LogicalOperation(new PositionToken(this._$.first_line, this._$.first_column), $2, LogicalType.AND, $1, $3);}
    |STATE_LOGICAL_OP or STATE_LOGICAL_OP { $$ = new LogicalOperation(new PositionToken(this._$.first_line, this._$.first_column), $2, LogicalType.OR, $1, $3);}
    |not STATE_LOGICAL_OP { $$ = new LogicalOperation(new PositionToken(this._$.first_line, this._$.first_column), $2, LogicalType.NOT, $2, null);}
;

STATE_LOGICAL_OP
    :LOGICAL_OPERATION { $$ = $1; }
    |parentheses_l LOGICAL_OPERATION parentheses_r { $$ = $2; }
    |STATE_RATIONAL_OP { $$ = $1; }
    |error {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion u Operacion", ErrorType.SYNTACTIC);
    }
;

STATE_VALUE
    :STATE_LOGICAL_OP { $$ = $1; }
;

/*
======================================================================================================================================
|BLOQUE DE CODIGO MAIN
======================================================================================================================================
*/
STRUCT_MAIN
    :void main parentheses_l parentheses_r keys_l BLOCK_CONTENT_MAIN keys_r
    { $$ = new MainNode(new PositionToken(this._$.first_line, this._$.first_column), $2, $6); }

    |error main parentheses_l parentheses_r keys_l BLOCK_CONTENT_MAIN keys_r {
        addError(this._$.first_line, this._$.first_column, $1, "Error en el metodo main", ErrorType.SYNTACTIC);
    }
    |void main error keys_l BLOCK_CONTENT_MAIN keys_r {
        addError(this._$.first_line, this._$.first_column, $2, "Error en el metodo main", ErrorType.SYNTACTIC);
    }
;

BLOCK_CONTENT_MAIN
    :BLOCK_CONTENT_MAIN STATE_DECLARATION_VAR { $$ = $1; $$.push($2); }
    |BLOCK_CONTENT_MAIN STATE_DECLARATION_VAR_ARRAY { $$ = $1; $$.push($2); }
    |BLOCK_CONTENT_MAIN STATE_DECLARATION_OBJECT_VAR { $$ = $1; $$.push($2); }
    |BLOCK_CONTENT_MAIN STATE_DECLARATION_OBJECT_VAR_ARRAY { $$ = $1; $$.push($2); }
    |BLOCK_CONTENT_MAIN STRUCT_ASIGNATION_VAR { $$ = $1; $$.push($2); }
    |BLOCK_CONTENT_MAIN STRUCT_ASIGNATION_VAR_ARRAY { $$ = $1; $$.push($2); }
    |BLOCK_CONTENT_MAIN STATE_COMMENT { $$ = $1; }
    |BLOCK_CONTENT_MAIN STRUCT_VAR { $$ = $1; $$.push($2); }
    |BLOCK_CONTENT_MAIN STATE_CALL_FUNCTION { $$ = $1; $$.push($2); }
    |BLOCK_CONTENT_MAIN STATE_COND_IF_ELSEIF_ELSE { $$ = $1; $$.push($2); }
    |BLOCK_CONTENT_MAIN STATE_SWITCH { $$ = $1; $$.push($2); }
    |BLOCK_CONTENT_MAIN STATE_FOR { $$ = $1; $$.push($2); }
    |BLOCK_CONTENT_MAIN STATE_WHILE { $$ = $1; $$.push($2); }
    |BLOCK_CONTENT_MAIN STATE_DO_WHILE { $$ = $1; $$.push($2); }
    |BLOCK_CONTENT_MAIN STATE_MATH { $$ = $1; $$.push($2); }
    |BLOCK_CONTENT_MAIN STATE_BREAK { $$ = $1; $$.push($2); }
    |BLOCK_CONTENT_MAIN STATE_CONTINUE { $$ = $1; $$.push($2); }
    |BLOCK_CONTENT_MAIN STATE_PRINTS { $$ = $1; $$.push($2); }
    |BLOCK_CONTENT_MAIN STRUCT_INPUT { $$ = $1; $$.push($2); }
    |BLOCK_CONTENT_MAIN STATE_RETURN { $$ = $1; $$.push($2); }
    |BLOCK_CONTENT_MAIN STATE_TOSTRING { $$ = $1; $$.push($2); }
    | { $$ = []; }
;

/*
======================================================================================================================================
|BLOQUE DE CODIGO DE CLASES
======================================================================================================================================
*/
STRUCT_CLASS
    :public class id STRUCT_EXTENDS keys_l CODE_CLASS keys_r 
    { $$ = new ClassInst(new PositionToken(this._$.first_line, this._$.first_column), $1, false, false, $3, $4, true, false, $6); }
    |public final class id STRUCT_EXTENDS keys_l CODE_CLASS keys_r 
    { $$ = new ClassInst(new PositionToken(this._$.first_line, this._$.first_column), $1, false, false, $4, $5, true, true, $7); }
    
    |class id STRUCT_EXTENDS keys_l CODE_CLASS keys_r 
    { $$ = new ClassInst(new PositionToken(this._$.first_line, this._$.first_column), $1, false, false, $2, $3, true, false, $5); }
    |final class id STRUCT_EXTENDS keys_l CODE_CLASS keys_r 
    { $$ = new ClassInst(new PositionToken(this._$.first_line, this._$.first_column), $1, false, false, $3, $3, true, true, $6); }
    
    |getter setter public class id STRUCT_EXTENDS keys_l CODE_CLASS keys_r 
    { $$ = new ClassInst(new PositionToken(this._$.first_line, this._$.first_column), $1, true, true, $5, $6, true, false, $8); }
    |getter setter public final class id STRUCT_EXTENDS keys_l CODE_CLASS keys_r 
    { $$ = new ClassInst(new PositionToken(this._$.first_line, this._$.first_column), $1, true, true, $6, $7, true, true, $9); }
    |setter getter class id STRUCT_EXTENDS keys_l CODE_CLASS keys_r 
    { $$ = new ClassInst(new PositionToken(this._$.first_line, this._$.first_column), $1, true, true, $4, $5, true, false, $7); }
    |setter getter final class id STRUCT_EXTENDS keys_l CODE_CLASS keys_r 
    { $$ = new ClassInst(new PositionToken(this._$.first_line, this._$.first_column), $1, true, true, $5, $6, true, true, $8); }
    
    |getter public class id STRUCT_EXTENDS keys_l CODE_CLASS keys_r 
    { $$ = new ClassInst(new PositionToken(this._$.first_line, this._$.first_column), $1, true, false, $4, $5, true, false, $7); }
    |getter public final class id STRUCT_EXTENDS keys_l CODE_CLASS keys_r 
    { $$ = new ClassInst(new PositionToken(this._$.first_line, this._$.first_column), $1, true, false, $5, $6, true, true, $8); }
    |setter class id STRUCT_EXTENDS keys_l CODE_CLASS keys_r 
    { $$ = new ClassInst(new PositionToken(this._$.first_line, this._$.first_column), $1, false, true, $3, $4, true, false, $6); }
    |setter final class id STRUCT_EXTENDS keys_l CODE_CLASS keys_r 
    { $$ = new ClassInst(new PositionToken(this._$.first_line, this._$.first_column), $1, false, true, $4, $5, true, true, $7); }

    |error class id STRUCT_EXTENDS keys_l CODE_CLASS keys_r {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la estructura de la clase", ErrorType.SYNTACTIC);
    }
;

STRUCT_EXTENDS
    :extends id { $$ = $2; }
    | { $$ = null; }

    |extends error {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la estructura de la herencia", ErrorType.SYNTACTIC);
    }
;

CODE_CLASS
    :CODE_CLASS STATE_DECLARATION_ATRIB { $$ = $1; $$.push($2); }
    |CODE_CLASS STATE_DECLARATION_ATRIB_ARRAY { $$ = $1; $$.push($2); }
    |CODE_CLASS STATE_DECLARATION_OBJECT_ATRIB { $$ = $1; $$.push($2); }
    |CODE_CLASS STATE_DECLARATION_OBJECT_ATRIB_ARRAY { $$ = $1; $$.push($2); }
    |CODE_CLASS STRUCT_ASIGNATION_VAR { $$ = $1; $$.push($2); }
    |CODE_CLASS STRUCT_ASIGNATION_VAR_ARRAY { $$ = $1; $$.push($2); }
    |CODE_CLASS STATE_COMMENT { $$ = $1; }
    |CODE_CLASS STRUCT_MAIN { $$ = $1; $$.push($2); }
    |CODE_CLASS STATE_FUNCTION { $$ = $1; $$.push($2); }
    |CODE_CLASS STATE_METOD { $$ = $1; $$.push($2); }
    |CODE_CLASS STATE_CONSTRUCTOR { $$ = $1; $$.push($2); }
    | { $$ = []; }
;

/*
======================================================================================================================================
|DECLARACION DE ATRIBUTOS Y ASIGNACION
======================================================================================================================================
*/
STATE_DECLARATION_ATRIB
    :STRUCT_DECLARATION_ATRIB semicolon
    {
        $$ = $1;
        $$.isGetter = false;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |getter STRUCT_DECLARATION_ATRIB semicolon
    {
        $$ = $2;
        $$.isGetter = true;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |setter STRUCT_DECLARATION_ATRIB semicolon
    {
        $$ = $2;
        $$.isGetter = false;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |getter setter STRUCT_DECLARATION_ATRIB semicolon
    {
        $$ = $3;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |setter getter STRUCT_DECLARATION_ATRIB semicolon
    {
        $$ = $3;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }

    |private STRUCT_DECLARATION_ATRIB semicolon
    {
        $$ = $2;
        $$.isGetter = false;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }
    |getter private STRUCT_DECLARATION_ATRIB semicolon
    {
        $$ = $3;
        $$.isGetter = true;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }
    |setter private STRUCT_DECLARATION_ATRIB semicolon
    {
        $$ = $3;
        $$.isGetter = false;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }
    |getter setter private STRUCT_DECLARATION_ATRIB semicolon
    {
        $$ = $4;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }
    |setter getter private STRUCT_DECLARATION_ATRIB semicolon
    {
        $$ = $4;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }

    |public STRUCT_DECLARATION_ATRIB semicolon
    {
        $$ = $2;
        $$.isGetter = false;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |getter public STRUCT_DECLARATION_ATRIB semicolon
    {
        $$ = $3;
        $$.isGetter = true;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |setter public STRUCT_DECLARATION_ATRIB semicolon
    {
        $$ = $3;
        $$.isGetter = false;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |getter setter public STRUCT_DECLARATION_ATRIB semicolon
    {
        $$ = $4;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |setter getter public STRUCT_DECLARATION_ATRIB semicolon
    {
        $$ = $4;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }

    |error public STRUCT_DECLARATION_ATRIB semicolon {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }

;

STRUCT_DECLARATION_ATRIB
    :STRUCT_DECLARATION_ATRIB comma id STATE_ASIGNATION_ATRIB
    {
        $$ = $1;
        $$.listDeclaration.push(new DeclarationAtribute(new PositionToken(this._$.first_line, this._$.first_column), null, $3, $3, $4));
    }
    |final static DATATYPE_PRIMITIVE id STATE_ASIGNATION_ATRIB
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        $3, $2, DeclarationType.ATRIBUT, false, false, null, true, true,
        [new DeclarationAtribute(new PositionToken(this._$.first_line, this._$.first_column), null, $4, $4, $5)]);
    }
    |static final DATATYPE_PRIMITIVE id STATE_ASIGNATION_ATRIB
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        $3, $2, DeclarationType.ATRIBUT, false, false, null, true, true,
        [new DeclarationAtribute(new PositionToken(this._$.first_line, this._$.first_column), null, $4, $4, $5)]);
    }
    |final DATATYPE_PRIMITIVE id STATE_ASIGNATION_ATRIB { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        $2, $2, DeclarationType.ATRIBUT, false, false, null, true, false,
        [new DeclarationAtribute(new PositionToken(this._$.first_line, this._$.first_column), null, $3, $3, $4)]);
    }
    |static DATATYPE_PRIMITIVE id STATE_ASIGNATION_ATRIB
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        $2, $2, DeclarationType.ATRIBUT, false, false, null, false, true,
        [new DeclarationAtribute(new PositionToken(this._$.first_line, this._$.first_column), null, $3, $3, $4)]);
    }
    |DATATYPE_PRIMITIVE id STATE_ASIGNATION_ATRIB
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        $1, $2, DeclarationType.ATRIBUT, false, false, null, false, false,
        [new DeclarationAtribute(new PositionToken(this._$.first_line, this._$.first_column), null, $2, $2, $3)]);
    }

    |error DATATYPE_PRIMITIVE id STATE_ASIGNATION_ATRIB {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |error STATE_ASIGNATION_ATRIB {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STATE_ASIGNATION_ATRIB
    :equal_mark ASIGNATION_ATRIB  { $$ = $2; }
    |  { $$ = null; }

    |error ASIGNATION_ATRIB {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

ASIGNATION_ATRIB
    :STATE_VALUE { $$ = $1; }
;


//ARREGLOS
STATE_DECLARATION_ATRIB_ARRAY
    :STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    {
        $$ = $1;
        $$.isGetter = false;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |getter STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    {
        $$ = $2;
        $$.isGetter = true;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |setter STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    {
        $$ = $2;
        $$.isGetter = false;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |getter setter STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    {
        $$ = $3;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |setter getter STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    {
        $$ = $3;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }

    |private STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    {
        $$ = $2;
        $$.isGetter = false;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }
    |getter private STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    {
        $$ = $3;
        $$.isGetter = true;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }
    |setter private STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    {
        $$ = $3;
        $$.isGetter = false;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }
    |getter setter private STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    {
        $$ = $4;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }
    |setter getter private STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    {
        $$ = $4;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }

    |public STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    {
        $$ = $2;
        $$.isGetter = false;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |getter public STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    {
        $$ = $3;
        $$.isGetter = true;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |setter public STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    {
        $$ = $3;
        $$.isGetter = false;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |getter setter public STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    {
        $$ = $4;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |setter getter public STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    {
        $$ = $4;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }

    |error public STRUCT_DECLARATION_ATRIB_ARRAY semicolon {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STRUCT_DECLARATION_ATRIB_ARRAY
    :STRUCT_DECLARATION_ATRIB_ARRAY comma STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_VAR_ARRAY
    {
        $$ = $1;
        $$.listDeclaration.push(new DeclarationArray(new PositionToken(this._$.first_line, this._$.first_column), null, $4, $4, $5, $3, true));
    }
    |final static DATATYPE_PRIMITIVE STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_VAR_ARRAY
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        $3, $2, DeclarationType.ATRIBUT, false, false, null, true, true,
        [new DeclarationArray(new PositionToken(this._$.first_line, this._$.first_column), null, $5, $5, $6, $4, true)]);
    }
    |static final DATATYPE_PRIMITIVE STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_VAR_ARRAY
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        $3, $2, DeclarationType.ATRIBUT, false, false, null, true, true,
        [new DeclarationArray(new PositionToken(this._$.first_line, this._$.first_column), null, $5, $5, $6, $4, true)]);
    }
    |final DATATYPE_PRIMITIVE STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_VAR_ARRAY
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        $2, $2, DeclarationType.ATRIBUT, false, false, null, true, false,
        [new DeclarationArray(new PositionToken(this._$.first_line, this._$.first_column), null, $4, $4, $5, $3, true)]);
    }
    |static DATATYPE_PRIMITIVE STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_VAR_ARRAY
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        $2, $2, DeclarationType.ATRIBUT, false, false, null, false, true,
        [new DeclarationArray(new PositionToken(this._$.first_line, this._$.first_column), null, $4, $4, $5, $3, true)]);
    }
    |DATATYPE_PRIMITIVE STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_VAR_ARRAY
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        $1, $2, DeclarationType.ATRIBUT, false, false, null, false, false,
        [new DeclarationArray(new PositionToken(this._$.first_line, this._$.first_column), null, $3, $3, $4, $2, true)]);
    }

    |error STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_VAR_ARRAY {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |DATATYPE_PRIMITIVE error id STATE_ASIGNATION_VAR_ARRAY {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |DATATYPE_PRIMITIVE STRUCT_EMPTY_DIMS_VAR_ARRAY error STATE_ASIGNATION_VAR_ARRAY {
        addError(this._$.first_line, this._$.first_column, $3, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;


/*
======================================================================================================================================
|DECLARACION DE VARIABLES Y ASIGNACION
======================================================================================================================================
*/

STATE_DECLARATION_VAR
    :STRUCT_DECLARATION_VAR semicolon
    {
        $$ = $1;
        $$.isGetter = false;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
;

STRUCT_DECLARATION_VAR
    :STRUCT_DECLARATION_VAR comma id STATE_ASIGNATION_VAR
    {
        $$ = $1;
        $$.listDeclaration.push(new DeclarationVarible(new PositionToken(this._$.first_line, this._$.first_column), null, $3, $3, $4));
    }
    |final DATATYPE_PRIMITIVE id STATE_ASIGNATION_VAR
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        $1, $2, DeclarationType.VAR, false, false, null, true, false,
        [new DeclarationVarible(new PositionToken(this._$.first_line, this._$.first_column), null, $3, $3, $4)]);
    }
    |DATATYPE_PRIMITIVE id STATE_ASIGNATION_VAR
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        $1, $2, DeclarationType.VAR, false, false, null, false, false,
        [new DeclarationVarible(new PositionToken(this._$.first_line, this._$.first_column), null, $2, $2, $3)]);
    }

    |error id STATE_ASIGNATION_VAR {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |DATATYPE_PRIMITIVE error STATE_ASIGNATION_VAR {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STATE_ASIGNATION_VAR
    :equal_mark ASIGNATION_VAR { $$ = $2; }
    | { $$ = null; }

    |error ASIGNATION_VAR {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

ASIGNATION_VAR
    :STATE_VALUE { $$ = $1; }
;


STRUCT_ASIGNATION_VAR
    :id equal_mark ASIGNATION_VAR semicolon {$$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, $3, false, false); }
    |id plus_plus semicolon
    {
        var arithPlus = new ArithmeticOperation(new PositionToken(
            this._$.first_line, this._$.first_column), $2, ArithType.ADD,
            new Identifier(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, false),
            new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"INTEGER", 1),  $2, 1)
            );
        $$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, arithPlus, false, false);
    }
    |id minus_minus semicolon
    {
        var arithMinus = new ArithmeticOperation(new PositionToken(
            this._$.first_line, this._$.first_column), $2, ArithType.SUBTRAC,
            new Identifier(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, false),
            new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"INTEGER", 1),  $2, 1)
            );
        $$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, arithMinus, false, false);
    }
    //Cuando es un objeto
    |id period id equal_mark ASIGNATION_VAR semicolon
    {
        $$ = new AsigAtribObject(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, $3, $5, false, false);
    }
    |id equal_mark new id parentheses_l parentheses_r semicolon
    {
        $$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $1, $1,
            new InstanceObject(new PositionToken(this._$.first_line, this._$.first_column), $4, $4, []),
            false, false);
    }
    |id equal_mark new id parentheses_l STATE_PARAM_OBJECT parentheses_r semicolon
    {
        $$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $1, $1,
            new InstanceObject(new PositionToken(this._$.first_line, this._$.first_column), $4, $4, $6),
            false, false);
    }

    //CUANDO ES UN ARREGLO
    |id equal_mark VALUE_ARRAY_STATE semicolon {$$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, $3, false, true); }
    |id equal_mark new DATATYPE_PRIMITIVE STRUCT_VALUE_DIMS_VAR_ARRAY semicolon
    {
        $$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $1, $1,
            new InstanceArray(new PositionToken(this._$.first_line, this._$.first_column), $4, $1, $5),
            false, true);
    }
    |id equal_mark new id STRUCT_VALUE_DIMS_VAR_ARRAY semicolon
    {
        $$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $1, $1,
            new InstanceArray(new PositionToken(this._$.first_line, this._$.first_column),
            new DynamicDataType(1,$4, 1),
            $1, $5),
            false, true);
    }

    //PARA LOS TRIBUTOS
    |this id equal_mark ASIGNATION_VAR semicolon {$$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $2, $2, $3, true, false); }
    |this id plus_plus semicolon
    {
        var arithPlus = new ArithmeticOperation(new PositionToken(
            this._$.first_line, this._$.first_column), $2, ArithType.ADD,
            new Identifier(new PositionToken(this._$.first_line, this._$.first_column), $2, $2, false),
            new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"INTEGER", 1),  $2, 1)
            );
        $$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, arithPlus, true, false);
    }
    |this id minus_minus semicolon
    {
        var arithMinus = new ArithmeticOperation(new PositionToken(
            this._$.first_line, this._$.first_column), $2, ArithType.SUBTRAC,
            new Identifier(new PositionToken(this._$.first_line, this._$.first_column), $2, $2, false),
            new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"INTEGER", 1),  $2, 1)
            );
        $$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, arithMinus, true, false);
    }

    //Cuando es un objeto
    |this id period id equal_mark ASIGNATION_VAR semicolon {$$ = new AsigAtribObject(new PositionToken(this._$.first_line, this._$.first_column), $2, $2, $3, $5, true, false);}
    |this id equal_mark new id parentheses_l parentheses_r semicolon
    {
        $$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $2, $2,
            new InstanceObject(new PositionToken(this._$.first_line, this._$.first_column), $5, $5, []),
            true, false);
    }
    |this id equal_mark new id parentheses_l STATE_PARAM_OBJECT parentheses_r semicolon
    {
        $$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $2, $2,
            new InstanceObject(new PositionToken(this._$.first_line, this._$.first_column), $5, $5, $7),
            true, false);
    }

    //CUANDO ES UN ARREGLO
    |this id equal_mark VALUE_ARRAY_STATE semicolon {$$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $2, $2, $3, true, true); }
    |this id equal_mark new DATATYPE_PRIMITIVE STRUCT_VALUE_DIMS_VAR_ARRAY semicolon
    {
        $$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $2, $2,
            new InstanceArray(new PositionToken(this._$.first_line, this._$.first_column), $4, $2, $5),
            true, true);
    }
    |this id equal_mark new id STRUCT_VALUE_DIMS_VAR_ARRAY semicolon
    {
        $$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $2, $2,
            new InstanceArray(new PositionToken(this._$.first_line, this._$.first_column),
            new DynamicDataType(1,$4, 1),
            $2, $5),
            false, true);
    }

    |error equal_mark new id parentheses_l STATE_PARAM_OBJECT parentheses_r semicolon {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |this id equal_mark error parentheses_l STATE_PARAM_OBJECT parentheses_r semicolon {
        addError(this._$.first_line, this._$.first_column, $4, "Error en la Expresion", ErrorType.SYNTACTIC);
    }

;

STRUCT_VAR
    :var id equal_mark ASIGNATION_VAR semicolon
    {$$ = new DeclarationVar(new PositionToken(this._$.first_line, this._$.first_column), $3, $3, $5, false);}
    |final var id equal_mark ASIGNATION_VAR semicolon
    {$$ = new DeclarationVar(new PositionToken(this._$.first_line, this._$.first_column), $3, $3, $5, true);}

    |var id equal_mark new id parentheses_l parentheses_r semicolon
    {
        $$ = new DeclarationVar(new PositionToken(this._$.first_line, this._$.first_column), $3, $3,
        new InstanceObject(new PositionToken(this._$.first_line, this._$.first_column), $6, $6, []),
        false);
    }
    |final var id equal_mark new id parentheses_l parentheses_r semicolon
    {
        $$ = new DeclarationVar(new PositionToken(this._$.first_line, this._$.first_column), $3, $3,
        new InstanceObject(new PositionToken(this._$.first_line, this._$.first_column), $6, $6, []),
        true);
    }
    |var id equal_mark new id parentheses_l STATE_PARAM_OBJECT parentheses_r semicolon
    {
        $$ = new DeclarationVar(new PositionToken(this._$.first_line, this._$.first_column), $3, $3,
        new InstanceObject(new PositionToken(this._$.first_line, this._$.first_column), $6, $6, $8),
        false);
    }
    |final var id equal_mark new id parentheses_l STATE_PARAM_OBJECT parentheses_r semicolon
    {
        $$ = new DeclarationVar(new PositionToken(this._$.first_line, this._$.first_column), $3, $3,
        new InstanceObject(new PositionToken(this._$.first_line, this._$.first_column), $6, $6, $8),
        true);
    }

    |var error new id parentheses_l STATE_PARAM_OBJECT parentheses_r semicolon {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |var id equal_mark error parentheses_l STATE_PARAM_OBJECT parentheses_r semicolon {
        addError(this._$.first_line, this._$.first_column, $4, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |var error semicolon {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

//ARREGLOS
STATE_DECLARATION_VAR_ARRAY
    :STRUCT_DECLARATION_VAR_ARRAY semicolon
    {
        $$ = $1;
        $$.isGetter = false;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
;

STRUCT_DECLARATION_VAR_ARRAY
    :STRUCT_DECLARATION_VAR_ARRAY comma STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_VAR_ARRAY
    {
        $$ = $1;
        $$.listDeclaration.push(new DeclarationArray(new PositionToken(this._$.first_line, this._$.first_column), null, $4, $4, $5, $3, true));
    }
    |final DATATYPE_PRIMITIVE STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_VAR_ARRAY
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        $1, $2, DeclarationType.ATRIBUT, false, false, null, true, false,
        [new DeclarationArray(new PositionToken(this._$.first_line, this._$.first_column), null, $4, $4, $5, $3, true)]);
    }
    |DATATYPE_PRIMITIVE STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_VAR_ARRAY
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        $1, $2, DeclarationType.ATRIBUT, false, false, null, false, false,
        [new DeclarationArray(new PositionToken(this._$.first_line, this._$.first_column), null, $3, $3, $4, $2, true)]);
    }

    |error STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_VAR_ARRAY {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |DATATYPE_PRIMITIVE error id STATE_ASIGNATION_VAR_ARRAY {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STRUCT_EMPTY_DIMS_VAR_ARRAY
    :STRUCT_EMPTY_DIMS_VAR_ARRAY brackets_l brackets_r { $$ = $1 + 1; }
    |brackets_l brackets_r { $$ = 1; }
;

STRUCT_VALUE_DIMS_VAR_ARRAY
    :STRUCT_VALUE_DIMS_VAR_ARRAY brackets_l STATE_VALUE brackets_r { $$ = $1; $$.push($3); }
    |brackets_l STATE_VALUE brackets_r { $$ = [$2]; }
;

STATE_ASIGNATION_VAR_ARRAY
    :equal_mark ASIGNATION_VAR_ARRAY { $$ = $2; }
    | { $$ = null; }
;

ASIGNATION_VAR_ARRAY
    :STATE_VALUE { $$ = $1; }
    |VALUE_ARRAY_STATE { $$ = $1; }
    |new DATATYPE_PRIMITIVE STRUCT_VALUE_DIMS_VAR_ARRAY
    { $$ = new InstanceArray(new PositionToken(this._$.first_line, this._$.first_column), $2, $1, $3); }

    |error STRUCT_VALUE_DIMS_VAR_ARRAY {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

VALUE_ARRAY_STATE
    :keys_l VALUE_ARRAY_MULTI_STATE keys_r { $$ = new DataArray(new PositionToken(this._$.first_line, this._$.first_column), $1, $2); }
    |keys_l VALUE_UNIT_ARRAY_STATE keys_r { $$ = new DataArray(new PositionToken(this._$.first_line, this._$.first_column), $1, $2); }
    |keys_l keys_r { $$ = new DataArray(new PositionToken(this._$.first_line, this._$.first_column), $1, []); }
;

VALUE_ARRAY_MULTI_STATE
    :VALUE_ARRAY_MULTI_STATE comma keys_l VALUE_ARRAY_MULTI_STATE keys_r { $$ = $1; $$.push(new DataArray(new PositionToken(this._$.first_line, this._$.first_column), $1, $4)); }
    |VALUE_ARRAY_MULTI_STATE comma keys_l VALUE_UNIT_ARRAY_STATE keys_r { $$ = $1; $$.push(new DataArray(new PositionToken(this._$.first_line, this._$.first_column), $1, $4)); }
    |keys_l VALUE_ARRAY_MULTI_STATE keys_r { $$ = [new DataArray(new PositionToken(this._$.first_line, this._$.first_column), $1, $2)];}
    |keys_l VALUE_UNIT_ARRAY_STATE keys_r { $$ = [new DataArray(new PositionToken(this._$.first_line, this._$.first_column), $1, $2)];}
;

VALUE_UNIT_ARRAY_STATE
    :VALUE_UNIT_ARRAY_STATE comma STATE_VALUE { $$ = $1; $$.push($3); }
    |VALUE_UNIT_ARRAY_STATE comma new DATATYPE_PRIMITIVE STRUCT_VALUE_DIMS_VAR_ARRAY
    {
        $$ = $1;
        $$.push(new InstanceArray(
            new PositionToken(this._$.first_line, this._$.first_column),
            $4,
            $1, $5));
    }
    |VALUE_UNIT_ARRAY_STATE comma new id STRUCT_VALUE_DIMS_VAR_ARRAY
    {
        $$ = $1;
        $$.push(new InstanceArray(
            new PositionToken(this._$.first_line, this._$.first_column),
            new DynamicDataType(1,$4, 1),
            $4, $5));
    }
    |STATE_VALUE { $$ = [$1]; }
    |new DATATYPE_PRIMITIVE STRUCT_VALUE_DIMS_VAR_ARRAY { $$ = [new InstanceArray(
            new PositionToken(this._$.first_line, this._$.first_column),
            $2,
            $1, $3)]; }
    |new id STRUCT_VALUE_DIMS_VAR_ARRAY { $$ = [new InstanceArray(
            new PositionToken(this._$.first_line, this._$.first_column),
            new DynamicDataType(1,$2, 1),
            $1, $3)]; }
;

STRUCT_ASIGNATION_VAR_ARRAY
    :id STRUCT_VALUE_DIMS_VAR_ARRAY equal_mark ASIGNATION_VAR semicolon
    { $$ = new AsignationArray(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, $2, $4, false); }
    |id STRUCT_VALUE_DIMS_VAR_ARRAY equal_mark new id parentheses_l parentheses_r semicolon
    { $$ = new AsignationArray(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, $2,
        new InstanceObject(new PositionToken(this._$.first_line, this._$.first_column), $5, $5, []),
        false);
    }
    |id STRUCT_VALUE_DIMS_VAR_ARRAY equal_mark new id parentheses_l STATE_PARAM_OBJECT parentheses_r semicolon
    { $$ = new AsignationArray(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, $2,
        new InstanceObject(new PositionToken(this._$.first_line, this._$.first_column), $5, $5, $7),
        false);
    }
    //CUANDO SON ATRIBUTOS
    |this id STRUCT_VALUE_DIMS_VAR_ARRAY equal_mark ASIGNATION_VAR semicolon
    { $$ = new AsignationArray(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, $2, $4, true); }
    |this id STRUCT_VALUE_DIMS_VAR_ARRAY equal_mark new id parentheses_l parentheses_r semicolon
    { $$ = new AsignationArray(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, $2,
        new InstanceObject(new PositionToken(this._$.first_line, this._$.first_column), $5, $5, []),
        true);
    }
    |this id STRUCT_VALUE_DIMS_VAR_ARRAY equal_mark new id parentheses_l STATE_PARAM_OBJECT parentheses_r semicolon
    { $$ = new AsignationArray(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, $2,
        new InstanceObject(new PositionToken(this._$.first_line, this._$.first_column), $5, $5, $7),
        true);
    }

    |this id error equal_mark new id parentheses_l STATE_PARAM_OBJECT parentheses_r semicolon {
        addError(this._$.first_line, this._$.first_column, $3, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |this id STRUCT_VALUE_DIMS_VAR_ARRAY error parentheses_l STATE_PARAM_OBJECT parentheses_r semicolon {
        addError(this._$.first_line, this._$.first_column, $4, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |error STRUCT_VALUE_DIMS_VAR_ARRAY equal_mark new id parentheses_l STATE_PARAM_OBJECT parentheses_r semicolon {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

/*
======================================================================================================================================
|OBJETOS
======================================================================================================================================
*/
STATE_DECLARATION_OBJECT_VAR
    :STRUCT_DECLARATION_OBJECT_VAR semicolon
    {
        $$ = $1;
        $$.isGetter = false;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
;

STATE_DECLARATION_OBJECT_ATRIB
    :STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    {
        $$ = $1;
        $$.isGetter = false;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |getter setter STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    {
        $$ = $3;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |setter getter STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    {
        $$ = $3;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |getter STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    {
        $$ = $2;
        $$.isGetter = true;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |setter STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    {
        $$ = $2;
        $$.isGetter = false;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }

    |private STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    {
        $$ = $2;
        $$.isGetter = false;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }
    |getter setter private STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    {
        $$ = $4;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }
    |setter getter private STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    {
        $$ = $4;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }
    |getter private STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    {
        $$ = $3;
        $$.isGetter = true;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }
    |setter private STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    {
        $$ = $3;
        $$.isGetter = false;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }

    |public STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    {
        $$ = $2;
        $$.isGetter = false;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |getter setter public STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    {
        $$ = $4;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |setter getter public STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    {
        $$ = $4;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |getter public STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    {
        $$ = $3;
        $$.isGetter = true;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |setter public STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    {
        $$ = $3;
        $$.isGetter = false;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }

    |error STRUCT_DECLARATION_OBJECT_ATRIB semicolon {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STRUCT_DECLARATION_OBJECT_ATRIB
    :STRUCT_DECLARATION_OBJECT_ATRIB comma id STATE_ASIGNATION_OBJECT
    {
        $$ = $1;
        $$.listDeclaration.push(new DeclarationAtribute(new PositionToken(this._$.first_line, this._$.first_column), null, $3, $3, $4));
    }
    |static final id id STATE_ASIGNATION_OBJECT
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        new DynamicDataType(1, $3, 1), $2, DeclarationType.ATRIBUT, false, false, null, true, true,
        [new DeclarationAtribute(new PositionToken(this._$.first_line, this._$.first_column), null, $4, $4, $5)]);
    }
    |final static id id STATE_ASIGNATION_OBJECT
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        new DynamicDataType(1, $3, 1), $2, DeclarationType.ATRIBUT, false, false, null, true, true,
        [new DeclarationAtribute(new PositionToken(this._$.first_line, this._$.first_column), null, $4, $4, $5)]);
    }
    |final id id STATE_ASIGNATION_OBJECT
    {
        $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        new DynamicDataType(1, $2, 1), $2, DeclarationType.ATRIBUT, false, false, null, true, false,
        [new DeclarationAtribute(new PositionToken(this._$.first_line, this._$.first_column), null, $3, $3, $4)]);
    }
    |static id id STATE_ASIGNATION_OBJECT
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        new DynamicDataType(1, $2, 1), $2, DeclarationType.ATRIBUT, false, false, null, false, true,
        [new DeclarationAtribute(new PositionToken(this._$.first_line, this._$.first_column), null, $3, $3, $4)]);
    }
    |id id STATE_ASIGNATION_OBJECT
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        new DynamicDataType(1, $1, 1),
        $2, DeclarationType.ATRIBUT, false, false, null, false, false,
        [new DeclarationAtribute(new PositionToken(this._$.first_line, this._$.first_column), null, $2, $2, $3)]);
    }

    |id error STATE_ASIGNATION_OBJECT {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STRUCT_DECLARATION_OBJECT_VAR
    :STRUCT_DECLARATION_OBJECT_VAR comma id STATE_ASIGNATION_OBJECT
    {
        $$ = $1;
        $$.listDeclaration.push(new DeclarationVarible(new PositionToken(this._$.first_line, this._$.first_column), null, $3, $3, $4));
    }
    |final id id STATE_ASIGNATION_OBJECT
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        new DynamicDataType(1, $2, 1), $2, DeclarationType.VAR, false, false, null, true, false,
        [new DeclarationVarible(new PositionToken(this._$.first_line, this._$.first_column), null, $3, $3, $4)]);
    }
    |id id STATE_ASIGNATION_OBJECT
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        new DynamicDataType(1, $1, 1), $2, DeclarationType.VAR, false, false, null, false, false,
        [new DeclarationVarible(new PositionToken(this._$.first_line, this._$.first_column), null, $2, $2, $3)]);
    }


    |id error STATE_ASIGNATION_OBJECT {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STATE_ASIGNATION_OBJECT
    :equal_mark VALUE_ASIGNATION_OBJECT { $$ = $2; }
    | { $$ = null; }

    |error VALUE_ASIGNATION_OBJECT {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

VALUE_ASIGNATION_OBJECT
    :STATE_VALUE { $$ = $1; }
    |new id parentheses_l STATE_PARAM_OBJECT parentheses_r {$$ = new InstanceObject(new PositionToken(this._$.first_line, this._$.first_column), $2, $2, $4);}
    |new id parentheses_l parentheses_r {$$ = new InstanceObject(new PositionToken(this._$.first_line, this._$.first_column), $2, $2, []);}

    |error parentheses_l STATE_PARAM_OBJECT parentheses_r {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STATE_PARAM_OBJECT
    :STATE_PARAM_OBJECT comma STATE_VALUE {$$ = $1; $$.push($3);}
    |STATE_VALUE {$$ = [$1]}

    |STATE_PARAM_OBJECT error STATE_VALUE {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;


//ARREGLOS DE TIPO OBJETO
STATE_DECLARATION_OBJECT_ATRIB_ARRAY
    :STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    {
        $$ = $1;
        $$.isGetter = false;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |getter STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    {
        $$ = $2;
        $$.isGetter = true;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |setter STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    {
        $$ = $2;
        $$.isGetter = false;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |getter setter STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    {
        $$ = $3;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |setter getter STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    {
        $$ = $3;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }

    |private STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    {
        $$ = $2;
        $$.isGetter = false;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }
    |getter private STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    {
        $$ = $3;
        $$.isGetter = true;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }
    |setter private STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    {
        $$ = $3;
        $$.isGetter = false;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }
    |getter setter private STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    {
        $$ = $4;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }
    |setter getter private STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    {
        $$ = $4;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }

    |public STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    {
        $$ = $2;
        $$.isGetter = false;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |getter public STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    {
        $$ = $3;
        $$.isGetter = true;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |setter public STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    {
        $$ = $3;
        $$.isGetter = false;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |getter setter public STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    {
        $$ = $4;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |setter getter public STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    {
        $$ = $4;
        $$.isGetter = true;
        $$.isSetter = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }

    |error public STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |error STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STATE_DECLARATION_OBJECT_VAR_ARRAY
    :STRUCT_DECLARATION_OBJECT_VAR_ARRAY semicolon
    {
        $$ = $1;
        $$.isGetter = false;
        $$.isSetter = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
;

STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY
    :STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY comma STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_OBJECT_VAR_ARRAY
    {
        $$ = $1;
        $$.listDeclaration.push(new DeclarationArray(new PositionToken(this._$.first_line, this._$.first_column), null, $4, $4, $5, $3, true));
    }
    |final static id STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_OBJECT_VAR_ARRAY
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        new DynamicDataType(1, $3, 1), $2, DeclarationType.ATRIBUT, false, false, null, true, true,
        [new DeclarationArray(new PositionToken(this._$.first_line, this._$.first_column), null, $5, $5, $6, $4, true)]);
    }
    |static final id STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_OBJECT_VAR_ARRAY
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        new DynamicDataType(1, $3, 1), $2, DeclarationType.ATRIBUT, false, false, null, true, true,
        [new DeclarationArray(new PositionToken(this._$.first_line, this._$.first_column), null, $5, $5, $6, $4, true)]);
    }
    |final id STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_OBJECT_VAR_ARRAY
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        new DynamicDataType(1, $2, 1), $2, DeclarationType.ATRIBUT, false, false, null, true, false,
        [new DeclarationArray(new PositionToken(this._$.first_line, this._$.first_column), null, $4, $4, $5, $3, true)]);
    }
    |static id STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_OBJECT_VAR_ARRAY
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        new DynamicDataType(1, $2, 1), $2, DeclarationType.ATRIBUT, false, false, null, false, true,
        [new DeclarationArray(new PositionToken(this._$.first_line, this._$.first_column), null, $4, $4, $5, $3, true)]);
    }
    |id STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_OBJECT_VAR_ARRAY
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        new DynamicDataType(1, $1, 1), $2, DeclarationType.ATRIBUT, false, false, null, false, false,
        [new DeclarationArray(new PositionToken(this._$.first_line, this._$.first_column), null, $3, $3, $4, $2, true)]);
    }

    |id error id STATE_ASIGNATION_OBJECT_VAR_ARRAY {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |id STRUCT_EMPTY_DIMS_VAR_ARRAY error STATE_ASIGNATION_OBJECT_VAR_ARRAY {
        addError(this._$.first_line, this._$.first_column, $3, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STRUCT_DECLARATION_OBJECT_VAR_ARRAY
    :STRUCT_DECLARATION_OBJECT_VAR_ARRAY comma STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_OBJECT_VAR_ARRAY
    {
        $$ = $1;
        $$.listDeclaration.push(new DeclarationArray(new PositionToken(this._$.first_line, this._$.first_column), null, $4, $4, $5, $3, true));
    }
    |final id STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_OBJECT_VAR_ARRAY
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        new DynamicDataType(1, $1, 1), $2, DeclarationType.ATRIBUT, false, false, null, true, false,
        [new DeclarationArray(new PositionToken(this._$.first_line, this._$.first_column), null, $4, $4, $5, $3, true)]);
    }
    |id STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_OBJECT_VAR_ARRAY
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column),
        new DynamicDataType(1, $1, 1), $2, DeclarationType.ATRIBUT, false, false, null, false, false,
        [new DeclarationArray(new PositionToken(this._$.first_line, this._$.first_column), null, $3, $3, $4, $2, true)]);
    }


    |final error id STATE_ASIGNATION_OBJECT_VAR_ARRAY {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |id STRUCT_EMPTY_DIMS_VAR_ARRAY error STATE_ASIGNATION_OBJECT_VAR_ARRAY {
        addError(this._$.first_line, this._$.first_column, $3, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STATE_ASIGNATION_OBJECT_VAR_ARRAY
    :equal_mark ASIGNATION_OBJECT_VAR_ARRAY { $$ = $2; }
    | { $$ = null; }

    |error ASIGNATION_OBJECT_VAR_ARRAY {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

ASIGNATION_OBJECT_VAR_ARRAY
    :STATE_VALUE { $$ = $1; }
    |VALUE_ARRAY_STATE { $$ = $1; }
    |new id STRUCT_VALUE_DIMS_VAR_ARRAY
    { $$ = new InstanceArray(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1, $2, 1), $1, $3); }

    |error STRUCT_VALUE_DIMS_VAR_ARRAY {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

/*
======================================================================================================================================
|SENTENCIA IF - ELSE
======================================================================================================================================
*/

STATE_COND_IF_ELSEIF_ELSE
    :COND_IF_STATE STATE_ELSE { $$ = $1; $$.elseNode = $2; }
;

COND_IF_STATE
    :STRUCT_IF { $$ = $1; }
    |STRUCT_IF STATE_ELSEIF { $$ = $1; $$.elseIfList = $2; }
;

STATE_ELSEIF
    :STATE_ELSEIF STRUCT_ELSEIF { $$ = $1; $$.push($2); }
    |STRUCT_ELSEIF { $$ = [$1]; }
;

STATE_ELSE
    :STRUCT_ELSE { $$ = $1; }
    | { $$ = null; }
;

STRUCT_IF
    :if parentheses_l STATE_VALUE parentheses_r keys_l CODE_FUNC_METOD keys_r
    {$$ = new ConditionalIf(new PositionToken(this._$.first_line, this._$.first_column), $1, $3, $6, [], null);}

    |error STATE_VALUE parentheses_r keys_l CODE_FUNC_METOD keys_r {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |if error keys_l CODE_FUNC_METOD keys_r {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STRUCT_ELSEIF
    :elseif parentheses_l STATE_VALUE parentheses_r keys_l CODE_FUNC_METOD keys_r
    {$$ = new ConditionalElseIf(new PositionToken(this._$.first_line, this._$.first_column), $1, $3, $6);}

    |elseif error keys_l CODE_FUNC_METOD keys_r {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STRUCT_ELSE
    :else keys_l CODE_FUNC_METOD keys_r {$$ = new ConditionalElse(new PositionToken(this._$.first_line, this._$.first_column), $1, $3);}
;


/*
======================================================================================================================================
|SENTENCIA WHILE
======================================================================================================================================
======================================================================================================================================
|SENTENCIA DO-WHILE
======================================================================================================================================
*/

STATE_WHILE
    :STRUCT_WHILE { $$ = $1; }
;

STRUCT_WHILE
    :while parentheses_l STATE_VALUE parentheses_r keys_l CODE_FUNC_METOD keys_r
    {$$ = new ConditionalWhile(new PositionToken(this._$.first_line, this._$.first_column), $1, $3, $6);}
    |while error keys_l CODE_FUNC_METOD keys_r {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STATE_DO_WHILE
    :STRUCT_DO_WHILE { $$ = $1; }
;

STRUCT_DO_WHILE
    :do keys_l CODE_FUNC_METOD keys_r while parentheses_l STATE_VALUE parentheses_r semicolon
    {$$ = new ConditionalDoWhile(new PositionToken(this._$.first_line, this._$.first_column), $1, $7, $3);}
    |do keys_l CODE_FUNC_METOD keys_r while error semicolon {
        addError(this._$.first_line, this._$.first_column, $6, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;
/*
======================================================================================================================================
|SENTENCIA FOR
======================================================================================================================================
*/
STATE_FOR
    :STRUCT_FOR { $$ = $1; }
;

STRUCT_FOR
    :for parentheses_l ASIG_STATE_FOR semicolon COND_STATE_FOR semicolon SENTENCE_STATE_FOR parentheses_r keys_l CODE_FUNC_METOD keys_r
    {$$ = new ConditionalFor(new PositionToken(this._$.first_line, this._$.first_column), $1, $3, $5, $7, $10);}

    |error parentheses_l ASIG_STATE_FOR semicolon COND_STATE_FOR semicolon SENTENCE_STATE_FOR parentheses_r keys_l CODE_FUNC_METOD keys_r {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

ASIG_STATE_FOR
    :DATATYPE_PRIMITIVE id equal_mark STATE_VALUE
    {$$ = new DeclarationAtribute(new PositionToken(this._$.first_line, this._$.first_column), $1, $2, $2, $4);}
    |id equal_mark STATE_VALUE {$$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, $3, false, false);}
    |var id equal_mark STATE_VALUE {$$ = new DeclarationVar(new PositionToken(this._$.first_line, this._$.first_column), $2, $2, $4, false);}
    |this id equal_mark STATE_VALUE {$$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $2, $2, $3, true, false); }

    |error id equal_mark STATE_VALUE {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |error STATE_VALUE {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |var error STATE_VALUE {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |this error STATE_VALUE {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

COND_STATE_FOR
    :STATE_VALUE { $$ = $1; }
;

SENTENCE_STATE_FOR
    :id equal_mark ASIGNATION_VAR {$$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, $3, false, false); }
    |id plus_plus 
    {
        var arithPlus = new ArithmeticOperation(new PositionToken(
            this._$.first_line, this._$.first_column), $2, ArithType.ADD,
            new Identifier(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, false),
            new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"INTEGER", 1),  $2, 1)
            );
        $$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, arithPlus, false, false);
    }
    |id minus_minus
    {
        var arithMinus = new ArithmeticOperation(new PositionToken(
            this._$.first_line, this._$.first_column), $2, ArithType.SUBTRAC,
            new Identifier(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, false),
            new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"INTEGER", 1),  $2, 1)
            );
        $$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, arithMinus, false, false);
    }
    //Cuando es un objeto
    |id period id equal_mark ASIGNATION_VAR
    {
        $$ = new AsigAtribObject(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, $3, $5, false, false);
    }
    //CUANDO ES UN ARREGLO
    |id equal_mark VALUE_ARRAY_STATE {$$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, $3, false, true); }
    //PARA LOS TRIBUTOS
    |this id equal_mark ASIGNATION_VAR {$$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $2, $2, $3, true, false); }
    |this id plus_plus
    {
        var arithPlus = new ArithmeticOperation(new PositionToken(
            this._$.first_line, this._$.first_column), $2, ArithType.ADD,
            new Identifier(new PositionToken(this._$.first_line, this._$.first_column), $2, $2, false),
            new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"INTEGER", 1),  $2, 1)
            );
        $$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, arithPlus, true, false);
    }
    |this id minus_minus
    {
        var arithMinus = new ArithmeticOperation(new PositionToken(
            this._$.first_line, this._$.first_column), $2, ArithType.SUBTRAC,
            new Identifier(new PositionToken(this._$.first_line, this._$.first_column), $2, $2, false),
            new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"INTEGER", 1),  $2, 1)
            );
        $$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, arithMinus, true, false);
    }
    //Cuando es un objeto
    |this id period id equal_mark ASIGNATION_VAR {$$ = new AsigAtribObject(new PositionToken(this._$.first_line, this._$.first_column), $2, $2, $3, $5, true, false);}
    //CUANDO ES UN ARREGLO
    |this id equal_mark VALUE_ARRAY_STATE {$$ = new AsignationVar(new PositionToken(this._$.first_line, this._$.first_column), $2, $2, $3, true, true); }

    |error ASIGNATION_VAR {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |error plus_plus  {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |error minus_minus  {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }

;



/*
======================================================================================================================================
|SENTENCIA SWITCH
======================================================================================================================================
*/

STATE_SWITCH
    :STRUCT_SWITCH { $$ = $1; }
;

STRUCT_SWITCH
    :switch parentheses_l STATE_VALUE parentheses_r keys_l CONTENT_SWITCH keys_r
    { $$ = new ConditionalSwitch(new PositionToken(this._$.first_line, this._$.first_column), $1, );}

    |switch error keys_l CONTENT_SWITCH keys_r {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |switch parentheses_l STATE_VALUE parentheses_r keys_l error keys_r {
        addError(this._$.first_line, this._$.first_column, $6, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

CONTENT_SWITCH
    :STRUCT_CASE {$$ = $1;}
    |STRUCT_CASE default colon CODE_FUNC_METOD
    { 
        $$ = $1;
        $$.push(new DefaultNode(new PositionToken(this._$.first_line, this._$.first_column), $2, $4));
    }

    |error default colon CODE_FUNC_METOD {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STRUCT_CASE
    :STRUCT_CASE case VALUE_CASE colon CODE_FUNC_METOD 
    { 
        $$ = $1;
        $$.push(new ConditionalSwitchCase(new PositionToken(this._$.first_line, this._$.first_column), $2, $3, $5));
    }
    |case VALUE_CASE colon CODE_FUNC_METOD
    { $$ = [new ConditionalSwitchCase(new PositionToken(this._$.first_line, this._$.first_column), $1, $2, $4)]; }

    |case error colon CODE_FUNC_METOD {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |error VALUE_CASE colon CODE_FUNC_METOD {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

VALUE_CASE
    :decimal_primitive { $$ = new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"FLOAT", 1), $1, parseFloat($1));}
    |integer_primitive { $$ = new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"INTEGER", 1), $1, parseInt($1));}
    |char_primitive { $$ = new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"CHAR", 1), $1, $1);}
    |string_primitive { $$ = new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"FLOAT", 1), $1, $1);}
    |true { $$ = new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"BOOLEAN", 1), $1, true);}
    |false { $$ = new Primitive(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"BOOLEAN", 1), $1, false);}
;

/*
======================================================================================================================================
|SENTENCIA CONSTRUCTOR
======================================================================================================================================
*/

STATE_CONSTRUCTOR
    :id parentheses_l parentheses_r keys_l CODE_CONSTRUCT keys_r 
    {$$ = new ConstructorInst(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, [], $5);}
    |id parentheses_l PARAMS_FUNC_METOD parentheses_r keys_l CODE_CONSTRUCT keys_r
    {$$ = new ConstructorInst(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, $3, $6);}
    |public id parentheses_l parentheses_r keys_l CODE_CONSTRUCT keys_r
    {$$ = new ConstructorInst(new PositionToken(this._$.first_line, this._$.first_column), $1, $2, [], $6);}
    |public id parentheses_l PARAMS_FUNC_METOD parentheses_r keys_l CODE_CONSTRUCT keys_r
    {$$ = new ConstructorInst(new PositionToken(this._$.first_line, this._$.first_column), $1, $2, $4, $7);}

    |error id parentheses_l PARAMS_FUNC_METOD parentheses_r keys_l CODE_CONSTRUCT keys_r {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |public id error keys_l CODE_CONSTRUCT keys_r {
        addError(this._$.first_line, this._$.first_column, $3, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STATE_SUPER
    :super parentheses_l parentheses_r semicolon {$$ = new SuperInst(new PositionToken(this._$.first_line, this._$.first_column), $1, []);}
    |super parentheses_l STATE_PARAM_CALL_FUNCTION parentheses_r semicolon {$$ = new SuperInst(new PositionToken(this._$.first_line, this._$.first_column), $1, $3);}

    |super error semicolon {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

CODE_CONSTRUCT
    :CODE_CONSTRUCT STATE_DECLARATION_VAR {$$ = $1; $$.push($2); }
    |CODE_CONSTRUCT STATE_DECLARATION_VAR_ARRAY {$$ = $1; $$.push($2); }
    |CODE_CONSTRUCT STATE_DECLARATION_OBJECT_VAR {$$ = $1; $$.push($2); }
    |CODE_CONSTRUCT STATE_DECLARATION_OBJECT_VAR_ARRAY {$$ = $1; $$.push($2); }
    |CODE_CONSTRUCT STRUCT_ASIGNATION_VAR {$$ = $1; $$.push($2); }
    |CODE_CONSTRUCT STRUCT_ASIGNATION_VAR_ARRAY {$$ = $1; $$.push($2); }
    |CODE_CONSTRUCT STATE_COMMENT {$$ = $1; }
    |CODE_CONSTRUCT STRUCT_VAR {$$ = $1; $$.push($2); }
    |CODE_CONSTRUCT STATE_CALL_FUNCTION {$$ = $1; $$.push($2); }
    |CODE_CONSTRUCT STATE_COND_IF_ELSEIF_ELSE {$$ = $1; $$.push($2); }
    |CODE_CONSTRUCT STATE_SWITCH {$$ = $1; $$.push($2); }
    |CODE_CONSTRUCT STATE_FOR {$$ = $1; $$.push($2); }
    |CODE_CONSTRUCT STATE_WHILE {$$ = $1; $$.push($2); }
    |CODE_CONSTRUCT STATE_DO_WHILE {$$ = $1; $$.push($2); }
    |CODE_CONSTRUCT STATE_MATH {$$ = $1; $$.push($2); }
    |CODE_CONSTRUCT STATE_BREAK {$$ = $1; $$.push($2); }
    |CODE_CONSTRUCT STATE_CONTINUE {$$ = $1; $$.push($2); }
    |CODE_CONSTRUCT STATE_PRINTS {$$ = $1; $$.push($2); }
    |CODE_CONSTRUCT STRUCT_INPUT {$$ = $1; $$.push($2); }
    |CODE_CONSTRUCT STATE_RETURN {$$ = $1; $$.push($2); }
    |CODE_CONSTRUCT STATE_TOSTRING {$$ = $1; $$.push($2); }
    |CODE_CONSTRUCT STATE_SUPER {$$ = $1; $$.push($2); }
    // |CODE_CONSTRUCT
    // |CODE_CONSTRUCT
    | {$$ = []; }
;
/*
======================================================================================================================================
|SENTENCIA FUNCTION
======================================================================================================================================
*/
STATE_CALL_FUNCTION
    :STRUCT_CALL_FUNCTION semicolon {$$ = $1;}
;

STRUCT_CALL_FUNCTION
    :id parentheses_l parentheses_r
    { $$ = new CallFunction(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, [], false);}
    |id parentheses_l STATE_PARAM_CALL_FUNCTION parentheses_r
    { $$ = new CallFunction(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, $3, false);}
    |this id parentheses_l parentheses_r
    { $$ = new CallFunction(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, [], true);}
    |this id parentheses_l STATE_PARAM_CALL_FUNCTION parentheses_r
    { $$ = new CallFunction(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, $3, true);}

    //Para funciones de objetos
    |id period id parentheses_l parentheses_r
    { $$ = new CallFunctionObject(new PositionToken(this._$.first_line, this._$.first_column), $1, $3, [], false);}
    |id period id parentheses_l STATE_PARAM_CALL_FUNCTION parentheses_r
    { $$ = new CallFunctionObject(new PositionToken(this._$.first_line, this._$.first_column), $1, $3, $5, false);}
    |this id period id parentheses_l parentheses_r
    { $$ = new CallFunctionObject(new PositionToken(this._$.first_line, this._$.first_column), $1, $3, [], true);}
    |this id period id parentheses_l STATE_PARAM_CALL_FUNCTION parentheses_r
    { $$ = new CallFunctionObject(new PositionToken(this._$.first_line, this._$.first_column), $1, $3, $5, true);}

    |error period id parentheses_l STATE_PARAM_CALL_FUNCTION parentheses_r {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }

;

STATE_PARAM_CALL_FUNCTION
    :STATE_PARAM_CALL_FUNCTION comma STATE_VALUE  {$$ = $1; $$.push($3); }
    |STATE_VALUE {$$ = [$1];}
;

STATE_FUNCTION
    :STRUCT_FUNCTION 
    {
        $$ = $1; 
        $$.isOverride = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |override STRUCT_FUNCTION 
    {
        $$ = $2; 
        $$.isOverride = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }

    |public STRUCT_FUNCTION 
    {
        $$ = $2; 
        $$.isOverride = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |override public STRUCT_FUNCTION 
    {
        $$ = $3; 
        $$.isOverride = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }

    |private STRUCT_FUNCTION {
        $$ = $2; 
        $$.isOverride = false;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }
    |override private STRUCT_FUNCTION 
    {
        $$ = $3; 
        $$.isOverride = true;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }

    |error private STRUCT_FUNCTION {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |error public STRUCT_FUNCTION {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |error STRUCT_FUNCTION {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STRUCT_FUNCTION
    :DATATYPE_PRIMITIVE id parentheses_l parentheses_r keys_l CODE_FUNC_METOD keys_r
    {$$ = new FunctionProcedure(new PositionToken(this._$.first_line, this._$.first_column), $1, $2, false, true, $2, [], $6);}
    |DATATYPE_PRIMITIVE id parentheses_l PARAMS_FUNC_METOD parentheses_r keys_l CODE_FUNC_METOD keys_r
    {$$ = new FunctionProcedure(new PositionToken(this._$.first_line, this._$.first_column), $1, $2, false, true, $2, $4, $7);}
    |static DATATYPE_PRIMITIVE id parentheses_l parentheses_r keys_l CODE_FUNC_METOD keys_r
    {$$ = new FunctionProcedure(new PositionToken(this._$.first_line, this._$.first_column), $2, $3, true, true, $3, [], $7);}
    |static DATATYPE_PRIMITIVE id parentheses_l PARAMS_FUNC_METOD parentheses_r keys_l CODE_FUNC_METOD keys_r
    {$$ = new FunctionProcedure(new PositionToken(this._$.first_line, this._$.first_column), $2, $3, true, true, $3, $5, $8);}

    |error parentheses_l PARAMS_FUNC_METOD parentheses_r keys_l CODE_FUNC_METOD keys_r {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |DATATYPE_PRIMITIVE id error keys_l CODE_FUNC_METOD keys_r {
        addError(this._$.first_line, this._$.first_column, $3, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |static DATATYPE_PRIMITIVE id error keys_l CODE_FUNC_METOD keys_r {
        addError(this._$.first_line, this._$.first_column, $4, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;


PARAMS_FUNC_METOD
    :PARAMS_FUNC_METOD comma DATATYPE_PRIMITIVE id
    {
        $$ = $1;
        $$.push(new DeclarationParam(new PositionToken(this._$.first_line, this._$.first_column), $3, $4, $4, null, false));
    }
    |PARAMS_FUNC_METOD comma id id
    {
        $$ = $1;
        $$.push(new DeclarationParam(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1, $3, 1), $3, $4, null, false));
    }
    |PARAMS_FUNC_METOD comma DATATYPE_PRIMITIVE STRUCT_EMPTY_DIMS_VAR_ARRAY id
    {
        $$ = $1;
        $$.push(new DeclarationParam(new PositionToken(this._$.first_line, this._$.first_column), $3, $5, $5, $4, true));
    }
    |PARAMS_FUNC_METOD comma id STRUCT_EMPTY_DIMS_VAR_ARRAY id
    {
        $$ = $1;
        $$.push(new DeclarationParam(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1, $3, 1), $3, $5, $4, true));
    }
    |DATATYPE_PRIMITIVE id {$$ = [new DeclarationParam(new PositionToken(this._$.first_line, this._$.first_column), $1, $2, $2, null, false)];}
    |id id {$$ = [new DeclarationParam(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1, $1, 1), $1, $2, null, false)];}
    |DATATYPE_PRIMITIVE STRUCT_EMPTY_DIMS_VAR_ARRAY id {$$ = [new DeclarationParam(new PositionToken(this._$.first_line, this._$.first_column), $1, $3, $3, $2, true)];}
    |id STRUCT_EMPTY_DIMS_VAR_ARRAY id  {$$ = [new DeclarationParam(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1, $1, 1), $1, $3, $2, true)];}
;
/*
======================================================================================================================================
|SENTENCIA METODO
======================================================================================================================================
*/

STATE_METOD
    :STRUCT_METOD
    {
        $$ = $1; 
        $$.isOverride = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |override STRUCT_METOD
    {
        $$ = $2; 
        $$.isOverride = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }

    |public STRUCT_METOD
    {
        $$ = $2; 
        $$.isOverride = false;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }
    |override public STRUCT_METOD
    {
        $$ = $3; 
        $$.isOverride = true;
        $$.encapsulationType = EncapsulationType.PUBLIC;
    }

    |private STRUCT_METOD
    {
        $$ = $2; 
        $$.isOverride = false;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }
    |override private STRUCT_METOD
    {
        $$ = $3; 
        $$.isOverride = true;
        $$.encapsulationType = EncapsulationType.PRIVATE;
    }
;

STRUCT_METOD
    :void id parentheses_l parentheses_r keys_l CODE_FUNC_METOD keys_r
    {$$ = new FunctionProcedure(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(10,"VOID", 1), $2, false, false, $2, [], $6);}
    |void id parentheses_l PARAMS_FUNC_METOD parentheses_r keys_l CODE_FUNC_METOD keys_r
    {$$ = new FunctionProcedure(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(10,"VOID", 1), $2, false, false, $2, $4, $7);}
    |static void id parentheses_l parentheses_r keys_l CODE_FUNC_METOD keys_r
    {$$ = new FunctionProcedure(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(10,"VOID", 1), $3, true, false, $3, [], $7);}
    |static void id parentheses_l PARAMS_FUNC_METOD parentheses_r keys_l CODE_FUNC_METOD keys_r
    {$$ = new FunctionProcedure(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(10,"VOID", 1), $3, true, false, $3, $5, $8);}


    |void id error keys_l CODE_FUNC_METOD keys_r {
        addError(this._$.first_line, this._$.first_column, $3, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |static void id error keys_l CODE_FUNC_METOD keys_r {
        addError(this._$.first_line, this._$.first_column, $4, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;


CODE_FUNC_METOD
    :CODE_FUNC_METOD STATE_DECLARATION_VAR {$$ = $1; $$.push($2); }
    |CODE_FUNC_METOD STATE_DECLARATION_VAR_ARRAY {$$ = $1; $$.push($2); }
    |CODE_FUNC_METOD STATE_DECLARATION_OBJECT_VAR {$$ = $1; $$.push($2); }
    |CODE_FUNC_METOD STATE_DECLARATION_OBJECT_VAR_ARRAY {$$ = $1; $$.push($2); }
    |CODE_FUNC_METOD STRUCT_ASIGNATION_VAR {$$ = $1; $$.push($2); }
    |CODE_FUNC_METOD STRUCT_ASIGNATION_VAR_ARRAY {$$ = $1; $$.push($2); }
    |CODE_FUNC_METOD STATE_COMMENT {$$ = $1; }
    |CODE_FUNC_METOD STRUCT_VAR {$$ = $1; $$.push($2); }
    |CODE_FUNC_METOD STATE_CALL_FUNCTION {$$ = $1; $$.push($2); }
    |CODE_FUNC_METOD STATE_COND_IF_ELSEIF_ELSE {$$ = $1; $$.push($2); }
    |CODE_FUNC_METOD STATE_SWITCH {$$ = $1; $$.push($2); }
    |CODE_FUNC_METOD STATE_FOR {$$ = $1; $$.push($2); }
    |CODE_FUNC_METOD STATE_WHILE {$$ = $1; $$.push($2); }
    |CODE_FUNC_METOD STATE_DO_WHILE {$$ = $1; $$.push($2); }
    |CODE_FUNC_METOD STATE_MATH {$$ = $1; $$.push($2); }
    |CODE_FUNC_METOD STATE_BREAK {$$ = $1; $$.push($2); }
    |CODE_FUNC_METOD STATE_CONTINUE {$$ = $1; $$.push($2); }
    |CODE_FUNC_METOD STATE_PRINTS {$$ = $1; $$.push($2); }
    |CODE_FUNC_METOD STRUCT_INPUT {$$ = $1; $$.push($2); }
    |CODE_FUNC_METOD STATE_RETURN {$$ = $1; $$.push($2); }
    |CODE_FUNC_METOD STATE_TOSTRING {$$ = $1; $$.push($2); }
    // |CODE_FUNC_METOD
    // |CODE_FUNC_METOD
    | {$$ = []; }
;

/*
======================================================================================================================================
|SENTENCIAS MATH
======================================================================================================================================
*/
STATE_MATH
    :STRUCT_CALL_FUNC_MATH semicolon {$$ = $1;}

    |error semicolon {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STRUCT_CALL_FUNC_MATH
    // Math.abs(double a)
    :math_abs parentheses_l STATE_VALUE parentheses_r {$$ = new CallMath(new PositionToken(this._$.first_line, this._$.first_column), $1, MathType.ABS, $3, null);}
    // Math.ceil(double a)
    |math_ceil parentheses_l STATE_VALUE parentheses_r {$$ = new CallMath(new PositionToken(this._$.first_line, this._$.first_column), $1, MathType.CEIL, $3, null);}
    // Math.floor(double a)
    |math_floor parentheses_l STATE_VALUE parentheses_r {$$ = new CallMath(new PositionToken(this._$.first_line, this._$.first_column), $1, MathType.FLOOR, $3, null);}
    // Math.round(double a)
    |math_round parentheses_l STATE_VALUE parentheses_r {$$ = new CallMath(new PositionToken(this._$.first_line, this._$.first_column), $1, MathType.ROUND, $3, null);}
    // Math.max(double a, double b)
    |math_max parentheses_l STATE_VALUE comma STATE_VALUE parentheses_r {$$ = new CallMath(new PositionToken(this._$.first_line, this._$.first_column), $1, MathType.MAX, $3, $4);}
    // Math.min(double a, double b)
    |math_min parentheses_l STATE_VALUE comma STATE_VALUE parentheses_r {$$ = new CallMath(new PositionToken(this._$.first_line, this._$.first_column), $1, MathType.MIN, $3, $4);}
    // Math.pow(double base, double exponente)
    |math_pow parentheses_l STATE_VALUE comma STATE_VALUE parentheses_r {$$ = new CallMath(new PositionToken(this._$.first_line, this._$.first_column), $1, MathType.POW, $3, $4);}
    // Math.sqrt(double a)
    |math_sqrt parentheses_l STATE_VALUE parentheses_r {$$ = new CallMath(new PositionToken(this._$.first_line, this._$.first_column), $1, MathType.SQRT, $3, null);}
    // Math.random()
    |math_random parentheses_l parentheses_r {$$ = new CallMath(new PositionToken(this._$.first_line, this._$.first_column), $1, MathType.RANDOM, null, null);}
    // Math.toRadians(double grados)
    |math_toradians parentheses_l STATE_VALUE parentheses_r {$$ = new CallMath(new PositionToken(this._$.first_line, this._$.first_column), $1, MathType.TO_RADIANS, $3, null);}
    // Math.acos(double a)
    |math_acos parentheses_l STATE_VALUE parentheses_r {$$ = new CallMath(new PositionToken(this._$.first_line, this._$.first_column), $1, MathType.ACOS, $3, null);}
    // Math.sin(double a)
    |math_sin parentheses_l STATE_VALUE parentheses_r {$$ = new CallMath(new PositionToken(this._$.first_line, this._$.first_column), $1, MathType.SIN, $3, null);}
    // Math.atan(double a)
    |math_atan parentheses_l STATE_VALUE parentheses_r {$$ = new CallMath(new PositionToken(this._$.first_line, this._$.first_column), $1, MathType.ATAN, $3, null);}
    // Math.exp(double a)
    |math_exp parentheses_l STATE_VALUE parentheses_r {$$ = new CallMath(new PositionToken(this._$.first_line, this._$.first_column), $1, MathType.EXP, $3, null);}
;


/*
======================================================================================================================================
|llamadas y otros
======================================================================================================================================
*/

STATE_BREAK
    :break semicolon {$$ = new BreakNode(new PositionToken(this._$.first_line, this._$.first_column), $1);}
;


STATE_CONTINUE
    :continue semicolon {$$ = new ContinueNode(new PositionToken(this._$.first_line, this._$.first_column), $1);}
;

STATE_RETURN
    :return STATE_VALUE semicolon {$$ = new ReturnNode(new PositionToken(this._$.first_line, this._$.first_column), $1, $2);}
;

STRUCT_CALL_ARRAY
    :id STRUCT_VALUE_DIMS_VAR_ARRAY {$$ = new CallArray(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, $2);}
;

STRUCT_CALL_OBJECT_VALUE
    :id period id {$$ = new CallValueObject(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, $3, false);}
    |this id period id {$$ = new CallValueObject(new PositionToken(this._$.first_line, this._$.first_column), $1, $2, $4, true);}

    |error period id {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STATE_INPUTS
    :STRUCT_INPUT semicolon { $$ = $1; }
;

STRUCT_INPUT
    :readfloat parentheses_l id parentheses_r { $$ = new InputNode(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"FLOAT",1), $1, $3); }
    |readint parentheses_l id parentheses_r { $$ = new InputNode(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"INTEGER",1), $1, $3); }
    |readchar parentheses_l id parentheses_r { $$ = new InputNode(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"CHAR",1), $1, $3); }
    |readboolean parentheses_l id parentheses_r { $$ = new InputNode(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"BOOLEAN",1), $1, $3); }
    |readstring parentheses_l id parentheses_r { $$ = new InputNode(new PositionToken(this._$.first_line, this._$.first_column), new DynamicDataType(1,"STRING",1), $1, $3); }
;

STATE_PRINTS
    :STRUCT_SOUT semicolon { $$ = $1; }
;

STRUCT_SOUT
    :printf parentheses_l STATE_VALUE parentheses_r {$$ = new PrintNode(new PositionToken(this._$.first_line, this._$.first_column), $1, $3, false);}
    |println parentheses_l STATE_VALUE parentheses_r {$$ = new PrintNode(new PositionToken(this._$.first_line, this._$.first_column), $1, $3, true);}
    |printf parentheses_l parentheses_r {$$ = new PrintNode(new PositionToken(this._$.first_line, this._$.first_column), $1, null, false);}
    |println parentheses_l parentheses_r {$$ = new PrintNode(new PositionToken(this._$.first_line, this._$.first_column), $1, null, true);}

    |println error parentheses_r {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STATE_TOSTRING
    :STRUCT_TOSTRING semicolon { $$ = $1; }
;

STRUCT_TOSTRING
    :tostring parentheses_l parentheses_r {$$ = new TostringNode(new PositionToken(this._$.first_line, this._$.first_column), $1, null, false);}
    |this tostring parentheses_l parentheses_r {$$ = new TostringNode(new PositionToken(this._$.first_line, this._$.first_column), $1, null, true);}
    |id period tostring parentheses_l parentheses_r {$$ = new TostringNode(new PositionToken(this._$.first_line, this._$.first_column), $1, $1, false);}
    |this id period tostring parentheses_l parentheses_r {$$ = new TostringNode(new PositionToken(this._$.first_line, this._$.first_column), $1, $2, true);}

    |error tostring parentheses_l parentheses_r {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |tostring error {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |this tostring error {
        addError(this._$.first_line, this._$.first_column, $3, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |id period tostring error {
        addError(this._$.first_line, this._$.first_column, $4, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |this id period tostring error {
        addError(this._$.first_line, this._$.first_column, $5, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;
