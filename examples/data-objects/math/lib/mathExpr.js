/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import * as SearchMenu from "@fluid-example/search-menu";
import * as MergeTree from "@fluidframework/merge-tree";
import * as Katex from "katex";
import { CharacterCodes } from "./characterCodes";
export const cursorTex = " \\textcolor{#800080}{\\vert}";
export const cursorColor = "rgb(128, 0, 128)";
export const boxEmptyParam = (viewText) => viewText.replace(/{}/g, "{\\Box}");
export var MathTokenType;
(function (MathTokenType) {
    MathTokenType[MathTokenType["Variable"] = 0] = "Variable";
    MathTokenType[MathTokenType["PatternVariable"] = 1] = "PatternVariable";
    MathTokenType[MathTokenType["PatternType"] = 2] = "PatternType";
    MathTokenType[MathTokenType["INT"] = 3] = "INT";
    MathTokenType[MathTokenType["REAL"] = 4] = "REAL";
    MathTokenType[MathTokenType["Command"] = 5] = "Command";
    MathTokenType[MathTokenType["LCurly"] = 6] = "LCurly";
    MathTokenType[MathTokenType["RCurly"] = 7] = "RCurly";
    MathTokenType[MathTokenType["MidCommand"] = 8] = "MidCommand";
    MathTokenType[MathTokenType["EndCommand"] = 9] = "EndCommand";
    MathTokenType[MathTokenType["Space"] = 10] = "Space";
    MathTokenType[MathTokenType["Newline"] = 11] = "Newline";
    MathTokenType[MathTokenType["EOI"] = 12] = "EOI";
    MathTokenType[MathTokenType["SUB"] = 13] = "SUB";
    MathTokenType[MathTokenType["ADD"] = 14] = "ADD";
    MathTokenType[MathTokenType["DIV"] = 15] = "DIV";
    MathTokenType[MathTokenType["MUL"] = 16] = "MUL";
    MathTokenType[MathTokenType["LEQ"] = 17] = "LEQ";
    MathTokenType[MathTokenType["GEQ"] = 18] = "GEQ";
    MathTokenType[MathTokenType["OPAREN"] = 19] = "OPAREN";
    MathTokenType[MathTokenType["CPAREN"] = 20] = "CPAREN";
    MathTokenType[MathTokenType["COMMA"] = 21] = "COMMA";
    MathTokenType[MathTokenType["IMPLIES"] = 22] = "IMPLIES";
    MathTokenType[MathTokenType["Equals"] = 23] = "Equals";
})(MathTokenType || (MathTokenType = {}));
export const Nope = -1;
const addCommand = (cmdTree, command) => {
    if (command.texString) {
        command.iconHTML = Katex.renderToString(command.texString, { throwOnError: false });
    }
    cmdTree.put(command.key, command);
};
export const mathCmdTree = new MergeTree.TST();
export function mathMenuCreate(context, boundingElm, onSubmit) {
    return SearchMenu.searchBoxCreate(context, boundingElm, mathCmdTree, false, onSubmit);
}
const greekLetters = [
    "alpha", "beta", "gamma", "delta", "epsilon", "constepsilon",
    "zeta", "eta", "Gamma", "Delta", "Theta", "theta", "vartheta",
    "iota", "kappa", "lambda", "mu", "nu", "xi", "Lambda", "Xi",
    "Pi", "pi", "varpi", "rho", "varrho", "sigma", "varsigma",
    "Sigma", "Upsilon", "Phi", "upsilon", "phi", "varphi", "chi",
    "psi", "omega", "Psi", "Omega",
];
const bigOpsSubExp = [
    "int", "sum", "prod", "coprod", "oint",
];
const bigOpsSub = [
    "bigcup", "bigcap", "bigsqcup", "bigvee", "bigwedge", "lim",
];
export var TokenPrecedence;
(function (TokenPrecedence) {
    TokenPrecedence[TokenPrecedence["NONE"] = 0] = "NONE";
    TokenPrecedence[TokenPrecedence["IMPLIES"] = 1] = "IMPLIES";
    TokenPrecedence[TokenPrecedence["REL"] = 2] = "REL";
    TokenPrecedence[TokenPrecedence["LOG"] = 3] = "LOG";
    TokenPrecedence[TokenPrecedence["IN"] = 4] = "IN";
    TokenPrecedence[TokenPrecedence["ADD"] = 5] = "ADD";
    TokenPrecedence[TokenPrecedence["MUL"] = 6] = "MUL";
    TokenPrecedence[TokenPrecedence["NEG"] = 7] = "NEG";
    TokenPrecedence[TokenPrecedence["EXP"] = 8] = "EXP";
    TokenPrecedence[TokenPrecedence["UNDER"] = 9] = "UNDER";
})(TokenPrecedence || (TokenPrecedence = {}));
export var TokenLexFlags;
(function (TokenLexFlags) {
    TokenLexFlags[TokenLexFlags["None"] = 0] = "None";
    TokenLexFlags[TokenLexFlags["PrimaryFirstSet"] = 1] = "PrimaryFirstSet";
    TokenLexFlags[TokenLexFlags["Binop"] = 2] = "Binop";
    TokenLexFlags[TokenLexFlags["Relop"] = 6] = "Relop";
})(TokenLexFlags || (TokenLexFlags = {}));
const singleTokText = [];
singleTokText[MathTokenType.SUB] = "-";
singleTokText[MathTokenType.DIV] = "";
singleTokText[MathTokenType.ADD] = "+";
singleTokText[MathTokenType.OPAREN] = "(";
singleTokText[MathTokenType.CPAREN] = ")";
singleTokText[MathTokenType.COMMA] = ",";
export function tokenText(tok) {
    if (tok.text !== undefined) {
        return tok.text;
    }
    else {
        return singleTokText[tok.type];
    }
}
var Operator;
(function (Operator) {
    Operator[Operator["IMPLIES"] = 0] = "IMPLIES";
    Operator[Operator["EQ"] = 1] = "EQ";
    Operator[Operator["LEQ"] = 2] = "LEQ";
    Operator[Operator["GEQ"] = 3] = "GEQ";
    Operator[Operator["MUL"] = 4] = "MUL";
    Operator[Operator["DIV"] = 5] = "DIV";
    Operator[Operator["ADD"] = 6] = "ADD";
    Operator[Operator["SUB"] = 7] = "SUB";
    Operator[Operator["EXP"] = 8] = "EXP";
    Operator[Operator["UNDER"] = 9] = "UNDER";
    Operator[Operator["IN"] = 10] = "IN";
    Operator[Operator["NOTIN"] = 11] = "NOTIN";
    Operator[Operator["SUBSET"] = 12] = "SUBSET";
    Operator[Operator["SETMINUS"] = 13] = "SETMINUS";
    Operator[Operator["PLUSMINUS"] = 14] = "PLUSMINUS";
    Operator[Operator["INTERSECTION"] = 15] = "INTERSECTION";
    Operator[Operator["AND"] = 16] = "AND";
    Operator[Operator["OR"] = 17] = "OR";
    Operator[Operator["UNION"] = 18] = "UNION";
    Operator[Operator["CONG"] = 19] = "CONG";
    Operator[Operator["SUBSETEQ"] = 20] = "SUBSETEQ";
    Operator[Operator["VDASH"] = 21] = "VDASH";
    Operator[Operator["EQUIV"] = 22] = "EQUIV";
    Operator[Operator["OWNS"] = 23] = "OWNS";
    Operator[Operator["FORALL"] = 24] = "FORALL";
    Operator[Operator["EXISTS"] = 25] = "EXISTS";
})(Operator || (Operator = {}));
const texString = [];
texString[Operator.ADD] = "+";
texString[Operator.SUB] = "-";
texString[Operator.DIV] = "\\frac";
texString[Operator.EQ] = "=";
texString[Operator.UNDER] = "_";
texString[Operator.EXP] = "^";
texString[Operator.LEQ] = "\\leq ";
texString[Operator.GEQ] = "\\geq ";
texString[Operator.IMPLIES] = "\\Rightarrow ";
texString[Operator.MUL] = "";
texString[Operator.IN] = "\\in ";
texString[Operator.SETMINUS] = "\\setminus ";
texString[Operator.PLUSMINUS] = "\\pm ";
texString[Operator.INTERSECTION] = "\\cap ";
texString[Operator.AND] = "\\wedge ";
texString[Operator.OR] = "\\vee ";
texString[Operator.UNION] = "\\cup ";
texString[Operator.CONG] = "\\cong ";
texString[Operator.SUBSETEQ] = "\\subseteq ";
texString[Operator.VDASH] = "\\vdash ";
texString[Operator.EQUIV] = "\\equiv ";
texString[Operator.OWNS] = "\\owns ";
texString[Operator.NOTIN] = "\\notin ";
texString[Operator.SUBSET] = "\\subset ";
const tokenProps = [];
tokenProps[MathTokenType.INT] = { flags: TokenLexFlags.PrimaryFirstSet };
tokenProps[MathTokenType.REAL] = { flags: TokenLexFlags.PrimaryFirstSet };
tokenProps[MathTokenType.PatternVariable] = { flags: TokenLexFlags.PrimaryFirstSet };
tokenProps[MathTokenType.Variable] = { flags: TokenLexFlags.PrimaryFirstSet };
tokenProps[MathTokenType.Command] = { flags: TokenLexFlags.PrimaryFirstSet };
tokenProps[MathTokenType.OPAREN] = { flags: TokenLexFlags.PrimaryFirstSet };
tokenProps[MathTokenType.ADD] = {
    flags: TokenLexFlags.Binop,
    precedence: TokenPrecedence.ADD, op: Operator.ADD,
};
tokenProps[MathTokenType.SUB] = { flags: TokenLexFlags.Binop, precedence: TokenPrecedence.ADD, op: Operator.SUB };
tokenProps[MathTokenType.DIV] = {
    flags: TokenLexFlags.Binop,
    precedence: TokenPrecedence.MUL, op: Operator.DIV,
};
tokenProps[MathTokenType.MUL] = { flags: TokenLexFlags.Binop, precedence: TokenPrecedence.MUL, op: Operator.MUL };
tokenProps[MathTokenType.Equals] = { flags: TokenLexFlags.Relop, precedence: TokenPrecedence.REL, op: Operator.EQ };
tokenProps[MathTokenType.LEQ] = { flags: TokenLexFlags.Relop, precedence: TokenPrecedence.REL, op: Operator.LEQ };
tokenProps[MathTokenType.GEQ] = { flags: TokenLexFlags.Relop, precedence: TokenPrecedence.REL, op: Operator.GEQ };
tokenProps[MathTokenType.IMPLIES] = { flags: TokenLexFlags.Binop, precedence: TokenPrecedence.IMPLIES, op: Operator.IMPLIES };
const operatorToPrecedence = [];
operatorToPrecedence[Operator.IMPLIES] = TokenPrecedence.IMPLIES;
operatorToPrecedence[Operator.EQ] = TokenPrecedence.REL;
operatorToPrecedence[Operator.LEQ] = TokenPrecedence.REL;
operatorToPrecedence[Operator.GEQ] = TokenPrecedence.REL;
operatorToPrecedence[Operator.IN] = TokenPrecedence.IN;
operatorToPrecedence[Operator.MUL] = TokenPrecedence.MUL;
operatorToPrecedence[Operator.DIV] = TokenPrecedence.MUL;
operatorToPrecedence[Operator.ADD] = TokenPrecedence.ADD;
operatorToPrecedence[Operator.SUB] = TokenPrecedence.ADD;
operatorToPrecedence[Operator.UNDER] = TokenPrecedence.EXP;
operatorToPrecedence[Operator.EXP] = TokenPrecedence.EXP;
operatorToPrecedence[Operator.IN] = TokenPrecedence.IN;
operatorToPrecedence[Operator.SETMINUS] = TokenPrecedence.ADD;
operatorToPrecedence[Operator.PLUSMINUS] = TokenPrecedence.ADD;
operatorToPrecedence[Operator.INTERSECTION] = TokenPrecedence.MUL;
operatorToPrecedence[Operator.UNION] = TokenPrecedence.MUL;
operatorToPrecedence[Operator.AND] = TokenPrecedence.LOG;
operatorToPrecedence[Operator.OR] = TokenPrecedence.LOG;
operatorToPrecedence[Operator.CONG] = TokenPrecedence.REL;
operatorToPrecedence[Operator.SUBSETEQ] = TokenPrecedence.IN;
operatorToPrecedence[Operator.SUBSET] = TokenPrecedence.IN;
operatorToPrecedence[Operator.VDASH] = TokenPrecedence.IMPLIES;
operatorToPrecedence[Operator.EQUIV] = TokenPrecedence.REL;
operatorToPrecedence[Operator.OWNS] = TokenPrecedence.IN;
operatorToPrecedence[Operator.NOTIN] = TokenPrecedence.IN;
// SETMINUS, PLUSMINUS, INTERSECTION, AND, OR, UNION, CONG, SUBSETEQ, VDASH, EQUIV, OWNS
const binaryOperators = [
    { key: "setminus", op: Operator.SETMINUS },
    { key: "times", op: Operator.MUL },
    { key: "div", op: Operator.DIV },
    { key: "pm", op: Operator.PLUSMINUS },
    { key: "cap", op: Operator.INTERSECTION },
    { key: "wedge", op: Operator.AND },
    { key: "vee", op: Operator.OR },
    { key: "land", op: Operator.AND },
    { key: "cup", op: Operator.UNION },
];
const binaryRelations = [
    { key: "leq", op: Operator.LEQ },
    { key: "geq", op: Operator.GEQ },
    { key: "cong", op: Operator.CONG },
    { key: "in", op: Operator.IN },
    { key: "notin", op: Operator.NOTIN },
    { key: "subset", op: Operator.SUBSET },
    { key: "subseteq", op: Operator.SUBSETEQ },
    { key: "vdash", op: Operator.VDASH },
    { key: "equiv", op: Operator.EQUIV },
    { key: "ni", op: Operator.OWNS },
    { key: "owns", op: Operator.OWNS },
    { key: "implies", op: Operator.IMPLIES },
];
const logic = [
    { key: "forall", op: Operator.FORALL },
    { key: "exists", op: Operator.EXISTS },
];
greekLetters.map((letter) => addCommand(mathCmdTree, { key: letter, arity: 0, texString: "\\" + letter + " ", tokenType: MathTokenType.Variable }));
bigOpsSubExp.map((name) => {
    addCommand(mathCmdTree, {
        key: name, arity: 0, sub: true, exp: true,
        texString: "\\" + name + " ",
    });
    addCommand(mathCmdTree, {
        key: name + "-over", arity: 0, sub: true, exp: true,
        texString: "\\" + name + "_{}^{}",
    });
});
bigOpsSub.map((name) => addCommand(mathCmdTree, {
    key: name, arity: 0, sub: true,
    texString: "\\" + name + " ",
}));
binaryOperators.map((oper) => addCommand(mathCmdTree, {
    key: oper.key, arity: 2, infix: true,
    op: oper.op, texString: "\\" + oper.key + " ",
}));
binaryRelations.map((oper) => addCommand(mathCmdTree, {
    key: oper.key, arity: 2, infix: true,
    op: oper.op, texString: "\\" + oper.key + " ",
}));
logic.map((oper) => addCommand(mathCmdTree, {
    key: oper.key, arity: 1,
    op: oper.op, texString: "\\" + oper.key + " ",
}));
const superCmd = { key: "^", arity: 1 };
const subCmd = { key: "_", arity: 1 };
addCommand(mathCmdTree, { key: "cos", arity: 0, exp: true, texString: "\\cos " });
addCommand(mathCmdTree, { key: "log", arity: 0, exp: true, texString: "\\log " });
addCommand(mathCmdTree, { key: "ln", arity: 0, exp: true, texString: "\\ln " });
addCommand(mathCmdTree, { key: "infty", arity: 0, texString: "\\infty " });
addCommand(mathCmdTree, { key: "Box", arity: 0, texString: "\\Box " });
addCommand(mathCmdTree, { key: "nabla", arity: 0, texString: "\\nabla " });
addCommand(mathCmdTree, { key: "partial", arity: 0, exp: true, texString: "\\partial " });
addCommand(mathCmdTree, { key: "neg", arity: 0, texString: "\\neg " });
addCommand(mathCmdTree, { key: "overline", arity: 1, texString: "\\overline{} " });
addCommand(mathCmdTree, { key: "circ", arity: 0, texString: "\\circ " });
addCommand(mathCmdTree, { key: "sin", arity: 0, exp: true, texString: "\\sin " });
addCommand(mathCmdTree, { key: "sqrt", arity: 1, texString: "\\sqrt{} " });
addCommand(mathCmdTree, { key: "to", arity: 0, texString: "\\to " });
addCommand(mathCmdTree, { key: "frac", arity: 2, texString: "\\frac{}{} " });
export function printTokens(tokIndex, mathCursor, tokens, mathText) {
    console.log(`Math indx ${tokIndex} cp ${mathCursor} is`);
    let buf = "";
    for (let i = 0, len = tokens.length; i < len; i++) {
        const tok = tokens[i];
        buf += `${i} [${tok.start}, ${tok.end}): ${MathTokenType[tok.type]} ${mathText.substring(tok.start, tok.end)}`;
        if (tok.endTok) {
            buf += `et: ${tok.endTok.end}`;
        }
        buf += "\n";
    }
    console.log(buf);
}
export function posAtToken(tokIndex, tokens) {
    let pos = 0;
    for (let i = 0; i < tokIndex; i++) {
        if (i >= tokens.length) {
            return pos;
        }
        const tok = tokens[i];
        pos += (tok.end - tok.start);
    }
    return pos;
}
export function tokenAtPos(mathCursor, tokens) {
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].start === mathCursor) {
            return i;
        }
    }
    return tokens.length;
}
export function mathTokFwd(tokIndex, tokens) {
    const toklen = tokens.length;
    let _tokIndex = tokIndex + 1;
    while (_tokIndex < toklen) {
        if ((tokens[_tokIndex].type === MathTokenType.Space) ||
            ((tokens[_tokIndex].type === MathTokenType.Command) &&
                (tokens[_tokIndex].isModifier))) {
            _tokIndex++;
        }
        else {
            break;
        }
    }
    return _tokIndex;
}
/**
 * This function updates the mathCursor and mathTokenIndex properties of mathMarker
 * @param mathMarker marker for end of math region
 */
