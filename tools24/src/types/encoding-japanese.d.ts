declare module 'encoding-japanese' {
  export type EncodingName =
    | 'UTF8'
    | 'UTF16'
    | 'UTF16BE'
    | 'UTF16LE'
    | 'SJIS'
    | 'EUCJP'
    | 'JIS'
    | 'BINARY'
    | 'ASCII'
    | 'AUTO'
    | 'UNICODE';

  export interface ConvertOptions {
    to: EncodingName;
    from?: EncodingName;
    bom?: boolean | string;
    type?: 'string' | 'array';
  }

  export function detect(
    data: number[] | Uint8Array | string
  ): Exclude<EncodingName, 'AUTO' | 'UNICODE'> | false;

  export function convert(
    data: number[] | Uint8Array | string,
    to: EncodingName | ConvertOptions,
    from?: EncodingName
  ): number[];

  export function codeToString(data: number[]): string;
  export function stringToCode(str: string): number[];
  export function urlEncode(data: number[]): string;
  export function urlDecode(str: string): number[];
  export function base64Encode(data: number[]): string;
  export function base64Decode(str: string): number[];

  const Encoding: {
    detect: typeof detect;
    convert: typeof convert;
    codeToString: typeof codeToString;
    stringToCode: typeof stringToCode;
    urlEncode: typeof urlEncode;
    urlDecode: typeof urlDecode;
    base64Encode: typeof base64Encode;
    base64Decode: typeof base64Decode;
  };

  export default Encoding;
}
