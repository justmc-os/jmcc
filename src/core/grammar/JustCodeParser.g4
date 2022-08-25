parser grammar JustCodeParser;

options {
	tokenVocab = JustCodeLexer;
}

file: anysemi* importHeader* statements EOF;

importHeader: IMPORT string anysemi+;

// ---------------------- Statements ----------------------

statements: anysemi* (statement (anysemi+ statement?)*)?;

statement:
	declaration
	| expression
	| ifStatement
	| lambdaStatement
	| breakStatement;

declaration:
	functionDeclaration
	| eventDeclaration
	| variableDeclaration;

functionDeclaration:
	(FUNCTION | PROCESS) NL* identifier NL* functionValueParameters NL* block;
eventDeclaration:
	EVENT NL* LANGLE NL* identifier RANGLE NL* block;

functionValueParameters:
	LPAREN (
		functionValueParameter (COMMA functionValueParameter)* COMMA?
	)? RPAREN;
functionValueParameter: identifier (ASSIGNMENT expression)?;

variableDeclaration:
	variableModifier? VAR NL* identifier NL* ASSIGNMENT NL* expression;

variableModifier: SAVE | GAME | INLINE NL*;

block: LCURL statements RCURL;

ifStatement:
	IF NL* NOT? NL* LPAREN expression RPAREN NL* block? SEMICOLON? (
		NL* ELSE NL* block?
	)?;

lambdaStatement:
	expression LCURL lambdaArguments? ARROW? statements RCURL;
lambdaArguments: identifier (COMMA identifier)*;

breakStatement: BREAK;

// ----------------------- Literals -----------------------

literalConstant: BooleanLiteral | NumberLiteral | string;

listLiteral:
	LSQUARE (expression (COMMA expression)* COMMA?)? RSQUARE;

string: stringLiteral | sqStringLiteral;

stringLiteral:
	QUOTE_OPEN (stringContent | stringExpression)* QUOTE_CLOSE;

stringContent: StringText | StringReference;

stringExpression: StringExpressionStart expression RCURL;

sqStringLiteral:
	SINGLE_QUOTE_OPEN (sqStringContent | sqStringExpression)* SINGLE_QUOTE_CLOSE;

sqStringContent: SQStringText | SQStringReference;

sqStringExpression: SQStringExpressionStart expression RCURL;

backtickIdentifierLiteral:
	BACKTICK_OPEN (
		backtickIdentifierContent
		| backtickIdentifierExpression
	)* BACKTICK_CLOSE;

backtickIdentifierContent:
	BacktickIdentifierText
	| BacktickReference;
backtickIdentifierExpression:
	BacktickIdentifierExpressionStart expression RCURL;

identifier: backtickIdentifierLiteral | Identifier;

// ---------------------- Expressions ---------------------

expression:
	additiveExpression (assignmentOperator additiveExpression)*;

additiveExpression:
	multiplicativeExpression (
		additiveOperator NL* multiplicativeExpression
	)*;

multiplicativeExpression:
	prefixUnaryExpression (
		multiplicativeOperator NL* prefixUnaryExpression
	)*;

prefixUnaryExpression: unaryOperator? postfixUnaryExpression;

postfixUnaryExpression:
	postfixUnaryNavigatedExpression postfixUnaryOperator?;

postfixUnaryNavigatedExpression:
	atomicExpression (
		NL* (DOT | DOUBLE_COLON) NL* identifierWithSelection
	)?;

atomicExpression:
	parenthesizedExpression
	| literalConstant
	| listLiteral
	| identifier;

parenthesizedExpression: LPAREN expression RPAREN;

// ------------------------- Calls ------------------------

identifierWithSelection:
	identifier (LANGLE NL* identifier NL* RANGLE)?;
callSuffix:
	LPAREN (valueArgument (COMMA valueArgument)* COMMA?)? RPAREN;
valueArgument: (identifier NL* ASSIGNMENT NL*)? expression;

arrayAccess: LSQUARE expression RSQUARE;

// ----------------------- Operators ----------------------

postfixUnaryOperator: callSuffix | unaryOperator | arrayAccess;
unaryOperator: INCR | DECR;
multiplicativeOperator: MULT | DIV | MOD;
additiveOperator: ADD | SUB;
assignmentOperator:
	ASSIGNMENT
	| ADD_ASSIGNMENT
	| SUB_ASSIGNMENT
	| MULT_ASSIGNMENT
	| DIV_ASSIGNMENT
	| MOD_ASSIGNMENT;

anysemi: NL | SEMICOLON;