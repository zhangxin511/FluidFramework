/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

export interface IStorageNameProvider {
	assignStorageName(tenantId: string, documentId: string): Promise<string>;
	retrieveStorageName(tenantId: string, documentId: string): Promise<string>;
}
