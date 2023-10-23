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
    const { ArithType } = require("src/app/core/models/ast/main/utils/arith-type.ts");
    const { DynamicDataType } = require("src/app/core/models/ast/main/utils/DynamicDataType.ts");
    const { LogicalType } = require("src/app/core/models/ast/main/utils/logical-type.ts");
    const { RationalType } = require("src/app/core/models/ast/main/utils/rational-type.ts");
    const { ArithmeticOperation } = require("src/app/core/models/ast/main/expressions/arithmetic-operation.ts");
    const { Identifier } = require("src/app/core/models/ast/main/expressions/identifier.ts");
    const { LogicalOperation } = require("src/app/core/models/ast/main/expressions/logical-operation.ts");
    const { MathNode } = require("src/app/core/models/ast/main/expressions/math-node.ts");
    const { Primitive } = require("src/app/core/models/ast/main/expressions/primitive.ts");
    const { RationalOperation } = require("src/app/core/models/ast/main/expressions/rational-operation.ts");
    // const {  } = require("src/app/core/models/ast/main/expressions");
    //INSTRUCTIONS
    const { AsignationArray } = require("src/app/core/models/ast/main/instructions/asignation-array.ts");
    const { AsignationVar } = require("src/app/core/models/ast/main/instructions/asignation-var.ts");
    const { CallArray } = require("src/app/core/models/ast/main/instructions/call-array.ts");
    const { CallFunction } = require("src/app/core/models/ast/main/instructions/call-function.ts");
    const { ClassInst } = require("src/app/core/models/ast/main/instructions/class-inst.ts");
    const { ConstructorInst } = require("src/app/core/models/ast/main/instructions/constructor-inst.ts");
    const { DataArray } = require("src/app/core/models/ast/main/instructions/data-array.ts");
    const { DeclarationArray } = require("src/app/core/models/ast/main/instructions/declaration-array.ts");
    const { DeclarationAtribute } = require("src/app/core/models/ast/main/instructions/declaration-atribute.ts");
    const { DeclarationParam } = require("src/app/core/models/ast/main/instructions/declaration-param.ts");
    const { DeclarationVar } = require("src/app/core/models/ast/main/instructions/declaration-var.ts");
    const { FunctionProcedure } = require("src/app/core/models/ast/main/instructions/function-procedure.ts");
    const { ListDeclaration } = require("src/app/core/models/ast/main/instructions/list-declaration.ts");
    const { NodeMain } = require("src/app/core/models/ast/main/instructions/node-main.ts");
    // const {  } = require("src/app/core/models/ast/main/instructions");
    // const {  } = require("src/app/core/models/ast/main/instructions");
    // const {  } = require("src/app/core/models/ast/main/instructions");
    // const {  } = require("src/app/core/models/ast/main/instructions");
    // const {  } = require("src/app/core/models/ast/main/instructions");
    //SENTENCES
    const { ConditionalDoWhile } = require("src/app/core/models/ast/main/sentences/conditional-do-while.ts");
    const {  } = require("src/app/core/models/ast/main/sentences/conditional-else-if.ts");
    const {  } = require("src/app/core/models/ast/main/sentences/conditional-else.ts");
    const {  } = require("src/app/core/models/ast/main/sentences/conditional-for.ts");
    const {  } = require("src/app/core/models/ast/main/sentences/conditional-if.ts");
    const {  } = require("src/app/core/models/ast/main/sentences/conditional-switch-case.ts");
    const {  } = require("src/app/core/models/ast/main/sentences/conditional-switch.ts");
    const {  } = require("src/app/core/models/ast/main/sentences/conditional-while.ts");
    // const {  } = require("src/app/core/models/ast/main/sentences");
    // const {  } = require("src/app/core/models/ast/main/sentences");
    

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
        console.log(listErrors);
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
    :CODE EOF { /*console.log($1);*/ /*resultado = $1;*/ /*return $1;*/ return new TreeAST([], getListErrors());}
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
    |BLOCK_CONTENT_MAIN STATE_RETURN { $$ = $1; $$.push($2); }
    |BLOCK_CONTENT_MAIN STATE_TOSTRING { $$ = $1; $$.push($2); }
    // |BLOCK_CONTENT_MAIN 
    // |BLOCK_CONTENT_MAIN 
    // |BLOCK_CONTENT_MAIN 
    | { $$ = []; }
