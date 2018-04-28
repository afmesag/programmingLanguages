package main;

import gen.TLONBaseVisitor;
import gen.TLONParser;
import org.antlr.v4.runtime.tree.TerminalNode;

public class MyVisitor<T> extends TLONBaseVisitor {
	@Override
	public T visitParse(TLONParser.ParseContext ctx) {
		if (ctx.from_file() != null)
			return visitFrom_file(ctx.from_file());
		return visitFrom_input(ctx.from_input());
	}

	@Override
	public T visitFrom_input(TLONParser.From_inputContext ctx) {
		return visitStat(ctx.stat());
	}

	@Override
	public T visitFrom_file(TLONParser.From_fileContext ctx) {
		StringBuilder stringBuilder = new StringBuilder();
		for (TLONParser.StatContext statContext : ctx.stat()) {
			stringBuilder.append(visitStat(statContext));
		}
		return (T) stringBuilder;
	}

	@Override
	public T visitStat(TLONParser.StatContext ctx) {
		if (ctx.simple_stat() != null)
			return visitSimple_stat(ctx.simple_stat());
		return visitCompound_stat(ctx.compound_stat());

	}

	@Override
	public T visitCompound_stat(TLONParser.Compound_statContext ctx) {
		if (ctx.if_stat() != null)
			return visitIf_stat(ctx.if_stat());
		else if (ctx.while_stat() != null)
			return visitWhile_stat(ctx.while_stat());
		else if (ctx.for_stat() != null)
			return visitFor_stat(ctx.for_stat());
		else
			return visitFuncion(ctx.funcion());
	}

	@Override
	public T visitSimple_stat(TLONParser.Simple_statContext ctx) {
		if (ctx.assignment() != null)
			return visitAssignment(ctx.assignment());
		else if (ctx.log() != null)
			return visitLog(ctx.log());
		else if (ctx.importar() != null)
			return visitImportar(ctx.importar());
		else if (ctx.retornar() != null)
			return visitRetornar(ctx.retornar());
		else {
			return (T) (visit(ctx.atom()) + "\n");
		}
	}

	@Override
	public T visitAssignment(TLONParser.AssignmentContext ctx) {
		String s = visitVariable(ctx.variable()) + ctx.ASSIGN().getText();
		if (ctx.assignment() != null)
			s += visitAssignment(ctx.assignment());
		else
			s += visit(ctx.expr());
		return (T) s;
	}

	@Override
	public T visitIf_stat(TLONParser.If_statContext ctx) {
		StringBuilder stringBuilder = new StringBuilder(ctx.IF(0).getText() +
				visitCondition_block(ctx.condition_block(0)));
		if (!ctx.ELSE().isEmpty()) {
			int ifLimit = ctx.IF().size();
			int elseIndex = 0;
			int elseLimit = ctx.ELSE().size();
			while (elseIndex + 1 < elseLimit && elseIndex + 1 < ifLimit &&
					ctx.ELSE(elseIndex) != null && ctx.IF(elseIndex + 1) != null) {
				// Else-If statement
				stringBuilder.append(addIndentation(ctx.depth - 1));
				stringBuilder.append("elif");
				stringBuilder.append(visitCondition_block(ctx.condition_block(elseIndex++)));
			}
			if (elseIndex < elseLimit) {
				stringBuilder.append(addIndentation(ctx.depth - 1));
				stringBuilder.append(ctx.ELSE(elseIndex).getText() + ":");
				stringBuilder.append(visitStat_block(ctx.stat_block()));
			}

		}
		return (T) stringBuilder.toString();
	}

	@Override
	public T visitWhile_stat(TLONParser.While_statContext ctx) {
		return (T) (ctx.WHILE().getText() + " (" + visit(ctx.expr()) + "):"
				+ visitStat_block(ctx.stat_block()));
	}

	@Override
	public T visitFor_stat(TLONParser.For_statContext ctx) {
		return (T) (ctx.FOR().getText() + " " + ctx.ID().getText() + " " + ctx.IN().getText() + " "
				+ visit(ctx.expr()) + ":" + visitStat_block(ctx.stat_block()));
	}

	@Override
	public T visitLog(TLONParser.LogContext ctx) {
		return (T) ("print " + visit(ctx.expr()));
	}

