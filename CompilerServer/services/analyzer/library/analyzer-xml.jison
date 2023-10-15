/*
Equivale al parseCode de CUP
Codigo para el parser
Basicamente aqui van los imports, funciones, metodos, variables
BloqueI:
%{

%}
BloqueF:
*/

%{
    const { FileProject } = require("./FileProject.js");
    const { Project } = require("./Project.js");
    const { Folder } = require("./Folder.js");
    const { Library } = require("./Library.js");

    var resultado;
    // var yylloc;

    
%}


/* Directivas Lexicas y Expresiones regulares | Tokens
Aqui van todo el analisis lexico 
Basicamente aqui va las expresiones regulares, los simbolos terminales
Y tambien podemos meter codigo dentro

BloqueI:
%lex
//directivas -> options. ejemplo:
%options case-sensitive
%options yylineno  //Fila
%location //Columna

//ejemplo expresion regular
<NOMBRE>    [expresion_regular]
NUM         [0-9]+
MAS         "+"
%%

/lex
BloqueF:

*/
%lex
//Fila
%options yylineno
//Columna  
%location             

%x INITIAL
%%
// Letra			[a-zA-Z][a-zA-Z0-9]*
// Digito          [0-9]
// Numero          {Digito} {Digito}*


// <INITIAL>{
\s+                     /* skip whitespace */
<INITIAL>"<libreria>"               {return 'libreria_a';}
<INITIAL>"</libreria>"              {return 'libreria_c';}
<INITIAL>"<proyecto"                {return 'proyecto_a';}
<INITIAL>"\""[^\"]*"\""		        {yytext = yytext.substr(1,yyleng-2); return 'cadena'; }
<INITIAL>"nombre="                  {return 'nombre';}
<INITIAL>"<carpeta"               {return 'folder_a';}
<INITIAL>"</carpeta>"              {return 'folder_c';}
<INITIAL>"<archivo"                 {return 'archivo_a';}
<INITIAL>"path="                    {return 'path';}
<INITIAL>"</archivo>"               {return 'archivo_c';}
<INITIAL>"</proyecto>"              {return 'proyecto_c';}
<INITIAL>">"                        {return 'cierre';}
<INITIAL>([a-zA-Z0-9_-])+([.][a-zA-Z0-9_-]+)*   {return 'id';}
<<EOF>>                             {return 'EOF';}
.                                   { console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); 
                                        console.log(yylloc);
                                    }
// .                                   {return 'INVALID';}


// }
/lex

/* Asociación de operadores y precedencia */
// %left MAS MENOS
// %left POR DIVIDIDO

%start ini

%%


ini: 
    LIBRERIA EOF { /*console.log($1);*/ resultado = $1; return $1; }
;

LIBRERIA:
    libreria_a PROYECTOS libreria_c 
        {
            $$ = new Library($2);
        }
    | error {
        $$ = new Library([]);
    }
;

PROYECTOS
    :PROYECTOS proyecto_a nombre cadena cierre CONTENT proyecto_c 
        {
            const listProjects = $1;
            listProjects.push(new Project($4, $6));
            $$ = listProjects;
        }
    |   { 
            $$ = new Array();
        }
    | error proyecto_c { 
        console.log("Error sintácticoProject: " + $1);
        console.log("ErrorProject: " + $0);
        yy.errorSkips = 1;
        $$ = new Array();
        }
;

CONTENT: CONTENT ARCHIVO {
            const contentF = $1;
            if($2){
                contentF.push($2);
                console.log(contentF)
            }
            $$ = contentF;
        }
        |CONTENT CARPETA {
            const contentC = $1;
            if($2){
                // console.log($1)
                contentC.push($2);
            }
            $$ = contentC;
        }
        | { $$ = new Array(); };


CARPETA
    :folder_a nombre cadena cierre CONTENT folder_c 
        {
            $$ = new Folder($3, $5);
        }
    | error folder_c {
        console.log("Error sintácticoFolder: " + $1);
        console.log("ErrorFolder: " + $0);
        yy.errorSkips = 1;
        $$ = null;
    }
;

ARCHIVO
    :archivo_a path cadena cierre id archivo_c 
        {
            $$ = new FileProject($3, $5);
        }
    | error archivo_c {
        console.log("Error sintácticoArchivo: " + $1);
        console.log("ErrorArchivo: " + $0);
        yy.errorSkips = 1;
        $$ = null;
    }
;