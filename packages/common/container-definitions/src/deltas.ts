/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { IEventProvider, IEvent, IErrorEvent } from "@fluidframework/common-definitions";
import { IDisposable } from "@fluidframework/core-interfaces";
import { IAnyDriverError } from "@fluidframework/driver-definitions";
import {
	ConnectionMode,
	IClientConfiguration,
	IClientDetails,
	IDocumentMessage,
	ISequencedDocumentMessage,
	ISignalClient,
	ISignalMessage,
	ITokenClaims,
} from "@fluidframework/protocol-definitions";

/**
 * Contract representing the result of a newly established connection to the server for syncing deltas.
 */
export interface IConnectionDetails {
	clientId: string;
	claims: ITokenClaims;
	serviceConfiguration: IClientConfiguration;

	/**
	 * Last known sequence number to ordering service at the time of connection.
	 *
	 * @remarks
	 *
	 * It may lap actual last sequence number (quite a bit, if container is very active).
	 * But it's the best information for client to figure out how far it is behind, at least
	 * for "read" connections. "write" connections may use own "join" op to similar information,
	 * that is likely to be more up-to-date.
	 */
	checkpointSequenceNumber: number | undefined;
}

/**
 * Internal version of IConnectionDetails with props are only exposed internally
 * @deprecated 2.0.0-internal.5.2.0 - Intended for internal use only and will be removed in an upcoming relase.
 */
export interface IConnectionDetailsInternal extends IConnectionDetails {
	/**
	 * @deprecated 2.0.0-internal.5.2.0 - Intended for internal use only and will be removed in an upcoming relase.
	 */
	mode: ConnectionMode;
	/**
	 * @deprecated 2.0.0-internal.5.2.0 - Intended for internal use only and will be removed in an upcoming relase.
	 */
	version: string;
	/**
	 * @deprecated 2.0.0-internal.5.2.0 - Intended for internal use only and will be removed in an upcoming relase.
	 */
	initialClients: ISignalClient[];
	/**
	 * @deprecated 2.0.0-internal.5.2.0 - Intended for internal use only and will be removed in an upcoming relase.
	 */
	reason: string;
}

/**
 * Interface used to define a strategy for handling incoming delta messages
 * @deprecated 2.0.0-internal.5.2.0 - Intended for internal use only and will be removed in an upcoming relase.
 */
export interface IDeltaHandlerStrategy {
	/**
	 * Processes the message.
	 * @deprecated 2.0.0-internal.5.2.0 - Intended for internal use only and will be removed in an upcoming relase.
	 */
	process: (message: ISequencedDocumentMessage) => void;

	/**
	 * Processes the signal.
	 * @deprecated 2.0.0-internal.5.2.0 - Intended for internal use only and will be removed in an upcoming relase.
	 */
	processSignal: (message: ISignalMessage) => void;
}

/**
 * Contract supporting delivery of outbound messages to the server
 */
export interface IDeltaSender {
	/**
	 * Flush all pending messages through the outbound queue
	 */
	flush(): void;
}

/**
 * Events emitted by {@link IDeltaManager}.
 */
export interface IDeltaManagerEvents extends IEvent {
	/**
	 * @deprecated No replacement API recommended.
	 */
	(event: "prepareSend", listener: (messageBuffer: any[]) => void);

	/**
	 * @deprecated No replacement API recommended.
	 */
	(event: "submitOp", listener: (message: IDocumentMessage) => void);

	/**
	 * Emitted immediately after processing an incoming operation (op).
	 *
	 * @remarks
	 *
	 * Note: this event is not intended for general use.
	 * Prefer to listen to events on the appropriate ultimate recipients of the ops, rather than listening to the
	 * ops directly on the {@link IDeltaManager}.
	 *
	 * Listener parameters:
	 *
	 * - `message`: The op that was processed.
	 *
	 * - `processingTime`: The amount of time it took to process the inbound operation (op), expressed in milliseconds.
	 */
	(event: "op", listener: (message: ISequencedDocumentMessage, processingTime: number) => void);

	/**
	 * @deprecated No replacement API recommended.
	 */
	(event: "allSentOpsAckd", listener: () => void);

	/**
	 * Emitted periodically with latest information on network roundtrip latency
	 */
	(event: "pong", listener: (latency: number) => void);

	/**
	 * @deprecated No replacement API recommended.
	 */
	(event: "processTime", listener: (latency: number) => void);

	/**
	 * Emitted when the {@link IDeltaManager} completes connecting to the Fluid service.
	 *
	 * @remarks
	 * This occurs once we've received the connect_document_success message from the server,
	 * and happens prior to the client's join message (if there is a join message).
	 *
	 * Listener parameters:
	 *
	 * - `details`: Connection metadata.
	 *
	 * - `opsBehind`: An estimate of far behind the client is relative to the service in terms of ops.
	 * Will not be specified if an estimate cannot be determined.
	 */
	(event: "connect", listener: (details: IConnectionDetails, opsBehind?: number) => void);

	/**
	 * Emitted when the {@link IDeltaManager} becomes disconnected from the Fluid service.
	 *
	 * @remarks Listener parameters:
	 *
	 * - `reason`: Describes the reason for which the delta manager was disconnected.
	 * - `error` : error if any for the disconnect.
	 */
	(event: "disconnect", listener: (reason: string, error?: IAnyDriverError) => void);

