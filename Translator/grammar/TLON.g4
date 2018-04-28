grammar TLON;

parse
 : from_input | from_file
 ;

from_input
 : stat[1] NEWLINE
 ;

from_file
 : (stat[1]|NEWLINE)* EOF
 ;

stat[Integer depth]
 : simple_stat
 | compound_stat[depth]
 ;

compound_stat[Integer depth]
 : if_stat[depth]
 | while_stat[depth]
 | for_stat[depth]
 | funcion[depth]
 ;

simple_stat
 : assignment
 | log
 | importar
 | retornar
 | atom NEWLINE
 | OTHER
 ;

assignment
 : variable ASSIGN (assignment|expr)
 ;

if_stat[Integer depth]
 : IF condition_block[depth] (ELSE IF condition_block[depth])* (ELSE stat_block[depth])?
 ;

while_stat[Integer depth]
 : WHILE expr stat_block[depth]
 ;

for_stat[Integer depth]
 : FOR ID IN expr stat_block[depth]
 ;

log
 : LOG OPAR expr CPAR
 ;

funcion[Integer depth]
 : FUNCION ID OPAR (parametro (COMMA parametro)*)? CPAR (NEWLINE|stat[depth+1])* END
 ;

importar
 : IMPORT ID (POINT ID)*
 | FROM ID IMPORT ID
 ;

retornar
 : RETORNO OPAR expr CPAR NEWLINE
 ;

condition_block[Integer depth]
 : expr NEWLINE? stat_block[depth]
 ;

stat_block[Integer depth]
 : OBRACE (stat[depth+1]|NEWLINE)* CBRACE
 | stat[depth+1] NEWLINE
 ;

array
 : OKEY (expr (COMMA expr)*)? CKEY
 | OKEY start=expr POINTS (step=expr POINTS)? end=expr CKEY
 ;

accessarray
 : variable OKEY expr CKEY
 ;

variable
 : ID (POINT ID)* (OPAR (expr (COMMA expr)*)? CPAR)?
 | ID (POINT ID)* OKEY expr CKEY
 ; 

parametro
 : ID (ASSIGN expr)?
 ;

expr
 : <assoc=right>left=expr POW right=expr        #powExpr
 | MINUS expr                                   #unaryMinusExpr
 | NOT expr                                     #notExpr
 | left=expr op=(MULT|DIV|MOD) right=expr       #multiplicationExpr
 | left=expr op=(PLUS|MINUS) right=expr         #additiveExpr
 | left=expr op=(LTEQ|GTEQ|LT|GT) right=expr    #relationalExpr
 | left=expr op=(EQ|NEQ) right=expr             #equalityExpr
 | left=expr AND right=expr                     #andExpr
 | left=expr OR right=expr                      #orExpr
 | OPAR expr CPAR 						        #parExpr
 | atom                                         #atomExpr
 ;

atom
 : (INT|FLOAT)  #numberAtom
 | (TRUE|FALSE) #booleanAtom
 | STRING       #stringAtom
 | array		#arrayAtom
 | objeto		#objetoAtom
 | accessarray  #accessToarray
 | variable		#accessVariable
 | NIL          #nilAtom
 ;

objeto
 : OBRACE (keyvalue (COMMA keyvalue)*)? CBRACE
 ;

keyvalue
 : ID POINTS expr
 ;

OR : '||';
AND : '&&';
EQ : '==';
NEQ : '!=';
GT : '>';
LT : '<';
GTEQ : '>=';
LTEQ : '<=';
PLUS : '+';
MINUS : '-';
MULT : '*';
DIV : '/';
MOD : '%';
POW : '^';
NOT : '!';

ASSIGN : '=';
OPAR : '(';
CPAR : ')';
OBRACE : '{';
CBRACE : '}';
OKEY : '[';
CKEY : ']';
COMMA : ',';
POINTS: ':';

TRUE : 'true';
FALSE : 'false';
NIL : 'nil';
IF : 'if';
ELSE : 'else';
WHILE : 'while';
LOG : 'log';
FOR : 'for';
IN : 'in';
FUNCION: 'funcion';
END: 'end';
RETORNO: 'retorno';
IMPORT: 'importar';
FROM: 'desde';
ASTERISC: 'todo';
POINT: '.';

ID
 : [a-zA-Z_] [a-zA-Z_0-9]*
 ;

INT
 : [0-9]+
 ;

FLOAT
 : [0-9]+ '.' [0-9]*
 | '.' [0-9]+
 ;

STRING
 : '"' (~["\r\n] | '""')* '"'
 ;
COMMENT
 : '#' ~[\r\n]* -> skip
 ;
SPACE
 : [ \t\r] -> skip
 ;
NEWLINE
 : [\n]
 ;
OTHER
 : .
 ;