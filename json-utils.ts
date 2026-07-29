export type JsonValidationResult = {
    valid: true;
    value: unknown;
    summary: string;
} | {
    valid: false;
    error: string;
};

export type JsonTransformResult = {
    success: true;
    text: string;
} | {
    success: false;
    error: string;
};

export function validateJson(text: string): JsonValidationResult {
    try {
        const value = JSON.parse(text) as unknown;
        return {
            valid: true,
            value,
            summary: getJsonSummary(value)
        };
    } catch (error) {
        return {
            valid: false,
            error: getJsonParseErrorMessage(text, error)
        };
    }
}

export function formatJson(text: string, indent: number): JsonTransformResult {
    const parsed = validateJson(text);

    if (!parsed.valid) {
        return {
            success: false,
            error: parsed.error
        };
    }

    return {
        success: true,
        text: JSON.stringify(parsed.value, null, indent)
    };
}

export function minifyJson(text: string): JsonTransformResult {
    const parsed = validateJson(text);

    if (!parsed.valid) {
        return {
            success: false,
            error: parsed.error
        };
    }

    return {
        success: true,
        text: JSON.stringify(parsed.value)
    };
}

export function getJsonSummary(value: unknown): string {
    if (Array.isArray(value)) {
        return `Array with ${value.length.toLocaleString()} ${value.length === 1 ? 'item' : 'items'}`;
    }

    if (value && typeof value === 'object') {
        const keyCount = Object.keys(value).length;
        return `Object with ${keyCount.toLocaleString()} ${keyCount === 1 ? 'key' : 'keys'}`;
    }

    if (value === null) {
        return 'JSON null';
    }

    return `JSON ${typeof value}`;
}

function getJsonParseErrorMessage(text: string, error: unknown): string {
    const message = error instanceof Error ? error.message : 'Invalid JSON';
    const position = getErrorPosition(message, text);

    if (position === null) {
        return message;
    }

    const { line, column } = getLineColumn(text, position);
    return `${message.replace(/\s*\(line \d+ column \d+\)$/, '')} at line ${line}, column ${column}`;
}

function getErrorPosition(message: string, text: string): number | null {
    const positionMatch = message.match(/position\s+(\d+)/i);
    if (positionMatch) {
        return Number(positionMatch[1]);
    }

    if (/unexpected end/i.test(message)) {
        return text.length;
    }

    const tokenMatch = message.match(/unexpected token '(.+?)'/i);
    if (tokenMatch) {
        const tokenPosition = text.indexOf(tokenMatch[1] || '');
        return tokenPosition >= 0 ? tokenPosition : null;
    }

    return null;
}

function getLineColumn(text: string, position: number): { line: number; column: number } {
    const beforeError = text.slice(0, position);
    const lines = beforeError.split(/\r\n|\r|\n/);

    return {
        line: lines.length,
        column: (lines[lines.length - 1]?.length || 0) + 1
    };
}
