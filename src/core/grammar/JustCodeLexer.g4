lexer grammar JustCodeLexer;

import UnicodeClasses;

// ----------------------- Skipped ------------------------

// Multiline comments
DelimitedComment:
	'/*' (DelimitedComment | .)*? '*/' -> channel(HIDDEN);

LineComment: '//' ~[\u000A\u000D]* -> channel(HIDDEN);

// Whitespace
WS: [\u0020\u0009\u000C] -> channel(HIDDEN);

// Newline
NL: '\u000A' | '\u000D' '\u000A';

// ---------------------- Separators ----------------------

DOT: '.';
COMMA: ',';
COLON: ':';
DOUBLE_COLON: '::';
SEMICOLON: ';';
LPAREN: '(' -> pushMode(Inside);
RPAREN: ')';
LSQUARE: '[' -> pushMode(Inside);
RSQUARE: ']';
LCURL: '{';
RCURL: '}';
ARROW: '->';
LANGLE: '<';
RANGLE: '>';

// ---------------------- Operators -----------------------

MULT: '*';
MOD: '%';
DIV: '/';
ADD: '+';
SUB: '-';
INCR: '++';
DECR: '--';
ASSIGNMENT: '=';
ADD_ASSIGNMENT: '+=';
SUB_ASSIGNMENT: '-=';
MULT_ASSIGNMENT: '*=';
DIV_ASSIGNMENT: '/=';
MOD_ASSIGNMENT: '%=';

// ----------------------- Keywords -----------------------

FUNCTION: 'function';
PROCESS: 'process';
INLINE: 'inline';
IMPORT: 'import';
IF: 'if';
NOT: 'not';
ELSE: 'else';
EVENT: 'event';
BREAK: 'break';
VAR: 'var';
GAME: 'game';
SAVE: 'save';

QUOTE_OPEN: '"' -> pushMode(String);
SINGLE_QUOTE_OPEN: '\'' -> pushMode(SQString);
BACKTICK_OPEN: '`' -> pushMode(IdentifierInBackticks);

// ----------------------- Literals -----------------------

BooleanLiteral: 'true' | 'false';

Identifier: IdentifierLiteral;
IdentifierLiteral: (Letter | '_' | '%') (
		Letter
		| '_'
		| '%'
		| Digit
	)*;
DollarIdentifier: '$' Identifier;

fragment Letter:
	UNICODE_CLASS_LL
	| UNICODE_CLASS_LM
	| UNICODE_CLASS_LO
	| UNICODE_CLASS_LT
	| UNICODE_CLASS_LU
	| UNICODE_CLASS_NL;

NumberLiteral: '-'? (IntegerLiteral | FloatLiteral);
IntegerLiteral: '0' | (DigitNoZero Digit*);
FloatLiteral: ('0' | DigitNoZero Digit*)? '.' Digit+;

fragment Digit: UNICODE_CLASS_ND;
fragment DigitNoZero: UNICODE_CLASS_ND_NoZeros;

// ----------------- Backtick identifier ------------------

// Identifier enclosed in grave accents that supports dollar identifier references
mode IdentifierInBackticks;

BACKTICK_CLOSE: '`' -> popMode;

BacktickIdentifierText: ~('`' | '$')+ | '$';

BacktickReference: DollarIdentifier;

BacktickIdentifierExpressionStart:
	'${' -> pushMode(StringExpression);

// ----------------------- String -------------------------

// Allowed tokens inside strings
mode String;

QUOTE_CLOSE: '"' -> popMode;

StringText: ~('\\' | '"' | '$')+ | '$';

StringReference: DollarIdentifier;

StringEscapedChar: '\\' .;

StringExpressionStart: '${' -> pushMode(StringExpression);

// ----------------- Single quote string ------------------

// Allowed tokens inside strings
mode SQString;

SINGLE_QUOTE_CLOSE: '\'' -> popMode;

SQStringText: ~('\\' | '\'' | '$')+ | '$';

SQStringReference: DollarIdentifier;

SQStringEscapedChar: '\\' .;

SQStringExpressionStart: '${' -> pushMode(StringExpression);

// ------------------ String Expression -------------------

// Allowed tokens inside string expressions
mode StringExpression;

StrExpr_RCURL: RCURL -> popMode, type(RCURL);

StrExpr_QUOTE_OPEN:
	QUOTE_OPEN -> pushMode(String), type(QUOTE_OPEN);
StrExpr_SINGLE_QUOTE_OPEN:
	SINGLE_QUOTE_OPEN -> pushMode(SQString), type(SINGLE_QUOTE_OPEN);
StrExpr_BACKTICK_OPEN:
	BACKTICK_OPEN -> pushMode(IdentifierInBackticks), type(BACKTICK_OPEN);

StrExpr_LPAREN: LPAREN -> pushMode(Inside), type(LPAREN);
StrExpr_LSQUARE: LSQUARE -> pushMode(Inside), type(LSQUARE);
StrExpr_LANGLE: LANGLE -> type(LANGLE);
StrExpr_RANGLE: RANGLE -> type(RANGLE);

