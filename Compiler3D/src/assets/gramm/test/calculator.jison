%lex
%%
"+"       {console.log(yytext); return 'ADD'};
"-"       {console.log(yytext); return 'SUBTRACT'};
"*"       {console.log(yytext); return 'MULTIPLY'};
"/"       {console.log(yytext); return 'DIVIDE'};
[0-9]+    {console.log(yytext); return 'NUMBER'};
[ \t\n]                 /* skip whitespace */
<<EOF>> return 'EOF';
.         return 'INVALID';
/lex

/* Definir precedencia de operadores */
%left ADD SUBTRACT
%left MULTIPLY DIVIDE

%start expressions

%%

expressions
  : expr EOF
  ;

expr
  : NUMBER
  | expr ADD expr
  | expr SUBTRACT expr
  | expr MULTIPLY expr
  | expr DIVIDE expr
  ;
