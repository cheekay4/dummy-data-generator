// Unicode conversion utilities

export interface CharDetail {
  char: string;
  codePoint: number;
  codePointHex: string;
  utf8Bytes: string; // hex bytes space-separated
  utf16: string;     // hex code units
  percentEncoded: string;
}

export interface UnicodeConversions {
  codePoints: string;      // U+65E5 U+672C ...
  jsEscape: string;        // \u65E5\u672C ...
  htmlDecimal: string;     // &#26085;&#26412; ...
  htmlHex: string;         // &#x65E5;&#x672C; ...
  utf8Bytes: string;       // E6 97 A5 E6 9C ...
  utf16: string;           // 65E5 672C ...
  percentEncoded: string;  // %E6%97%A5 ...
}

export function convertText(text: string): UnicodeConversions {
  const chars = Array.from(text); // split by code point (handles surrogates)

  const codePoints = chars
    .map((c) => `U+${c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`)
    .join(' ');

  const jsEscape = chars
    .map((c) => {
      const cp = c.codePointAt(0)!;
      if (cp > 0xffff) {
        const hi = Math.floor((cp - 0x10000) / 0x400) + 0xd800;
        const lo = ((cp - 0x10000) % 0x400) + 0xdc00;
        return (
          `\\u${hi.toString(16).toUpperCase().padStart(4, '0')}` +
          `\\u${lo.toString(16).toUpperCase().padStart(4, '0')}`
        );
      }
      return `\\u${cp.toString(16).toUpperCase().padStart(4, '0')}`;
    })
    .join('');

  const htmlDecimal = chars
    .map((c) => `&#${c.codePointAt(0)!};`)
    .join('');

  const htmlHex = chars
    .map((c) => `&#x${c.codePointAt(0)!.toString(16).toUpperCase()};`)
    .join('');

  const utf8Bytes = Array.from(new TextEncoder().encode(text))
    .map((b) => b.toString(16).toUpperCase().padStart(2, '0'))
    .join(' ');

  const utf16 = Array.from({ length: text.length }, (_, i) =>
    text.charCodeAt(i).toString(16).toUpperCase().padStart(4, '0'),
  ).join(' ');

  const percentEncoded = encodeURIComponent(text);

  return { codePoints, jsEscape, htmlDecimal, htmlHex, utf8Bytes, utf16, percentEncoded };
}

export function getCharDetails(text: string): CharDetail[] {
  return Array.from(text).map((c) => {
    const cp = c.codePointAt(0)!;
    const utf8 = Array.from(new TextEncoder().encode(c))
      .map((b) => b.toString(16).toUpperCase().padStart(2, '0'))
      .join(' ');
    const utf16Parts: string[] = [];
    for (let i = 0; i < c.length; i++) {
      utf16Parts.push(c.charCodeAt(i).toString(16).toUpperCase().padStart(4, '0'));
    }
    return {
      char: c,
      codePoint: cp,
      codePointHex: cp.toString(16).toUpperCase().padStart(4, '0'),
      utf8Bytes: utf8,
      utf16: utf16Parts.join(' '),
      percentEncoded: encodeURIComponent(c),
    };
  });
}

/** Unescape \uXXXX sequences to text */
export function decodeJSUnicodeEscape(text: string): string {
  return text.replace(/\\u([0-9A-Fa-f]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16)),
  );
}

/** Decode HTML entities (&#DDDDD; and &#xXXXX;) */
export function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)));
}

/** Convert full-width ASCII/Katakana → half-width */
export function fullWidthToHalfWidth(text: string): string {
  return text
    .replace(/[！-～]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/　/g, ' ');
}

/** Convert half-width ASCII → full-width */
export function halfWidthToFullWidth(text: string): string {
  return text
    .replace(/[!-~]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0xfee0))
    .replace(/ /g, '　');
}
