%{
    var resultado;
    let listErrors = new Array();
    let pilaAmbito = new Array();

    const { PositionToken } = require('src/app/core/models/mlg/error/position-token.ts');
    const { ErrorGram } = require("src/app/core/models/mlg/error/error-gramm.ts");
    // const { TreeAST } = require("src/app/core/models/mlg/AST/tree-ast.ts");


    // //Imports del AST
    // //Expressions
    // const { DataType, Types } = require("src/app/core/models/mlg/Utils/data-type.ts");
    // const { ArithTypes } = require("src/app/core/models/mlg/Utils/arith-type.ts");
    // const { LogicalTypes } = require("src/app/core/models/mlg/Utils/logical-type.ts");
    // const { RatioTypes } = require("src/app/core/models/mlg/Utils/rational-type.ts");
    // // const { ArrayExp } = require("src/app/core/models/mlg/Expressions/ArrayExp");
    // const { Break } = require("src/app/core/models/mlg/Expressions/break.ts");
    // const { Continue } = require("src/app/core/models/mlg/Expressions/continue.ts");
    // const { Identifier } = require("src/app/core/models/mlg/Expressions/identifier.ts");
    // // const { InputCall } = require("src/app/core/models/mlg/Expressions/InputCall");
    // const { OperationArithmetic } = require("src/app/core/models/mlg/Expressions/operation-arithmetic.ts");
    // // const { OperationLogical } = require("src/app/core/models/mlg/Expressions/OperationLogical");
    // const { OperationRational } = require("src/app/core/models/mlg/Expressions/operation-rational.ts");
    // const { Primitive } = require("src/app/core/models/mlg/Expressions/primitive.ts");
    // const { Return } = require("src/app/core/models/mlg/Expressions/return.ts");
    // //Instructions
    // const { Declaration } = require("src/app/core/models/mlg/Instructions/declaration.ts");
    // const { ForInst, Range } = require("src/app/core/models/mlg/Instructions/for-inst.ts");
    // const { FunctionInst } = require("src/app/core/models/mlg/Instructions/function-inst.ts");
    // const { IfInst, ElIfInst, ElseInst } = require("src/app/core/models/mlg/Instructions/if-inst.ts");
    // const { InputCall, TypeInput } = require("src/app/core/models/mlg/Instructions/input-call.ts");
    // const { Print } = require("src/app/core/models/mlg/Instructions/print.ts");
    // const { WhileInst } = require("src/app/core/models/mlg/Instructions/while-inst.ts");
    
    // const { Gramm } = require("src/app/core/models/mlg/gramm.ts");

    // function addError(row, column, typeError, tokenS, description){
    //     let positionToken = new PositionToken(row, column);
    //     let errorGram = new ErrorGram(positionToken, typeError, tokenS, description);
    //     console.log(errorGram);
    //     console.log(`Error>> Linea: ${row}, Columna: ${column}, TipoError: ${typeError}, Token: ${tokenS}, Descripcion: ${description}`);
        
    //     listErrors.push(errorGram);
    // }

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

    //para la identacion
    var estadoIdent = false;
    var contadorAmbito=0, ambitoActual=0;

    function iniciar(){
        pilaAmbito.push(0);
    }

    function verificarIndentacion(value, size){
        if(!(pilaAmbito.length==0)){
            var ambito = pilaAmbito[pilaAmbito.length - 1]
            if((ambito+1)==size){
                pilaAmbito.push(ambito+1);
                // console.log(value.substr(1,value.length),'INDENT:',(ambito+1));
                return 'indent';
            }else if((ambito-1)==size){
                pilaAmbito.push(ambito-1);
                // console.log(value.substr(1,value.length),'DEDENT:',(ambito-1));
                return 'dedent';
            }else if(ambito==size){
                // console.log(value.substr(1,value.length),'SALTO_:',ambito);
                return null;
            }else{
                // console.log(value.substr(1,value.length),'ERROR DE identacion');
                // return ' ';
                // return null;
            }
        }else{
            iniciar();
            return verificarIndentacion(value, size);
        }
    }

    function getTabs(texto, size){
        let contador = 0;
        let contadorS = 0;
        // console.log('<',texto,'> size:',size);
        for(let i = 0; i<size; i++){
            let caracter = texto.substr(i,1);
            // console.log('char:',caracter,'| tamanio',caracter.length);
            switch(caracter){
                case '\t':
                // case '\n\t':
                    // console.log('Tchar:|'+caracter+'| t');
                    contador++;
                    break;
                case ' ':
                // case '  ':
                // case '    ':
                // case '      ':
                case '\b':
                // case '':
                    // console.log('Tchar:|'+caracter+'| s');
                    contadorS++;
                    break;
                case '\n':
                case '\r':
                    // console.log('Tchar:|'+caracter+'| n');
                    // contador++;
                    break;
                    default:
                    // console.log('Tchar:|'+caracter+'| l');
            }
            if(contadorS==4){
                contador++;
                contadorS = 0;
            }
        }
        // console.log('Contador:',contador);
        return contador;
    }
    
%}


%lex

