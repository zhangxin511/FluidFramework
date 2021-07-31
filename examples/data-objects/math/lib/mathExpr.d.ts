/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import * as SearchMenu from "@fluid-example/search-menu";
import { IFluidObject } from "@fluidframework/core-interfaces";
import * as MergeTree from "@fluidframework/merge-tree";
export declare const cursorTex = " \\textcolor{#800080}{\\vert}";
export declare const cursorColor = "rgb(128, 0, 128)";
export declare const boxEmptyParam: (viewText: string) => string;
export declare enum MathTokenType {
    Variable = 0,
    PatternVariable = 1,
    PatternType = 2,
    INT = 3,
    REAL = 4,
    Command = 5,
    LCurly = 6,
    RCurly = 7,
    MidCommand = 8,
    EndCommand = 9,
    Space = 10,
    Newline = 11,
    EOI = 12,
    SUB = 13,
    ADD = 14,
    DIV = 15,
    MUL = 16,
    LEQ = 17,
    GEQ = 18,
    OPAREN = 19,
    CPAREN = 20,
    COMMA = 21,
    IMPLIES = 22,
    Equals = 23
}
export declare const Nope = -1;
export interface IMathCommand extends SearchMenu.ISearchMenuCommand {
    arity?: number;
    infix?: boolean;
    sub?: boolean;
    exp?: boolean;
    op?: Operator;
    prec?: TokenPrecedence;
    texString?: string;
    tokenType?: MathTokenType;
}
export declare const mathCmdTree: MergeTree.TST<IMathCommand>;
export declare function mathMenuCreate(context: any, boundingElm: HTMLElement, onSubmit: (s: string, cmd?: IMathCommand) => void): SearchMenu.ISearchBox;
export declare enum TokenPrecedence {
    NONE = 0,
    IMPLIES = 1,
    REL = 2,
    LOG = 3,
    IN = 4,
    ADD = 5,
    MUL = 6,
    NEG = 7,
    EXP = 8,
    UNDER = 9
}
export interface ITokenProperties {
    flags: TokenLexFlags;
    op?: Operator;
    precedence?: TokenPrecedence;
    rightAssoc?: boolean;
}
export declare enum TokenLexFlags {
    None = 0,
    PrimaryFirstSet = 1,
    Binop = 2,
    Relop = 6
}
export declare function tokenText(tok: MathToken): string;
declare enum Operator {
    IMPLIES = 0,
    EQ = 1,
    LEQ = 2,
    GEQ = 3,
    MUL = 4,
    DIV = 5,
    ADD = 6,
    SUB = 7,
    EXP = 8,
    UNDER = 9,
    IN = 10,
    NOTIN = 11,
    SUBSET = 12,
    SETMINUS = 13,
    PLUSMINUS = 14,
    INTERSECTION = 15,
    AND = 16,
    OR = 17,
    UNION = 18,
    CONG = 19,
    SUBSETEQ = 20,
    VDASH = 21,
    EQUIV = 22,
    OWNS = 23,
    FORALL = 24,
    EXISTS = 25
}
export declare function printTokens(tokIndex: number, mathCursor: number, tokens: MathToken[], mathText: string): void;
export declare function posAtToken(tokIndex: number, tokens: MathToken[]): number;
export declare function tokenAtPos(mathCursor: number, tokens: MathToken[]): number;
export declare function mathTokFwd(tokIndex: number, tokens: MathToken[]): number;
export interface IMathCursor {
    mathCursor: number;
    mathTokenIndex: number;
}
export interface IMathMarker extends MergeTree.Marker {
    mathTokens: MathToken[];
    mathText: string;
    mathInstance?: IFluidObject;
}
/**
 * This function updates the mathCursor and mathTokenIndex properties of mathMarker
 * @param mathMarker marker for end of math region
 */
export declare function bksp(mathMarker: IMathMarker, mc: IMathCursor): {
    start: number;
    end: number;
};
export declare function mathTokRev(tokIndex: number, tokens: MathToken[]): number;
export declare class MathToken {
    type: MathTokenType;
    start: number;
    end: number;
    cmdInfo?: IMathCommand;
    paramCmd?: MathToken;
    paramIndex?: number;
    isSymbol?: boolean;
    text?: string;
    constructor(type: MathTokenType, start: number, end: number, cmdInfo?: IMathCommand);
}
export declare class MathSymbolToken extends MathToken {
    cmdInfo?: IMathCommand;
    subCmd?: MathCommandToken;
    superCmd?: MathCommandToken;
    isSymbol: boolean;
    isModifier?: boolean;
    constructor(type: MathTokenType, start: number, end: number, cmdInfo?: IMathCommand);
}
export declare class MathCommandToken extends MathSymbolToken {
    cmdInfo?: IMathCommand;
    paramRefRemaining?: number;
    endTok?: MathToken;
    paramStarts: MathToken[];
    symbolModified?: MathSymbolToken;
    constructor(type: MathTokenType, start: number, end: number, cmdInfo?: IMathCommand);
}
export declare function transformInputCode(c: number): string;
interface ICharStream {
    chars: string;
    index: number;
}
export declare function lexSpace(tokens: MathToken[], charStream: ICharStream): void;
export declare function lexMath(mathBuffer: string): MathToken[];
interface ITokenStream {
    text: string;
    tokens: MathToken[];
    index: number;
    end: number;
}
export declare function tokStreamAtEOI(tokStream: ITokenStream): boolean;
export declare enum ExprType {
    INTEGER = 0,
    RATIONAL = 1,
    REAL = 2,
    VARIABLE = 3,
    PATTERNVAR = 4,
    BINOP = 5,
    UNOP = 6,
    TUPLE = 7,
    CALL = 8,
    ERROR = 9
}
interface IEnvironment {
    [s: string]: IExpr;
}
export declare function extractFirstVar(s: string): IVariable;
export declare function mulExprNoVar(env: IEnvironment, factor?: number): boolean;
export declare function solve(eqn: IExpr, v: IVariable): IExpr;
export declare function negateConstant(env: IEnvironment): boolean;
export declare function divrl(env: IEnvironment): boolean;
export interface IExpr {
    type: ExprType;
    pendingParens?: string;
    parenthesized?: boolean;
    minChar?: number;
    limChar?: number;
    value?: number;
    text?: string;
    pvarType?: PatternVarType;
    elements?: IExpr[];
    op?: Operator;
}
export interface ITuple extends IExpr {
    elements: IExpr[];
}
export interface IConstant extends IExpr {
    assignedVar?: IVariable;
}
export interface IVariable extends IExpr {
    text: string;
    sub?: IExpr;
}
declare enum PatternVarType {
    Const = 0,
    Var = 1,
    Expr = 2,
    Any = 3
}
export interface IPatternVar extends IVariable {
    pvarType: PatternVarType;
}
export declare function testEqn(s: string, norm?: boolean, vsolve?: IVariable): void;
export declare function testExprLine(s: string, tokenIndex: number, tokens: MathToken[]): void;
export declare function matchSolution(line: string, varName: string, varExpr: string): boolean;
export declare function testExpr(s: string): void;
export declare function testNorm(): void;
export declare function testSolve(): void;
export declare function testLCD(): void;
export declare function testMatch(): void;
export {};
//# sourceMappingURL=mathExpr.d.ts.map