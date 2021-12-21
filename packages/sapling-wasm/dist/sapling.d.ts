export declare function initLib(): Promise<void>;
export declare function setupElgamal(sk_as_string: string): Promise<any[]>;
export declare function keygen(r: any, sealer: any, params: any, sk: any, pk: any): Promise<any[]>;
export declare function decrypt(encryptions: any, sealer: any, r: any, params: any, sk: any, pk: any): Promise<any[]>;