StrExpr_RPAREN: ')' -> type(RPAREN);
StrExpr_RSQUARE: ']' -> type(RSQUARE);
StrExpr_LCURL:
	LCURL -> pushMode(StringExpression), type(LCURL);
StrExpr_DOT: DOT -> type(DOT);
StrExpr_COMMA: COMMA -> type(COMMA);
StrExpr_MULT: MULT -> type(MULT);
StrExpr_MOD: MOD -> type(MOD);
StrExpr_DIV: DIV -> type(DIV);
StrExpr_ADD: ADD -> type(ADD);
StrExpr_SUB: SUB -> type(SUB);
StrExpr_INCR: INCR -> type(INCR);
StrExpr_DECR: DECR -> type(DECR);
StrExpr_COLON: COLON -> type(COLON);
StrExpr_DOUBLE_COLON: DOUBLE_COLON -> type(DOUBLE_COLON);
StrExpr_SEMICOLON: SEMICOLON -> type(SEMICOLON);
StrExpr_ASSIGNMENT: ASSIGNMENT -> type(ASSIGNMENT);
StrExpr_ADD_ASSIGNMENT: ADD_ASSIGNMENT -> type(ADD_ASSIGNMENT);
StrExpr_SUB_ASSIGNMENT: SUB_ASSIGNMENT -> type(SUB_ASSIGNMENT);
StrExpr_MULT_ASSIGNMENT:
	MULT_ASSIGNMENT -> type(MULT_ASSIGNMENT);
StrExpr_DIV_ASSIGNMENT: DIV_ASSIGNMENT -> type(DIV_ASSIGNMENT);
StrExpr_MOD_ASSIGNMENT: MOD_ASSIGNMENT -> type(MOD_ASSIGNMENT);

StrExpr_BooleanLiteral: BooleanLiteral -> type(BooleanLiteral);
StrExpr_NumberLiteral: NumberLiteral -> type(NumberLiteral);

StrExpr_Identifier: Identifier -> type(Identifier);
StrExpr_Comment: (LineComment | DelimitedComment) -> channel(HIDDEN);
StrExpr_WS: WS -> channel(HIDDEN);
StrExpr_NL: NL -> channel(HIDDEN);

// ------------------ Inside parentheses ------------------

// Allowed tokens inside parentheses
mode Inside;

Inside_RPAREN: ')' -> popMode, type(RPAREN);
Inside_RSQUARE: ']' -> popMode, type(RSQUARE);

Inside_LPAREN: LPAREN -> pushMode(Inside), type(LPAREN);
Inside_LSQUARE: LSQUARE -> pushMode(Inside), type(LSQUARE);
Inside_LANGLE: LANGLE -> type(LANGLE);
Inside_RANGLE: RANGLE -> type(RANGLE);

Inside_LCURL: LCURL -> type(LCURL);
Inside_RCURL: RCURL -> type(RCURL);
Inside_DOT: DOT -> type(DOT);
Inside_COMMA: COMMA -> type(COMMA);
Inside_MULT: MULT -> type(MULT);
Inside_MOD: MOD -> type(MOD);
Inside_DIV: DIV -> type(DIV);
Inside_ADD: ADD -> type(ADD);
Inside_SUB: SUB -> type(SUB);
Inside_INCR: INCR -> type(INCR);
Inside_DECR: DECR -> type(DECR);
Inside_COLON: COLON -> type(COLON);
Inside_DOUBLE_COLON: DOUBLE_COLON -> type(DOUBLE_COLON);
Inside_SEMICOLON: SEMICOLON -> type(SEMICOLON);
Inside_ASSIGNMENT: ASSIGNMENT -> type(ASSIGNMENT);
Inside_ADD_ASSIGNMENT: ADD_ASSIGNMENT -> type(ADD_ASSIGNMENT);
Inside_SUB_ASSIGNMENT: SUB_ASSIGNMENT -> type(SUB_ASSIGNMENT);
Inside_MULT_ASSIGNMENT:
	MULT_ASSIGNMENT -> type(MULT_ASSIGNMENT);
Inside_DIV_ASSIGNMENT: DIV_ASSIGNMENT -> type(DIV_ASSIGNMENT);
Inside_MOD_ASSIGNMENT: MOD_ASSIGNMENT -> type(MOD_ASSIGNMENT);
Inside_QUOTE_OPEN:
	QUOTE_OPEN -> pushMode(String), type(QUOTE_OPEN);
Inside_SINGLE_QUOTE_OPEN:
	SINGLE_QUOTE_OPEN -> pushMode(SQString), type(SINGLE_QUOTE_OPEN);
Inside_BACKTICK_OPEN:
	BACKTICK_OPEN -> pushMode(IdentifierInBackticks), type(BACKTICK_OPEN);

Inside_BooleanLiteral: BooleanLiteral -> type(BooleanLiteral);
Inside_NumberLiteral: NumberLiteral -> type(NumberLiteral);

Inside_Identifier: Identifier -> type(Identifier);
Inside_Comment: (LineComment | DelimitedComment) -> channel(HIDDEN);
Inside_WS: WS -> channel(HIDDEN);
Inside_NL: NL -> channel(HIDDEN);