	@Override
	public T visitFuncion(TLONParser.FuncionContext ctx) {
		StringBuilder stringBuilder = new StringBuilder("def " + ctx.ID().getText()
				+ ctx.OPAR().getText());
		if (!ctx.parametro().isEmpty()) {
			for (TLONParser.ParametroContext parametroContext : ctx.parametro()) {
				stringBuilder.append(visitParametro(parametroContext));
				stringBuilder.append(",");
			}
			// Delete last comma
			stringBuilder.deleteCharAt(stringBuilder.length() - 1);
		}
		stringBuilder.append(ctx.CPAR().getText());
		stringBuilder.append(":");
		for (TLONParser.StatContext statContext : ctx.stat()) {
			stringBuilder.append(addIndentation(ctx.depth));
			stringBuilder.append(visitStat(statContext));
		}
		return (T) stringBuilder.toString();
	}

	@Override
	public T visitImportar(TLONParser.ImportarContext ctx) {
		StringBuilder stringBuilder = new StringBuilder();
		if (ctx.FROM() == null) {
			// First rule
			stringBuilder.append("import ");
			for (TerminalNode terminalNode : ctx.ID()) {
				stringBuilder.append(terminalNode.getText());
				stringBuilder.append(".");
			}
			// Delete last point
			stringBuilder.deleteCharAt(stringBuilder.length() - 1);
		} else {
			stringBuilder.append("from ");
			stringBuilder.append(ctx.ID(0).getText());
			stringBuilder.append(" import ");
			stringBuilder.append(ctx.ID(1).getText());
		}
		return (T) stringBuilder.toString();
	}

	@Override
	public T visitRetornar(TLONParser.RetornarContext ctx) {
		return (T) ("return " + visit(ctx.expr()));
	}

	@Override
	public T visitCondition_block(TLONParser.Condition_blockContext ctx) {
		return (T) ("(" + visit(ctx.expr()) + "):" + visitStat_block(ctx.stat_block()));
	}

	@Override
	public T visitStat_block(TLONParser.Stat_blockContext ctx) {
		StringBuilder stringBuilder = new StringBuilder();
		for (TLONParser.StatContext statContext : ctx.stat()) {
			stringBuilder.append(addIndentation(ctx.depth));
			stringBuilder.append(visitStat(statContext));
		}
		return (T) stringBuilder.toString();
	}

	@Override
	public T visitArray(TLONParser.ArrayContext ctx) {
		StringBuilder stringBuilder = new StringBuilder(ctx.OKEY().getText());
		// Simple array [a,b,...]
		if (ctx.start == null) {
			// First rule
			for (TLONParser.ExprContext exprContext : ctx.expr()) {
				stringBuilder.append(visit(exprContext));
				stringBuilder.append(",");
			}
			// Delete last comma
			stringBuilder.deleteCharAt(stringBuilder.length() - 1);
		} else {
			stringBuilder.append(visit(ctx.start));
			stringBuilder.append(ctx.POINTS().get(0).getText());
			stringBuilder.append(visit(ctx.end));
			if (ctx.step != null) {
				stringBuilder.append(ctx.POINTS().get(1).getText());
				stringBuilder.append(visit(ctx.step));
			}
		}
		stringBuilder.append(ctx.CKEY().getText());
		return (T) stringBuilder.toString();
	}

	@Override
	public T visitAccessarray(TLONParser.AccessarrayContext ctx) {
		return (T) (visitVariable(ctx.variable()) + ctx.OKEY().getText() + visit(ctx.expr())
				+ ctx.CKEY().getText());
	}

	@Override
	public T visitVariable(TLONParser.VariableContext ctx) {
		StringBuilder stringBuilder = new StringBuilder();
		for (TerminalNode terminalNode : ctx.ID()) {
			stringBuilder.append(terminalNode.getText());
			stringBuilder.append(".");
		}
		// Delete last point
		stringBuilder.deleteCharAt(stringBuilder.length() - 1);
		if (ctx.OPAR() != null) {
			stringBuilder.append(ctx.OPAR().getText());
			for (TLONParser.ExprContext exprContext : ctx.expr()) {
				stringBuilder.append(visit(exprContext));
				stringBuilder.append(",");
			}
			// Delete last comma
			stringBuilder.deleteCharAt(stringBuilder.length() - 1);
			stringBuilder.append(ctx.CPAR().getText());
		} else if (ctx.OKEY() != null) {
			stringBuilder.append(ctx.OKEY().getText());
			stringBuilder.append(visit(ctx.expr(0)));
			stringBuilder.append(ctx.CKEY().getText());
		}
		return (T) stringBuilder.toString();
	}