	/**
	 * Emitted when read/write permissions change.
	 *
	 * @remarks Listener parameters:
	 *
	 * - `readonly`: Whether or not the delta manager is now read-only.
	 */
	(event: "readonly", listener: (readonly: boolean) => void);
}

/**
 * Manages the transmission of ops between the runtime and storage.
 */
export interface IDeltaManager<T, U> extends IEventProvider<IDeltaManagerEvents>, IDeltaSender {
	/** The queue of inbound delta messages */
	readonly inbound: IDeltaQueue<T>;

	/** The queue of outbound delta messages */
	readonly outbound: IDeltaQueue<U[]>;

	/** The queue of inbound delta signals */
	readonly inboundSignal: IDeltaQueue<ISignalMessage>;

	/** The current minimum sequence number */
	readonly minimumSequenceNumber: number;

	/** The last sequence number processed by the delta manager */
	readonly lastSequenceNumber: number;

	/** The last message processed by the delta manager */
	readonly lastMessage: ISequencedDocumentMessage | undefined;

	/** The latest sequence number the delta manager is aware of */
	readonly lastKnownSeqNumber: number;

	/** The initial sequence number set when attaching the op handler */
	readonly initialSequenceNumber: number;

	/**
	 * Tells if current connection has checkpoint information.
	 * I.e. we know how far behind the client was at the time of establishing connection
	 */
	readonly hasCheckpointSequenceNumber: boolean;

	/** Details of client */
	readonly clientDetails: IClientDetails;

	/** Protocol version being used to communicate with the service */
	readonly version: string;

	/** Max message size allowed to the delta manager */
	readonly maxMessageSize: number;

	/** Service configuration provided by the service. */
	readonly serviceConfiguration: IClientConfiguration | undefined;

	/** Flag to indicate whether the client can write or not. */
	readonly active: boolean;

	readonly readOnlyInfo: ReadOnlyInfo;

	/** Submit a signal to the service to be broadcast to other connected clients, but not persisted */
	submitSignal(content: any): void;

	/**
	 * @deprecated - 2.0.0-internal.5.3.0 - The IDeltaManager's dispose state is not recommended for observation
	 * and will be removed in an upcoming release.
	 */
	readonly disposed: boolean;

	/**
	 * @deprecated - 2.0.0-internal.5.3.0 - Disposing the IDeltaManager results in inconsistent system state.
	 * This member will be removed in an upcoming release.
	 */
	dispose(error?: Error): void;
}

/**
 * Events emitted by {@link IDeltaQueue}.
 */
export interface IDeltaQueueEvents<T> extends IErrorEvent {
	/**
	 * Emitted when a task is enqueued.
	 *
	 * @remarks Listener parameters:
	 *
	 * - `task`: The task being enqueued.
	 */
	(event: "push", listener: (task: T) => void);

	/**
	 * Emitted immediately after processing an enqueued task and removing it from the queue.
	 *
	 * @remarks
	 *
	 * Note: this event is not intended for general use.
	 * Prefer to listen to events on the appropriate ultimate recipients of the ops, rather than listening to the
	 * ops directly on the {@link IDeltaQueue}.
	 *
	 * Listener parameters:
	 *
	 * - `task`: The task that was processed.
	 */
	(event: "op", listener: (task: T) => void);

	/**
	 * Emitted when the queue of tasks to process is emptied.
	 *
	 * @remarks Listener parameters:
	 *
	 * - `count`: The number of events (`T`) processed before becoming idle.
	 *
	 * - `duration`: The amount of time it took to process elements (in milliseconds).
	 *
	 * @see {@link IDeltaQueue.idle}
	 */
	(event: "idle", listener: (count: number, duration: number) => void);
}

/**
 * Queue of ops to be sent to or processed from storage
 */
export interface IDeltaQueue<T> extends IEventProvider<IDeltaQueueEvents<T>>, IDisposable {
	/**
	 * Flag indicating whether or not the queue was paused
	 */
	paused: boolean;

	/**
	 * The number of messages remaining in the queue
	 */
	length: number;

	/**
	 * Flag indicating whether or not the queue is idle.
	 * I.e. there are no remaining messages to processes.
	 */
	idle: boolean;

	/**
	 * Pauses processing on the queue.
	 *
	 * @returns A promise which resolves when processing has been paused.
	 */
	pause(): Promise<void>;

	/**
	 * Resumes processing on the queue
	 */
	resume(): void;

	/**
	 * Peeks at the next message in the queue
	 */
	peek(): T | undefined;

	/**
	 * Returns all the items in the queue as an array. Does not remove them from the queue.
	 */
	toArray(): T[];

	/**
	 * returns number of ops processed and time it took to process these ops.
	 * Zeros if queue did not process anything (had no messages, was paused or had hit an error before)
	 */
	waitTillProcessingDone(): Promise<{ count: number; duration: number }>;
}

export type ReadOnlyInfo =
	| {
			readonly readonly: false | undefined;
	  }
	| {
			readonly readonly: true;
			/** read-only because forceReadOnly() was called */
			readonly forced: boolean;
			/** read-only because client does not have write permissions for document */
			readonly permissions: boolean | undefined;
			/** read-only with no delta stream connection */
			readonly storageOnly: boolean;
			/** extra info on why connection to delta stream is not possible. This info might be provided
			 * if storageOnly is set to true */
			readonly storageOnlyReason?: string;
	  };
