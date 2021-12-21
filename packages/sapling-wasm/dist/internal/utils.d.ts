/// <reference types="node" />
export declare function bufferFrom(value: Buffer | Uint8Array | string | number, name?: string, expectedType?: string): Buffer;
export declare function bufferFromOfLength(value: Buffer | Uint8Array | string | number, minLength: number, name?: string, expectedType?: string): Buffer;
export declare function numberToBytes(number: number): Buffer;
export declare function isHexString(string: any): string is string;
export declare function numberFrom(value: number | string, name?: string, expectedType?: string): number;
export declare function stringFrom(value: number | string | BigInt, name?: string, expectedType?: string): string;
export declare function uninitialized(): void;
export declare function rejectPromise<T>(methodName: string, error: any): Promise<T>;
export declare function invalidTypeError(name?: string, expectedType?: string): Error;
