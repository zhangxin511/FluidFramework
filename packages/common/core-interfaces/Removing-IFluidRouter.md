# Removing IFluidRouter

The interface `IFluidRouter` is being deprecated and removed over the next several internal releases.
It exposes a `request` function and is implemented across Fluid Framework's layers to light up the "request pattern"
for accessing objects out of a Fluid Container.
The request pattern is incompatible with [Garbage Collection](../../runtime/container-runtime/src/gc/garbageCollection.md),
so any code that previously accessed an object via request should migrate to using handles instead.

This document serves as a "how-to" guide for this migration, and will also include the latest status of the work.

## Key Concepts

### `IFluidRouter` and `absolutePath`

Here's what [`IFluidRouter`](src/fluidRouter.ts) looks like:

```ts
export interface IProvideFluidRouter {
	readonly IFluidRouter: IFluidRouter;
}
export interface IFluidRouter extends IProvideFluidRouter {
	request(request: IRequest): Promise<IResponse>;
}
```

It uses the Provider pattern so any Fluid Object may be queried for `IFluidRouter` to call `request` on if present.

Here's the **deprecated** flow for referencing and accessing an object:

1. Store the object's `absolutePath` (a container-relative URL path) in some DDS
2. Later, load the object via `request({ url: absolutePath })`

### `IFluidLoadable` and `IFluidHandle`

The new way to reference an object within a Fluid Container is via its `handle`:

1. Store the object's `handle` in some DDS
2. Later, load the object via `handle.get()`

### Entry Point

`request` has also been used as the way to get at the application-specific Container and DataStore implementations
starting from native Fluid types like `IContainer` and `IDataStore` - both of which have extended `IFluidRouter`.
The new way to do this is via the object's "entry point".

Here it is on `IContainer`, returning an anonymous `FluidObject` - the application-specified root object:

```ts
getEntryPoint?(): Promise<FluidObject | undefined>;
```

And here it is on `IDataStore`, returning an `IFluidHandle` to an anonymous `FluidObject` - the DataStore's root object:

```ts
readonly entryPoint?: IFluidHandle<FluidObject>;
```

So how does an application specify what the Container or DataStore's entry point is?
Via a parameter `initializeEntryPoint` that's found on `ContainerRuntime.loadRuntime` and `FluidDataStoreRuntime`'s constructor.

### Aliased DataStores

(Not yet written)

## Status

<!-- prettier-ignore-start -->
| API                                                      | Deprecated in        | Removed in           |
| -------------------------------------------------------- | -------------------- | -------------------- |
| `IFluidRouter`                                           | 2.0.0-internal.5.4.0 |                      |
<!-- prettier-ignore-end -->
