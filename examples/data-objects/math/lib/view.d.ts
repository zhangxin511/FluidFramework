/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import { View } from "@fluid-example/flow-util-lib";
interface IMathInit extends IMathProps {
}
interface IMathProps {
}
export declare class MathView extends View<IMathInit, IMathProps> {
    private input?;
    private cell?;
    protected onAttach(init: Readonly<IMathInit>): Element;
    protected onUpdate(props: Readonly<IMathProps>): void;
    protected onDetach(): void;
    private readonly onInputChanged;
    private caretLeave;
    private readonly onKeyDown;
    private verticalCaretEnter;
    private readonly onCaretEnter;
}
export {};
//# sourceMappingURL=view.d.ts.map