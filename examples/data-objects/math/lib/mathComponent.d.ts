/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
/// <reference types="node" />
import { EventEmitter } from "events";
import * as ClientUI from "@fluid-example/client-ui-lib";
import * as SearchMenu from "@fluid-example/search-menu";
import { IFluidObject, IFluidHandleContext, IFluidLoadable, IFluidRouter, IRequest, IResponse } from "@fluidframework/core-interfaces";
import { FluidObjectHandle } from "@fluidframework/datastore";
import { IFluidObjectCollection } from "@fluid-example/fluid-object-interfaces";
import { ISharedDirectory } from "@fluidframework/map";
import * as MergeTree from "@fluidframework/merge-tree";
import { IFluidDataStoreContext, IFluidDataStoreFactory } from "@fluidframework/runtime-definitions";
import { LazyLoadedDataObject } from "@fluidframework/data-object-base";
import { IFluidHTMLOptions, IFluidHTMLView } from "@fluidframework/view-interfaces";
import * as MathExpr from "./mathExpr";
declare type IMathMarkerInst = MathExpr.IMathMarker;
export declare class MathView implements IFluidHTMLView, ClientUI.controls.IViewCursor, ClientUI.controls.IViewLayout {
    instance: MathInstance;
    get IFluidHTMLView(): this;
    get IViewCursor(): this;
    get IViewLayout(): this;
    cursorActive: boolean;
    cursorElement: HTMLElement;
    canInline: boolean;
    containerElement: HTMLElement;
    mathCursor: number;
    mathTokenIndex: number;
    searchMenuHost: SearchMenu.ISearchMenuHost;
    options?: IFluidHTMLOptions;
    rootElement: HTMLElement;
    constructor(instance: MathInstance, scope?: IFluidObject);
    render(containerElement: HTMLElement, options?: IFluidHTMLOptions): void;
    remove(): void;
    remoteEdit: (pos: number, len: number, isInsert: boolean) => void;
    enter(direction: ClientUI.controls.CursorDirection): void;
    leave(direction: ClientUI.controls.CursorDirection): void;
    rev(): boolean;
    fwd(): boolean;
    setListeners(): void;
    buildAlignedAsDiv(mathLines: string[], elm: HTMLElement): void;
    buildAligned(mathLines: string[], checks: boolean[]): string;
    buildTree(elm: HTMLElement, display?: string): void;
    localRender(): void;
    onKeydown(e: KeyboardEvent): void;
    insertText(text: string): void;
    specialCommand(cmd: string): void;
    onKeypress(e: KeyboardEvent): void;
    private noteCursorExit;
}
export declare class MathInstance extends EventEmitter implements IFluidLoadable, IFluidRouter {
    leafId: string;
    readonly collection: MathCollection;
    readonly options: IMathOptions;
    static defaultOptions: IMathOptions;
    get IFluidLoadable(): this;
    get IFluidRouter(): this;
    handle: FluidObjectHandle;
    endMarker: IMathMarkerInst;
    startMarker: MergeTree.Marker;
    solnText: string;
    solnVar: string;
    constructor(leafId: string, context: IFluidHandleContext, collection: MathCollection, options?: IMathOptions, inCombinedText?: boolean);
    insertText(text: string, pos: number): void;
    removeText(startPos: number, endPos: number): void;
    request(request: IRequest): Promise<IResponse>;
    detach(): void;
    remoteEdit(pos: number, len: number, isInsert: boolean): void;
    postInsert(): void;
    getMathText(): string;
    private initialize;
}
export interface IMathOptions extends IFluidHTMLOptions {
}
export declare class MathCollection extends LazyLoadedDataObject<ISharedDirectory> implements IFluidObjectCollection {
    private static readonly factory;
    static getFactory(): IFluidDataStoreFactory;
    static create(parentContext: IFluidDataStoreContext, props?: any): Promise<IFluidObject>;
    create(): void;
    load(): Promise<void>;
    get IFluidLoadable(): this;
    get IFluidObjectCollection(): this;
    get IFluidRouter(): this;
    private combinedMathText;
    appendMathMarkers(instance: MathInstance, inCombinedText: boolean): void;
    createCollectionItem(options?: IMathOptions): MathInstance;
    getText(instance: MathInstance): string;
    removeCollectionItem(instance: MathInstance): void;
    request(request: IRequest): Promise<IResponse>;
    insertText(text: string, instanceId: string, offset: number): void;
    removeText(instance: MathInstance, start: number, end: number): void;
    getInstance(id: string, options?: IMathOptions): MathInstance;
    private getStartPos;
    private findTile;
    private initialize;
}
export declare const fluidExport: IFluidDataStoreFactory;
export {};
//# sourceMappingURL=mathComponent.d.ts.map