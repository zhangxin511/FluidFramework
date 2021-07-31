/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import { EventEmitter } from "events";
import * as ClientUI from "@fluid-example/client-ui-lib";
import { Caret } from "@fluid-example/flow-util-lib";
import { FluidObjectHandle } from "@fluidframework/datastore";
import { SharedDirectory } from "@fluidframework/map";
import * as MergeTree from "@fluidframework/merge-tree";
import * as Sequence from "@fluidframework/sequence";
import { LazyLoadedDataObjectFactory, LazyLoadedDataObject } from "@fluidframework/data-object-base";
import * as Katex from "katex";
import * as MathExpr from "./mathExpr";
const directionToCursorDirection = {
    [3 /* left */]: ClientUI.controls.CursorDirection.Left,
    [1 /* right */]: ClientUI.controls.CursorDirection.Right,
    [12 /* up */]: ClientUI.controls.CursorDirection.Up,
    [4 /* down */]: ClientUI.controls.CursorDirection.Down,
    [0 /* none */]: ClientUI.controls.CursorDirection.Airlift,
};
const cursorDirectionToDirection = {
    [ClientUI.controls.CursorDirection.Left]: 3 /* left */,
    [ClientUI.controls.CursorDirection.Right]: 1 /* right */,
    [ClientUI.controls.CursorDirection.Up]: 12 /* up */,
    [ClientUI.controls.CursorDirection.Down]: 4 /* down */,
    [ClientUI.controls.CursorDirection.Airlift]: 0 /* none */,
};
export class MathView {
    constructor(instance, scope) {
        this.instance = instance;
        this.cursorActive = false;
        // IViewLayout
        this.canInline = true;
        this.mathCursor = 0;
        this.mathTokenIndex = 0;
        this.remoteEdit = (pos, len, isInsert) => {
            if (this.cursorActive) {
                const mathMarker = this.instance.endMarker;
                let mathCursorNew = this.mathCursor;
                if (isInsert) {
                    if (pos <= mathCursorNew) {
                        mathCursorNew += len;
                    }
                }
                else {
                    if ((pos + len) <= mathCursorNew) {
                        mathCursorNew -= len;
                    }
                    else {
                        mathCursorNew = pos;
                    }
                }
                this.mathCursor = mathCursorNew;
                this.mathTokenIndex = MathExpr.tokenAtPos(mathCursorNew, mathMarker.mathTokens);
            }
            this.localRender();
        };
        if (scope) {
            this.searchMenuHost = scope.ISearchMenuHost;
        }
        this.options = this.instance.options;
        this.instance.on("remoteEdit", this.remoteEdit);
    }
    get IFluidHTMLView() { return this; }
    get IViewCursor() { return this; }
    get IViewLayout() { return this; }
    // IFluidHTMLView
    render(containerElement, options) {
        if (options) {
            this.options = options;
        }
        this.buildTree(containerElement, this.options.display);
    }
    remove() {
        this.instance.off("remoteEdit", this.remoteEdit);
    }
    // IViewCursor
    enter(direction) {
        console.log(`enter: ${ClientUI.controls.CursorDirection[direction]}`);
        this.cursorActive = true;
        if (direction === ClientUI.controls.CursorDirection.Right) {
            this.mathCursor = 0;
            this.mathTokenIndex = 0;
        }
        else if (direction === ClientUI.controls.CursorDirection.Left) {
            const mathText = this.instance.getMathText();
            this.mathCursor = mathText.length;
            this.mathTokenIndex = this.instance.endMarker.mathTokens.length;
        }
    }
    leave(direction) {
        this.cursorActive = false;
    }
    rev() {
        const mathMarker = this.instance.endMarker;
        this.mathTokenIndex = MathExpr.mathTokRev(this.mathTokenIndex, mathMarker.mathTokens);
        if (this.mathTokenIndex !== MathExpr.Nope) {
            this.mathCursor = MathExpr.posAtToken(this.mathTokenIndex, mathMarker.mathTokens);
        }
        else {
            this.mathCursor = 0;
            this.mathTokenIndex = 0;
            this.noteCursorExit(ClientUI.controls.CursorDirection.Left);
            return true;
        }
    }
    fwd() {
        const mathMarker = this.instance.endMarker;
        this.mathTokenIndex = MathExpr.mathTokFwd(this.mathTokenIndex, mathMarker.mathTokens);
        if (this.mathTokenIndex > mathMarker.mathTokens.length) {
            this.noteCursorExit(ClientUI.controls.CursorDirection.Right);
            return true;
        }
        else if (this.mathTokenIndex === mathMarker.mathTokens.length) {
            const mathText = this.instance.getMathText();
            this.mathCursor = mathText.length;
        }
        else {
            this.mathCursor = MathExpr.posAtToken(this.mathTokenIndex, mathMarker.mathTokens);
        }
    }
    setListeners() {
        this.containerElement.tabIndex = 0;
        this.containerElement.style.outline = "none";
        this.containerElement.addEventListener("focus", () => {
            console.log("focus...");
            this.enter(ClientUI.controls.CursorDirection.Focus);
            this.localRender();
        });
        this.containerElement.addEventListener("blur", () => {
            this.leave(ClientUI.controls.CursorDirection.Focus);
            this.localRender();
        });
        this.containerElement.addEventListener("keydown", (e) => {
            this.onKeydown(e);
        });
        this.containerElement.addEventListener("keypress", (e) => {
            this.onKeypress(e);
        });
        this.containerElement.addEventListener("fluid:caretenter" /* enter */, ((e) => {
            // Let caller know we've handled the event:
            e.preventDefault();
            e.stopPropagation();
            const cursorDirection = directionToCursorDirection[e.detail.direction];
            console.log(`caret event ${ClientUI.controls.CursorDirection[cursorDirection]}`);
            this.enter(cursorDirection);
        }));
    }
    buildAlignedAsDiv(mathLines, elm) {
        let count = 1;
        for (const line of mathLines) {
            const lineDiv = document.createElement("div");
            elm.appendChild(lineDiv);
            const eqIndex = line.indexOf("=");
            if (eqIndex >= 0) {
                const preEq = line.substring(0, eqIndex);
                const postEq = line.substring(eqIndex + 1);
                const preEqElm = document.createElement("span");
                preEqElm.style.width = "35%";
                Katex.render(preEq, preEqElm, { throwOnError: false, displayMode: true });
                const eqElm = document.createElement("span");
                eqElm.style.width = "10%";
                Katex.render("=", eqElm, { throwOnError: false, displayMode: true });
                const postEqElm = document.createElement("span");
                postEqElm.style.width = "35%";
                Katex.render(postEq, postEqElm, { throwOnError: false, displayMode: true });
                lineDiv.appendChild(preEqElm);
                lineDiv.appendChild(eqElm);
                lineDiv.appendChild(postEqElm);
            }
            else {
                const eqElm = document.createElement("span");
                eqElm.style.width = "80%";
                Katex.render("=", eqElm, { throwOnError: false, displayMode: true });
                lineDiv.appendChild(eqElm);
            }
            const tagElm = document.createElement("span");
            tagElm.style.width = "20%";
            Katex.render(`\\tag{${count++}}{}`, tagElm, { throwOnError: false, displayMode: true });
            lineDiv.appendChild(tagElm);
            count++;
        }
    }
    buildAligned(mathLines, checks) {
        let mathBuffer = "\\begin{darray}{rcllcr} \n";
        let count = 1;
        for (let i = 0; i < mathLines.length; i++) {
            let line = mathLines[i];
            if (line.includes("=")) {
                line = line.replace("=", "& = &");
            }
            else {
                line = `& ${line} &`;
            }
            let rightContext = "\\hspace{20ex}";
            if (checks[i]) {
                rightContext += "\\textcolor{#008000}{\\checkmark}";
            }
            mathBuffer += `${line} & & ${rightContext} & \\textrm{(${count++})} \\\\ \n`;
        }
        mathBuffer += "\\end{darray}";
        return mathBuffer;
    }
    buildTree(elm, display) {
        let _display = display;
        if (this.containerElement !== elm) {
            this.containerElement = elm;
            this.setListeners();
        }
        if (_display === undefined) {
            _display = this.options.display;
        }
        const mathText = this.instance.getMathText();
        let mathBuffer = mathText;
        const mathMarker = this.instance.endMarker;
        this.containerElement = elm;
        if (mathMarker.mathTokens === undefined) {
            mathMarker.mathTokens = [];
            mathMarker.mathText = "";
        }
        let rootElement;
        if (_display === "inline") {
            rootElement = document.createElement("span");
            rootElement.style.marginLeft = "2px";
            rootElement.style.marginTop = "4px";
            rootElement.style.marginRight = "2px";
            if (this.cursorActive) {
                rootElement.style.borderLeft = "solid orange 2px";
                rootElement.style.borderRight = "solid orange 2px";
                // showCursor
                mathBuffer = mathBuffer.substring(0, this.mathCursor) +
                    MathExpr.cursorTex +
                    mathBuffer.substring(this.mathCursor);
                mathBuffer = MathExpr.boxEmptyParam(mathBuffer);
            }
            Katex.render(mathBuffer, rootElement, { throwOnError: false });
        }
        else {
            const useDarray = true;
            const checkSoln = true;
            const checks = [];
            rootElement = document.createElement("div");
            const cleanMathLines = mathBuffer.split("\n");
            for (let i = 0; i < cleanMathLines.length; i++) {
                const cleanLine = cleanMathLines[i];
                if (checkSoln) {
                    try {
                        checks[i] = MathExpr.matchSolution(cleanLine, this.instance.solnVar, this.instance.solnText);
                    }
                    catch (e) {
                        console.log(`match soln: ${cleanLine}`);
                        checks[i] = false;
                    }
                }
                else {
                    checks[i] = false;
                }
            }
            if (this.cursorActive) {
                // showCursor
                mathBuffer = mathBuffer.substring(0, this.mathCursor) +
                    MathExpr.cursorTex +
                    mathBuffer.substring(this.mathCursor);
                mathBuffer = MathExpr.boxEmptyParam(mathBuffer);
            }
            const mathLines = mathBuffer.split("\n");
            if (useDarray) {
                mathBuffer = this.buildAligned(mathLines, checks);
                Katex.render(mathBuffer, rootElement, { throwOnError: false, displayMode: true });
            }
            else {
                this.buildAlignedAsDiv(mathLines, rootElement);
            }
        }
        if (this.cursorActive) {
            const cursorElement = ClientUI.controls.findFirstMatch(rootElement, (cursor) => cursor.style && (cursor.style.color === MathExpr.cursorColor));
            if (cursorElement) {
                this.cursorElement = cursorElement;
                cursorElement.classList.add("blinking");
            }
        }
        this.rootElement = rootElement;
        elm.appendChild(rootElement);
    }
    localRender() {
        if (this.containerElement) {
            ClientUI.controls.clearSubtree(this.containerElement);
            this.buildTree(this.containerElement, this.options.display);
        }
    }
    onKeydown(e) {
        if (e.keyCode === ClientUI.controls.KeyCode.backspace) {
            const mathMarker = this.instance.endMarker;
            const toRemoveMath = MathExpr.bksp(mathMarker, this);
            if (toRemoveMath) {
                this.instance.removeText(toRemoveMath.start, toRemoveMath.end);
            }
            const mathText = this.instance.collection.getText(this.instance);
            mathMarker.mathText = mathText;
            mathMarker.mathTokens = MathExpr.lexMath(mathText);
            this.mathCursor = MathExpr.posAtToken(this.mathTokenIndex, mathMarker.mathTokens);
            if (this.containerElement) {
                ClientUI.controls.clearSubtree(this.containerElement);
                this.buildTree(this.containerElement, this.options.display);
            }
        }
        else if (e.keyCode === ClientUI.controls.KeyCode.rightArrow) {
            if (this.fwd()) {
                this.leave(ClientUI.controls.CursorDirection.Right);
            }
            this.localRender();
        }
        else if (e.keyCode === ClientUI.controls.KeyCode.leftArrow) {
            if (this.rev()) {
                this.leave(ClientUI.controls.CursorDirection.Left);
            }
            this.localRender();
        }
    }
    insertText(text) {
        this.instance.insertText(text, this.mathCursor);
        const mathMarker = this.instance.endMarker;
        this.mathTokenIndex = MathExpr.mathTokFwd(this.mathTokenIndex, mathMarker.mathTokens);
        this.mathCursor = MathExpr.posAtToken(this.mathTokenIndex, mathMarker.mathTokens);
        console.log(`set math cursor to ${this.mathCursor} on input ${text}`);
        if (this.containerElement) {
            ClientUI.controls.clearSubtree(this.containerElement);
            this.buildTree(this.containerElement, this.instance.options.display);
        }
    }
    specialCommand(cmd) {
        console.log(`special command ${cmd}`);
        if (cmd.startsWith("solution ")) {
            this.instance.solnText = cmd.substring(9);
            const v = MathExpr.extractFirstVar(this.instance.solnText);
            if (v) {
                this.instance.solnVar = v.text;
            }
        }
    }
    onKeypress(e) {
        if (e.charCode === ClientUI.controls.CharacterCodes.backslash) {
            if (this.searchMenuHost) {
                this.searchMenuHost.showSearchMenu(MathExpr.mathCmdTree, false, true, (s, cmd) => {
                    if (cmd) {
                        const text = cmd.texString;
                        this.insertText(text);
                    }
                    else {
                        this.specialCommand(s);
                    }
                });
            }
        }
        else {
            const toInsert = MathExpr.transformInputCode(e.charCode);
            if (toInsert) {
                this.insertText(toInsert);
            }
            else {
                console.log(`unrecognized math input ${e.char}`);
            }
        }
    }
    noteCursorExit(direction) {
        const cursorElement = ClientUI.controls.findFirstMatch(this.containerElement, (cursor) => {
            return cursor.style && (cursor.style.color === MathExpr.cursorColor);
        }) || this.containerElement;
        Caret.caretLeave(this.containerElement, cursorDirectionToDirection[direction], cursorElement.getBoundingClientRect());
    }
}
export class MathInstance extends EventEmitter {
    constructor(leafId, context, collection, options = MathInstance.defaultOptions, inCombinedText = false) {
        super();
        this.leafId = leafId;
        this.collection = collection;
        this.options = options;
        this.solnText = "x=0";
        this.solnVar = "x";
        this.handle = new FluidObjectHandle(this, leafId, context);
        this.initialize(inCombinedText);
    }
    get IFluidLoadable() { return this; }
    get IFluidRouter() { return this; }
    insertText(text, pos) {
        this.collection.insertText(text, this.leafId, pos);
    }
    removeText(startPos, endPos) {
        this.collection.removeText(this, startPos, endPos);
    }
    async request(request) {
        return {
            mimeType: "fluid/object",
            status: 200,
            value: this,
        };
    }
    detach() {
    }
    remoteEdit(pos, len, isInsert) {
        const mathMarker = this.endMarker;
        const mathText = this.collection.getText(this);
        mathMarker.mathTokens = MathExpr.lexMath(mathText);
        mathMarker.mathText = mathText;
        this.emit("remoteEdit", pos, len, isInsert);
    }
    postInsert() {
        const mathText = this.collection.getText(this);
        const mathMarker = this.endMarker;
        mathMarker.mathText = mathText;
        mathMarker.mathTokens = MathExpr.lexMath(mathText);
    }
    getMathText() {
        return this.collection.getText(this);
    }
    initialize(inCombinedText) {
        this.collection.appendMathMarkers(this, inCombinedText);
    }
}
MathInstance.defaultOptions = { display: "inline" };
function getPosition(sharedString, segment) {
    return sharedString.getPosition(segment);
}
const endIdPrefix = "end-";
export class MathCollection extends LazyLoadedDataObject {
    static getFactory() { return MathCollection.factory; }
    static async create(parentContext, props) {
        return MathCollection.factory.create(parentContext, props);
    }
    create() {
        this.combinedMathText = Sequence.SharedString.create(this.runtime, "mathText");
        this.root.set("mathText", this.combinedMathText.handle);
        this.initialize();
    }
    async load() {
        this.combinedMathText = await (await this.root.wait("mathText")).get();
        this.initialize();
    }
    get IFluidLoadable() { return this; }
    get IFluidObjectCollection() { return this; }
    get IFluidRouter() { return this; }
    appendMathMarkers(instance, inCombinedText) {
        const endId = endIdPrefix + instance.leafId;
        if (!inCombinedText) {
            let pos = this.combinedMathText.getLength();
            this.combinedMathText.insertMarker(pos++, MergeTree.ReferenceType.Tile, {
                [MergeTree.reservedTileLabelsKey]: ["math"],
                [MergeTree.reservedMarkerIdKey]: instance.leafId,
                mathStart: true,
            });
            this.combinedMathText.insertMarker(pos, MergeTree.ReferenceType.Tile, {
                componentOptions: instance.options,
                [MergeTree.reservedTileLabelsKey]: ["math"],
                [MergeTree.reservedMarkerIdKey]: endId,
                mathEnd: true,
            });
        }
        let seg = this.combinedMathText.getMarkerFromId(endId);
        const mathMarker = seg;
        instance.endMarker = mathMarker;
        mathMarker.mathInstance = instance;
        seg = this.combinedMathText.getMarkerFromId(instance.leafId);
        instance.startMarker = seg;
        mathMarker.mathText = this.getText(instance);
        mathMarker.mathTokens = MathExpr.lexMath(mathMarker.mathText);
    }
    createCollectionItem(options) {
        const leafId = `math-${Date.now()}`;
        return new MathInstance(leafId, this.runtime.objectsRoutingContext, this, options);
    }
    getText(instance) {
        const sharedString = this.combinedMathText;
        const startMarker = instance.startMarker;
        const start = getPosition(sharedString, startMarker) + startMarker.cachedLength;
        const endMarker = instance.endMarker;
        const end = getPosition(sharedString, endMarker);
        return this.combinedMathText.getText(start, end);
    }
    removeCollectionItem(instance) {
        const sharedString = this.combinedMathText;
        const startMarker = instance.startMarker;
        const start = getPosition(sharedString, startMarker);
        const endMarker = instance.endMarker;
        const end = getPosition(sharedString, endMarker) + endMarker.cachedLength;
        this.combinedMathText.removeRange(start, end);
    }
    async request(request) {
        // Trim leading slash, if it exists
        const trimmedUrl = request.url.startsWith("/") ? request.url.substr(1) : request.url;
        // Next segment is math instance id, if it exists
        const instanceId = trimmedUrl
            .substr(0, !trimmedUrl.includes("/", 1) ? trimmedUrl.length : trimmedUrl.indexOf("/"));
        // If no instance is requested, then the collection itself is being requested
        if (!instanceId) {
            return {
                mimeType: "fluid/object",
                status: 200,
                value: this,
            };
        }
        const instance = this.getInstance(instanceId);
        // FIX this using a routing toolkit (don't end route here!)
        const trimmedRequest = { url: "/" };
        if (instance !== undefined) {
            return instance.request(trimmedRequest);
        }
    }
    insertText(text, instanceId, offset) {
        const instance = this.getInstance(instanceId);
        const pos = this.getStartPos(instance) + offset;
        this.combinedMathText.insertText(pos, text);
        instance.postInsert();
    }
    removeText(instance, start, end) {
        const startPos = this.getStartPos(instance);
        this.combinedMathText.removeRange(startPos + start, startPos + end);
    }
    getInstance(id, options = MathInstance.defaultOptions) {
        let _options = options;
        const endId = endIdPrefix + id;
        const mathMarker = this.combinedMathText.getMarkerFromId(endId);
        if (mathMarker !== undefined) {
            if (!mathMarker.mathInstance) {
                if (mathMarker.properties.componentOptions) {
                    _options = mathMarker.properties.componentOptions;
                }
                mathMarker.mathInstance = new MathInstance(id, this.runtime.objectsRoutingContext, this, _options, true);
            }
            return mathMarker.mathInstance;
        }
    }
    getStartPos(instance) {
        const sharedString = this.combinedMathText;
        const startMarker = instance.startMarker;
        const start = getPosition(sharedString, startMarker);
        return start + startMarker.cachedLength;
    }
    findTile(startPos, tileType, preceding) {
        return this.combinedMathText.findTile(startPos, tileType, preceding);
    }
    initialize() {
        // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-internal-modules, import/no-unassigned-import
        require("katex/dist/katex.min.css");
        // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-unassigned-import
        require("./index.css");
        this.combinedMathText.on("sequenceDelta", (event) => {
            if ((!event.isLocal) && (event.ranges.length > 0) && (event.clientId !== "original")) {
                let pos;
                let len = 0;
                event.ranges.forEach((range) => {
                    pos = range.position;
                    len += range.segment.cachedLength;
                });
                // console.log(`got event from ${event.clientId} pos: ${pos}`);
                const tileInfo = this.findTile(pos, "math", false);
                if (tileInfo && (tileInfo.tile.properties.mathEnd)) {
                    const mathMarker = tileInfo.tile;
                    const leafId = mathMarker.getId().substring(endIdPrefix.length);
                    const instance = this.getInstance(leafId);
                    const startPos = this.getStartPos(instance);
                    instance.remoteEdit(pos - startPos, len, event.deltaOperation === 0 /* INSERT */);
                }
            }
        });
    }
}
MathCollection.factory = new LazyLoadedDataObjectFactory("@fluid-example/math", MathCollection, 
/* root: */ SharedDirectory.getFactory(), [Sequence.SharedString.getFactory()]);
export const fluidExport = MathCollection.getFactory();
//# sourceMappingURL=mathComponent.js.map