	@Override
	public T visitParametro(TLONParser.ParametroContext ctx) {
		String s = ctx.ID().getText();
		if (ctx.ASSIGN() != null) {
			s += ctx.ASSIGN().getText() + visit(ctx.expr());
		}
		return (T) s;
	}

	@Override
	public T visitPowExpr(TLONParser.PowExprContext ctx) {
		return (T) ("pow(" + visit(ctx.expr(0)) + "," + visit(ctx.expr(1)) + ")");
	}

	@Override
	public T visitUnaryMinusExpr(TLONParser.UnaryMinusExprContext ctx) {
		return (T) (ctx.MINUS().getText() + visit(ctx.expr()));
	}

	@Override
	public T visitNotExpr(TLONParser.NotExprContext ctx) {
		return (T) ("not " + visit(ctx.expr()));
	}

	@Override
	public T visitMultiplicationExpr(TLONParser.MultiplicationExprContext ctx) {
		return (T) (visit(ctx.left) + ctx.op.getText() + visit(ctx.right));
	}

	@Override
	public T visitAdditiveExpr(TLONParser.AdditiveExprContext ctx) {
		return (T) (visit(ctx.left) + ctx.op.getText() + visit(ctx.right));
	}

	@Override
	public T visitRelationalExpr(TLONParser.RelationalExprContext ctx) {
		return (T) (visit(ctx.left) + ctx.op.getText() + visit(ctx.right));
	}

	@Override
	public T visitEqualityExpr(TLONParser.EqualityExprContext ctx) {
		return (T) (visit(ctx.left) + ctx.op.getText() + visit(ctx.right));
	}

	@Override
	public T visitAndExpr(TLONParser.AndExprContext ctx) {
		return (T) (visit(ctx.expr(0)) + " and " + visit(ctx.expr(1)));
	}

	@Override
	public T visitOrExpr(TLONParser.OrExprContext ctx) {
		return (T) (visit(ctx.expr(0)) + " or " + visit(ctx.expr(1)));
	}

	@Override
	public T visitParExpr(TLONParser.ParExprContext ctx) {
		return (T) (ctx.OPAR().getText() + visit(ctx.expr()) + ctx.CPAR().getText());
	}

	@Override
	public T visitAtomExpr(TLONParser.AtomExprContext ctx) {
		return (T) visit(ctx.atom());
	}

	@Override
	public T visitNumberAtom(TLONParser.NumberAtomContext ctx) {
		return (T) ctx.getText();
	}

	@Override
	public T visitBooleanAtom(TLONParser.BooleanAtomContext ctx) {
		return ctx.TRUE() != null ? (T) "True" : (T) "False";
	}

	@Override
	public T visitStringAtom(TLONParser.StringAtomContext ctx) {
		return (T) ctx.STRING().getText();
	}

	@Override
	public T visitArrayAtom(TLONParser.ArrayAtomContext ctx) {
		return visitArray(ctx.array());
	}

	@Override
	public T visitObjetoAtom(TLONParser.ObjetoAtomContext ctx) {
		return visitObjeto(ctx.objeto());
	}

	@Override
	public T visitAccessToarray(TLONParser.AccessToarrayContext ctx) {
		return visitAccessarray(ctx.accessarray());
	}

	@Override
	public T visitAccessVariable(TLONParser.AccessVariableContext ctx) {
		return visitVariable(ctx.variable());
	}

	@Override
	public T visitNilAtom(TLONParser.NilAtomContext ctx) {
		return (T) ctx.NIL().getText();
	}

	@Override
	public T visitObjeto(TLONParser.ObjetoContext ctx) {
		StringBuilder stringBuilder = new StringBuilder(ctx.OBRACE().getText());
		for (TLONParser.KeyvalueContext keyvalueContext : ctx.keyvalue()) {
			stringBuilder.append(visitKeyvalue(keyvalueContext));
			stringBuilder.append(",");
		}
		// Delete last comma
		stringBuilder.deleteCharAt(stringBuilder.length() - 1);
		stringBuilder.append(ctx.CBRACE().getText());
		return (T) stringBuilder.toString();
	}

	@Override
	public T visitKeyvalue(TLONParser.KeyvalueContext ctx) {
		return (T) ("\"" + ctx.ID().getText() + "\"" + ctx.POINTS().getText() + visit(ctx.expr()));
	}

	private String addIndentation(Integer depth) {
		StringBuilder stringBuilder = new StringBuilder("\n");
		for (Integer i = 0; i < depth; i++) {
			stringBuilder.append("\t");
		}
		return stringBuilder.toString();
	}
}
