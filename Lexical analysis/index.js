const {
	specialOperatorsDict,
	idRegExp,
	numRegExp,
	reservedWords
} = require('./utils');
const specialOperators = Object.keys(specialOperatorsDict);
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
			return -1;
		case 2:
			if (!character) return 3;
			if (idRegExp.test(character)) return 2;
			return 3;
		case 4:
			filteredOperator = specialOperators.find(
				(operator) => operator[1] === character
			);
			if (filteredOperator) return 6;
			return 5;
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

let tokens = [];
let line = 0;
if (process.argv.length > 2) return;
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.on('line', (input) => {
	line++;
	if (input.toUpperCase() === 'EOF') {
		rl.close();
		console.log(
			tokens
				.map((token) => {
					if (reservedWords.includes(token.lexeme) || token.lexeme === 'log') {
						token.type = token.lexeme;
						delete token.lexeme;
					}
					if (token.type === 'token_string')
						token.lexeme = token.lexeme.replace(/"/g, '');
					return `<${token.type}${token.lexeme ? ',' + token.lexeme : ''},${
						token.line
					},${token.column}>`;
				})
				.join('\n')
		);
		return;
	}
	if (line[0] === '#' || !line) return;
	let lastStatus = 1;
	let newStatus;
	let column = 1;
	let currentLexeme = [];
	do {
		const character = input[0];
		newStatus = delta(lastStatus, character);
		if (newStatus === -1) {
			let lastChar;
			let lexeme = '';
			switch (lastStatus) {
				case 3:
					lastChar = currentLexeme.pop();
					lexeme = currentLexeme.join('');
					if (lastChar) input = lastChar + input;
					tokens.push({
						line,
						column,
						lexeme,
						type: 'id'
					});
					break;
				case 5:
					lastChar = currentLexeme.pop();
					if (lastChar) input = lastChar + input;
				case 6:
					lexeme = currentLexeme.join('');
					tokens.push({
						line,
						column,
						type: specialOperatorsDict[lexeme]
					});
					break;
				case 8:
					lastChar = currentLexeme.pop();
					lexeme = currentLexeme.join('');
					if (lastChar) input = lastChar + input;
					tokens.push({
						line,
						column,
						lexeme,
						type: 'token_integer'
					});
					break;
				case 10:
					lastChar = currentLexeme.pop();
					lexeme = currentLexeme.join('');
					if (lastChar) input = lastChar + input;
					input = currentLexeme.pop() + input;
					tokens.push({
						line,
						column,
						lexeme: currentLexeme.join(''),
						type: 'token_integer'
					});
					break;
				case 12:
					lastChar = currentLexeme.pop();
					lexeme = currentLexeme.join('');
					if (lastChar) input = lastChar + input;
					tokens.push({
						line,
						column,
						lexeme,
						type: 'token_float'
					});
					break;
				case 14:
					currentLexeme.pop();
					lexeme = currentLexeme.join('');
					lexeme += '"';
					tokens.push({
						line,
						column,
						lexeme,
						type: 'token_string'
					});
					break;
				default:
					console.error('No se pudo agregar el token');
			}
			column += lexeme.length;
			lastStatus = 1;
			currentLexeme = [];
			if (input[0] === ' ') {
				column++;
				input = input.slice(1);
			}
		} else {
			currentLexeme.push(character);
			lastStatus = newStatus;
			input = input.slice(1);
		}
	} while (input || newStatus !== -1);
});
