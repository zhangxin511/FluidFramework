/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { Caret, Dom, Template, View, } from "@fluid-example/flow-util-lib";
import { debug } from "./debug";
import * as style from "./index.css";
const template = new Template({
    tag: "div", props: { className: style.math }, children: [
        { tag: "div", ref: "cell", props: { className: style.cell } },
        { tag: "input", ref: "input", props: { className: style.input } },
    ],
});
export class MathView extends View {
    constructor() {
        super(...arguments);
        this.onInputChanged = () => {
            this.cell.textContent = this.input.value;
        };
        this.onKeyDown = (e) => {
            switch (e.code) {
                case "ArrowLeft" /* arrowLeft */:
                    if (this.input.selectionEnd === 0) {
                        this.caretLeave(e, 3 /* left */);
                    }
                    break;
                case "ArrowRight" /* arrowRight */:
                    if (this.input.selectionEnd === this.input.value.length) {
                        this.caretLeave(e, 1 /* right */);
                    }
                    break;
                case "ArrowUp" /* arrowUp */:
                    this.caretLeave(e, 12 /* up */);
                    break;
                case "ArrowDown" /* arrowDown */:
                    this.caretLeave(e, 4 /* down */);
                    break;
                default:
                    this.onInputChanged();
            }
        };
        this.onCaretEnter = (e) => {
            debug(`onCaretEnter(${JSON.stringify(e.detail)})`);
            const input = this.input;
            input.focus();
            switch (e.detail.direction) {
                case 3 /* left */:
                    input.setSelectionRange(input.value.length, input.value.length, "backward");
                    e.preventDefault();
                    e.stopPropagation();
                    break;
                case 1 /* right */:
                    input.setSelectionRange(0, 0, "forward");
                    e.preventDefault();
                    e.stopPropagation();
                    break;
                case 12 /* up */:
                case 4 /* down */:
                    this.verticalCaretEnter(e);
                    break;
                default:
            }
        };
    }
    onAttach(init) {
        const root = template.clone();
        this.input = template.get(root, "input");
        this.cell = template.get(root, "cell");
        this.input.value = "f(t) = sin(t)";
        this.onDom(this.input, "input", this.onInputChanged);
        this.onDom(this.input, "paste", this.onInputChanged);
        this.onDom(this.input, "keydown", this.onKeyDown);
        this.onDom(this.input, "keypress", this.onInputChanged);
        this.onDom(root, "fluid:caretenter" /* enter */, this.onCaretEnter);
        this.onInputChanged();
        return root;
    }
    onUpdate(props) {
        // Do nothing
    }
    onDetach() {
        // Do nothing
    }
    caretLeave(e, direction) {
        const caretBounds = Dom.getClientRect(this.cell.firstChild, this.input.selectionEnd);
        if (Caret.caretLeave(this.input, direction, caretBounds)) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
    verticalCaretEnter(e) {
        const { left } = e.detail.caretBounds;
        const offset = Dom.findNodeOffset(this.cell.firstChild, left, -Infinity, +Infinity);
        this.input.setSelectionRange(offset, offset, "forward");
        e.preventDefault();
        e.stopPropagation();
    }
}
//# sourceMappingURL=view.js.map