%options yylineno          
%locations  


// %s IMPORT STPY STJV STCPP

%s INITIAL IMPORT PYTHON JAVA CPP

id              [a-zA-Z]([a-zA-Z_]|[0-9])*
Letra			[a-zA-Z][a-zA-Z0-9]*
Digito          [0-9]
Numero          {Digito} {Digito}*
tab             ([\t])
tabspc          ("    "|"\b\b\b\b")
tababs          ([\n]+({tabspc}+|{tab}+)?)

%%

<PYTHON>{tababs}                                                    { var sim = verificarIndentacion(yytext, getTabs(yytext, yyleng) ); if(sim!=null){return sim;}else{/*IGNORAR*/}}
// <PYTHON>[ \r\b\f\t]+                     /* skip whitespace */


//bloques
<INITIAL>"%%PY"                                                     { resetData(); this.pushState('PYTHON'); paint("<INTIAL>"+yytext); return 'block_py';}
<IMPORT>"%%PY"                                                      { this.popState(); this.pushState('PYTHON'); paint("<IMPORT>"+yytext); return 'block_py';}
<INITIAL>"%%JAVA"                                                   { resetData(); this.pushState('JAVA'); paint("<INTIAL>"+yytext); return 'block_java';}
<PYTHON>"%%JAVA"                                                    { this.popState(); this.pushState('JAVA'); paint("<PYTHON>"+yytext); return 'block_java';}
<INITIAL>"%%PROGRAMA"                                               { resetData(); this.pushState('CPP'); paint("<INTIAL>"+yytext); return 'block_cpp';}
<JAVA>"%%PROGRAMA"                                                  { this.popState(); this.pushState('CPP'); paint("<JAVA>"+yytext); return 'block_cpp';}

//Para la seccion de paquetes
<INITIAL>"paquete"                                                  { resetData(); this.pushState('IMPORT'); return 'paquete';}
<IMPORT>"paquete"                                                   { return 'paquete';}
<IMPORT>{id}                                                        { return 'id';}
<IMPORT>"."                                                         { return 'punto';}
<IMPORT>"*"                                                         { return 'asterisco';}

//Para la seccion de python
<PYTHON>"def"                                                       { return 'def';}
<PYTHON>"return"                                                    { return 'return';}

<PYTHON>"and"                                                       { return 'and';}
<PYTHON>"or"                                                        { return 'or';}
<PYTHON>"not"                                                       { return 'not';}

<PYTHON>"input"                                                     { return 'input';}

<PYTHON>"if"                                                        { return 'if';}
<PYTHON>"elif"                                                      { return 'elif';}
<PYTHON>"else"                                                      { return 'else';}

//ciclos python
<PYTHON>"for"                                                       { return 'for';}
<PYTHON>"in"                                                        { return 'in';}
<PYTHON>"range"                                                     { return 'range';}
<PYTHON>"while"                                                     { return 'while';}
//pyton no tiene do while
<PYTHON>"break"                                                     { return 'break';}
<PYTHON>"continue"                                                  { return 'continue';}

//Para la seccion de java
//Para la seccion de cpp

