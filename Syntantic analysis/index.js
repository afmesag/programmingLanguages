const gramar = {
	STAT: {
		SIMPSTAT: [
			'id',
			'log',
			'import',
			'from',
			'return',
			'num',
			'boolean',
			'string',
			'cori',
			'llavi',
			'nil',
			'pari'
		],
		COMPSTAT: ['if', 'while', 'for', 'function']
	}
};
for (const symbol in gramar) {
	for (const production in gramar[symbol]) {
		const symbolsInProduction = production.split(' ');
		const predictionList = gramar[symbol][production];
		let functionBody = 'if (';
		functionBody +=
			predictionList.map((item) => `token() === ${item}`).join(' || ') + '){';
		functionBody +=
			symbolsInProduction
				.map(
					(item) => (/^[A-Z]*$/.test(item) ? `${item}();` : `match(${item})`)
				)
				.join('\n') + '}';
	}
}
