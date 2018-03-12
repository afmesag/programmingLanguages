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
	in: 'token_in',
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
	'=': 'token_assign'
};
const specialOperators = Object.keys(specialOperatorsDict);
const reservedWords = ['false', 'true', 'for', 'while', 'function', 'if'];
const idRegExp = /[a-z]/i;
const numRegExp = /[0-9]/;
const printTokens = (tokens) => {
	console.log(
		tokens
			.map((token) => {
				if (token.type === 'token_string')
					token.lexeme = token.lexeme.replace(/"/g, '');
				if (token.lexeme)
					return `<${token.type},${token.lexeme},${token.line},${
						token.column
					}>`;
				else return `<${token.type},${token.line},${token.column}>`;
			})
			.join('\n')
	);
};

const delta = (state, character) => {
	let filteredOperator;
	switch (state) {
		case 1:
			if (idRegExp.test(character)) return 2;
			filteredOperator = specialOperators.find(
				(operator) => operator[0] === character
			);
			if (filteredOperator) return 4;
			if (numRegExp.test(character)) return 7;
			if (character === '"') return 13;
			if (character === ' ' || character === '\t') return 1;
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
			console.error('No se pudo encontrar un nuevo estado');
	}
};

module.exports.readTokens = (input, line) => {
	let lastStatus = 1;
	let newStatus;
	let column = 1;
	let currentLexeme = [];
	const tokens = [];
	do {
		const character = input[0];
		newStatus = delta(lastStatus, character);
		if (newStatus === -1) {
			let lastChar;
			let lexeme = '';
			switch (lastStatus) {
				case 3:
					lastChar = currentLexeme.pop();
					if (lastChar) input = lastChar + input;
					lexeme = currentLexeme.join('');
					if (reservedWords.includes(lexeme) || lexeme === 'log') {
						tokens.push({
							line,
							column,
							type: lexeme
						});
					} else {
						tokens.push({
							line,
							column,
							lexeme,
							type: 'id'
						});
					}
					break;
				case 6:
					lastChar = currentLexeme.pop();
					if (lastChar) input = lastChar + input;
				case 5:
					lexeme = currentLexeme.join('');
					if (!specialOperators.includes(lexeme)) {
						throw {
							tokens,
							error: `Error léxico(línea:${line}, columna:${column})`
						};
					}
					tokens.push({
						line,
						column,
						type: specialOperatorsDict[lexeme]
					});
					break;
				case 8:
					lastChar = currentLexeme.pop();
					if (lastChar) input = lastChar + input;
					lexeme = currentLexeme.join('');
					tokens.push({
						line,
						column,
						lexeme,
						type: 'token_integer'
					});
					break;
				case 10:
					lastChar = currentLexeme.pop();
					if (lastChar) input = lastChar + input;
					input = currentLexeme.pop() + input;
					lexeme = currentLexeme.join('');
					tokens.push({
						line,
						column,
						lexeme,
						type: 'token_integer'
					});
					break;
				case 12:
					lastChar = currentLexeme.pop();
					if (lastChar) input = lastChar + input;
					lexeme = currentLexeme.join('');
					tokens.push({
						line,
						column,
						lexeme,
						type: 'token_float'
					});
					break;
				case 14:
					lexeme = currentLexeme.join('');
					tokens.push({
						line,
						column,
						lexeme,
						type: 'token_string'
					});
					break;
				default:
					throw {
						tokens,
						error: `Error léxico(línea:${line}, columna:${column})`
					};
			}
			column += lexeme.length;
			lastStatus = 1;
			currentLexeme = [];
		} else {
			if (newStatus !== 1) currentLexeme.push(character);
			else column++;
			lastStatus = newStatus;
			input = input.slice(1);
		}
	} while (input || newStatus !== -1);
	return tokens;
};
module.exports.printTokens = printTokens;