;

/*
======================================================================================================================================
|BLOQUE DE CODIGO DE CLASES
======================================================================================================================================
*/
STRUCT_CLASS
    :public STATE_FINAL class id STRUCT_EXTENDS keys_l CODE_CLASS keys_r { $$ = new ClassInst(new PositionToken(this._$.first_line, this._$.first_column), false, false, $4, $4, $5, true, $2, $7); }
    |STATE_FINAL class id STRUCT_EXTENDS keys_l CODE_CLASS keys_r { $$ = new ClassInst(new PositionToken(this._$.first_line, this._$.first_column), false, false, $3, $3, $4, true, $1, $6); }
    |getter setter public STATE_FINAL class id STRUCT_EXTENDS keys_l CODE_CLASS keys_r { $$ = new ClassInst(new PositionToken(this._$.first_line, this._$.first_column), true, true, $4, $4, $5, true, $2, $7); }
    |setter getter STATE_FINAL class id STRUCT_EXTENDS keys_l CODE_CLASS keys_r { $$ = new ClassInst(new PositionToken(this._$.first_line, this._$.first_column), true, true, $3, $3, $4, true, $1, $6); }
    |getter public STATE_FINAL class id STRUCT_EXTENDS keys_l CODE_CLASS keys_r { $$ = new ClassInst(new PositionToken(this._$.first_line, this._$.first_column), true, false, $4, $4, $5, true, $2, $7); }
    |setter STATE_FINAL class id STRUCT_EXTENDS keys_l CODE_CLASS keys_r { $$ = new ClassInst(new PositionToken(this._$.first_line, this._$.first_column), false, true, $3, $3, $4, true, $1, $6); }


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
    // |CODE_CLASS
    // |CODE_CLASS
    // |CODE_CLASS
    // |CODE_CLASS
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
        $1, $2, DeclarationType.ATRIBUT, false, false, null, true, true, 
        [new DeclarationAtribute(new PositionToken(this._$.first_line, this._$.first_column), $1, $2, $2, $3)]); 
    }
    |static final DATATYPE_PRIMITIVE id STATE_ASIGNATION_ATRIB 
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column), 
        $1, $2, DeclarationType.ATRIBUT, false, false, null, true, true, 
        [new DeclarationAtribute(new PositionToken(this._$.first_line, this._$.first_column), $1, $2, $2, $3)]); 
    }
    |final DATATYPE_PRIMITIVE id STATE_ASIGNATION_ATRIB { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column), 
        $1, $2, DeclarationType.ATRIBUT, false, false, null, true, false, 
        [new DeclarationAtribute(new PositionToken(this._$.first_line, this._$.first_column), null, $2, $2, $3)]); 
    }
    |static DATATYPE_PRIMITIVE id STATE_ASIGNATION_ATRIB
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column), 
        $1, $2, DeclarationType.ATRIBUT, false, false, null, false, true, 
        [new DeclarationAtribute(new PositionToken(this._$.first_line, this._$.first_column), $1, $2, $2, $3)]); 
    }
    |DATATYPE_PRIMITIVE id STATE_ASIGNATION_ATRIB
    { $$ = new ListDeclaration(
        new PositionToken(this._$.first_line, this._$.first_column), 
        $1, $2, DeclarationType.ATRIBUT, false, false, null, false, false, 
        [new DeclarationAtribute(new PositionToken(this._$.first_line, this._$.first_column), $1, $2, $2, $3)]); 
    }

    |error DATATYPE_PRIMITIVE id STATE_ASIGNATION_ATRIB {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |error STATE_ASIGNATION_ATRIB {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STATE_ASIGNATION_ATRIB
    :equal_mark ASIGNATION_ATRIB  { $$ = $1; }
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
    |getter STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    |setter STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    |getter setter STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    |setter getter STRUCT_DECLARATION_ATRIB_ARRAY semicolon

    |private STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    |getter private STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    |setter private STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    |getter setter private STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    |setter getter private STRUCT_DECLARATION_ATRIB_ARRAY semicolon

    |public STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    |getter public STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    |setter public STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    |getter setter public STRUCT_DECLARATION_ATRIB_ARRAY semicolon
    |setter getter public STRUCT_DECLARATION_ATRIB_ARRAY semicolon

    |error public STRUCT_DECLARATION_ATRIB_ARRAY semicolon {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STRUCT_DECLARATION_ATRIB_ARRAY
    :STRUCT_DECLARATION_ATRIB_ARRAY comma STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_VAR_ARRAY
    |final static DATATYPE_PRIMITIVE STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_VAR_ARRAY
    |static final DATATYPE_PRIMITIVE STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_VAR_ARRAY
    |final DATATYPE_PRIMITIVE STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_VAR_ARRAY
    |static DATATYPE_PRIMITIVE STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_VAR_ARRAY
    |DATATYPE_PRIMITIVE STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_VAR_ARRAY

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
;

STRUCT_DECLARATION_VAR
    :STRUCT_DECLARATION_VAR comma id STATE_ASIGNATION_VAR
    |final DATATYPE_PRIMITIVE id STATE_ASIGNATION_VAR
    |DATATYPE_PRIMITIVE id STATE_ASIGNATION_VAR

    |error id STATE_ASIGNATION_VAR {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |DATATYPE_PRIMITIVE error STATE_ASIGNATION_VAR {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STATE_ASIGNATION_VAR
    :equal_mark ASIGNATION_VAR
    |

    |error ASIGNATION_VAR {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

ASIGNATION_VAR
    :STATE_VALUE
;


STRUCT_ASIGNATION_VAR
    :id equal_mark ASIGNATION_VAR semicolon
    |id plus_plus semicolon
    |id minus_minus semicolon
    //Cuando es un objeto
    |id period id equal_mark ASIGNATION_VAR semicolon
    |id equal_mark new id parentheses_l parentheses_r semicolon
    |id equal_mark new id parentheses_l STATE_PARAM_OBJECT parentheses_r semicolon
    //CUANDO ES UN ARREGLO
    |id equal_mark VALUE_ARRAY_STATE semicolon
    |id equal_mark new DATATYPE_PRIMITIVE STRUCT_VALUE_DIMS_VAR_ARRAY semicolon
    |id equal_mark new id STRUCT_VALUE_DIMS_VAR_ARRAY semicolon

    //PARA LOS TRIBUTOS
    |this id equal_mark ASIGNATION_VAR semicolon
    |this id plus_plus semicolon
    |this id minus_minus semicolon
    //Cuando es un objeto
    |this id period id equal_mark ASIGNATION_VAR semicolon
    |this id equal_mark new id parentheses_l parentheses_r semicolon
    |this id equal_mark new id parentheses_l STATE_PARAM_OBJECT parentheses_r semicolon
    //CUANDO ES UN ARREGLO
    |this id equal_mark VALUE_ARRAY_STATE semicolon
    |this id equal_mark new DATATYPE_PRIMITIVE STRUCT_VALUE_DIMS_VAR_ARRAY semicolon
    |this id equal_mark new id STRUCT_VALUE_DIMS_VAR_ARRAY semicolon

    |error equal_mark new id parentheses_l STATE_PARAM_OBJECT parentheses_r semicolon {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |this id equal_mark error parentheses_l STATE_PARAM_OBJECT parentheses_r semicolon {
        addError(this._$.first_line, this._$.first_column, $4, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    
;

STRUCT_VAR
    :STATE_FINAL var id equal_mark ASIGNATION_VAR semicolon
    |STATE_FINAL var id equal_mark new id parentheses_l parentheses_r semicolon
    |STATE_FINAL var id equal_mark new id parentheses_l STATE_PARAM_OBJECT parentheses_r semicolon

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
;

STRUCT_DECLARATION_VAR_ARRAY
    :STRUCT_DECLARATION_VAR_ARRAY comma STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_VAR_ARRAY
    |final DATATYPE_PRIMITIVE STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_VAR_ARRAY
    |DATATYPE_PRIMITIVE STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_VAR_ARRAY

    |error STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_VAR_ARRAY {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |DATATYPE_PRIMITIVE error id STATE_ASIGNATION_VAR_ARRAY {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STRUCT_EMPTY_DIMS_VAR_ARRAY
    :STRUCT_EMPTY_DIMS_VAR_ARRAY brackets_l brackets_r
    |brackets_l brackets_r
;

STRUCT_VALUE_DIMS_VAR_ARRAY
    :STRUCT_VALUE_DIMS_VAR_ARRAY brackets_l STATE_VALUE brackets_r
    |brackets_l STATE_VALUE brackets_r
;

STATE_ASIGNATION_VAR_ARRAY
    :equal_mark ASIGNATION_VAR_ARRAY
    |
;

ASIGNATION_VAR_ARRAY
    :STATE_VALUE
    |VALUE_ARRAY_STATE 
    |new DATATYPE_PRIMITIVE STRUCT_VALUE_DIMS_VAR_ARRAY

    |error STRUCT_VALUE_DIMS_VAR_ARRAY {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

VALUE_ARRAY_STATE 
    :keys_l VALUE_ARRAY_MULTI_STATE keys_r
    |keys_l VALUE_UNIT_ARRAY_STATE keys_r
    |keys_l keys_r
;

VALUE_ARRAY_MULTI_STATE
    :VALUE_ARRAY_MULTI_STATE comma keys_l VALUE_ARRAY_MULTI_STATE keys_r
    |VALUE_ARRAY_MULTI_STATE comma keys_l VALUE_UNIT_ARRAY_STATE keys_r
    |keys_l VALUE_ARRAY_MULTI_STATE keys_r
    |keys_l VALUE_UNIT_ARRAY_STATE keys_r
;

VALUE_UNIT_ARRAY_STATE
    :VALUE_UNIT_ARRAY_STATE comma STATE_VALUE
    |VALUE_UNIT_ARRAY_STATE comma new DATATYPE_PRIMITIVE STRUCT_VALUE_DIMS_VAR_ARRAY
    |VALUE_UNIT_ARRAY_STATE comma new id STRUCT_VALUE_DIMS_VAR_ARRAY
    |STATE_VALUE
    |new DATATYPE_PRIMITIVE STRUCT_VALUE_DIMS_VAR_ARRAY
    |new id STRUCT_VALUE_DIMS_VAR_ARRAY
;

STRUCT_ASIGNATION_VAR_ARRAY
    :id STRUCT_VALUE_DIMS_VAR_ARRAY equal_mark ASIGNATION_VAR semicolon
    |id STRUCT_VALUE_DIMS_VAR_ARRAY equal_mark new id parentheses_l parentheses_r semicolon
    |id STRUCT_VALUE_DIMS_VAR_ARRAY equal_mark new id parentheses_l STATE_PARAM_OBJECT parentheses_r semicolon
    //CUANDO SON ATRIBUTOS
    |this id STRUCT_VALUE_DIMS_VAR_ARRAY equal_mark ASIGNATION_VAR semicolon
    |this id STRUCT_VALUE_DIMS_VAR_ARRAY equal_mark new id parentheses_l parentheses_r semicolon
    |this id STRUCT_VALUE_DIMS_VAR_ARRAY equal_mark new id parentheses_l STATE_PARAM_OBJECT parentheses_r semicolon

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
    :public STRUCT_DECLARATION_OBJECT_VAR semicolon
    |private STRUCT_DECLARATION_OBJECT_VAR semicolon
    |STRUCT_DECLARATION_OBJECT_VAR semicolon
;

STATE_DECLARATION_OBJECT_ATRIB
    :STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    |getter setter STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    |setter getter STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    |getter STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    |setter STRUCT_DECLARATION_OBJECT_ATRIB semicolon

    |private STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    |getter setter private STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    |setter getter private STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    |getter private STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    |setter private STRUCT_DECLARATION_OBJECT_ATRIB semicolon

    |public STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    |getter setter public STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    |setter getter public STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    |getter public STRUCT_DECLARATION_OBJECT_ATRIB semicolon
    |setter public STRUCT_DECLARATION_OBJECT_ATRIB semicolon

    |error STRUCT_DECLARATION_OBJECT_ATRIB semicolon {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STRUCT_DECLARATION_OBJECT_ATRIB
    :STRUCT_DECLARATION_OBJECT_ATRIB comma id STATE_ASIGNATION_OBJECT
    |static final id id STATE_ASIGNATION_OBJECT
    |final static id id STATE_ASIGNATION_OBJECT
    |final id id STATE_ASIGNATION_OBJECT
    |static id id STATE_ASIGNATION_OBJECT
    |id id STATE_ASIGNATION_OBJECT
    |id error STATE_ASIGNATION_OBJECT {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STRUCT_DECLARATION_OBJECT_VAR
    :STRUCT_DECLARATION_OBJECT_VAR comma id STATE_ASIGNATION_OBJECT
    |final id id STATE_ASIGNATION_OBJECT
    |id id STATE_ASIGNATION_OBJECT
    |id error STATE_ASIGNATION_OBJECT {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STATE_ASIGNATION_OBJECT
    :equal_mark VALUE_ASIGNATION_OBJECT
    |
    |error VALUE_ASIGNATION_OBJECT {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

VALUE_ASIGNATION_OBJECT
    :STATE_VALUE
    |new id parentheses_l STATE_PARAM_OBJECT parentheses_r
    |new id parentheses_l parentheses_r

    |error parentheses_l STATE_PARAM_OBJECT parentheses_r {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STATE_PARAM_OBJECT
    :STATE_PARAM_OBJECT comma STATE_VALUE
    |STATE_VALUE

    |STATE_PARAM_OBJECT error STATE_VALUE {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;


//ARREGLOS DE TIPO OBJETO
STATE_DECLARATION_OBJECT_ATRIB_ARRAY
    :STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    |getter STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    |setter STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    |getter setter STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    |setter getter STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon

    |private STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    |getter private STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    |setter private STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    |getter setter private STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    |setter getter private STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon

    |public STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    |getter public STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    |setter public STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    |getter setter public STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon
    |setter getter public STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon

    |error public STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |error STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY semicolon {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STATE_DECLARATION_OBJECT_VAR_ARRAY
    :STRUCT_DECLARATION_OBJECT_VAR_ARRAY semicolon
;

STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY
    :STRUCT_DECLARATION_OBJECT_ATRIB_ARRAY comma STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_OBJECT_VAR_ARRAY
    |final static id STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_OBJECT_VAR_ARRAY
    |static final id STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_OBJECT_VAR_ARRAY
    |final id STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_OBJECT_VAR_ARRAY
    |static id STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_OBJECT_VAR_ARRAY
    |id STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_OBJECT_VAR_ARRAY
    |id error id STATE_ASIGNATION_OBJECT_VAR_ARRAY {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |id STRUCT_EMPTY_DIMS_VAR_ARRAY error STATE_ASIGNATION_OBJECT_VAR_ARRAY {
        addError(this._$.first_line, this._$.first_column, $3, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STRUCT_DECLARATION_OBJECT_VAR_ARRAY
    :STRUCT_DECLARATION_OBJECT_VAR_ARRAY comma STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_OBJECT_VAR_ARRAY
    |final id STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_OBJECT_VAR_ARRAY
    |id STRUCT_EMPTY_DIMS_VAR_ARRAY id STATE_ASIGNATION_OBJECT_VAR_ARRAY
    |final error id STATE_ASIGNATION_OBJECT_VAR_ARRAY {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |id STRUCT_EMPTY_DIMS_VAR_ARRAY error STATE_ASIGNATION_OBJECT_VAR_ARRAY {
        addError(this._$.first_line, this._$.first_column, $3, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STATE_ASIGNATION_OBJECT_VAR_ARRAY
    :equal_mark ASIGNATION_OBJECT_VAR_ARRAY
    |
    |error ASIGNATION_OBJECT_VAR_ARRAY {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

ASIGNATION_OBJECT_VAR_ARRAY
    :STATE_VALUE
    |VALUE_ARRAY_STATE 
    |new id STRUCT_VALUE_DIMS_VAR_ARRAY
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
    :COND_IF_STATE STATE_ELSE
;

COND_IF_STATE
    :STRUCT_IF 
    |STRUCT_IF STATE_ELSEIF
;

STATE_ELSEIF
    :STATE_ELSEIF STRUCT_ELSEIF
    |STRUCT_ELSEIF
;

STATE_ELSE
    :STRUCT_ELSE
    |
;

STRUCT_IF
    :if parentheses_l STATE_VALUE parentheses_r keys_l CODE_FUNC_METOD keys_r

    |error STATE_VALUE parentheses_r keys_l CODE_FUNC_METOD keys_r {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |if error keys_l CODE_FUNC_METOD keys_r {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STRUCT_ELSEIF
    :elseif parentheses_l STATE_VALUE parentheses_r keys_l CODE_FUNC_METOD keys_r
    |elseif error keys_l CODE_FUNC_METOD keys_r {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STRUCT_ELSE
    :else keys_l CODE_FUNC_METOD keys_r
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
    :STRUCT_WHILE
;

STRUCT_WHILE
    :while parentheses_l STATE_VALUE parentheses_r keys_l CODE_FUNC_METOD keys_r
    |while error keys_l CODE_FUNC_METOD keys_r {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STATE_DO_WHILE
    :STRUCT_DO_WHILE
;

STRUCT_DO_WHILE
    :do keys_l CODE_FUNC_METOD keys_r while parentheses_l STATE_VALUE parentheses_r semicolon

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
    :STRUCT_FOR
;

STRUCT_FOR
    :for parentheses_l ASIG_STATE_FOR semicolon COND_STATE_FOR semicolon SENTENCE_STATE_FOR parentheses_r keys_l CODE_FUNC_METOD keys_r

    |error parentheses_l ASIG_STATE_FOR semicolon COND_STATE_FOR semicolon SENTENCE_STATE_FOR parentheses_r keys_l CODE_FUNC_METOD keys_r {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    // |for error keys_l CODE_FUNC_METOD keys_r
;

ASIG_STATE_FOR
    :DATATYPE_PRIMITIVE id equal_mark STATE_VALUE
    |id equal_mark STATE_VALUE
    |var id equal_mark STATE_VALUE
    |this id equal_mark STATE_VALUE

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
    :STATE_VALUE
;

SENTENCE_STATE_FOR
    :id equal_mark ASIGNATION_VAR
    |id plus_plus
    |id minus_minus
    //Cuando es un objeto
    |id period id equal_mark ASIGNATION_VAR 
    //CUANDO ES UN ARREGLO
    |id equal_mark VALUE_ARRAY_STATE 
    //PARA LOS TRIBUTOS
    |this id equal_mark ASIGNATION_VAR 
    |this id plus_plus 
    |this id minus_minus 
    //Cuando es un objeto
    |this id period id equal_mark ASIGNATION_VAR 
    //CUANDO ES UN ARREGLO
    |this id equal_mark VALUE_ARRAY_STATE 

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
    :STRUCT_SWITCH
;

STRUCT_SWITCH
    :switch parentheses_l STATE_VALUE parentheses_r keys_l CONTENT_SWITCH keys_r

    |switch error keys_l CONTENT_SWITCH keys_r {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |switch parentheses_l STATE_VALUE parentheses_r keys_l error keys_r {
        addError(this._$.first_line, this._$.first_column, $6, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

CONTENT_SWITCH
    :STRUCT_CASE
    |STRUCT_CASE default colon CODE_FUNC_METOD

    |error default colon CODE_FUNC_METOD {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STRUCT_CASE
    :STRUCT_CASE case VALUE_CASE colon CODE_FUNC_METOD
    |case VALUE_CASE colon CODE_FUNC_METOD

    |case error colon CODE_FUNC_METOD {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |error VALUE_CASE colon CODE_FUNC_METOD {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

VALUE_CASE
    :decimal_primitive
    |integer_primitive
    |char_primitive
    |string_primitive
    |true
    |false
;

/*
======================================================================================================================================
|SENTENCIA CONSTRUCTOR
======================================================================================================================================
*/

STATE_CONSTRUCTOR
    :id parentheses_l parentheses_r keys_l CODE_FUNC_METOD keys_r
    |id parentheses_l PARAMS_FUNC_METOD parentheses_r keys_l CODE_FUNC_METOD keys_r
    |public id parentheses_l parentheses_r keys_l CODE_FUNC_METOD keys_r
    |public id parentheses_l PARAMS_FUNC_METOD parentheses_r keys_l CODE_FUNC_METOD keys_r

    |error id parentheses_l PARAMS_FUNC_METOD parentheses_r keys_l CODE_FUNC_METOD keys_r {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |public id error keys_l CODE_FUNC_METOD keys_r {
        addError(this._$.first_line, this._$.first_column, $3, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STATE_SUPER
    :super parentheses_l parentheses_r semicolon
    |super parentheses_l STATE_PARAM_CALL_FUNCTION parentheses_r semicolon
    |super error semicolon {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

/*
======================================================================================================================================
|SENTENCIA FUNCTION
======================================================================================================================================
*/
STATE_CALL_FUNCTION
    :STRUCT_CALL_FUNCTION semicolon
;

STRUCT_CALL_FUNCTION
    :id parentheses_l parentheses_r
    |id parentheses_l STATE_PARAM_CALL_FUNCTION parentheses_r
    |this id parentheses_l parentheses_r
    |this id parentheses_l STATE_PARAM_CALL_FUNCTION parentheses_r

    //Para funciones de objetos
    |id period id parentheses_l parentheses_r
    |id period id parentheses_l STATE_PARAM_CALL_FUNCTION parentheses_r
    |this id period id parentheses_l parentheses_r
    |this id period id parentheses_l STATE_PARAM_CALL_FUNCTION parentheses_r

    |error period id parentheses_l STATE_PARAM_CALL_FUNCTION parentheses_r {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }

;

STATE_PARAM_CALL_FUNCTION
    :STATE_PARAM_CALL_FUNCTION comma STATE_VALUE
    |STATE_VALUE
;

STATE_FUNCTION
    :STRUCT_FUNCTION
    |override STRUCT_FUNCTION

    |public STRUCT_FUNCTION
    |override public STRUCT_FUNCTION

    |private STRUCT_FUNCTION
    |override private STRUCT_FUNCTION

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
    |DATATYPE_PRIMITIVE id parentheses_l PARAMS_FUNC_METOD parentheses_r keys_l CODE_FUNC_METOD keys_r
    |static DATATYPE_PRIMITIVE id parentheses_l parentheses_r keys_l CODE_FUNC_METOD keys_r
    |static DATATYPE_PRIMITIVE id parentheses_l PARAMS_FUNC_METOD parentheses_r keys_l CODE_FUNC_METOD keys_r
    
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
    |PARAMS_FUNC_METOD comma id id
    |PARAMS_FUNC_METOD comma DATATYPE_PRIMITIVE STRUCT_EMPTY_DIMS_VAR_ARRAY id
    |PARAMS_FUNC_METOD comma id STRUCT_EMPTY_DIMS_VAR_ARRAY id
    |DATATYPE_PRIMITIVE id
    |id id
    |DATATYPE_PRIMITIVE STRUCT_EMPTY_DIMS_VAR_ARRAY id
    |id STRUCT_EMPTY_DIMS_VAR_ARRAY id
;
/*
======================================================================================================================================
|SENTENCIA METODO
======================================================================================================================================
*/

STATE_METOD
    :STRUCT_METOD
    |override STRUCT_METOD

    |public STRUCT_METOD
    |override public STRUCT_METOD

    |private STRUCT_METOD
    |override private STRUCT_METOD
;

STRUCT_METOD
    :void id parentheses_l parentheses_r keys_l CODE_FUNC_METOD keys_r
    |void id parentheses_l PARAMS_FUNC_METOD parentheses_r keys_l CODE_FUNC_METOD keys_r
    |static void id parentheses_l parentheses_r keys_l CODE_FUNC_METOD keys_r
    |static void id parentheses_l PARAMS_FUNC_METOD parentheses_r keys_l CODE_FUNC_METOD keys_r

    |void id error keys_l CODE_FUNC_METOD keys_r {
        addError(this._$.first_line, this._$.first_column, $3, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
    |static void id error keys_l CODE_FUNC_METOD keys_r {
        addError(this._$.first_line, this._$.first_column, $4, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;


CODE_FUNC_METOD
    :CODE_FUNC_METOD STATE_DECLARATION_VAR
    |CODE_FUNC_METOD STATE_DECLARATION_VAR_ARRAY 
    |CODE_FUNC_METOD STATE_DECLARATION_OBJECT_VAR
    |CODE_FUNC_METOD STATE_DECLARATION_OBJECT_VAR_ARRAY
    |CODE_FUNC_METOD STRUCT_ASIGNATION_VAR
    |CODE_FUNC_METOD STRUCT_ASIGNATION_VAR_ARRAY
    |CODE_FUNC_METOD STATE_COMMENT
    |CODE_FUNC_METOD STRUCT_VAR
    |CODE_FUNC_METOD STATE_CALL_FUNCTION
    |CODE_FUNC_METOD STATE_COND_IF_ELSEIF_ELSE
    |CODE_FUNC_METOD STATE_SWITCH
    |CODE_FUNC_METOD STATE_FOR
    |CODE_FUNC_METOD STATE_WHILE
    |CODE_FUNC_METOD STATE_DO_WHILE
    |CODE_FUNC_METOD STATE_MATH
    |CODE_FUNC_METOD STATE_BREAK
    |CODE_FUNC_METOD STATE_CONTINUE
    |CODE_FUNC_METOD STATE_PRINTS
    |CODE_FUNC_METOD STATE_RETURN
    |CODE_FUNC_METOD STATE_TOSTRING
    // |CODE_FUNC_METOD 
    // |CODE_FUNC_METOD 
    // |CODE_FUNC_METOD 
    |
;

/*
======================================================================================================================================
|SENTENCIAS MATH
======================================================================================================================================
*/
STATE_MATH
    :STRUCT_CALL_FUNC_MATH semicolon
    |error semicolon {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STRUCT_CALL_FUNC_MATH
    // Math.abs(double a)
    :math_abs parentheses_l STATE_VALUE parentheses_r
    // Math.ceil(double a)
    |math_ceil parentheses_l STATE_VALUE parentheses_r
    // Math.floor(double a)
    |math_floor parentheses_l STATE_VALUE parentheses_r
    // Math.round(double a)
    |math_round parentheses_l STATE_VALUE parentheses_r
    // Math.max(double a, double b)
    |math_max parentheses_l STATE_VALUE comma STATE_VALUE parentheses_r
    // Math.min(double a, double b)
    |math_min parentheses_l STATE_VALUE comma STATE_VALUE parentheses_r
    // Math.pow(double base, double exponente)
    |math_pow parentheses_l STATE_VALUE comma STATE_VALUE parentheses_r
    // Math.sqrt(double a)
    |math_sqrt parentheses_l STATE_VALUE parentheses_r
    // Math.random()
    |math_random parentheses_l parentheses_r
    // Math.toRadians(double grados)
    |math_toradians parentheses_l STATE_VALUE parentheses_r
    // Math.acos(double a)
    |math_acos parentheses_l STATE_VALUE parentheses_r
    // Math.sin(double a)
    |math_sin parentheses_l STATE_VALUE parentheses_r
    // Math.atan(double a)
    |math_atan parentheses_l STATE_VALUE parentheses_r
    // Math.exp(double a)
    |math_exp parentheses_l STATE_VALUE parentheses_r
;


/*
======================================================================================================================================
|llamadas y otros
======================================================================================================================================
*/

STATE_BREAK
    :break semicolon
;


STATE_CONTINUE
    :continue semicolon
;

STATE_RETURN
    :return STATE_VALUE semicolon
;

STRUCT_CALL_ARRAY
    :id STRUCT_VALUE_DIMS_VAR_ARRAY
;

STRUCT_CALL_OBJECT_VALUE
    :id period id
    |this id period id

    |error period id {
        addError(this._$.first_line, this._$.first_column, $1, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STATE_PRINTS
    :STRUCT_SOUT semicolon
;

STRUCT_SOUT
    :printf parentheses_l STATE_VALUE parentheses_r
    |println parentheses_l STATE_VALUE parentheses_r
    |printf parentheses_l parentheses_r
    |println parentheses_l parentheses_r

    |println error parentheses_r {
        addError(this._$.first_line, this._$.first_column, $2, "Error en la Expresion", ErrorType.SYNTACTIC);
    }
;

STATE_TOSTRING
    :STRUCT_TOSTRING semicolon
;

STRUCT_TOSTRING
    :tostring parentheses_l parentheses_r
    |this tostring parentheses_l parentheses_r
    |id period tostring parentheses_l parentheses_r
    |this id period tostring parentheses_l parentheses_r

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