export function bksp(mathMarker, mc) {
    let prevTokIndex = mathTokRev(mc.mathTokenIndex, mathMarker.mathTokens);
    while ((prevTokIndex >= 0) &&
        ((mathMarker.mathTokens[prevTokIndex].type === MathTokenType.EndCommand) ||
            (mathMarker.mathTokens[prevTokIndex].type === MathTokenType.MidCommand))) {
        prevTokIndex--;
    }
    if (prevTokIndex >= 0) {
        const prevTok = mathMarker.mathTokens[prevTokIndex];
        mc.mathTokenIndex = prevTokIndex;
        mc.mathCursor = prevTok.start;
        if ((prevTok.type === MathTokenType.Command) &&
            (prevTok.cmdInfo.arity > 0)) {
            const prevCommandTok = prevTok;
            return { start: prevTok.start, end: prevCommandTok.endTok.end };
        }
        else if ((prevTok.isSymbol) && (hasSymbolModifiers(prevTok))) {
            return { start: prevTok.start, end: furthestModifierEnd(prevTok) };
        }
        else {
            return { start: prevTok.start, end: prevTok.end };
        }
    }
}
export function mathTokRev(tokIndex, tokens) {
    let _tokIndex = tokIndex - 1;
    if (_tokIndex > (tokens.length - 1)) {
        _tokIndex = tokens.length - 1;
    }
    while (_tokIndex >= 0) {
        const tok = tokens[_tokIndex];
        if ((tok.type === MathTokenType.Space) ||
            ((tok.type === MathTokenType.Command) &&
                (tok.isModifier))) {
            _tokIndex--;
        }
        else {
            break;
        }
    }
    if (_tokIndex >= 0) {
        return _tokIndex;
    }
    else {
        return Nope;
    }
}
export class MathToken {
    constructor(type, start, end, cmdInfo) {
        this.type = type;
        this.start = start;
        this.end = end;
        this.cmdInfo = cmdInfo;
    }
}
export class MathSymbolToken extends MathToken {
    constructor(type, start, end, cmdInfo) {
        super(type, start, end, cmdInfo);
        this.cmdInfo = cmdInfo;
        this.isSymbol = true;
    }
}
function hasSymbolModifiers(symTok) {
    return symTok.subCmd || symTok.superCmd;
}
function furthestModifierEnd(symTok) {
    if (symTok.subCmd) {
        if (symTok.superCmd) {
            return Math.max(symTok.subCmd.endTok.end, symTok.superCmd.endTok.end);
        }
        else {
            return symTok.subCmd.endTok.end;
        }
    }
    else {
        return symTok.superCmd.endTok.end;
    }
}
export class MathCommandToken extends MathSymbolToken {
    constructor(type, start, end, cmdInfo) {
        super(type, start, end, cmdInfo);
        this.cmdInfo = cmdInfo;
    }
}
function isAlpha(c) {
    return ((c >= CharacterCodes.a) && (c <= CharacterCodes.z)) ||
        ((c >= CharacterCodes.A) && (c <= CharacterCodes.Z));
}
function isNumber(c) {
    return ((c >= CharacterCodes._0) && (c <= CharacterCodes._9));
}
function isMathPunct(c) {
    return (c === CharacterCodes.openParen) ||
        (c === CharacterCodes.closeParen) ||
        (c === CharacterCodes.equals) ||
        (c === CharacterCodes.minus) ||
        (c === CharacterCodes.plus);
}
export function transformInputCode(c) {
    if (isAlpha(c) || isMathPunct(c) || isNumber(c)) {
        return String.fromCharCode(c);
    }
    else {
        switch (c) {
            case CharacterCodes.caret:
                return "^{}";
            case CharacterCodes._:
                return "_{}";
            case CharacterCodes.cr:
                // AF: restrict to top-level (pass into this function whether top-level)
                return "\n";
            default:
        }
    }
}
const eoc = Nope;
function charStreamPeek(charStream) {
    return charStreamGet(charStream, false);
}
function charStreamAdvance(charStream, amt = 1) {
    charStream.index += amt;
    if (charStream.index > charStream.chars.length) {
        charStream.index = charStream.chars.length;
    }
}
function charStreamRetreat(charStream, amt) {
    charStream.index -= amt;
    if (charStream.index < 0) {
        charStream.index = 0;
    }
}
function charStreamGet(charStream, advance = true) {
    const charsLen = charStream.chars.length;
    if (charStream.index < charsLen) {
        const ch = charStream.chars.charCodeAt(charStream.index);
        if (advance) {
            charStream.index++;
        }
        return ch;
    }
    else {
        return eoc;
    }
}
function charStreamSubstring(start, charStream) {
    return charStream.chars.substring(start, charStream.index);
}
function isDecimalDigit(c) {
    return c >= CharacterCodes._0 && c <= CharacterCodes._9;
}
function isVariableChar(c) {
    return (c >= CharacterCodes.a && c <= CharacterCodes.z) ||
        (c >= CharacterCodes.A && c <= CharacterCodes.Z);
}
// assumes char stream points at first character in identifier
function lexId(charStream) {
    const startOffset = charStream.index;
    let ch;
    do {
        ch = charStreamGet(charStream);
    } while (isVariableChar(ch));
    if (ch !== eoc) {
        charStreamRetreat(charStream, 1);
    }
    return charStreamSubstring(startOffset, charStream);
}
function lexCommand(tokens, charStream, cmdStack) {
    const startPos = charStream.index;
    charStreamAdvance(charStream); // skip the backslash
    const key = lexId(charStream);
    let tokenType = MathTokenType.Command;
    const cmd = mathCmdTree.get(key);
    if (cmd.tokenType !== undefined) {
        tokenType = cmd.tokenType;
    }
    if (cmd.arity > 0) {
        // consume the "{"
        charStreamAdvance(charStream);
    }
    const tok = new MathCommandToken(tokenType, startPos, charStream.index, cmd);
    tokens.push(tok);
    if (cmd.arity > 0) {
        tok.paramRefRemaining = cmd.arity;
        cmdStack.push(tok);
    }
    return tok;
}
export function lexSpace(tokens, charStream) {
    const startPos = charStream.index;
    let c = charStreamPeek(charStream);
    while (c === CharacterCodes.space) {
        charStreamAdvance(charStream);
        c = charStreamPeek(charStream);
    }
    if (startPos < charStream.index) {
        tokens.push(new MathToken(MathTokenType.Space, startPos, charStream.index));
    }
}
// chars not recognized as math input (such as "!") stopped
// at input filter level and not expected
function lexCharStream(charStream, tokens, cmdStack) {
    let prevSymTok;
    function modSymTok(curTok, isSub = true) {
        if (prevSymTok) {
            let symTok = prevSymTok;
            if (prevSymTok.isModifier) {
                symTok = symTok.symbolModified;
            }
            if (isSub) {
                symTok.subCmd = curTok;
            }
            else {
                symTok.superCmd = curTok;
            }
            curTok.symbolModified = symTok;
        }
    }
    function lexEq() {
        const pos = charStream.index;
        // first character is '='
        charStreamAdvance(charStream);
        const nextChar = charStreamPeek(charStream);
        if (nextChar === CharacterCodes.greaterThan) {
            // recognized an '=>'
            charStreamAdvance(charStream);
            return new MathToken(MathTokenType.IMPLIES, pos, pos + 2);
        }
        else {
            // recognized "="
            return new MathToken(MathTokenType.Equals, pos, pos + 1);
        }
    }
    // reals also
    function lexNumber() {
        const start = charStream.index;
        let ch;
        do {
            ch = charStreamGet(charStream);
        } while (isDecimalDigit(ch));
        if (ch !== eoc) {
            charStreamRetreat(charStream, 1);
        }
        const numString = charStreamSubstring(start, charStream);
        const tok = new MathToken(MathTokenType.INT, start, charStream.index);
        tok.text = numString;
        return tok;
    }
    let c = charStreamPeek(charStream);
    while (c !== eoc) {
        // single character variables (unless preceded by '?')
        if (isVariableChar(c)) {
            const start = charStream.index;
            charStreamAdvance(charStream);
            const vartok = new MathSymbolToken(MathTokenType.Variable, start, charStream.index);
            prevSymTok = vartok;
            vartok.text = charStreamSubstring(start, charStream);
            if (charStreamPeek(charStream) === CharacterCodes.colon) {
                // it's a pattern variable!
                vartok.type = MathTokenType.PatternVariable;
            }
            tokens.push(vartok);
        }
        else if (isDecimalDigit(c)) {
            tokens.push(lexNumber());
        }
        else {
            switch (c) {
                case CharacterCodes.backslash:
                    const cmdTok = lexCommand(tokens, charStream, cmdStack);
                    if ((cmdTok.type === MathTokenType.Variable) ||
                        (cmdTok.cmdInfo && (cmdTok.cmdInfo.arity === 0))) {
                        prevSymTok = cmdTok;
                    }
                    break;
                case CharacterCodes.equals:
                    tokens.push(lexEq());
                    break;
                case CharacterCodes.slash:
                    tokens.push(new MathToken(MathTokenType.DIV, charStream.index, charStream.index + 1));
                    charStreamAdvance(charStream);
                    break;
                case CharacterCodes.plus:
                    tokens.push(new MathToken(MathTokenType.ADD, charStream.index, charStream.index + 1));
                    charStreamAdvance(charStream);
                    break;
                case CharacterCodes.comma:
                    tokens.push(new MathToken(MathTokenType.COMMA, charStream.index, charStream.index + 1));
                    charStreamAdvance(charStream);
                    break;
                case CharacterCodes.minus:
                    tokens.push(new MathToken(MathTokenType.SUB, charStream.index, charStream.index + 1));
                    charStreamAdvance(charStream);
                    break;
                case CharacterCodes.caret: {
                    const pos = charStream.index;
                    const tok = new MathCommandToken(MathTokenType.Command, pos, pos + 2, superCmd);
                    tok.paramRefRemaining = 1;
                    tok.isModifier = true;
                    cmdStack.push(tok);
                    modSymTok(tok, false);
                    tokens.push(tok);
                    charStreamAdvance(charStream, 2);
                    break;
                }
                case CharacterCodes._: {
                    const pos = charStream.index;
                    const tok = new MathCommandToken(MathTokenType.Command, pos, pos + 2, subCmd);
                    tok.paramRefRemaining = 1;
                    tok.isModifier = true;
                    cmdStack.push(tok);
                    modSymTok(tok);
                    tokens.push(tok);
                    charStreamAdvance(charStream, 2);
                    break;
                }
                case CharacterCodes.openBrace:
                    console.log(`shouldn't see { at pos ${charStream.index})`);
                    printTokens(0, 0, tokens, charStream.chars);
                    charStreamAdvance(charStream);
                    break;
                case CharacterCodes.closeBrace: {
                    const start = charStream.index;
                    let tokenType = MathTokenType.RCurly;
                    let cmd;
                    if (cmdStack.length > 0) {
                        cmd = cmdStack[cmdStack.length - 1];
                        if (cmd.paramRefRemaining > 1) {
                            charStreamAdvance(charStream); // consume the following "{"
                            tokenType = MathTokenType.MidCommand;
                        }
                    }
                    charStreamAdvance(charStream);
                    const tok = new MathToken(tokenType, start, charStream.index);
                    tokens.push(tok);
                    if (cmd !== undefined) {
                        tok.paramCmd = cmd;
                        tok.paramIndex = cmd.cmdInfo.arity - cmd.paramRefRemaining;
                        cmd.paramRefRemaining--;
                        if (cmd.paramRefRemaining === 0) {
                            cmdStack.pop();
                            tok.type = MathTokenType.EndCommand;
                            cmd.endTok = tok;
                        }
                    }
                    break;
                }
                case CharacterCodes.openParen:
                    tokens.push(new MathToken(MathTokenType.OPAREN, charStream.index, charStream.index + 1));
                    charStreamAdvance(charStream);
                    break;
                case CharacterCodes.closeParen:
                    tokens.push(new MathToken(MathTokenType.CPAREN, charStream.index, charStream.index + 1));
                    charStreamAdvance(charStream);
                    break;
                case CharacterCodes.space:
                    lexSpace(tokens, charStream);
                    break;
                case CharacterCodes.linefeed:
                    tokens.push(new MathToken(MathTokenType.Newline, charStream.index, charStream.index + 1));
                    charStreamAdvance(charStream);
                    break;
                case eoc:
                    break;
                case CharacterCodes.question: {
                    charStreamAdvance(charStream);
                    const start = charStream.index;
                    const vartext = lexId(charStream);
                    const vartok = new MathToken(MathTokenType.PatternVariable, start, charStream.index);
                    vartok.text = vartext;
                    tokens.push(vartok);
                    break;
                }
                case CharacterCodes.colon: {
                    charStreamAdvance(charStream);
                    const start = charStream.index;
                    const varTypeText = lexId(charStream);
                    const vartok = new MathToken(MathTokenType.PatternType, start, charStream.index);
                    vartok.text = varTypeText;
                    tokens.push(vartok);
                    break;
                }
                default:
                    const ch = charStream.chars.charAt(charStream.index);
                    console.log(`shouldn't see ${ch} at pos ${charStream.index})`);
                    printTokens(0, 0, tokens, charStream.chars);
                    charStreamAdvance(charStream);
            }
        }
        c = charStreamPeek(charStream);
    }
    return tokens;
}
export function lexMath(mathBuffer) {
    return lexCharStream({ chars: mathBuffer, index: 0 }, [], []);
}
function tokStreamPeek(tokStream) {
    return tokStreamGet(tokStream, false);
}
export function tokStreamAtEOI(tokStream) {
    let tokenEndIndex = tokStream.tokens.length;
    if (tokStream.end >= 0) {
        tokenEndIndex = tokStream.end;
    }
    return (tokenEndIndex === tokStream.index);
}
function tokStreamAdvance(tokStream) {
    tokStreamGet(tokStream, true);
}
function tokStreamGet(tokStream, advance = true) {
    let tokenEndIndex = tokStream.tokens.length;
    if (tokStream.end >= 0) {
        tokenEndIndex = tokStream.end;
    }
    if (tokStream.index < tokenEndIndex) {
        const tok = tokStream.tokens[tokStream.index];
        if (advance) {
            tokStream.index++;
        }
        return tok;
    }
    else {
        return { end: Nope, start: Nope, type: MathTokenType.EOI };
    }
}
function tokStreamCreateFromRange(text, tokens, start, end) {
    return { text, tokens, index: start, end };
}
function tokStreamCreate(text, tokens, filter = true) {
    let _tokens = tokens;
    if (filter) {
        _tokens = _tokens.filter((v) => v.type !== MathTokenType.Space);
    }
    return tokStreamCreateFromRange(text, _tokens, 0, Nope);
}
export var ExprType;
(function (ExprType) {
    ExprType[ExprType["INTEGER"] = 0] = "INTEGER";
    ExprType[ExprType["RATIONAL"] = 1] = "RATIONAL";
    ExprType[ExprType["REAL"] = 2] = "REAL";
    ExprType[ExprType["VARIABLE"] = 3] = "VARIABLE";
    ExprType[ExprType["PATTERNVAR"] = 4] = "PATTERNVAR";
    ExprType[ExprType["BINOP"] = 5] = "BINOP";
    ExprType[ExprType["UNOP"] = 6] = "UNOP";
    ExprType[ExprType["TUPLE"] = 7] = "TUPLE";
    ExprType[ExprType["CALL"] = 8] = "CALL";
    ExprType[ExprType["ERROR"] = 9] = "ERROR";
})(ExprType || (ExprType = {}));
var Constants;
(function (Constants) {
    function matchConstant(c, e) {
        if (isConstant(e)) {
            const prom = promote(c, e);
            if (prom.c1.type === ExprType.RATIONAL) {
                const r1 = prom.c1;
                const r2 = prom.c2;
                return (r1.a === r2.a) && (r1.b === r2.b);
            }
            else {
                return prom.c1.value === prom.c2.value;
            }
        }
        return false;
    }
    Constants.matchConstant = matchConstant;
    function makeInt(n) {
        return { type: ExprType.INTEGER, value: n };
    }
    Constants.makeInt = makeInt;
    function rationalOp(op, r1, r2) {
        const l = lcd(r1, r2);
        const _r1 = l.r1;
        const _r2 = l.r2;
        switch (op) {
            case Operator.ADD:
                return { type: ExprType.RATIONAL, a: _r1.a + _r2.a, b: _r1.b };
            case Operator.SUB:
                return { type: ExprType.RATIONAL, a: _r1.a - _r2.a, b: _r1.b };
            case Operator.MUL:
                return simplifyRational({ type: ExprType.RATIONAL, a: _r1.a * _r2.a, b: _r1.b * _r1.b });
            case Operator.DIV:
                return simplifyRational({ type: ExprType.RATIONAL, a: _r1.a * _r2.b, b: _r1.b * _r2.a });
            case Operator.EXP:
                if (_r2.b === 1) {
                    return simplifyRational({ type: ExprType.RATIONAL, a: Math.pow(_r1.a, _r2.a), b: Math.pow(_r1.b, _r2.a) });
                }
                else if ((_r2.a % _r2.b) === 0) {
                    const exp = _r2.a / _r2.b;
                    return simplifyRational({ type: ExprType.RATIONAL, a: Math.pow(_r1.a, exp), b: Math.pow(_r1.b, exp) });
                }
                else {
                    // punt to real
                    return ({ type: ExprType.REAL, value: Math.pow(_r1.a / _r1.b, _r2.a / _r2.b) });
                }
            default:
        }
    }
    Constants.rationalOp = rationalOp;
    function negate(c) {
        if (c.type === ExprType.RATIONAL) {
            const r = c;
            const rat = { type: ExprType.RATIONAL, a: -r.a, b: r.b };
            return rat;
        }
        else {
            const real = c;
            return { type: c.type, value: -real.value };
        }
    }
    Constants.negate = negate;
    function isNegative(c) {
        if (c.type === ExprType.RATIONAL) {
            const r = c;
            return ((r.a < 0) && (r.b > 0)) || ((r.a > 0) && (r.b < 0));
        }
        else {
            const real = c;
            return real.value < 0;
        }
    }
    Constants.isNegative = isNegative;
    // update to handle negative integers and rationals
    function gcd(a, b) {
        if (b === 0) {
            return a;
        }
        else if (a === 0) {
            return b;
        }
        else {
            return gcd(b, a % b);
        }
    }
    function lcm(k1, k2) {
        return (Math.abs(k1 * k2) / gcd(k1, k2));
    }
    function lcd(r1, r2) {
        if (r2.b === r1.b) {
            return { r1, r2 };
        }
        else {
            const d = lcm(r1.b, r2.b);
            let f = d / r1.b;
            let nr1;
            if (r1.a === 0) {
                nr1 = { type: ExprType.RATIONAL, a: 0, b: d };
            }
            else {
                nr1 = { type: ExprType.RATIONAL, a: f * r1.a, b: f * r1.b };
            }
            f = d / r2.b;
            let nr2;
            if (r2.a === 0) {
                nr2 = { type: ExprType.RATIONAL, a: 0, b: d };
            }
            else {
                nr2 = { type: ExprType.RATIONAL, a: f * r2.a, b: f * r2.b };
            }
            return { r1: nr1, r2: nr2 };
        }
    }
    Constants.lcd = lcd;
    function simplifyRational(rat) {
        if ((rat.a % rat.b) === 0) {
            return { type: ExprType.INTEGER, value: rat.a / rat.b };
        }
        const d = gcd(rat.a, rat.b);
        if (d === 1) {
            return rat;
        }
        else {
            const resrat = { type: ExprType.RATIONAL, a: rat.a / d, b: rat.b / d };
            return resrat;
        }
    }
    Constants.simplifyRational = simplifyRational;
    function convertConstant(c, type) {
        if (c.type < type) {
            if (c.type === ExprType.INTEGER) {
                if (type === ExprType.REAL) {
                    return { type: ExprType.REAL, value: c.value };
                }
                else {
                    // type == ExprType.RATIONAL
                    const rat = { type: ExprType.RATIONAL, a: c.value, b: 1 };
                    return rat;
                }
            }
            else if (c.type === ExprType.RATIONAL) {
                // type == ExprType.REAL
                const rat = c;
                return { type: ExprType.REAL, value: rat.a / rat.b };
            }
        }
        else {
            return c;
        }
    }
    Constants.convertConstant = convertConstant;
    function promote(a, b) {
        if (a.type === b.type) {
            return { c1: a, c2: b };
        }
        else if (a.type < b.type) {
            return { c1: convertConstant(a, b.type), c2: b };
        }
        else {
            return { c1: a, c2: convertConstant(b, a.type) };
        }
    }
    Constants.promote = promote;
})(Constants || (Constants = {}));
function exprToTexParens(expr) {
    return exprToTex(expr, true, TokenPrecedence.NONE, false, true);
}
function isInfix(op) {
    return (op !== Operator.DIV);
}
function isParamOp(op) {
    return (op === Operator.EXP) || (op === Operator.UNDER);
}
function exprToTex(expr, inputMode = true, prevPrecedence = TokenPrecedence.NONE, left = false, alwaysParens = false) {
    let tex = expr.pendingParens ? expr.pendingParens : "";
    const showParens = alwaysParens || (inputMode && (expr.parenthesized));
    let op1Tex;
    let op2Tex;
    switch (expr.type) {
        case ExprType.TUPLE: {
            const tuple = expr;
            if (!expr.pendingParens) {
                tex += "(";
            }
            for (let i = 0, len = tuple.elements.length; i < len; i++) {
                if (i > 0) {
                    tex += ",";
                }
                tex += exprToTex(tuple.elements[i], inputMode, TokenPrecedence.MUL, false, alwaysParens);
            }
            if (!expr.pendingParens) {
                tex += ")";
            }
            break;
        }
        case ExprType.BINOP:
            const binex = expr;
            const precedence = operatorToPrecedence[binex.op];
            if (isInfix(binex.op)) {
                const paramOp = isParamOp(binex.op);
                op1Tex = exprToTex(binex.operand1, inputMode, precedence, true, alwaysParens);
                let rightPrec = precedence;
                if (paramOp) {
                    rightPrec = TokenPrecedence.NONE;
                }
                op2Tex = exprToTex(binex.operand2, inputMode, rightPrec, false, alwaysParens);
                let parenthesize = showParens;
                if (!parenthesize) {
                    if (left) {
                        parenthesize = (precedence < prevPrecedence) && (!expr.pendingParens);
                    }
                    else {
                        parenthesize = (precedence <= prevPrecedence) && (!expr.pendingParens);
                    }
                }
                if (parenthesize) {
                    tex += "(";
                }
                tex += op1Tex;
                tex += texString[binex.op];
                if (paramOp) {
                    tex += "{";
                }
                tex += op2Tex;
                if (paramOp) {
                    tex += "}";
                }
                if (parenthesize) {
                    tex += ")";
                }
            }
            else {
                const paramPrec = inputMode ? precedence : TokenPrecedence.NONE;
                op1Tex = exprToTex(binex.operand1, inputMode, paramPrec, false, alwaysParens);
                op2Tex = exprToTex(binex.operand2, inputMode, paramPrec, false, alwaysParens);
                tex += texString[binex.op];
                tex += "{" + op1Tex + "}";
                tex += "{" + op2Tex + "}";
            }
            break;
        case ExprType.UNOP:
            const unex = expr;
            tex += "-" + exprToTex(unex.operand1, inputMode, TokenPrecedence.NEG, false, alwaysParens);
            break;
        case ExprType.RATIONAL: {
            const rat = expr;
            if (Constants.isNegative(rat)) {
                tex += "-";
            }
            tex += "\\frac{" + Math.abs(rat.a).toString() + "}{" + Math.abs(rat.b).toString() + "}";
            break;
        }
        case ExprType.CALL: {
            const ecall = expr;
            if ((!ecall.notFound) && (!ecall.prefixCmds)) {
                tex += "\\" + ecall.name;
                if (ecall.sub) {
                    tex += "_{" + exprToTex(ecall.sub, inputMode) + "}";
                }
                if (ecall.exp) {
                    tex += "^{" + exprToTex(ecall.exp, inputMode) + "}";
                }
                tex += " ";
                if (ecall.params.length === 1) {
                    if (ecall.curlies) {
                        tex += "{";
                    }
                    tex += exprToTex(ecall.params[0], inputMode);
                    if (ecall.curlies) {
                        tex += "}";
                    }
                }
            }
            else if (ecall.notFound) {
                tex += "\\class{err}{\\mathrm{\\backslash " + ecall.name + "}}";
            }
            else {
                tex += "\\mathrm{\\backslash " + ecall.name + "}";
            }
            break;
        }
        case ExprType.INTEGER:
        case ExprType.REAL: {
            const c = expr;
            if (c.assignedVar) {
                tex += exprToTex(c.assignedVar, inputMode, prevPrecedence, left, alwaysParens);
            }
            else {
                tex += expr.value;
            }
            break;
        }
        case ExprType.VARIABLE: {
            const vexpr = expr;
            tex += vexpr.text;
            if (vexpr.sub) {
                tex += "_{" + exprToTex(vexpr.sub, inputMode, TokenPrecedence.NONE, false, alwaysParens) + "}";
            }
            break;
        }
        case ExprType.PATTERNVAR:
            const pvar = expr;
            if (pvar.text === "cur") {
                tex += "\\cssId{mcur}{\\cdots}";
            }
            else {
                tex += "?" + pvar.text + ((pvar.pvarType === PatternVarType.Any) ? "" : (":" + PatternVarType[pvar.pvarType]));
            }
            break;
        default:
    }
    return tex;
}
function emptyEnvironment() {
    const env = {};
    return env;
}
function bind(env, pvarName, type, e) {
    if ((type === PatternVarType.Const) && (!isConstant(e))) {
        return false;
    }
    else if ((type === PatternVarType.Var) && (e.type !== ExprType.VARIABLE)) {
        return false;
    }
    else if ((type === PatternVarType.Expr) && (isConstant(e))) {
        return false;
    }
    let existing;
    if (env) {
        existing = env[pvarName];
    }
    if (existing) {
        return match(existing, e, env, true);
    }
    else {
        env[pvarName] = e;
        return true;
    }
}
function matchS(p, expr, env) {
    const pattern = parse(p);
    return match(pattern, expr, env);
}
function parse(s) {
    const tokens = lexCharStream({ chars: s, index: 0 }, [], []);
    const parserContext = {};
    return parseExpr(tokStreamCreate(s, tokens), parserContext);
}
const diagMatch = false;
function match(pattern, expr, env, literal = false) {
    if (diagMatch) {
        const texP = exprToTex(pattern);
        const texE = exprToTexParens(expr);
        console.log(`matching ${texP} vs ${texE}`);
    }
    let matched = false;
    if (isConstant(pattern)) {
        matched = Constants.matchConstant(pattern, expr);
        if ((!matched) && diagMatch) {
            console.log("constant match failed");
        }
        return matched;
    }
    switch (pattern.type) {
        case ExprType.PATTERNVAR: {
            const pvar = pattern;
            matched = bind(env, pvar.text, pvar.pvarType, expr);
            if ((!matched) && diagMatch) {
                console.log("bind failed");
            }
            return matched;
        }
        case ExprType.VARIABLE: {
            if (literal) {
                if (expr.type !== ExprType.VARIABLE) {
                    if (diagMatch) {
                        console.log(`literal variable match failed with expr type ${ExprType[expr.type]}`);
                    }
                    return false;
                }
                else {
                    const vpat = pattern;
                    const vexpr = expr;
                    matched = (vpat.text === vexpr.text);
                    if ((!matched) && diagMatch) {
                        console.log("literal variable match failed (2)");
                    }
                    if (matched && vpat.sub) {
                        if (vexpr.sub) {
                            // only literal match of subscript expressions for now
                            matched = match(vpat.sub, vexpr.sub, env, true);
                        }
                        else {
                            matched = false;
                        }
                    }
                    return matched;
                }
            }
            else {
                matched = bind(env, pattern.text, PatternVarType.Any, expr);
                if ((!matched) && diagMatch) {
                    console.log("bind failed");
                }
                return matched;
            }
        }
        case ExprType.UNOP: {
            const punex = pattern;
            if (expr.type === ExprType.UNOP) {
                const eunex = expr;
                if (punex.op !== eunex.op) {
                    if (diagMatch) {
                        console.log("unop match failed");
                    }
                    return false;
                }
                else {
                    return match(punex.operand1, eunex.operand1, env, literal);
                }
            }
            else if (isConstant(expr)) {
                if (Constants.isNegative(expr)) {
                    const n = Constants.negate(expr);
                    return match(punex.operand1, n, env, literal);
                }
            }
            break;
        }
        case ExprType.BINOP: {
            if (expr.type === ExprType.BINOP) {
                const pbinex = pattern;
                const ebinex = expr;
                if (pbinex.op !== ebinex.op) {
                    if (diagMatch) {
                        console.log("binop match failed");
                    }
                    return false;
                }
                else {
                    return match(pbinex.operand1, ebinex.operand1, env) &&
                        match(pbinex.operand2, ebinex.operand2, env);
                }
            }
            break;
        }
        default:
    }
    if (diagMatch) {
        console.log(`type mismatch ${ExprType[pattern.type]} vs ${ExprType[expr.type]}`);
    }
    return false;
}
function isConstant(expr) {
    return (expr.type === ExprType.INTEGER) || (expr.type === ExprType.RATIONAL) ||
        (expr.type === ExprType.REAL);
}
function applyBinop(binex) {
    const promoted = Constants.promote(binex.operand1, binex.operand2);
    const c1 = promoted.c1;
    const c2 = promoted.c2;
    if ((c1.type === ExprType.INTEGER) || (c1.type === ExprType.REAL)) {
        const rc1 = c1.value;
        const rc2 = c2.value;
        switch (binex.op) {
            case Operator.ADD:
                return { type: c1.type, value: rc1 + rc2 };
            case Operator.SUB:
                return { type: c1.type, value: rc1 - rc2 };
            case Operator.MUL:
                return { type: c1.type, value: rc1 * rc2 };
            case Operator.DIV:
                if (c1.type === ExprType.INTEGER) {
                    return Constants.simplifyRational({ type: ExprType.RATIONAL, a: rc1, b: rc2 });
                }
                else {
                    return { type: c1.type, value: rc1 / rc2 };
                }
            case Operator.EXP:
                return { type: c1.type, value: Math.pow(rc1, rc2) };
            default:
                return (binex);
        }
    }
    else {
        // rational
        return Constants.rationalOp(binex.op, c1, c2);
    }
}
export function extractFirstVar(s) {
    const expr = parse(s);
    let v;
    walk(expr, (e) => {
        if (e.type === ExprType.VARIABLE) {
            if (!v) {
                v = e;
            }
        }
        return true;
    });
    return v;
}
// assume left and right sides linear in v
// eliminate fractions then simplify both sides
function normalize(eqn) {
    let _eqn = eqn;
    const result = buildIfMatch([
        { pattern: "a/b=c/d", template: "ad=bc" },
        { pattern: "a/b=c", template: "a=bc" },
        { pattern: "a=c/d", template: "ad=c" }
    ], _eqn);
    if (result) {
        _eqn = result;
    }
    return simplifyExpr(_eqn);
}
// asume binex is a product
export function mulExprNoVar(env, factor = 1) {
    const origExpr = env.f;
    let expr = origExpr;
    const v = env.v;
    while (expr.type === ExprType.BINOP) {
        const binex = expr;
        if (match(v, binex.operand2, env, true)) {
            return false;
        }
        expr = binex.operand1;
    }
    if (!match(v, expr, env, true)) {
        if (factor !== 1) {
            const resBinex = {
                type: ExprType.BINOP, op: Operator.MUL,
                operand1: Constants.makeInt(-1), operand2: origExpr,
            };
            env.nf = resBinex;
        }
        else {
            env.nf = origExpr;
        }
        return true;
    }
    return false;
}
function walk(expr, pre, post) {
    if ((!pre) || pre(expr)) {
        switch (expr.type) {
            case ExprType.TUPLE: {
                const tuple = expr;
                for (let i = 0, len = tuple.elements.length; i < len; i++) {
                    walk(tuple.elements[i], pre, post);
                }
                break;
            }
            case ExprType.BINOP: {
                walk(expr.operand1, pre, post);
                walk(expr.operand2, pre, post);
                break;
            }
            case ExprType.UNOP: {
                walk(expr.operand1, pre, post);
                break;
            }
            case ExprType.CALL: {
                // sub, super as well
                const callExpr = expr;
                if (callExpr.params) {
                    for (let j = 0, clen = callExpr.params.length; j < clen; j++) {
                        walk(callExpr.params[j], pre, post);
                    }
                }
            }
            default:
            // console.log(`walk encountered expr type ${ExprType[expr.type]}`);
        }
        if (post) {
            post(expr);
        }
    }
}
function extractTermAndDegree(term, negate, v) {
    if (diagAC) {
        const tex = exprToTexParens(term);
        console.log(`extract term with negate ${negate}: ${tex}`);
    }
    let constPart;
    let symbolPart;
    let degree = 0;
    if (negate) {
        constPart = Constants.makeInt(-1);
    }
    walk(term, (e) => {
        if (isConstant(e)) {
            if (constPart) {
                constPart = applyBinop({ type: ExprType.BINOP, op: Operator.MUL, operand1: constPart, operand2: e });
            }
            else {
                constPart = e;
            }
        }
        else if (e.type === ExprType.VARIABLE) {
            if (e.text === v.text) {
                degree++;
            }
            else {
                if (symbolPart) {
                    const binex = { type: ExprType.BINOP, op: Operator.MUL, operand1: symbolPart, operand2: e };
                    symbolPart = simplifyExpr(binex);
                }
                else {
                    symbolPart = e;
                }
            }
        }
        else if ((e.type === ExprType.BINOP) && (e.op === Operator.EXP)) {
            const binex = e;
            if (binex.operand1.type === ExprType.VARIABLE) {
                if (binex.operand1.text === v.text) {
                    degree += binex.operand2.value;
                }
                else {
                    if (symbolPart) {
                        const sbinex = {
                            type: ExprType.BINOP, op: Operator.MUL,
                            operand1: symbolPart, operand2: e,
                        };
                        symbolPart = simplifyExpr(sbinex);
                    }
                    else {
                        symbolPart = e;
                    }
                }
            }
            else {
                console.log("need a variable as lhs of exponent");
            }
            return false;
        }
        return true;
    });
    const outTerm = {};
    if (symbolPart) {
        if (constPart) {
            const binex = {
                type: ExprType.BINOP, op: Operator.MUL, operand1: constPart, operand2: symbolPart,
            };
            outTerm.symbolPart = binex;
        }
        else {
            outTerm.symbolPart = symbolPart;
        }
    }
    else {
        outTerm.constPart = constPart;
    }
    return {
        splitTerm: outTerm,
        degree,
    };
}
function extractVarCoeff(expr, v, negate, degree) {
    let outDegree = 0;
    const term = {};
    if (expr.text === v.text) {
        outDegree = degree;
        if (negate) {
            term.constPart = Constants.makeInt(-1);
        }
        else {
            term.constPart = Constants.makeInt(1);
        }
    }
    else {
        if (negate) {
            const unex = { type: ExprType.UNOP, op: Operator.SUB, operand1: expr };
            term.symbolPart = unex;
        }
        else {
            term.symbolPart = expr;
        }
    }
    return {
        degree: outDegree,
        splitTerm: term,
    };
}
const diagAC = false;
// convert expression to polynomial coefficient array
// assume sum of products or e1=e2 where e1 and e2 are sum of products
function accumCoefficients(expr, v, poly, negate) {
    let term = {};
    let degree = 0;
    if (diagAC) {
        const tex = exprToTexParens(expr);
        console.log(`accum coeffs with negate ${negate}: ${tex}`);
    }
    if (isConstant(expr)) {
        term.constPart = expr;
        if (negate) {
            term.constPart = Constants.negate(term.constPart);
        }
    }
    else {
        switch (expr.type) {
            case ExprType.UNOP: {
                const unex = expr;
                const _negate = !negate;
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return accumCoefficients(unex.operand1, v, poly, _negate);
            }
            case ExprType.VARIABLE: {
                // bare v term
                const td = extractVarCoeff(expr, v, negate, 1);
                degree = td.degree;
                term = td.splitTerm;
                break;
            }
            case ExprType.BINOP: {
                const binex = expr;
                switch (binex.op) {
                    // expect ADD, SUB, MUL, EQ
                    case Operator.ADD:
                    case Operator.SUB: {
                        accumCoefficients(binex.operand1, v, poly, negate);
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                        return accumCoefficients(binex.operand2, v, poly, binex.op === Operator.SUB ? !negate : negate);
                    }
                    case Operator.EQ: {
                        accumCoefficients(binex.operand1, v, poly, false);
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                        return accumCoefficients(binex.operand2, v, poly, true);
                    }
                    case Operator.MUL: {
                        const td = extractTermAndDegree(binex, negate, v);
                        degree = td.degree;
                        term = td.splitTerm;
                        break;
                    }
                    case Operator.EXP: {
                        if (binex.operand1.type === ExprType.VARIABLE) {
                            if (binex.operand2.type === ExprType.INTEGER) {
                                const td = extractVarCoeff(binex.operand1, v, negate, binex.operand2.value);
                                degree = td.degree;
                                term = td.splitTerm;
                            }
                            else {
                                console.log("error: non-integer exponent in accum coeffs");
                            }
                        }
                        else {
                            console.log("error: complex lhs of exponent in accum coeffs");
                        }
                        break;
                    }
                    default:
                        console.log(`unexpected operator ${Operator[binex.op]}`);
                }
                break;
            }
            default:
                console.log(`unexpected expr type ${ExprType[expr.type]}`);
        }
    }
    if (poly[degree]) {
        if (term.symbolPart) {
            if (poly[degree].symbolPart) {
                const simplex = {
                    type: ExprType.BINOP, op: Operator.ADD,
                    operand1: poly[degree].symbolPart, operand2: term.symbolPart,
                };
                poly[degree].symbolPart = simplifyExpr(simplex);
            }
            else {
                poly[degree].symbolPart = term.symbolPart;
            }
        }
        if (term.constPart) {
            if (poly[degree].constPart) {
                poly[degree].constPart = applyBinop({ type: ExprType.BINOP, op: Operator.ADD, operand1: poly[degree].constPart, operand2: term.constPart });
            }
            else {
                poly[degree].constPart = term.constPart;
            }
        }
    }
    else {
        poly[degree] = term;
    }
    return poly;
}
function extractCoefficients(expr, v) {
    const polySplit = [];
    const poly = [];
    accumCoefficients(expr, v, polySplit, false);
    for (let i = 0, len = polySplit.length; i < len; i++) {
        const splitTerm = polySplit[i];
        if (splitTerm) {
            if (splitTerm.symbolPart) {
                poly[i] = splitTerm.symbolPart;
                if (splitTerm.constPart) {
                    const binex = {
                        type: ExprType.BINOP, op: Operator.ADD,
                        operand1: poly[i], operand2: splitTerm.constPart,
                    };
                    poly[i] = binex;
                }
            }
            else {
                poly[i] = splitTerm.constPart;
            }
        }
        else {
            poly[i] = Constants.makeInt(0);
        }
    }
    return poly;
}
export function solve(eqn, v) {
    const norm = normalize(eqn);
    if (!isSumOfProducts(norm)) {
        return norm;
    }
    const poly = extractCoefficients(norm, v);
    if (poly[0]) {
        if (poly[1]) {
            if (Constants.matchConstant(Constants.makeInt(0), poly[1])) {
                return undefined;
            }
            else {
                const op1Binex = {
                    type: ExprType.BINOP, op: Operator.MUL, operand1: Constants.makeInt(-1),
                    operand2: poly[0],
                };
                const simplex = {
                    type: ExprType.BINOP, op: Operator.DIV, operand1: op1Binex,
                    operand2: poly[1],
                };
                const binex = {
                    type: ExprType.BINOP, op: Operator.EQ, operand1: v, operand2: simplifyExpr(simplex),
                };
                return binex;
            }
        }
    }
    else {
        const binex = { type: ExprType.BINOP, op: Operator.EQ, operand1: v, operand2: Constants.makeInt(0) };
        return binex;
    }
}
function isInt(e, val) {
    return (e.type === ExprType.INTEGER) && ((!val) || (e.value === val));
}
function subst(e, env) {
    let evar;
    switch (e.type) {
        case ExprType.VARIABLE:
        case ExprType.PATTERNVAR: {
            evar = env[e.text];
            if (evar) {
                return evar;
            }
            break;
        }
        case ExprType.UNOP: {
            const unex = e;
            return { type: ExprType.UNOP, op: unex.op, operand1: subst(unex.operand1, env) };
        }
        case ExprType.BINOP: {
            const binex = e;
            return {
                type: ExprType.BINOP, op: binex.op, operand1: subst(binex.operand1, env),
                operand2: subst(binex.operand2, env),
            };
        }
        default:
        // console.log(`unrecognized expr type ${e.type}`);
    }
    return e;
}
function buildExpr(s, env) {
    const template = parse(s);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return subst(template, env);
}
const bifMatchDiag = false;
function buildIfMatch(pats, e, seedEnv, info) {
    let env;
    for (let i = 0, len = pats.length; i < len; i++) {
        if (seedEnv) {
            env = seedEnv();
        }
        else {
            env = {};
        }
        if (matchS(pats[i].pattern, e, env)) {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            if ((!pats[i].exec) || (pats[i].exec(env, pats[i].param))) {
                if (info) {
                    info.index = i;
                    info.pat = pats[i].pattern;
                }
                const built = buildExpr(pats[i].template, env);
                if (bifMatchDiag) {
                    const builtTex = exprToTex(built);
                    const etex = exprToTex(e);
                    console.log(`applied ${pats[i].pattern} to ${etex} yielding ${builtTex}`);
                }
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return built;
            }
        }
    }
    return undefined;
}
function foldConstants(env, opArg) {
    const ca = env.a;
    const cb = env.b;
    if (opArg.reverse) {
        env.c = applyBinop({ type: ExprType.BINOP, op: opArg.op, operand1: cb, operand2: ca });
    }
    else {
        env.c = applyBinop({ type: ExprType.BINOP, op: opArg.op, operand1: ca, operand2: cb });
    }
    return true;
}
function combineCoeffs(env, opArg) {
    const aLeft = env.al;
    const aRight = env.ar;
    let bLeft = env.bl;
    let bRight = env.br;
    // aLeft * x +/- bLeft = aRight * x +/- bRight;
    // sgn 00: -,-; 01: -,+; 10: +,-; 11: +,+
    // (aLeft-aRight) * x  = bRight-bLeft;
    const sgn = opArg.sgn;
    if ((sgn & 0x1) === 0) {
        bRight = Constants.negate(bRight);
    }
    if ((sgn & 0x2) === 0) {
        bLeft = Constants.negate(bLeft);
    }
    env.as = applyBinop({ type: ExprType.BINOP, op: Operator.SUB, operand1: aLeft, operand2: aRight });
    env.bs = applyBinop({ type: ExprType.BINOP, op: Operator.SUB, operand1: bRight, operand2: bLeft });
    return true;
}
function negateConstantIfNegative(env) {
    const cb = env.b;
    if (Constants.isNegative(cb)) {
        env.n = Constants.negate(cb);
        return true;
    }
    else {
        return false;
    }
}
export function negateConstant(env) {
    const cb = env.b;
    env.n = Constants.negate(cb);
    return true;
}
export function divrl(env) {
    const a = env.a;
    const b = env.b;
    if (isInt(a, 0)) {
        return false;
    }
    else {
        const q = applyBinop({ type: ExprType.BINOP, op: Operator.DIV, operand1: b, operand2: a });
        env.q = q;
        return true;
    }
}
// const | var | -factor | var^integer
function isFactor(expr) {
    if ((expr.type === ExprType.VARIABLE) || isConstant(expr)) {
        return true;
    }
    if (expr.type === ExprType.UNOP) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return isFactor(expr.operand1);
    }
    else if (expr.type === ExprType.BINOP) {
        const binex = expr;
        if (binex.op === Operator.EXP) {
            return (binex.operand1.type === ExprType.VARIABLE) &&
                (binex.operand2.type === ExprType.INTEGER);
        }
    }
    return false;
}
// ab | -a | factor
function isTerm(e) {
    if (e.type === ExprType.BINOP) {
        const binex = e;
        if (binex.op === Operator.MUL) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return isTerm(binex.operand1) && (isFactor(binex.operand2));
        }
    }
    else if (e.type === ExprType.UNOP) {
        return isTerm(e.operand1);
    }
    else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return isFactor(e);
    }
}
function isSumOfProducts(e) {
    switch (e.type) {
        case ExprType.BINOP: {
            const binex = e;
            if (binex.op === Operator.EQ) {
                return isSumOfProducts(binex.operand1) && isSumOfProducts(binex.operand2);
            }
            if ((binex.op === Operator.ADD) || (binex.op === Operator.SUB)) {
                return isSumOfProducts(binex.operand1) && (isSumOfProducts(binex.operand2));
            }
            else if (binex.op === Operator.MUL) {
                return isTerm(binex);
            }
            else if (binex.op === Operator.EXP) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return isFactor(binex);
            }
        }
        case ExprType.UNOP: {
            return isSumOfProducts(e);
        }
        default:
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return isFactor(e);
    }
}
const diagB = false;
// find correct place to check for divide by zero
function simplifyExpr(expr) {
    let _expr = expr;
    let delta = true;
    while (delta) {
        delta = false;
        if (diagB) {
            const tex = exprToTexParens(_expr);
            console.log(`simplifying ${tex}`);
        }
        let operand1;
        let operand2;
        switch (_expr.type) {
            case ExprType.INTEGER:
            case ExprType.REAL:
            case ExprType.VARIABLE:
                return _expr;
            case ExprType.RATIONAL:
                return Constants.simplifyRational(_expr);
            case ExprType.UNOP: {
                // currently only unary '-'
                const unex = _expr;
                if (isConstant(unex.operand1)) {
                    return Constants.negate(unex.operand1);
                }
                else {
                    operand1 = simplifyExpr(unex.operand1);
                    if (operand1 !== unex.operand1) {
                        delta = true;
                        const op1Unex = { type: ExprType.UNOP, op: unex.op, operand1 };
                        _expr = op1Unex;
                    }
                }
                break;
            }
            case ExprType.BINOP:
                const binex = _expr;
                if (isConstant(binex.operand1)) {
                    if (isConstant(binex.operand2)) {
                        return applyBinop(binex);
                    }
                }
                const info = { index: -1 };
                const result = buildIfMatch([
                    // multiplicative identity
                    { pattern: "1a", template: "a" },
                    { pattern: "a1", template: "a" },
                    { pattern: "a/1", template: "a" },
                    { pattern: "0/a", template: "0" },
                    { pattern: "-b:const", template: "?n", exec: negateConstantIfNegative },
                    { pattern: "a--b", template: "a+b" },
                    { pattern: "a-?b:const", template: "a+?n", exec: negateConstantIfNegative },
                    { pattern: "a+?b:const", template: "a-?n", exec: negateConstantIfNegative },
                    { pattern: "a-?b:const?c", template: "a+?n?c", exec: negateConstantIfNegative },
                    // commutative multiplication
                    { pattern: "a(bc)", template: "(ab)c" },
                    // distributive property
                    { pattern: "a(b+c)", template: "ab+ac" },
                    { pattern: "a(b-c)", template: "ab-ac" },
                    { pattern: "(a+b)c", template: "ac+bc" },
                    { pattern: "(a-b)c", template: "ac-bc" },
                    // move constants to beginning of term
                    { pattern: "?v:var?c:const", template: "?c?v" },
                    { pattern: "(?ca:const?e:expr)?cb:const", template: "(?ca?cb)?e" },
                    { pattern: "?ca:const(?cb:const?e:expr)", template: "(?ca?cb)?e" },
                    { pattern: "?e:expr?c:const", template: "?c?e" },
                    { pattern: "?ca:const(-?cb:const)", template: "-1?ca?cb" },
                    { pattern: "a(-b)", template: "-1ab" },
                    { pattern: "a+-b", template: "a-b" },
                    { pattern: "a--bc", template: "a+bc" },
                    { pattern: "a--(bc)", template: "a+bc" },
                    { pattern: "a+-bc", template: "a-bc" },
                    { pattern: "a-(b-c)", template: "a+c-b" },
                    { pattern: "-(a-b)", template: "b-a" },
                    { pattern: "a+(b+c)", template: "a+b+c" },
                    { pattern: "a-(b+c)", template: "a-b-c" },
                    { pattern: "a+(b-c)", template: "a+b-c" },
                    { pattern: "-1a", template: "-a" },
                    { pattern: "-a+b", template: "b-a" },
                    // combine like terms
                    { pattern: "?a:const?x+?b:const?x", template: "?c?x", exec: foldConstants, param: { op: Operator.ADD } },
                    { pattern: "?a:const?x-?d:const+?b:const?x", template: "?c?x-?d", exec: foldConstants, param: { op: Operator.ADD } },
                    { pattern: "?e:expr+?a:const+?b:const", template: "?e+?c", exec: foldConstants, param: { op: Operator.ADD } },
                    { pattern: "?e:expr+?a:const-?b:const", template: "?e+?c", exec: foldConstants, param: { op: Operator.SUB } },
                    { pattern: "?e:expr-?a:const+?b:const", template: "?e+?c", exec: foldConstants, param: { op: Operator.SUB, reverse: true } },
                    { pattern: "?e:expr-?a:const-?b:const", template: "?e-?c", exec: foldConstants, param: { op: Operator.ADD } },
                    { pattern: "?a:const+?e:expr-?b:const", template: "?e+?c", exec: foldConstants, param: { op: Operator.SUB } },
                    { pattern: "?a:const+?e:expr+?b:const", template: "?e+?c", exec: foldConstants, param: { op: Operator.ADD } },
                    // combine like terms on both sides
                    { pattern: "?al:const?x-?bl:const=?ar:const?x-?br:const", template: "?as?x=?bs", exec: combineCoeffs, param: { sgn: 0 } },
                    { pattern: "?al:const?x-?bl:const=?ar:const?x+?br:const", template: "?as?x=?bs", exec: combineCoeffs, param: { sgn: 1 } },
                    { pattern: "?al:const?x+?bl:const=?ar:const?x-?br:const", template: "?as?x=?bs", exec: combineCoeffs, param: { sgn: 2 } },
                    { pattern: "?al:const?x+?bl:const=?ar:const?x+?br:const", template: "?as?x=?bs", exec: combineCoeffs, param: { sgn: 3 } },
                ], binex, () => (emptyEnvironment()), info);
                if (result) {
                    if (diagB) {
                        console.log(`match ${info.index}: ${info.pat}`);
                    }
                    delta = true;
                    _expr = result;
                }
                else {
                    if (diagB) {
                        console.log("no match");
                    }
                    operand1 = simplifyExpr(binex.operand1);
                    operand2 = simplifyExpr(binex.operand2);
                    if ((operand1 !== binex.operand1) || (operand2 !== binex.operand2)) {
                        delta = true;
                        const resBinex = { type: ExprType.BINOP, op: binex.op, operand1, operand2 };
                        _expr = resBinex;
                    }
                }
                break;
            case ExprType.CALL:
            case ExprType.ERROR:
                break;
            default:
                console.log(`simplify: unrecognized expr type ${ExprType[_expr.type]}`);
        }
    }
    return _expr;
}
var PatternVarType;
(function (PatternVarType) {
    PatternVarType[PatternVarType["Const"] = 0] = "Const";
    PatternVarType[PatternVarType["Var"] = 1] = "Var";
    PatternVarType[PatternVarType["Expr"] = 2] = "Expr";
    PatternVarType[PatternVarType["Any"] = 3] = "Any";
})(PatternVarType || (PatternVarType = {}));
function makeErrorExpr(parsedSoFar) {
    return { type: ExprType.ERROR, minChar: parsedSoFar };
}
function getPvarType(tokStream) {
    const tok = tokStreamPeek(tokStream);
    if (tok.type === MathTokenType.PatternType) {
        tokStreamAdvance(tokStream);
        if (tok.text === "const") {
            return PatternVarType.Const;
        }
        else if (tok.text === "var") {
            return PatternVarType.Var;
        }
        else if (tok.text === "expr") {
            return PatternVarType.Expr;
        }
    }
    return PatternVarType.Any;
}
function parseModExpr(tokStream, ctxt, modTok) {
    return parseCall(tokStream, ctxt, modTok);
}
function tryModExpr(tokStream, ctxt, callExpr, callTok) {
    const tok = tokStreamPeek(tokStream);
    if (tok.type === MathTokenType.Command) {
        const cmdTok = tok;
        if (cmdTok.isModifier) {
            tokStreamAdvance(tokStream);
            const modExpr = parseModExpr(tokStream, ctxt, cmdTok);
            if (cmdTok === callTok.subCmd) {
                callExpr.sub = modExpr;
            }
            else {
                callExpr.exp = modExpr;
            }
            return true;
        }
    }
    return false;
}
function parseCall(tokStream, ctxt, callTok) {
    const callExpr = {
        type: ExprType.CALL,
        name: callTok.cmdInfo.key,
        params: [],
    };
    if (tryModExpr(tokStream, ctxt, callExpr, callTok)) {
        tryModExpr(tokStream, ctxt, callExpr, callTok);
    }
    if (callTok.cmdInfo.arity > 0) {
        for (let i = 0; i < callTok.cmdInfo.arity; i++) {
            callExpr.params[i] = parseExpr(tokStream, ctxt);
            const finishTok = tokStreamGet(tokStream);
            if ((finishTok.type !== MathTokenType.MidCommand) && (finishTok.type !== MathTokenType.EndCommand)) {
                console.log(`unexpected token of type ${MathTokenType[finishTok.type]} ends param expr`);
            }
        }
    }
    return callExpr;
}
function parseTupleTail(expr, tokStream, ctxt) {
    const elements = [expr];
    let tok;
    do {
        elements.push(parseExpr(tokStream, ctxt));
        tok = tokStreamGet(tokStream);
    } while (tok.type === MathTokenType.COMMA);
    if ((tok.type !== MathTokenType.CPAREN) && (tok.type !== MathTokenType.EOI)) {
        return makeErrorExpr(tok.start);
    }
    else {
        const tuple = { type: ExprType.TUPLE, elements };
        if (tok.type === MathTokenType.EOI) {
            tuple.pendingParens = "(";
        }
        return tuple;
    }
}
function parsePrimary(tokStream, ctxt) {
    let tok = tokStreamGet(tokStream);
    let expr;
    switch (tok.type) {
        case MathTokenType.OPAREN:
            expr = parseExpr(tokStream, ctxt);
            tok = tokStreamGet(tokStream);
            if (tok.type !== MathTokenType.CPAREN) {
                if (tok.type === MathTokenType.COMMA) {
                    return parseTupleTail(expr, tokStream, ctxt);
                }
                else if (tok.type === MathTokenType.EOI) {
                    if (expr.pendingParens) {
                        expr.pendingParens += "(";
                    }
                    else {
                        expr.pendingParens = "(";
                    }
                    expr.minChar = tok.start;
                    return expr;
                }
                else {
                    return makeErrorExpr(tok.start);
                }
            }
            else {
                expr.parenthesized = true;
                return (expr);
            }
        case MathTokenType.Command: {
            const cmdTok = tok;
            const callExpr = parseCall(tokStream, ctxt, cmdTok);
            if (cmdTok.isModifier && ctxt.prevVar) {
                ctxt.prevVar.sub = callExpr;
                ctxt.prevVar = undefined;
            }
            return callExpr;
        }
        case MathTokenType.INT:
            return { type: ExprType.INTEGER, value: parseInt(tok.text, 10), minChar: tok.start };
        case MathTokenType.REAL:
            return { type: ExprType.REAL, value: parseFloat(tok.text), minChar: tok.start };
        case MathTokenType.Variable: {
            const symTok = tok;
            const vexpr = {
                type: ExprType.VARIABLE, text: symTok.text,
                minChar: tok.start,
            };
            ctxt.prevVar = vexpr;
            return vexpr;
        }
        case MathTokenType.PatternVariable: {
            const pvarType = getPvarType(tokStream);
            return {
                type: ExprType.PATTERNVAR, text: tok.text,
                pvarType, minChar: tok.start,
            };
        }
        default:
            return makeErrorExpr(tok.start);
    }
}
function parseExpr(tokStream, ctxt, prevPrecedence = TokenPrecedence.NONE) {
    let tok = tokStreamPeek(tokStream);
    let usub = false;
    if (tok.type === MathTokenType.SUB) {
        // unary minus
        tokStreamAdvance(tokStream);
        usub = true;
    }
    let left = parsePrimary(tokStream, ctxt);
    if (usub) {
        if (isConstant(left)) {
            left = Constants.negate(left);
        }
        else {
            const unop = { type: ExprType.UNOP, op: Operator.SUB, operand1: left };
            left = unop;
        }
    }
    tok = tokStreamPeek(tokStream);
    while ((tok.type !== MathTokenType.EOI) && (tok.type !== MathTokenType.CPAREN) &&
        (tok.type !== MathTokenType.COMMA) && (tok.type !== MathTokenType.MidCommand) &&
        (tok.type !== MathTokenType.EndCommand)) {
        const props = tokenProps[tok.type];
        let rightAssoc = false;
        let precedence;
        let realOpToken = true;
        let op;
        if (tok.type === MathTokenType.Command) {
            const cmdTok = tok;
            const cmdInfo = cmdTok.cmdInfo;
            if (cmdInfo && cmdInfo.infix) {
                op = cmdInfo.op;
                precedence = operatorToPrecedence[op];
            }
            else {
                // treat as impending multiply
                precedence = TokenPrecedence.MUL;
                realOpToken = false;
                op = Operator.MUL;
            }
        }
        else if (props.flags & TokenLexFlags.Binop) {
            precedence = props.precedence;
            op = props.op;
            rightAssoc = props.rightAssoc;
        }
        else if (props.flags & TokenLexFlags.PrimaryFirstSet) {
            precedence = TokenPrecedence.MUL;
            realOpToken = false;
            op = Operator.MUL;
        }
        if ((prevPrecedence < precedence) || ((prevPrecedence === precedence) && rightAssoc)) {
            // previous op has weaker precedence
            if (realOpToken) {
                tokStreamAdvance(tokStream);
            }
            const right = parseExpr(tokStream, ctxt, precedence);
            const binex = { type: ExprType.BINOP, op, operand1: left, operand2: right };
            left = binex;
        }
        else {
            return left;
        }
        tok = tokStreamPeek(tokStream);
    }
    return left;
}
function parseEqn(tokStream) {
    let ctxt = {};
    const left = parseExpr(tokStream, ctxt, TokenPrecedence.REL);
    const tok = tokStreamGet(tokStream);
    if (tok.type === MathTokenType.Equals) {
        ctxt = {};
        const right = parseExpr(tokStream, ctxt, TokenPrecedence.IMPLIES);
        const binex = {
            type: ExprType.BINOP, op: Operator.EQ, operand1: left,
            operand2: right,
        };
        return binex;
    }
}
export function testEqn(s, norm = false, vsolve) {
    console.log(`trying ${s} ...`);
    const tokStream = tokStreamCreate(s, lexMath(s));
    let e = parseEqn(tokStream);
    if (e) {
        console.log(`which is ${exprToTexParens(e)}`);
        if (norm) {
            e = normalize(e);
            if (vsolve) {
                e = solve(e, vsolve);
            }
        }
        if (e) {
            const tex = exprToTex(e, false);
            console.log(tex);
        }
        else if (vsolve) {
            console.log(`no solution for ${vsolve.text}`);
        }
    }
    else {
        if (vsolve) {
            console.log(`no solution for ${vsolve.text}`);
        }
    }
}
function getLine(s, tokenIndex, tokens) {
    let start = 0;
    let end = s.length;
    for (let i = tokenIndex; i < tokens.length; i++) {
        if (tokens[i].type === MathTokenType.Newline) {
            end = tokens[i].start;
            break;
        }
    }
    for (let i = tokenIndex - 1; i >= 0; i--) {
        if (tokens[i].type === MathTokenType.Newline) {
            start = tokens[i].start + 1;
            break;
        }
    }
    const line = s.substring(start, end);
    return line;
}
export function testExprLine(s, tokenIndex, tokens) {
    const xvar = { text: "x", type: ExprType.VARIABLE };
    const line = getLine(s, tokenIndex, tokens);
    testEqn(line, true, xvar);
}
function equivalent(e, soln, v) {
    let _e = e;
    if ((_e.type !== ExprType.BINOP) || (_e.op !== Operator.EQ)) {
        return false;
    }
    _e = simplifyExpr(_e);
    _e = solve(_e, v);
    const solnEqn = soln;
    const eqn = _e;
    if (eqn &&
        match(solnEqn.operand1, eqn.operand1, {}, true) &&
        match(solnEqn.operand2, eqn.operand2, {}, true)) {
        return true;
    }
    else if (eqn &&
        match(solnEqn.operand1, eqn.operand2, {}, true) &&
        match(solnEqn.operand2, eqn.operand1, {}, true)) {
        return true;
    }
    return false;
}
export function matchSolution(line, varName, varExpr) {
    const e = parse(line);
    const v = { text: varName, type: ExprType.VARIABLE };
    const soln = parse(varExpr);
    return equivalent(e, soln, v);
}
export function testExpr(s) {
    console.log(`trying ${s} ...`);
    const tokStream = tokStreamCreate(s, lexMath(s));
    const ctxt = {};
    const e = parseExpr(tokStream, ctxt);
    const tex = exprToTex(e);
    console.log(tex);
}
export function testNorm() {
    testEqn("3/(2a+1)=4/(a-1)", true);
    testEqn("(5--1)/(2a+1-3)=(1--2)/(a-1)", true);
    testEqn("(-5--1)/(2a+1--3)=(1--2)/(a-1)", true);
    testEqn("5--1=0", true);
    testEqn("(a-b)/(c-d)=(x-y)/(w-z)", true);
    testEqn("3(x+1)=0", true);
    testEqn("3(x+y)=0", true);
    testEqn("(a+b)(x+1)=0", true);
    testEqn("3(x-1)=0", true);
    testEqn("3(x-y)=0", true);
    testEqn("(a+b)(x-1)=0", true);
    testEqn("(5+2)(x+1)=0", true);
    testEqn("(5+2)(x-1)=0", true);
    testEqn("(a-b)(c-d)=0", true);
}
export function testSolve() {
    const a = { type: ExprType.VARIABLE, text: "a" };
    const x = { type: ExprType.VARIABLE, text: "x" };
    // testEqn("x+x+5x-3=2x-2", true, x);
    // testEqn("x-3+5x+x=2x-1-1",true, x);
    testEqn("x-d-3+c-yx+zx=2x-2", true, x);
    testEqn("6-6a=4a+8", true, a);
    testEqn("4a+16=14a-14", true, a);
    testEqn("4a-16=14a-14", true, a);
    testEqn("2a+1=2a-1", true, a);
    testEqn("3/(2a+1)=4/(a-1)", true, a);
    testEqn("(5--1)/(2a+1-3)=(1--2)/(a-1)", true, a);
    testEqn("(-5--1)/(2a+1-3)=(1--2)/(a-1)", true, a);
    testEqn("3xy-5=0", true, x);
    testEqn("x3-5=0", true, x);
    testEqn("3yx-5=0", true, x);
    testEqn("3yx=0", true, x);
    testEqn("x+x+5x=2x-2", true, x);
    testEqn("x+x+5x-3=2x-2", true, x);
}
function testLCDPair(a1, b1, a2, b2) {
    const rr = Constants.lcd({ type: ExprType.RATIONAL, a: a1, b: b1 }, { type: ExprType.RATIONAL, a: a2, b: b2 });
    let tex = exprToTex(rr.r1);
    console.log(tex);
    tex = exprToTex(rr.r2);
    console.log(tex);
}
export function testLCD() {
    testLCDPair(2, 3, 5, 12);
    testLCDPair(1, 5, 0, 1);
}
export function testMatch() {
    let env = {};
    let eout;
    let tex;
    let e = parse("(6-6a)+(-4a)");
    if (!matchS("a+-bc", e, env)) {
        console.log("hmm...");
    }
    e = parse("2y-(3x-7)");
    env = {};
    if (matchS("a-(b-c)", e, env)) {
        eout = buildExpr("a+c-b", env);
        tex = exprToTex(eout);
        console.log(tex);
    }
    else {
        console.log("hmmm...");
    }
    e = parse("x4");
    env = {};
    if (matchS("?v:var?c:const", e, env)) {
        eout = buildExpr("?c?v", env);
        tex = exprToTex(eout);
        console.log(tex);
    }
    else {
        console.log("(1) hmmm...");
    }
    e = parse("ac-ad-(bc-bd)");
    env = {};
    if (matchS("a-(b-c)", e, env)) {
        eout = buildExpr("a+c-b", env);
        tex = exprToTex(eout);
        console.log(tex);
    }
    else {
        console.log("(2) hmmm...");
    }
    // e = parse("1x");
    e = parse("(3)(1)");
    env = {};
    const result = buildIfMatch([
        { pattern: "1a", template: "a" },
        { pattern: "a1", template: "a" }
    ], e);
    if (result) {
        tex = exprToTex(result);
        console.log(tex);
    }
    else {
        console.log("(3) hmmm...");
    }
}
//# sourceMappingURL=mathExpr.js.map