//GENERAL
//Comentarios
<PYTHON>[/][/][/]*[^\n]*[\n]?                                       { paint('comentario_simple: '+yytext); return 'comentario_simple';}
<PYTHON>[/*][*][^*]*[*]+([^/*][^*]*[*]+)*[/]                        { paint('comentario_bloque: '+yytext); return 'comentario_bloque';}
<INITIAL,IMPORT,JAVA,CPP>[/][/][/]*[^\n]*[\n]?                      { paint('comentario_simple: '+yytext); return 'comentario_simple';}
<INITIAL,IMPORT,JAVA,CPP>[/*][*][^*]*[*]+([^/*][^*]*[*]+)*[/]       { paint('comentario_bloque: '+yytext); return 'comentario_bloque';}

<PYTHON,JAVA,CPP>"+"                                                { return "mas"; }
<PYTHON,JAVA,CPP>"-"                                                { return "menos"; }
<PYTHON,JAVA,CPP>"*"                                                { return "por"; }
<PYTHON,JAVA,CPP>"/"                                                { return "div"; }
<PYTHON,JAVA,CPP>"%"                                                { return "mod"; }
<PYTHON,JAVA,CPP>"^"                                                { return "pot"; }
<PYTHON,JAVA,CPP>"^"                                                { return "pot"; }

<PYTHON,JAVA>"print"                                                { return 'print';}
<PYTHON,JAVA>"println"                                              { return 'println';}
<CPP>"<"[^\"]*">"	                                                {paint(yytext); paint("Estado actual: "+this.topState()); return 'library';}

<PYTHON,JAVA,CPP>">"                                                { return 'mayor_q';}
<PYTHON,JAVA,CPP>"<"                                                { return 'menor_q';}
<PYTHON,JAVA,CPP>"=="                                               { return 'igual_igual';}
<PYTHON,JAVA,CPP>">="                                               { return 'mayor_igual';}
<PYTHON,JAVA,CPP>"<="                                               { return 'menor_igual';}
<PYTHON,JAVA,CPP>"!="                                               { return 'diferente';}

//signos o simbolos reservados
<PYTHON,JAVA,CPP>":"                                                { return 'dos_puntos';}
<PYTHON,JAVA,CPP>","                                                { return 'coma';}
<PYTHON,JAVA,CPP>";"                                                { return 'punto_coma';}
<PYTHON,JAVA,CPP>"("                                                { return 'par_a';}
<PYTHON,JAVA,CPP>")"                                                { return 'par_c';}
<PYTHON,JAVA,CPP>"["                                                { return 'cor_a';}
<PYTHON,JAVA,CPP>"]"                                                { return 'cor_c';}
<PYTHON,JAVA,CPP>"="                                                { return 'igual';}

<PYTHON,JAVA,CPP>"true"                                             { return 'true';}
<PYTHON,JAVA,CPP>"false"                                            { return 'false';}
// <PYTHON,JAVA,CPP>""         { return ""; }
// <PYTHON,JAVA,CPP>""         { return ""; }



<PYTHON,JAVA,CPP>\"[^\"]*\"			                                {paint(yytext); yytext = yytext.substr(0,yyleng-0); return 'cadena'; }
<PYTHON,JAVA,CPP>\'[^\']?\'			                                {paint(yytext); yytext = yytext.substr(0,yyleng-0); return 'caracter'; }
<PYTHON,JAVA,CPP>{Numero}  	                                        {paint('entero: '+yytext); return 'entero';}
<PYTHON,JAVA,CPP>{Numero}("."){Numero} 	                            {paint('decimal: '+yytext); return 'decimal';}
<PYTHON,JAVA,CPP>{id}                                               { return 'id';}


<CPP>"#include"	                                                    {paint(yytext); paint("Estado actual: "+this.topState()); return 'include';}

<PYTHON>[ \r\b\f\t]+                                                /* skip whitespace */
<INITIAL,IMPORT,JAVA,CPP>\s+                                        /* skip whitespace */
<<EOF>>                                                             { console.log(yytext); return 'EOF';}
.                                                                   { console.log(yytext); return 'INVALID';}

/lex

/* Asociación de operadores y precedencia */
//presedencia de menor a mayor
//Precediencia operadores logicos
%left 'or'
%left 'and'
%right 'not'

//Presedencia operadores matematicos
%left 'igual_igual' 'diferente' 'mayor_q' 'menor_q' 'mayor_igual' 'menor_igual'
%left 'mas' 'menos'
%left 'mod' 'div' 'por'
%left 'pot'
%left UMINUS
// %right 'par_a' 'par_c'
// %right 'PY_OPERACION_RACIONAL'
// %right 'PY_OPERACION_ARITMETICA'
// %left MAS MENOS
// %left POR DIVIDIDO

%start ini

%%

ini: 
    BLOQUES_CODE EOF { /*console.log($1);*/ /*resultado = $1;*/ /*return $1;*/ return new PositionToken(1,25);}
;

BLOQUE_COMMENTS:
     comentario_simple
    |comentario_bloque
;

BLOQUES_CODE:
     BLOQUES_PAQUETES BLOQUES_PYTHON BLOQUES_JAVA BLOQUES_CPP
;

/*
======================================================================================================================================
|BLOQUE DE CODIGO DE PAQUETES
======================================================================================================================================
*/
BLOQUES_PAQUETES:
     PAQUETE_STATE BLOQUES_PAQUETES { $$ = []; }
    |BLOQUE_COMMENTS BLOQUES_PAQUETES { $$ = []; }
    | { $$ = []; }
;

PAQUETE_STATE:
     PAQUETE_PADRE {}
    |PAQUETE_PADRE punto asterisco
;

PAQUETE_PADRE:
     PAQUETE_PADRE punto id
    |paquete id
    // |error
;

/*
======================================================================================================================================
|BLOQUE DE CODIGO DE PYTHON
======================================================================================================================================
*/

BLOQUES_PYTHON:
     block_py { $$ = $1; }
    | { $$ = []; }
;

PY_BLANCOS:
     comentario_bloque
    |comentario_simple
    |indent
    |dedent
;

STATE_INDENT:
     indent
;

STATE_DEDENT:
     dedent
;

CODIGO_PY:
     { $$ = []; }
;



/*
======================================================================================================================================
|BLOQUE DE CODIGO DE JAVA
======================================================================================================================================
*/

BLOQUES_JAVA:
     block_java { $$ = []; }
    | { $$ = []; }
;

// CODE_JAVA
//     :CODE_JAVA JV_CLASES
//     |
// ;


/*
======================================================================================================================================
|BLOQUE DE CODIGO DE CPP
======================================================================================================================================
*/

BLOQUES_CPP:
     block_cpp CODE_PROGRAMA { $$ = []; }
    | { $$ = []; }
;

CODE_PROGRAMA:
     CODE_PROGRAMA BLOQUE_COMMENTS
    |CODE_PROGRAMA INCLUDE_LIB
    |
;

INCLUDE_LIB: 
     include library
    |include cadena
;

