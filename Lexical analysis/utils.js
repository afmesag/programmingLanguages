module.exports.specialOperatorsDict = {
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
module.exports.reservedWords = [
	'false',
	'true',
	'for',
	'while',
	'function',
	'if'
];
module.exports.idRegExp = /[a-z]/i;
module.exports.numRegExp = /[0-9]/;
