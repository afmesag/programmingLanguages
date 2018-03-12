const { readTokens, printTokens } = require('./utils');

let tokens = [];
let line = 0;
if (process.argv.length > 2) {
	const fs = require('fs');
	fs.readFile(process.argv[2], 'utf-8', (err, data) => {
		if (err) throw err;
		data.split('\n').forEach((input, line) => {
			if (input[0] === '#') return;
			try {
				tokens = tokens.concat(readTokens(input, line + 1));
			} catch (err) {
				tokens = tokens.concat(err.tokens);
				printTokens(tokens);
				console.log(err.error);
				process.exit(1);
			}
		});
		printTokens(tokens);
	});
} else {
	const readline = require('readline');
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rl.on('line', (input) => {
		if (input.toUpperCase() === 'EOF') {
			rl.close();
			printTokens(tokens);
			return;
		}
		line++;
		if (input[0] === '#') return;
		try {
			tokens = tokens.concat(readTokens(input, line));
		} catch (err) {
			tokens = tokens.concat(err.tokens);
			printTokens(tokens);
			console.log(err.error);
			process.exit(1);
		}
	});
}
