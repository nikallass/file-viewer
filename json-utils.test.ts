import { describe, expect, it } from 'vitest';
import { formatJson, getJsonSummary, minifyJson, validateJson } from './json-utils';

describe('validateJson', () => {
    it('accepts valid JSON and summarizes the top-level value', () => {
        const result = validateJson('{"name":"File Viewer","formats":["csv","json"]}');

        expect(result.valid).toBe(true);
        if (!result.valid) throw new Error('Expected valid JSON');
        expect(result.summary).toBe('Object with 2 keys');
    });

    it('returns a friendly line and column for invalid JSON', () => {
        const result = validateJson('{\n  "name": "File Viewer",\n}');

        expect(result.valid).toBe(false);
        if (result.valid) throw new Error('Expected invalid JSON');
        expect(result.error).toContain('line 3, column 1');
    });
});

describe('formatJson', () => {
    it('formats JSON with a configurable indent size', () => {
        expect(formatJson('{"name":"File Viewer","enabled":true}', 4)).toEqual({
            success: true,
            text: '{\n    "name": "File Viewer",\n    "enabled": true\n}'
        });
    });

    it('does not replace invalid JSON with formatted output', () => {
        const result = formatJson('{"name":}', 2);

        expect(result.success).toBe(false);
        if (result.success) throw new Error('Expected invalid JSON');
        expect(result.error).toContain('line 1, column');
    });
});

describe('minifyJson', () => {
    it('removes whitespace without changing the JSON value', () => {
        expect(minifyJson('{\n  "name": "File Viewer",\n  "enabled": true\n}')).toEqual({
            success: true,
            text: '{"name":"File Viewer","enabled":true}'
        });
    });
});

describe('getJsonSummary', () => {
    it('summarizes common top-level JSON types', () => {
        expect(getJsonSummary(['csv', 'json'])).toBe('Array with 2 items');
        expect(getJsonSummary(null)).toBe('JSON null');
        expect(getJsonSummary('hello')).toBe('JSON string');
    });
});
