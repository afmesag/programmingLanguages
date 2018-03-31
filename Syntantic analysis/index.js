const grammar = {
	START: {
		'FUNCTION START': ['FUNCTION'],
		'STAT START': ['ID', 'LOG', 'READ', 'IMPORT', 'FROM', 'RETURN', 'INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'NIL', 'LPAR', 'IF', 'WHILE', 'FOR', 'FUNCTION'],
		'EMPTY': ['EOF']
	},
	STAT: {
		'SIMP_STAT': ['ID', 'LOG', 'READ', 'IMPORT', 'FROM', 'RETURN', 'INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'NIL', 'LPAR'],
		'COMP_STAT': ['IF', 'WHILE', 'FOR', 'FUNCTION']
	},
	COMP_STAT: {
		'IF_STAT': ['IF'],
		'WHILE_STAT': ['WHILE'],
		'FOR_STAT': ['FOR'],
		'FUNCTION_STAT': ['FUNCTION']
	},
	SIMP_STAT: {
		'F ASSIGN': ['INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'ID', 'NIL', 'LPAR'],
		'LOG': ['LOG'],
		'READ': ['READ'],
		'IMPORT': ['IMPORT', 'FROM'],
		'RETURN': ['RETURN']
	},
	IF_STAT: {
		'if EXPR BLOCK ELSE': ['IF']
	},
	ELSE: {
		'else ELSE_PRIM': ['ELSE'],
		'EMPTY': ['ID', 'LOG', 'READ', 'IMPORT', 'FROM', 'RETURN', 'INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'NIL', 'LPAR', 'IF', 'WHILE', 'FOR', 'FUNCTION', 'END', 'RKEY', 'EOF']
	},
	ELSE_PRIM: {
		'IF_STAT': ['IF'],
		'BLOCK': ['ID', 'LOG', 'READ', 'IMPORT', 'FROM', 'RETURN', 'INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'NIL', 'LPAR', 'IF', 'WHILE', 'FOR', 'FUNCTION'],
	},
	WHILE_STAT: {
		'while EXPR BLOCK': ['WHILE']
	},
	FOR_STAT: {
		'for id in EXPR BLOCK': ['FOR']
	},
	FUNCTION: {
		'function id lpar FUNC_PARAM rpar FUNC_BODY end': ['FUNCTION']
	},
	FUNC_PARAM: {
		'PARAM MORE_FUNC_PARAM': ['ID'],
		'EMPTY': ['RPAR']
	},
	MORE_FUNC_PARAM: {
		'comma PARAM MORE_FUNC_PARAM': ['COMMA'],
		'EMPTY': ['RPAR']
	},
	PARAM: {
		'id PARAM_PRIM': ['ID']
	},
	PARAM_PRIM: {
		'assign EXPR': ['ASSIGN'],
		'EMPTY': ['COMMA', 'RPAR']
	},
	FUNC_BODY: {
		'STAT FUNC_BODY': ['ID', 'LOG', 'READ', 'IMPORT', 'FROM', 'RETURN', 'INT', 'FLOAT', 'TRUE', 'FALSE', 'LBRA', 'LKEY', 'NIL', 'LPAR', 'IF', 'WHILE', 'FOR', 'FUNCTION'],
		'EMPTY': ['END']
	},
	ASSIGN: {
		'assign EXPR': ['ASSIGN'],
		'EMPTY': ['ID', 'LOG', 'READ', 'IMPORT', 'FROM', 'RETURN', 'INT', 'FLOAT', 'TRUE', 'FALSE', 'LBRA', 'LKEY', 'NIL', 'LPAR', 'IF', 'WHILE', 'FOR', 'FUNCTION', 'END', 'RKEY', 'EOF'],
	},
	LOG: {
		'log lpar EXPR rpar': ['LOG']
	},
	READ: {
		'read lpar EXPR rpar': ['READ']
	},
	IMPORT: {
		'import id SUB_IMPORT': ['IMPORT'],
		'from id import id': ['FROM']
	},
	SUB_IMPORT: {
		'point id SUB_IMPORT': ['POINT'],
		'EMPTY': ['ID', 'LOG', 'READ', 'IMPORT', 'FROM', 'RETURN', 'INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'NIL', 'LPAR', 'IF', 'WHILE', 'FOR', 'FUNCTION', 'END', 'RKEY', 'EOF']
	},
	RETURN: {
		'return lpar EXPR rpar': ['RETURN']
	},
	BLOCK: {
		'lkey BLOCK_BODY rkey': ['LKEY'],
		'STAT': ['ID', 'LOG', 'READ', 'IMPORT', 'FROM', 'RETURN', 'INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'NIL', 'LPAR', 'IF', 'WHILE', 'FOR', 'FUNCTION']
	},
	BLOCK_BODY: {
		'STAT BLOCK_BODY': ['ID', 'LOG', 'READ', 'IMPORT', 'FROM', 'RETURN', 'INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'NIL', 'LPAR', 'IF', 'WHILE', 'FOR', 'FUNCTION'],
		'EMPTY': ['RKEY']
	},
	EXPR: {
		'EBOOL EXPR_PRIM': ['INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'ID', 'NIL', 'LPAR', 'MINUS', 'NOT']
	},
	EXPR_PRIM: {
		'or EBOOL EXPR_PRIM': ['OR'],
		'EMPTY': ['ELSE', 'ID', 'LOG', 'READ', 'IMPORT', 'FROM', 'RETURN', 'INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'NIL', 'LPAR', 'IF', 'WHILE', 'FOR', 'FUNCTION', 'RPAR', 'END', 'RKEY', 'EOF', 'RBRA', 'COMMA']
	},
	EBOOL: {
		'EXPREL EBOOL_PRIM': ['INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'ID', 'NIL', 'LPAR', 'MINUS'],
		'not EXPREL EBOOL_PRIM': ['NOT']
	},
	EBOOL_PRIM: {
		'and EXPREL EBOOL_PRIM': ['AND'],
		'EMPTY': ['OR', 'ELSE', 'ID', 'LOG', 'READ', 'IMPORT', 'FROM', 'RETURN', 'INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'NIL', 'LPAR', 'IF', 'WHILE', 'FOR', 'FUNCTION', 'RPAR', 'END', 'RKEY', 'EOF', 'RBRA', 'COMMA']
	},
	EXPREL: {
		'E EXPREL_PRIM': ['INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'ID', 'NIL', 'LPAR', 'MINUS']
	},
	EXPREL_PRIM: {
		'oprel E': ['OPREL'],
		'EMPTY': ['AND', 'OR', 'ELSE', 'ID', 'LOG', 'READ', 'IMPORT', 'FROM', 'RETURN', 'INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'NIL', 'LPAR', 'IF', 'WHILE', 'FOR', 'FUNCTION', 'RPAR', 'END', 'RKEY', 'EOF', 'RBRA', 'COMMA']
	},
	E: {
		'T E_PRIM': ['INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'ID', 'NIL', 'LPAR', 'MINUS']
	},
	E_PRIM: {
		'opsum T E_PRIM': ['OPSUM'],
		'EMPTY': ['OPREL', 'AND', 'OR', 'ELSE', 'ID', 'LOG', 'READ', 'IMPORT', 'FROM', 'RETURN', 'INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'NIL', 'LPAR', 'IF', 'WHILE', 'FOR', 'FUNCTION', 'RPAR', 'END', 'RKEY', 'EOF', 'RBRA', 'COMMA']
	},
	T: {
		'F T_PRIM': ['INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'ID', 'NIL', 'LPAR'],
		'minus F T_PRIM': ['MINUS']
	},
	T_PRIM: {
		'opmul F T_PRIM': ['OPMUL'],
		'EMPTY': ['OPSUM', 'OPREL', 'ELSE', 'ID', 'LOG', 'READ', 'IMPORT', 'FROM', 'RETURN', 'INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'NIL', 'LPAR', 'IF', 'WHILE', 'FOR', 'FUNCTION', 'RPAR', 'END', 'RKEY', 'EOF', 'RBRA', 'COMMA']
	},
	F: {
		'int': ['INT'],
		'float': ['FLOAT'],
		'true': ['TRUE'],
		'false': ['FALSE'],
		'string': ['STRING'],
		'ARRAY': ['LBRA'],
		'OBJECT': ['LKEY'],
		'VARIABLE F_PRIM': ['ID'],
		'nil': ['NIL'],
		'lpar EXPR rpar': ['LPAR']
	},
	F_PRIM: {
		'lbra EXPR rbra': ['LBRA'],
		'EMPTY': ['ASSIGN', 'OPMUL', 'OPSUM', 'OPREL', 'ELSE', 'ID', 'LOG', 'READ', 'IMPORT', 'FROM', 'RETURN', 'INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'NIL', 'LPAR', 'IF', 'WHILE', 'FOR', 'FUNCTION', 'RPAR', 'END', 'RKEY', 'EOF', 'RBRA', 'COMMA']
	},
	ARRAY: {
		'lbra ITEM_ARRAY rbra': ['lbra']
	},
	ITEM_ARRAY: {
		'EXPR MORE_ITEM_A': ['INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'ID', 'NIL', 'LPAR', 'MINUS', 'NOT'],
		'EMPTY': ['RBRA']
	},
	MORE_ITEM_A: {
		'comma EXPR MORE_ITEM_A': ['COMMA'],
		'EMPTY': ['RBRA']
	},
	OBJECT: {
		'lkey ITEM_OBJECT rkey': ['LKEY']
	},
	ITEM_OBJECT: {
		'id points EXPR MORE_ITEM_O': ['ID'],
		'EMPTY': ['RKEY']
	},
	MORE_ITEM_O: {
		'comma id points EXPR MORE_ITEM_O': ['COMMA'],
		'EMPTY': ['RKEY']
	},
	VARIABLE: {
		'id SUB_VAR VARIABLE_PRIM': ['ID']
	},
	VARIABLE_PRIM: {
		'SUB_VAR_FUNC': ['ASSIGN', 'OPMUL', 'OPSUM', 'OPREL', 'ELSE', 'ID', 'LOG', 'READ', 'IMPORT', 'FROM', 'RETURN', 'INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'NIL', 'LPAR', 'IF', 'WHILE', 'FOR', 'FUNCTION', 'RPAR', 'END', 'RBRA', 'EOF', 'RKEY', 'COMMA'],
		'lbra EXPR rbra': ['LBRA']
	},
	SUB_VAR: {
		'point id SUB_VAR': ['POINT'],
		'EMPTY': ['ASSIGN', 'OPMUL', 'OPSUM', 'OPREL', 'ELSE', 'ID', 'LOG', 'READ', 'IMPORT', 'FROM', 'RETURN', 'INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'NIL', 'LPAR', 'IF', 'WHILE', 'FOR', 'FUNCTION', 'RPAR', 'END', 'RBRA', 'EOF', 'RKEY', 'COMMA']
	},
	SUB_VAR_FUNC: {
		'lpar SUB_VAR_FUNC_PARAM rpar': ['LPAR'],
		'EMPTY': ['ASSIGN', 'OPMUL', 'OPSUM', 'OPREL', 'ELSE', 'ID', 'LOG', 'READ', 'IMPORT', 'FROM', 'RETURN', 'INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'NIL', 'LPAR', 'IF', 'WHILE', 'FOR', 'FUNCTION', 'RPAR', 'END', 'RBRA', 'EOF', 'RKEY', 'COMMA']
	},
	SUB_VAR_FUNC_PARAM: {
		'EXPR MORE_SUB_VAR_FUNC_PARAM': ['INT', 'FLOAT', 'TRUE', 'FALSE', 'STRING', 'LBRA', 'LKEY', 'ID', 'NIL', 'LPAR', 'MINUS', 'NOT'],
		'EMPTY': ['RPAR']
	},
	MORE_SUB_VAR_FUNC_PARAM: {
		'comma EXPR MORE_SUB_VAR_FUNC_PARAM': ['COMMA'],
		'EMPTY': ['RPAR']
	}
};
const terminals = {
	'token_llave_izq': 'LKEY',
	'token_llave_der': 'RKEY',
	'token_com': 'COMMENT',
	'token_cor_izq': 'LBRA',
	'token_cor_der': 'RBRA',
	'token_par_izq': 'LPAR',
	'token_par_der': 'RPAR',
	'token_mayor': 'LT',
	'token_menor': 'GT',
	'token_menor_igual': 'LTEQ',
	'token_mayor_igual': 'GTEQ',
	'token_igual_num': 'EQ',
	'token_diff_num': 'NEQ',
	'token_point': 'POINT',
	'token_and': 'AND',
	'token_or': 'OR',
	'token_not': 'NOT',
	'token_mas': 'PLUS',
	'token_menos': 'MINUS',
	'token_mul': 'MULT',
	'token_div': 'DIV',
	'token_mod': 'MOD',
	'token_pot': 'POT',
	'token_assign': 'ASSIGN',
	'token_coma': 'COMMA',
	'token_dosp': 'POINTS',
	'token_integer': 'INT',
	'token_float': 'FLOAT',
	'token_string': 'STRING',
	'false': 'FALSE',
	'true': 'TRUE',
	'log': 'LOG',
	'leer': 'READ',
	'importar': 'IMPORT',
	'desde': 'FROM',
	'if': 'IF',
	'while': 'WHILE',
	'for': 'FOR',
	'funcion': 'FUNCTION',
	'in': 'IN',
	'else': 'ELSE',
	'end': 'END',
	'retorno': 'RETURN',
	'nil': 'NIL',
	'id': 'ID',
	'EOF': 'EOF'
};
const translateTerminals = {
	'LKEY': '[',
	'RKEY': ']',
	'COMMENT': '·',
	'LBRA': '{',
	'RBRA': '}',
	'LPAR': '(',
	'RPAR': ')',
	'OPREL': {
		'LT': '<',
		'GT': '>',
		'LTEQ': '<=',
		'GTEQ': '>=',
		'EQ': '==',
		'NEQ': '!='
	},
	'POINT': '.',
	'AND': '&&',
	'OR': '||',
	'NOT': '!',
	'OPSUM': {
		'PLUS': '+',
		'MINUS': '-'
	},
	'MINUS': '-',
	'OPMUL': {
		'MULT': '*',
		'DIV': '/'
	},
	'MOD': '%',
	'POT': '^',
	'ASSIGN': '=',
	'COMMA': ',',
	'POINTS': ':',
	'FALSE': 'false',
	'TRUE': 'true',
	'LOG': 'log',
	'READ': 'leer',
	'IMPORT': 'importar',
	'FROM': 'desde',
	'IF': 'if',
	'WHILE': 'while',
	'FOR': 'for',
	'FUNCTION': 'funcion',
	'IN': 'in',
	'ELSE': 'else',
	'END': 'end',
	'RETURN': 'retorno',
	'NIL': 'nil',
	'ID': 'identificador',
	'STRING': 'valor_string',
	'INT': 'valor_integer',
	'FLOAT': 'valor_float'
};
const oprelSymbols = ['LT', 'GT', 'LTEQ', 'GTEQ', 'EQ', 'NEQ'];
const opsumSymbols = ['PLUS', 'MINUS'];
const opmulSymbols = ['MUL', 'DIV'];
const specialOperatorsDict = {
	'{': 'token_llave_izq',
	'}': 'token_llave_der',
	'#': 'token_com',
	'[': 'token_cor_izq',
	']': 'token_cor_der',
	'(': 'token_par_izq',
	')': 'token_par_der',
	'>': 'token_mayor',
	'<': 'token_menor',
	'>=': 'token_mayor_igual',
	'<=': 'token_menor_igual',
	'==': 'token_igual_num',
	'.': 'token_point',
	'!=': 'token_diff_num',
	'&&': 'token_and',
	'||': 'token_or',
	'!': 'token_not',
	'+': 'token_mas',
	'-': 'token_menos',
	'*': 'token_mul',
	'/': 'token_div',
	'%': 'token_mod',
	'^': 'token_pot',
	'=': 'token_assign',
	',': 'token_coma',
	':': 'token_dosp'
};
const specialOperators = Object.keys(specialOperatorsDict);
const reservedWords = ['log', 'leer', 'false', 'true', 'for', 'while', 'funcion', 'if', 'in', 'importar', 'else', 'end', 'retorno', 'nil', 'desde', 'todo', 'EOF'];
const idRegExp = /[a-z0-9_]/i;
const numRegExp = /[0-9]/;
const delta = (state, character) => {
	let filteredOperator;
	switch (state) {
		case 1:
			if (character === ' ' || character === '\t' || !character) return 1;
			if (/[a-z_]/i.test(character)) return 2;
			filteredOperator = specialOperators.find(
				(operator) => operator[0] === character
			);
			if (filteredOperator) return 4;
			if (numRegExp.test(character)) return 7;
			if (character === '"') return 13;
			return -1;
		case 2:
			if (!character) return 3;
			if (idRegExp.test(character)) return 2;
			return 3;
		case 4:
			filteredOperator = specialOperators.find(
				(operator) => character && operator[1] === character
			);
			if (filteredOperator) return 5;
			return 6;
		case 7:
			if (numRegExp.test(character)) return 7;
			if (character === '.') return 9;
			return 8;
		case 9:
			if (numRegExp.test(character)) return 11;
			return 10;
		case 11:
			if (numRegExp.test(character)) return 11;
			return 12;
		case 13:
			if (character !== '"') return 13;
			else return 14;
		case 3:
		case 5:
		case 6:
		case 8:
		case 10:
		case 12:
		case 14:
			return -1;
		default:
			process.stdout.write('No se pudo encontrar un nuevo estado');
	}
};

let line = 1;
let column = 1;
let stdin_input = '';
let currentToken = undefined;

const getToken = () => {
	let lastStatus = 1;
	let newStatus;
	let currentLexeme = [];
	while (stdin_input[0] === '\n') {
		line++;
		stdin_input = stdin_input.slice(1);
	}
	do {
		const character = stdin_input[0];
		newStatus = delta(lastStatus, character);
		if (newStatus === -1) {
			let token = {};
			let lastChar;
			let lexeme = '';
			switch (lastStatus) {
				case 3:
					lastChar = currentLexeme.pop();
					if (lastChar) stdin_input = lastChar + stdin_input;
					lexeme = currentLexeme.join('');
					if (reservedWords.includes(lexeme)) {
						token = {
							line,
							column,
							type: lexeme
						};
					} else {
						token = {
							line,
							column,
							lexeme,
							type: 'id'
						};
					}
					break;
				case 6:
					lastChar = currentLexeme.pop();
					if (lastChar) stdin_input = lastChar + stdin_input;
				case 5:
					lexeme = currentLexeme.join('');
					if (!specialOperators.includes(lexeme)) {
						throw {
							error: `>>> Error lexico(linea:${line},posicion:${column})`
						};
					}
					token = {
						line,
						column,
						type: specialOperatorsDict[lexeme]
					};
					break;
				case 8:
					lastChar = currentLexeme.pop();
					if (lastChar) stdin_input = lastChar + stdin_input;
					lexeme = currentLexeme.join('');
					token = {
						line,
						column,
						lexeme,
						type: 'token_integer'
					};
					break;
				case 10:
					lastChar = currentLexeme.pop();
					if (lastChar) stdin_input = lastChar + stdin_input;
					stdin_input = currentLexeme.pop() + stdin_input;
					lexeme = currentLexeme.join('');
					token = {
						line,
						column,
						lexeme,
						type: 'token_integer'
					};
					break;
				case 12:
					lastChar = currentLexeme.pop();
					if (lastChar) stdin_input = lastChar + stdin_input;
					lexeme = currentLexeme.join('');
					token = {
						line,
						column,
						lexeme,
						type: 'token_float'
					};
					break;
				case 14:
					lexeme = currentLexeme.join('');
					token = {
						line,
						column,
						lexeme,
						type: 'token_string'
					};
					break;
				default:
					debugger
					throw {
						error: `>>> Error lexico(linea:${line},posicion:${column})`
					};
			}
			column += lexeme.length;
			return token;
		} else {
			if (newStatus !== 1) currentLexeme.push(character);
			else column++;
			if (newStatus === 1 && !character) newStatus = -1;
			lastStatus = newStatus;
			stdin_input = stdin_input.slice(1);
		}
	} while (stdin_input || newStatus !== -1);
};

const syntaxError = (listExpectedTokens) => {
	let translatedCurrentToken = '';
	const terminalCurrentToken = terminals[currentToken.type];
	if (oprelSymbols.includes(terminalCurrentToken))
		translatedCurrentToken = translateTerminals.OPREL[terminalCurrentToken];
	else if (opmulSymbols.includes(terminalCurrentToken))
		translatedCurrentToken = translateTerminals.OPMUL[terminalCurrentToken];
	else if (opsumSymbols.includes(terminalCurrentToken))
		translatedCurrentToken = translateTerminals.OPSUM[terminalCurrentToken];
	else translatedCurrentToken = translateTerminals[terminalCurrentToken];
	const translatedExpectedTokens = listExpectedTokens.map(item => {
		if (item === 'OPREL' || item === 'OPMUL' || item === 'OPSUM')
			return Object.values(translateTerminals[item]).map(operator => `'${operator}'`);
		return `'${translateTerminals[item]}'`;
	});
	console.log(`<${currentToken.line}:${currentToken.column}> Error sintactico. Encontrado: '${translatedCurrentToken}'; se esperaba: ${translatedExpectedTokens.sort().join(',')}`);
	process.exit();
};

const match = (expectedToken) => {
	const tokenType = terminals[currentToken.type];
	if (
		(expectedToken === 'OPREL' && oprelSymbols.includes(tokenType)) ||
		(expectedToken === 'OPMUL' && opmulSymbols.includes(tokenType)) ||
		(expectedToken === 'OPSUM' && opsumSymbols.includes(tokenType)) ||
		tokenType === expectedToken
	) currentToken = getToken();
	else {
		if (expectedToken === 'OPREL')
			syntaxError(oprelSymbols);
		else if (expectedToken === 'OPMUL')
			syntaxError(opmulSymbols);
		else if (expectedToken === 'OPSUM')
			syntaxError(opsumSymbols);
		else for (const item in translateTerminals)
				if (item === expectedToken) {
					syntaxError([item]);
					break;
				}
	}
};

const getCurrentToken = () => {
	return currentToken;
};

const functions = {};
for (const symbol in grammar) {
	let totalProductions = [];
	let functionBody = 'const tokenType =' +
		' this.terminals[this.getCurrentToken().type];\n';
	for (const production in grammar[symbol]) {
		if (!grammar[symbol].hasOwnProperty(production)) continue;
		const symbolsInProduction = production.split(' ');
		const predictionList = grammar[symbol][production];
		totalProductions = totalProductions.concat(predictionList.filter(item => !totalProductions.includes(item)));
		functionBody += 'if (' +
			predictionList.map((item) => {
				if (item === 'OPREL' || item === 'OPSUM' || item === 'OPMUL')
					return `this.${item.toLowerCase()}Symbols.includes(tokenType)`;
				return `tokenType === '${item.toUpperCase()}'`;
			}).join(' || ') + '){\n';
		functionBody +=
			symbolsInProduction
				.map((item) => {
					if (item === 'EMPTY')
						return '';
					if (/^[A-Z_]*$/.test(item))
						return `\tthis.functions.${item}();`;
					return `\tthis.match('${item.toUpperCase()}');`;
				})
				.join('\n') + '\n} \nelse ';
	}
	functionBody += 'this.syntaxError([' + totalProductions.map(item => `'${item}'`).join(',') + ']);';
	functions[symbol] = new Function(functionBody).bind({
		functions,
		getCurrentToken,
		terminals,
		translateTerminals,
		oprelSymbols,
		opsumSymbols,
		opmulSymbols,
		match,
		syntaxError
	});
}

process.stdin.resume();
process.stdin.setEncoding('utf-8');
process.stdin.on('data', function (input) {
	if (input.trim()[0] === '#') return;
	stdin_input += input;
});

process.stdin.on('end', function () {
	stdin_input += 'EOF';
	currentToken = getToken();
	functions['START']();
	console.log('El analisis sintactico ha finalizado correctamente.');
	process.exit();
});