const grammar = {
	STAT: {
		SIMPSTAT: [
			'ID',
			'LOG',
			'IMPORT',
			'FROM',
			'RETURN',
			'INT',
			'FLOAT',
			'TRUE',
			'FALSE',
			'STRING',
			'LBRA',
			'LKEY',
			'NIL',
			'LPAR'
		],
		COMPSTAT: ['IF', 'WHILE', 'FOR', 'FUNCTION']
	}
};
const terminals = {
	'LKEY': 'token_llave_izq',
	'RKEY': 'token_llave_der',
	'COMMENT': 'token_com',
	'LBRA': 'token_cor_izq',
	'RBRA': 'token_cor_der',
	'LPAR': 'token_par_izq',
	'RPAR': 'token_par_der',
	'LT': 'token_mayor',
	'GT': 'token_menor',
	'LTEQ': 'token_menor_igual',
	'GTEQ': 'token_mayor_igual',
	'EQ': 'token_igual_num',
	'NEQ': 'token_diff_num',
	'POINT': 'token_point',
	'AND': 'token_and',
	'OR': 'token_or',
	'NOT': 'token_not',
	'PLUS': 'token_mas',
	'MINUS': 'token_menos',
	'MULT': 'token_mul',
	'DIV': 'token_div',
	'MOD': 'token_mod',
	'POT': 'token_pot',
	'ASSIGN': 'token_assign',
	'COMMA': 'token_coma',
	'POINTS': 'token_dosp',
	'INT': 'token_integer',
	'FLOAT': 'token_float',
	'STRING': 'token_string',
	'FALSE': 'false',
	'TRUE': 'true',
	'LOG': 'log',
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
	'ALL': 'todo',
	'ID': 'id'
};
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
const reservedWords = ['false', 'true', 'for', 'while', 'funcion', 'if', 'in', 'importar', 'else', 'end', 'retorno', 'nil', 'desde', 'todo'];
const idRegExp = /[a-z0-9]/i;
const numRegExp = /[0-9]/;
const delta = (state, character) => {
	let filteredOperator;
	switch (state) {
		case 1:
			if (character === ' ' || character === '\t' || !character) return 1;
			if (/[a-z]/i.test(character)) return 2;
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
let stdin_input='';

const getToken = () => {
	let lastStatus = 1;
	let newStatus;
	let currentLexeme = [];
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
					if (reservedWords.includes(lexeme) || lexeme === 'log') {
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
					throw {
						error: `>>> Error lexico(linea:${line},posicion:${column})`
					};
			}
			line++;
			column = 1;
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

const functions = {};
for (const symbol in grammar) {
	let totalProductions = [];
	let functionBody = 'const currentToken = getToken();\nconst tokenType = terminals[currentToken.type];\n';
	for (const production in grammar[symbol]) {
		if (!grammar[symbol].hasOwnProperty(production)) continue;
		const symbolsInProduction = production.split(' ');
		const predictionList = grammar[symbol][production];
		totalProductions = totalProductions.concat(predictionList);
		functionBody += 'if (' +
			predictionList.map((item) => `tokenType === ${item}`).join(' || ') + '){\n\t';
		functionBody +=
			symbolsInProduction
				.map((item) => (/^[A-Z]*$/.test(item) ? `${item}();` : `match(${item});`))
				.join('\n') + '\n} \nelse ';
	}
	functionBody += 'syntaxError(' + totalProductions.join(',') + ');';
	functions[symbol] = new Function('type', functionBody);
}

process.stdin.resume();
process.stdin.setEncoding('utf-8');

process.stdin.on('data', function (input) {
	stdin_input += input;
});

process.stdin.on('end', function () {
	functions['STAT']();
});
