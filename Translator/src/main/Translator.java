package main;

import gen.TLONLexer;
import gen.TLONParser;
import org.antlr.v4.runtime.ANTLRInputStream;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.tree.ParseTree;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

public class Translator {
	public static void main(String[] args) throws IOException {
		System.setIn(new FileInputStream(new File("input")));
		TLONLexer lexer = new TLONLexer(new ANTLRInputStream(System.in));
		CommonTokenStream tokens = new CommonTokenStream(lexer);
		TLONParser parser = new TLONParser(tokens);
		ParseTree tree = parser.parse();
		MyVisitor<String> loader = new MyVisitor<>();
		Object x = loader.visit(tree);
		System.out.print(x);
	}
}
